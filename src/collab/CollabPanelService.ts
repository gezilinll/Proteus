import { useUserStore } from '../store/User.store';
import { Room } from '../room/Room';
import { UserAwareness } from '../room/Whiteboard';
import { UserModel } from '../model/UserModel';

export class CollabPanelService {
    private _roomID: string = '';
    private _userStore = useUserStore();
    private _room: Room;

    constructor() {
        this._room = new Room();
    }

    setup(roomID: string) {
        this._roomID = roomID;
        this._userStore.self.color = this._randomColor();
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
            },
            {
                awarenessUpdated: this._handleUserAwarenessUpdated.bind(this),
            }
        );
    }

    joinVideoChat() {
        this._room.joinVideoChat(this._roomID, {
            producerAudioUpdated: (audio?: MediaStreamTrack | null) => {
                console.log('producerAudioUpdated');
                this._userStore.self.audioTrack = audio ?? undefined;
            },
            producerVideoUpdated: (video: MediaStreamTrack | null) => {
                console.log('producerVideoUpdated');
                this._userStore.self.videoTrack = video ?? undefined;
            },
        });
    }

    updateMousePosition(x: number, y: number) {
        this._room.updateMousePosition(x, y);
    }

    private _handleUserAwarenessUpdated(users: UserAwareness[]) {
        const onlineUsers = new Set(users.map((item) => item.id));
        for (const otherUser of this._userStore.others) {
            if (!onlineUsers.has(otherUser[0])) {
                this._userStore.others.delete(otherUser[0]);
            }
        }
        for (const onlineUser of users) {
            if (this._userStore.self.id === onlineUser.id) {
                continue;
            }
            if (!this._userStore.others.has(onlineUser.id)) {
                this._userStore.others.set(onlineUser.id, onlineUser as unknown as UserModel);
            } else {
                const localUser = this._userStore.others.get(onlineUser.id)!;
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
