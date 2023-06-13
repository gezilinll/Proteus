<template>
    <div class="app-container">
        <div class="app-header">Header</div>
        <div class="app-main">
            <canvas id="renderTarget" class="app-content"></canvas>
            <div class="app-sidebar app-sidebar-left">Left Sidebar</div>
            <div class="app-sidebar app-sidebar-right">Right Sidebar</div>
        </div>
        <div class="app-footer">
            <video id="producer" autoplay></video>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import protooClient from 'protoo-client';
import * as mediasoupClient from 'mediasoup-client';
import randomString from 'random-string';

let mediasoupDevice: any;
let sendTransport: any;
let recvTransport: any;
let webcams: Map<string, MediaDeviceInfo>;
let webcam = {
    device: null,
    resolution: 'hd',
};
let webcamProducer: any;

function getProtooUrl() {
    const hostname = 'gezilinll.com';

    return `wss://${hostname}:15025/?roomId=pel4u3xs&peerId=xhvwbe9o&consumerReplicas=undefined`;
}

function setProducerVideo(videoTrack: MediaStreamTrack) {
    const videoElem = document.getElementById('producer')! as HTMLVideoElement;

    const stream = new MediaStream();

    stream.addTrack(videoTrack);
    videoElem.srcObject = stream;
}

async function joinRoom(this: any, protoo: protooClient.Peer) {
    try {
        mediasoupDevice = new mediasoupClient.Device();
        const routerRtpCapabilities = await protoo.request('getRouterRtpCapabilities');

        await mediasoupDevice.load({ routerRtpCapabilities });

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
            const transportInfo = await protoo.request('createWebRtcTransport', {
                forceTcp: false,
                producing: true,
                consuming: false,
                sctpCapabilities: mediasoupDevice.sctpCapabilities,
            });

            const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
                transportInfo;
            const PC_PROPRIETARY_CONSTRAINTS = {
                // optional : [ { googDscp: true } ]
            };
            sendTransport = mediasoupDevice.createSendTransport({
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

            sendTransport.on(
                'connect',
                (
                    { dtlsParameters }: any,
                    callback: ((value: any) => any) | null | undefined,
                    errback: ((reason: any) => PromiseLike<never>) | null | undefined // eslint-disable-line no-shadow
                ) => {
                    protoo
                        .request('connectWebRtcTransport', {
                            transportId: sendTransport.id,
                            dtlsParameters,
                        })
                        .then(callback)
                        .catch(errback);
                }
            );

            sendTransport.on(
                'produce',
                async (
                    { kind, rtpParameters, appData }: any,
                    callback: (arg0: { id: any }) => void,
                    errback: (arg0: any) => void
                ) => {
                    try {
                        // eslint-disable-next-line no-shadow
                        const { id } = await protoo.request('produce', {
                            transportId: sendTransport.id,
                            kind,
                            rtpParameters,
                            appData,
                        });

                        callback({ id });
                    } catch (error: any) {
                        errback(error);
                    }
                }
            );

            sendTransport.on(
                'producedata',
                async (
                    { sctpStreamParameters, label, protocol, appData }: any,
                    callback: (arg0: { id: any }) => void,
                    errback: (arg0: any) => void
                ) => {
                    console.log(
                        '"producedata" event: [sctpStreamParameters:%o, appData:%o]',
                        sctpStreamParameters,
                        appData
                    );

                    try {
                        // eslint-disable-next-line no-shadow
                        const { id } = await protoo.request('produceData', {
                            transportId: sendTransport.id,
                            sctpStreamParameters,
                            label,
                            protocol,
                            appData,
                        });

                        callback({ id });
                    } catch (error: any) {
                        errback(error);
                    }
                }
            );
        }

        {
            // Create mediasoup Transport for receiving (unless we don't want to consume).
            const transportInfo = await protoo.request('createWebRtcTransport', {
                forceTcp: false,
                producing: false,
                consuming: true,
                sctpCapabilities: mediasoupDevice.sctpCapabilities,
            });

            const { id, iceParameters, iceCandidates, dtlsParameters, sctpParameters } =
                transportInfo;

            recvTransport = mediasoupDevice.createRecvTransport({
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

            recvTransport.on(
                'connect',
                (
                    { dtlsParameters }: any,
                    callback: any,
                    errback: any // eslint-disable-line no-shadow
                ) => {
                    protoo
                        .request('connectWebRtcTransport', {
                            transportId: recvTransport.id,
                            dtlsParameters,
                        })
                        .then(callback)
                        .catch(errback);
                }
            );

            // Join now into the room.
            // NOTE: Don't send our RTP capabilities if we don't want to consume.
            const { peers } = await protoo.request('join', {
                displayName: randomString({ length: 8 }).toLowerCase(),
                device: {
                    flag: 'chrome',
                    name: 'Chrome',
                    version: '114.0.0.0',
                },
                rtpCapabilities: mediasoupDevice.rtpCapabilities,
                sctpCapabilities: mediasoupDevice.sctpCapabilities,
            });
            console.log('You are in the room!');

            enableWebCam();
            sendTransport.on('connectionstatechange', (connectionState: string) => {
                console.log('connectionstatechange', connectionState);
            });
        }
    } catch (error: any) {
        console.log('_joinRoom() failed:%o', error);
    }
}

async function updateWebcams() {
    // Reset the list.
    webcams = new Map();

    const devices = await navigator.mediaDevices.enumerateDevices();

    for (const device of devices) {
        if (device.kind !== 'videoinput') continue;

        webcams.set(device.deviceId, device);
    }

    const array = Array.from(webcams.values());
    const len = array.length;

    if (len === 0) {
        webcam.device = null;
    } else {
        // @ts-ignore
        webcam.device = array[0];
    }
}

const VIDEO_CONSTRAINS = {
    qvga: { width: { ideal: 320 }, height: { ideal: 240 } },
    vga: { width: { ideal: 640 }, height: { ideal: 480 } },
    hd: { width: { ideal: 1280 }, height: { ideal: 720 } },
};

async function enableWebCam() {
    let track;
    let device;
    try {
        await updateWebcams();
        device = webcam.device as unknown as MediaDeviceInfo;

        if (!device) throw new Error('no webcam devices');

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: { ideal: device.deviceId },
            },
        });

        track = stream.getVideoTracks()[0];

        let encodings;
        let codec;
        const codecOptions = {
            videoGoogleStartBitrate: 1000,
        };

        encodings = [
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

        webcamProducer = await sendTransport.produce({
            track,
            encodings,
            codecOptions,
            codec,
        });

        setProducerVideo(webcamProducer.track);

        webcamProducer.on('transportclose', () => {
            console.log('Webcam transportclose!');
            webcamProducer = null;
        });

        webcamProducer.on('trackended', () => {
            console.log('Webcam disconnected!');
        });
    } catch (error) {
        console.log('enableWebcam() | failed:%o', error);
        if (track) track.stop();
    }
}

onMounted(() => {
    const protooTransport = new protooClient.WebSocketTransport(getProtooUrl());

    const protoo = new protooClient.Peer(protooTransport);

    protoo.on('open', () => {
        console.log('protooClient open');
        joinRoom(protoo);
    });

    protoo.on('failed', () => {
        console.log('protooClient failed');
    });

    protoo.on('disconnected', () => {
        console.log('protooClient disconnected');
    });

    protoo.on('close', () => {
        console.log('protooClient close');
    });

    protoo.on('request', () => {
        console.log('protooClient request');
    });

    protoo.on('notification', () => {
        console.log('protooClient notification');
    });
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
}

.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-header {
    background-color: #ddd;
    flex-basis: 32px;
}

.app-main {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
}

.app-content {
    flex-grow: 1;
}

.app-sidebar {
    flex-basis: 200px;
    background-color: #eee;
}

.app-sidebar-left {
    order: -1;
}

.app-footer {
    background-color: #ddd;
    flex-basis: 512px;
}
</style>
