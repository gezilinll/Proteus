import { VideoChat } from './VideoChat';
import { UserAwareness, Whiteboard, WhiteboardWatcher } from './Whiteboard';

export class Room {
    private _whiteboard: Whiteboard;
    private _videoChat: VideoChat;

    constructor() {
        this._whiteboard = new Whiteboard();
        this._videoChat = new VideoChat();
    }

    joinWhiteboard(id: string, user: UserAwareness, watcher?: WhiteboardWatcher) {
        this._whiteboard.join(id, user, watcher);
    }

    joinVideoChat(id: string) {
        this._videoChat.join(id);
    }

    updateMousePosition(x: number, y: number) {
        this._whiteboard.updateMousePosition(x, y);
    }
}
