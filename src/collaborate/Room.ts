import { RoomState, useRoomStore } from './Room.store';

export class Room {
    private _store = useRoomStore();

    joinWhiteBoard(roomID: string) {
        this._store.whiteBoard.join(roomID);
        this._store.status = RoomState.WHITEBOARD;
    }

    joinVideoChat(roomID: string) {
        this._store.videoChat.join(roomID);
        this._store.status = RoomState.VIDEO;
    }
}
