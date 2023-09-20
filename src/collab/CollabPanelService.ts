import { Room } from './room/Room';

export class CollabPanelService {
    private _room?: Room = undefined;

    constructor() {}

    joinRoom(id: string, userID: string) {
        this._room = this._room ?? new Room(id, userID);
    }
}
