import { Room } from './room/Room';

export class CollabPanelService {
    private _roomID: string = '';
    private _userID: string = '';
    private _userName: string = '';
    private _room: Room;

    constructor() {
        this._room = new Room();
    }

    setup(roomID: string, currentUser: { id: string; name: string }) {
        this._roomID = roomID;
        this._userID = currentUser.id;
        this._userName = currentUser.name;
    }

    joinWhiteboard() {
        this._room.joinWhiteboard(this._roomID, this._userID);
    }

    joinVideoChat() {
        this._room.joinVideoChat(this._roomID);
    }
}
