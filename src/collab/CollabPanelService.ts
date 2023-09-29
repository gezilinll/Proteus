import { UserModel } from '../model/UserModel';
import { useUserStore } from '../store/User.store';
import { Room } from './room/Room';
import { UserAwareness } from './room/Whiteboard';

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
        console.log('setup', this._userStore.self.color);
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
        this._room.joinVideoChat(this._roomID);
    }

    updateMousePosition(x: number, y: number) {
        this._room.updateMousePosition(x, y);
    }

    private _handleUserAwarenessUpdated(users: UserAwareness[]) {
        const onlineUsers = new Set(users.map((item) => item.id));
        this._userStore.others = this._userStore.others.filter((item) => onlineUsers.has(item.id));
        const localUsers = new Set(this._userStore.others.map((item) => item.id));
        localUsers.add(this._userStore.self.id);
        for (const onlineUser of users) {
            if (!localUsers.has(onlineUser.id)) {
                this._userStore.others.push({
                    id: onlineUser.id,
                    name: onlineUser.name,
                    color: onlineUser.color,
                    mouseX: onlineUser.mouseX,
                    mouseY: onlineUser.mouseY,
                });
            }
        }
    }

    private _randomColor() {
        let result = '';
        for (let i = 0; i < 6; ++i) {
            const value = Math.floor(16 * Math.random());
            result += value.toString(16);
        }
        return '#' + result;
    }
}
