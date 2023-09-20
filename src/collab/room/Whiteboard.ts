import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { HOCUSPOCUS_URL } from '../../Constants';

export declare type OnNewElementCallback = (element: Element) => void;

export class WhiteBoard {
    private _roomID: string;
    private _yjsProvider: HocuspocusProvider;

    private _origin: string;
    private _doc: Y.Doc;

    constructor(roomID: string, userID: string) {
        this._roomID = roomID;
        this._origin = uuidv4();
        this._doc = new Y.Doc();

        this._yjsProvider = new HocuspocusProvider({
            url: HOCUSPOCUS_URL,
            name: roomID,
            parameters: { userID },
            document: this._doc,
        });
    }
}
