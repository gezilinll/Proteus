import { VideoChat } from './VideoChat';
import { WhiteBoard } from './Whiteboard';

export class Room {
    private _whiteBoard: WhiteBoard;
    private _videoChat: VideoChat;

    constructor() {
        this._whiteBoard = new WhiteBoard();
        this._videoChat = new VideoChat();
    }

    joinWhiteboard(id: string, userID: string) {
        this._whiteBoard.join(id, userID);
    }

    joinVideoChat(id: string) {
        this._videoChat.join(id);
    }
}
