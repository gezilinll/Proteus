import { RoomState, useRoomStore } from './Room.store';
import { VideoChat } from './VideoChat';
import { WhiteBoard } from './WhiteBoard';

export class Room {
    private _store = useRoomStore();
    private _whiteBoard: WhiteBoard = new WhiteBoard();
    private _videoChat: VideoChat = new VideoChat();

    joinWhiteBoard(roomID: string) {
        this._whiteBoard.join(roomID);
        this._store.status = RoomState.WHITEBOARD;
    }

    joinVideoChat(roomID: string) {
        this._videoChat.join(roomID);
        this._store.status = RoomState.VIDEO;
    }

    enableWebcam() {
        this._videoChat.enableWebcam();
    }

    disableWebcam() {
        this._videoChat.disableWebcam();
    }
}
