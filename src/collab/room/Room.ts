import { WhiteBoard } from './Whiteboard';

export class Room {
    private _whiteBoard: WhiteBoard;

    constructor(id: string, userID: string) {
        this._whiteBoard = new WhiteBoard(id, userID);
    }
}
