import * as Y from 'yjs';
import { Brush } from '../elements/Brush';
import { v4 as uuidv4 } from 'uuid';
import { HocuspocusProvider } from '@hocuspocus/provider';

export class WhiteBoard {
    ID: string;
    private _yjsProvider: HocuspocusProvider | undefined = undefined;

    private _origin: string;
    private _doc: Y.Doc;
    private _yElementMap: Y.Map<unknown>;
    private _elementMap: Map<string, Brush> = new Map();
    private _sendFlag = 0;

    constructor() {
        this.ID = '';

        this._origin = uuidv4();
        // this._doc = doc;
        // this._yElementMap = this._doc.getMap('elements');
        // this._yElementMap.observe((_event, transaction) => {
        //     if (transaction.origin !== this._origin) {
        //         transaction.changed.forEach((value, _key) => {
        //             value.forEach((value) => {
        //                 let element = this._elementMap.get(value!);
        //                 if (!element) {
        //                     element = new Brush(value!);
        //                     this.addElement(element);
        //                     const data = new Map();
        //                     this._YMapToMap(this._yElementMap.get(value!)! as Y.Map<unknown>, data);
        //                     console.log('map updated', transaction.origin, this._origin);
        //                     element.importData(data);
        //                 }
        //             });
        //         });
        //     }
        // });
    }

    join(roomID: string) {
        this.ID = roomID;
        this._yjsProvider = new HocuspocusProvider({
            url: 'ws://47.119.150.226:3000',
            name: roomID,
        });
    }

    addElement(element: Brush) {
        this._elementMap.set(element.id, element);
        this._doc.transact(() => {
            const yElement = new Y.Map();
            this._mapToYMap(element.exportData(), yElement);
            yElement.observe((_event, transaction) => {
                if (transaction.origin !== this._origin) {
                    console.log('element updated', transaction.origin, this._origin);
                    const data = new Map();
                    this._YMapToMap(this._yElementMap.get(element.id) as Y.Map<unknown>, data);
                    element.importData(data);
                }
            });
            this._yElementMap.set(element.id, yElement);
        }, this._origin);
    }

    updateElement(element: Brush, force: boolean) {
        const yElement = this._yElementMap.get(element.id) as Y.Map<unknown>;
        if (force || this._sendFlag++ % 10 === 0) {
            this._doc.transact(() => {
                this._mapToYMap(element.exportData(), yElement);
            }, this._origin);
        }
    }

    private _mapToYMap(source: Map<string, any>, dst: Y.Map<unknown>) {
        source.forEach((value, key) => {
            dst.set(key, value);
        });
    }

    private _YMapToMap(source: Y.Map<unknown>, dst: Map<string, any>) {
        source.forEach((value, key) => {
            dst.set(key, value);
        });
    }
}
