import { Element } from '../elements/Element';
import { RoomState, useRoomStore } from './Room.store';
import { VideoChat } from './VideoChat';
import { WhiteBoard, OnNewElementCallback } from './WhiteBoard';

export declare type OnWhiteboardConnectedCallback = () => void;
export class Room {
    private _store = useRoomStore();
    private _whiteBoard: WhiteBoard = new WhiteBoard();
    private _videoChat: VideoChat = new VideoChat();
    private _wbCallback: OnWhiteboardConnectedCallback | undefined = undefined;

    joinWhiteBoard(roomID: string) {
        this._whiteBoard.join(roomID);
        this._store.status = RoomState.WHITEBOARD;
        this._wbCallback?.();
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

    onWhiteboardConnected(cb: OnWhiteboardConnectedCallback) {
        this._wbCallback = cb;
    }

    onNewOnlineElement(cb: OnNewElementCallback) {
        this._whiteBoard.onNewElement(cb);
    }

    syncNewElement(element: Element) {
        this._whiteBoard.addElement(element);
    }

    syncModifiedElement(element: Element) {
        this._whiteBoard.updateElement(element);
    }
}
