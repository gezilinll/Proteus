import protooClient from 'protoo-client';
import * as mediasoupClient from 'mediasoup-client';
import { Transport } from 'mediasoup-client/lib/types';
import { MEDIASOUP_URL } from '../Constants';
import { UserModel } from '../model/UserModel';

export declare type UserPeer = Pick<UserModel, 'id' | 'name' | 'peerID'>;

export declare type OnProducerStreamUpdated = (stream: MediaStreamTrack | null) => void;

export declare type OnConsumerStreamUpdated = (
    peerId: string,
    stream: MediaStreamTrack | null
) => void;

export enum Status {
    CLOSED,
    JOINED,
}

export interface VideoChatWatcher {
    producerVideoUpdated: OnProducerStreamUpdated;
    producerAudioUpdated: OnProducerStreamUpdated;
    consumerVideoUpdated: OnConsumerStreamUpdated;
    consumerAudioUpdated: OnConsumerStreamUpdated;
}
export class VideoChat {
    private _roomID: string = '';
    private _userPeer?: UserPeer;

    private _protoo: protooClient.Peer | undefined = undefined;
    private _mediasoupDevice: mediasoupClient.Device | undefined = undefined;
    private _sendTransport: Transport | undefined = undefined;
    private _recvTransport: Transport | undefined = undefined;

    private _webcamProducer: mediasoupClient.types.Producer | undefined = undefined;
    private _micProducer: mediasoupClient.types.Producer | undefined = undefined;

    private _status: Status = Status.CLOSED;

    private _producerVideoUpdated?: OnProducerStreamUpdated;
    private _producerAudioUpdated?: OnProducerStreamUpdated;
    private _consumerVideoUpdated?: OnConsumerStreamUpdated;
    private _consumerAudioUpdated?: OnConsumerStreamUpdated;

    constructor() {}

    async join(roomID: string, userPeer: UserPeer, watcher?: VideoChatWatcher) {
        this._roomID = roomID;
        this._userPeer = userPeer;
        this._producerVideoUpdated = watcher?.producerVideoUpdated;
        this._producerAudioUpdated = watcher?.producerAudioUpdated;
        this._consumerVideoUpdated = watcher?.consumerVideoUpdated;
        this._consumerAudioUpdated = watcher?.consumerAudioUpdated;

        const protooTransport = new protooClient.WebSocketTransport(this._getProtooUrl());
        this._protoo = new protooClient.Peer(protooTransport);

        this._protoo.on('open', () => {
            console.log('protooClient open');
            this._onProtooOpen();
        });

        this._protoo.on('failed', () => {
            console.log('protooClient failed');
            this._status = Status.CLOSED;
        });

        this._protoo.on('disconnected', () => {
            console.log('protooClient disconnected');
            this._status = Status.CLOSED;
        });

        this._protoo.on('close', () => {
            console.log('protooClient close');
            this._status = Status.CLOSED;
        });

        this._protoo.on('request', async (request, accept) => {
            console.log('protooClient request', request.method);
            switch (request.method) {
                case 'newConsumer': {
                    const { peerId, producerId, id, kind, rtpParameters, appData } = request.data;

                    try {
                        const consumer = await this._recvTransport!.consume({
                            id,
                            producerId,
                            kind,
                            rtpParameters,
                            // NOTE: Force streamId to be same in mic and webcam and different
                            // in screen sharing so libwebrtc will just try to sync mic and
                            // webcam streams from the same remote peer.
                            streamId: `${peerId}-${appData.share ? 'share' : 'mic-webcam'}`,
                            appData: { ...appData, peerId }, // Trick.
                        });

                        consumer.on('transportclose', () => {
                            console.log('consumer transportclose', consumer);
                            this._consumerAudioUpdated?.(consumer.appData.peerId, null);
                            this._consumerVideoUpdated?.(consumer.appData.peerId, null);
                        });

                        mediasoupClient.parseScalabilityMode(
                            consumer.rtpParameters.encodings![0].scalabilityMode
                        );

                        // We are ready. Answer the protoo request so the server will
                        // resume this Consumer (which was paused for now if video).
                        accept();

                        if (consumer.track.kind === 'audio') {
                            this._consumerAudioUpdated?.(consumer.appData.peerId, consumer.track);
                        } else {
                            this._consumerVideoUpdated?.(consumer.appData.peerId, consumer.track);
                        }
                    } catch (error) {
                        console.log('"newConsumer" request failed:%o', error);
                        throw error;
                    }
                    break;
                }
            }
        });

        this._protoo.on('notification', (notification) => {
            console.log('protooClient notification', notification);
        });
    }

