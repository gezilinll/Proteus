import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';
import { HocuspocusProvider, onAwarenessUpdateParameters } from '@hocuspocus/provider';
import { HOCUSPOCUS_URL } from '../Constants';
import { UserModel } from '../model/UserModel';

export declare type OnUserAwarenessUpdated = (users: UserAwareness[]) => void;

export declare type UserAwareness = Pick<UserModel, 'id' | 'name' | 'color' | 'mouseX' | 'mouseY'>;

export interface WhiteboardWatcher {
    awarenessUpdated: OnUserAwarenessUpdated;
}

export class Whiteboard {
    private _roomID: string = '';
    private _yjsProvider?: HocuspocusProvider;

    private _origin: string;
    private _doc: Y.Doc;

    private _user?: UserAwareness;

    private _awarenessUpdated?: OnUserAwarenessUpdated;

    constructor() {
        this._origin = uuidv4();
        this._doc = new Y.Doc();
    }

    join(roomID: string, user: UserAwareness, watcher?: WhiteboardWatcher) {
        this._roomID = roomID;
        this._user = user;
        this._awarenessUpdated = watcher?.awarenessUpdated;
        this._yjsProvider = new HocuspocusProvider({
            url: HOCUSPOCUS_URL,
            name: this._roomID,
            parameters: {},
            document: this._doc,
            onSynced: () => {
                console.log('WhiteBoard onSynced');
            },
            onConnect: () => {
                console.log('WhiteBoard onConnect');
            },
            onClose: () => {
                console.log('WhiteBoard onClose');
            },
            onDestroy: () => {
                console.log('WhiteBoard onDestroy');
            },
            onAwarenessUpdate: (data: onAwarenessUpdateParameters) => {
                const result = data.states.map((item) => item.user);
                this._awarenessUpdated?.(result as unknown as UserAwareness[]);
            },
        });

        this.updateMousePosition(0, 0);
    }

    updateMousePosition(x: number, y: number) {
        this._yjsProvider?.setAwarenessField('user', {
            id: this._user?.id,
            name: this._user?.name,
            color: this._user?.color,
            mouseX: x,
            mouseY: y,
        });
    }
}
