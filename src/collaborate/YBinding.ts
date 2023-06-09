import * as Y from "yjs";
import { Graphics } from "../elements/Graphics";
import { v4 as uuidv4 } from "uuid";

export class YBinding {
  private _origin: string;
  private _doc: Y.Doc;
  private _yElementMap: Y.Map<unknown>;
  private _elementMap: Map<string, Graphics> = new Map();

  constructor(doc: Y.Doc) {
    this._origin = uuidv4();
    this._doc = doc;
    this._yElementMap = this._doc.getMap("elements");
    this._yElementMap.observe((event, transaction) => {
      if (transaction.origin !== this._origin) {
        transaction.changed.forEach((value, key) => {
          value.forEach((value) => {
            let element = this._elementMap.get(value!);
            if (!element) {
              element = new Graphics(value!);
              this._elementMap.set(element.id, element);
              this.addElement(element);
            }
            element.replaceWithSVG(
              (this._yElementMap.get(value!)! as Y.Map<unknown>).get(
                "path"
              ) as string
            );
          });
        });
      }
    });
  }

  addElement(element: Graphics) {
    this._elementMap.set(element.id, element);

    const yElement = new Y.Map();
    yElement.set("svg", element.pathData);
    yElement.observe((event, transaction) => {
      if (transaction.origin !== this._origin) {
        element.replaceWithSVG(
          (this._yElementMap.get(element.id) as Y.Map<unknown>).get(
            "path"
          ) as string
        );
      }
    });
    this._doc.transact(() => {
      this._yElementMap.set(element.id, yElement);
    }, this._origin);
  }

  updateElement(element: Graphics) {
    const yElement = this._yElementMap.get(element.id) as Y.Map<unknown>;
    this._doc.transact(() => {
      yElement.set("path", element.pathData);
    }, this._origin);
  }
}
