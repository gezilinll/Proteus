import { useUserStore } from '../store/User.store';
import { Room } from '../room/Room';
import { UserAwareness } from '../room/Whiteboard';
import { UserModel } from '../model/UserModel';
import randomString from 'random-string';

export class CollabBarService {
    private _roomID: string = '';
    private _userStore = useUserStore();
    private _room: Room;

    constructor() {
        this._room = new Room();
    }

    setup(roomID: string) {
        this._roomID = roomID;
        this._userStore.self.color = this._randomColor();
        this._userStore.self.peerID = randomString({ length: 8 }).toLowerCase();
    }

    joinWhiteboard() {
        this._room.joinWhiteboard(
            this._roomID,
            {
                id: this._userStore.self.id,
                name: this._userStore.self.name,
                color: this._userStore.self.color,
                mouseX: this._userStore.self.mouseX,
                mouseY: this._userStore.self.mouseY,
                peerID: this._userStore.self.peerID,
            },
            {
                awarenessUpdated: this._handleUserAwarenessUpdated.bind(this),
            }
        );
    }

    joinVideoChat() {
        this._room.joinVideoChat(
            this._roomID,
            {
                id: this._userStore.self.id,
                name: this._userStore.self.name,
                peerID: this._userStore.self.peerID,
            },
            {
                producerAudioUpdated: (audio?: MediaStreamTrack | null) => {
                    if (audio) {
                        const audioStream = new MediaStream();
                        audioStream.addTrack(audio);
                        this._userStore.self.audioStream = audioStream;
                    } else {
                        this._userStore.self.audioStream = undefined;
                    }
                    this._userStore.userStreamFlag++;
                },
                producerVideoUpdated: (video: MediaStreamTrack | null) => {
                    if (video) {
                        const videoStream = new MediaStream();
                        videoStream.addTrack(video);
                        this._userStore.self.videoStream = videoStream;
                    } else {
                        this._userStore.self.videoStream = undefined;
                    }
                    this._userStore.userStreamFlag++;
                },
                consumerAudioUpdated: (peerId: string, stream: MediaStreamTrack | null) => {
                    const user = this._userStore.getOtherUserByPeerID(peerId)!;
                    if (stream) {
                        const audioStream = new MediaStream();
                        audioStream.addTrack(stream);
                        user.audioStream = audioStream;
                    } else {
                        user.audioStream = undefined;
                    }
                    this._userStore.userStreamFlag++;
                },
                consumerVideoUpdated: (peerId: string, stream: MediaStreamTrack | null) => {
                    const user = this._userStore.getOtherUserByPeerID(peerId)!;
                    if (stream) {
                        const videoStream = new MediaStream();
                        videoStream.addTrack(stream);
                        user.videoStream = videoStream;
                    } else {
                        user.videoStream = undefined;
                    }
                    this._userStore.userStreamFlag++;
                },
                consumerClosed: (peerId: string) => {
                    const user = this._userStore.getOtherUserByPeerID(peerId);
                    if (user) {
                        user.videoStream = undefined;
                        user.audioStream = undefined;
                    }
                    this._userStore.userStreamFlag++;
                },
            }
        );
    }

    leaveVideoChat() {
        this._room.leaveVideoChat();
    }

    updateMousePosition(x: number, y: number) {
        this._room.updateMousePosition(x, y);
    }

    switchAudio() {
        if (this._userStore.self.audioStream) {
            this._room.disableMic();
        } else {
            this._room.enableMic();
        }
    }

    switchVideo() {
        if (this._userStore.self.videoStream) {
            this._room.disableCamera();
        } else {
            this._room.enableCamera();
        }
    }

    private _handleUserAwarenessUpdated(users: UserAwareness[]) {
        const onlineUsers = new Set(users.map((item) => item.peerID));
        for (const otherUser of this._userStore.others) {
            if (!onlineUsers.has(otherUser.peerID)) {
                this._userStore.deleteOtherUser(otherUser);
            }
        }
        for (const onlineUser of users) {
            if (this._userStore.self.peerID === onlineUser.peerID) {
                continue;
            }
            if (!this._userStore.hasOtherUserByID(onlineUser.id)) {
                this._userStore.addOtherUser(onlineUser as unknown as UserModel);
            } else {
                const localUser = this._userStore.getOtherUserByUserID(onlineUser.id)!;
                localUser.mouseX = onlineUser.mouseX;
                localUser.mouseY = onlineUser.mouseY;
            }
        }
    }

    private _randomColor() {
        let result = '';
        for (let i = 0; i < 6; ++i) {
            const value = Math.floor(12 * Math.random());
            result += value.toString(16);
        }
        return '#' + result;
    }
}