    async leave() {
        if (this._webcamProducer) {
            this.disableWebcam();
        }
        if (this._micProducer) {
            this.disableMic();
        }
        this._protoo?.close();
    }

    private async _onProtooOpen() {
        try {
            this._mediasoupDevice = new mediasoupClient.Device({
                handlerName: 'Chrome111',
            });
            const routerRtpCapabilities = await this.protoo.request('getRouterRtpCapabilities');

            await this.mediasoupDevice.load({ routerRtpCapabilities });

            // NOTE: Stuff to play remote audios due to browsers' new autoplay policy.
            //
            // Just get access to the mic and DO NOT close the mic track for a while.
            // Super hack!
            {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioTrack = stream.getAudioTracks()[0];

                audioTrack.enabled = false;

                setTimeout(() => audioTrack.stop(), 120000);
            }

            {
                // Create mediasoup Transport for sending (unless we don't want to produce).
                const transportInfo = await this.protoo.request('createWebRtcTransport', {
                    forceTcp: false,
                    producing: true,
                    consuming: false,
                    sctpCapabilities: this.mediasoupDevice.sctpCapabilities,
                });

                const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
                    transportInfo;
                const PC_PROPRIETARY_CONSTRAINTS = {};
                this._sendTransport = this.mediasoupDevice.createSendTransport({
                    id,
                    iceParameters,
                    iceCandidates,
                    dtlsParameters: {
                        ...dtlsParameters,
                        // Remote DTLS role. We know it's always 'auto' by default so, if
                        // we want, we can force local WebRTC transport to be 'client' by
                        // indicating 'server' here and vice-versa.
                        role: 'auto',
                    },
                    sctpParameters,
                    iceServers: [],
                    proprietaryConstraints: PC_PROPRIETARY_CONSTRAINTS,
                    additionalSettings: { encodedInsertableStreams: false },
                });

                this.sendTransport.on('connect', ({ dtlsParameters }, callback, errCallback) => {
                    this.protoo
                        .request('connectWebRtcTransport', {
                            transportId: this.sendTransport.id,
                            dtlsParameters,
                        })
                        .then(callback)
                        .catch(errCallback);
                });

                this.sendTransport.on(
                    'produce',
                    async ({ kind, rtpParameters, appData }, callback, errCallback) => {
                        try {
                            // eslint-disable-next-line no-shadow
                            const { id } = await this.protoo.request('produce', {
                                transportId: this.sendTransport.id,
                                kind,
                                rtpParameters,
                                appData,
                            });

                            callback({ id });
                        } catch (error: any) {
                            errCallback(error);
                        }
                    }
                );

                this.sendTransport.on(
                    'producedata',
                    async (
                        { sctpStreamParameters, label, protocol, appData },
                        callback,
                        errCallback
                    ) => {
                        console.log(
                            '"producedata" event: [sctpStreamParameters:%o, appData:%o]',
                            sctpStreamParameters,
                            appData
                        );

                        try {
                            // eslint-disable-next-line no-shadow
                            const { id } = await this.protoo.request('produceData', {
                                transportId: this.sendTransport.id,
                                sctpStreamParameters,
                                label,
                                protocol,
                                appData,
                            });

                            callback({ id });
                        } catch (error: any) {
                            errCallback(error);
                        }
                    }
                );
            }

            {
                // Create mediasoup Transport for receiving (unless we don't want to consume).
                const transportInfo = await this.protoo.request('createWebRtcTransport', {
                    forceTcp: false,
                    producing: false,
                    consuming: true,
                    sctpCapabilities: this.mediasoupDevice.sctpCapabilities,
                });

                const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
                    transportInfo;

                this._recvTransport = this.mediasoupDevice.createRecvTransport({
                    id,
                    iceParameters,
                    iceCandidates,
                    dtlsParameters: {
                        ...dtlsParameters,
                        // Remote DTLS role. We know it's always 'auto' by default so, if
                        // we want, we can force local WebRTC transport to be 'client' by
                        // indicating 'server' here and vice-versa.
                        role: 'auto',
                    },
                    sctpParameters,
                    iceServers: [],
                    additionalSettings: { encodedInsertableStreams: false },
                });

                this.recvTransport.on('connect', ({ dtlsParameters }, callback, errCallback) => {
                    this.protoo
                        .request('connectWebRtcTransport', {
                            transportId: this.recvTransport.id,
                            dtlsParameters,
                        })
                        .then(callback)
                        .catch(errCallback);
                });

                // Join now into the room.
                // NOTE: Don't send our RTP capabilities if we don't want to consume.
                await this.protoo.request('join', {
                    displayName: this._userPeer!.name,
                    device: {
                        flag: 'chrome',
                        name: 'Chrome',
                        version: '114.0.0.0',
                    },
                    rtpCapabilities: this.mediasoupDevice.rtpCapabilities,
                    sctpCapabilities: this.mediasoupDevice.sctpCapabilities,
                });
                console.log('You are in the room!');

                await this._enableProducer();

                this.sendTransport.on('connectionstatechange', (connectionState: string) => {
                    console.log('connectionstatechange', connectionState);
                });

                this._status = Status.JOINED;
            }
        } catch (error: any) {
            console.log('_joinRoom() failed:%o', error);
        }
    }

