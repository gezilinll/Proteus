import * as Y from 'yjs';
import { Graphics } from '../elements/Graphics';
import { v4 as uuidv4 } from 'uuid';

export class YBinding {
    private _origin: string;
    private _doc: Y.Doc;
    private _yElementMap: Y.Map<unknown>;
    private _elementMap: Map<string, Graphics> = new Map();

    constructor(doc: Y.Doc) {
        this._origin = uuidv4();
        this._doc = doc;
        this._yElementMap = this._doc.getMap('elements');
        this._yElementMap.observe((_event, transaction) => {
            if (transaction.origin !== this._origin) {
                transaction.changed.forEach((value, _key) => {
                    value.forEach((value) => {
                        let element = this._elementMap.get(value!);
                        if (!element) {
                            element = new Graphics(value!);
                            this.addElement(element);
                        }
                        const data = new Map();
                        this._YMapToMap(this._yElementMap.get(value!)! as Y.Map<unknown>, data);
                        element.importData(data);
                    });
                });
            }
        });
    }

    addElement(element: Graphics) {
        this._elementMap.set(element.id, element);
        this._doc.transact(() => {
            const yElement = new Y.Map();
            this._mapToYMap(element.exportData(), yElement);
            yElement.observe((_event, transaction) => {
                if (transaction.origin !== this._origin) {
                    const data = new Map();
                    this._YMapToMap(this._yElementMap.get(element.id) as Y.Map<unknown>, data);
                    element.importData(data);
                }
            });
            this._yElementMap.set(element.id, yElement);
        }, this._origin);
    }

    updateElement(element: Graphics) {
        const yElement = this._yElementMap.get(element.id) as Y.Map<unknown>;
        this._doc.transact(() => {
            this._mapToYMap(element.exportData(), yElement);
        }, this._origin);
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