    private async _enableProducer() {
        await this.enableWebcam();
        await this.enableMic();
    }

    async enableWebcam() {
        try {
            if (!this.mediasoupDevice.canProduce('video')) {
                console.error('enableWebcam() | cannot produce video');
                return;
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            const webcamDevice = devices[0];

            if (!webcamDevice) {
                throw new Error('no webcam devices');
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: { ideal: webcamDevice.deviceId },
                },
            });

            const track = stream.getVideoTracks()[0];

            const codecOptions = {
                videoGoogleStartBitrate: 1000,
            };

            const encodings = [
                {
                    scaleResolutionDownBy: 1,
                    maxBitrate: 5000000,
                    scalabilityMode: 'L1T3',
                },
            ];

            encodings.unshift({
                scaleResolutionDownBy: 2,
                maxBitrate: 1000000,
                scalabilityMode: 'L1T3',
            });

            encodings.unshift({
                scaleResolutionDownBy: 4,
                maxBitrate: 500000,
                scalabilityMode: 'L1T3',
            });

            let codec;
            this._webcamProducer = await this.sendTransport.produce({
                track,
                encodings,
                codecOptions,
                codec,
            });

            this._producerVideoUpdated?.(this.webcamProducer.track);

            this.webcamProducer.on('transportclose', () => {
                console.log('Webcam transportclose!');
                this._webcamProducer = undefined;
            });

            this.webcamProducer.on('trackended', () => {
                console.log('Webcam disconnected!');
                this.disableWebcam().catch(() => {});
            });
        } catch (error) {
            console.log('enableWebcam() | failed:%o', error);
        }
    }

    async disableWebcam() {
        this.webcamProducer.close();

        try {
            await this.protoo.request('closeProducer', { producerId: this.webcamProducer.id });
        } catch (error) {
            console.log('Error closing server-side webcam Producer:', error);
        }

        this._webcamProducer = undefined;

        this._producerVideoUpdated?.(null);
    }

    async enableMic() {
        if (!this.mediasoupDevice.canProduce('audio')) {
            console.error('enableMic() | cannot produce audio');
            return;
        }

        let track;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            track = stream.getAudioTracks()[0];

            this._micProducer = await this.sendTransport.produce({
                track,
                codecOptions: {
                    opusStereo: true,
                    opusDtx: true,
                    opusFec: true,
                    opusNack: true,
                },
                // NOTE: for testing codec selection.
                // codec : this._mediasoupDevice.rtpCapabilities.codecs
                // 	.find((codec) => codec.mimeType.toLowerCase() === 'audio/pcma')
            });

            this._producerAudioUpdated?.(this._micProducer.track);

            this._micProducer.on('transportclose', () => {
                this._micProducer = undefined;
            });

            this._micProducer.on('trackended', () => {
                console.log('Microphone disconnected!');
                this.disableMic().catch(() => {});
            });
        } catch (error) {
            console.error('enableMic() | failed:%o', error);

            if (track) {
                track.stop();
            }
        }
    }

    async disableMic() {
        this.micProducer.close();

        try {
            await this.protoo.request('closeProducer', { producerId: this.micProducer.id });
        } catch (error) {
            console.log('Error closing server-side mic Producer:', error);
        }

        this._micProducer = undefined;
        this._producerAudioUpdated?.(null);
    }

    private _getProtooUrl() {
        return `${MEDIASOUP_URL}/?roomId=${this._roomID}&peerId=${
            this._userPeer!.peerID
        }&consumerReplicas=undefined`;
    }

    private get mediasoupDevice() {
        return this._mediasoupDevice!;
    }

    private get protoo() {
        return this._protoo!;
    }

    private get sendTransport() {
        return this._sendTransport!;
    }

    private get recvTransport() {
        return this._recvTransport!;
    }

    private get webcamProducer() {
        return this._webcamProducer!;
    }

    private get micProducer() {
        return this._micProducer!;
    }

    get status() {
        return this._status;
    }
}
