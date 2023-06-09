import { v4 as uuidv4 } from "uuid";
import paper from "paper";

export class Graphics {
  id: string;

  private _path: paper.Path;

  constructor(uuid?: string) {
    this.id = uuid ?? uuidv4();
    this._path = new paper.Path();
    this._path.strokeColor = new paper.Color(
      Math.random(),
      Math.random(),
      Math.random(),
      1.0
    );
    this._path.strokeWidth = Math.random() * 15;
  }

  importData(data: Map<string, any>) {
    this._path.remove();
    this._path = new paper.Path(data.get("path"));
    this._path.strokeColor = new paper.Color(data.get("strokeColor"));
    this._path.strokeWidth = data.get("strokeWidth");
  }

  exportData() {
    const result = new Map();
    result.set("path", this._path.pathData);
    result.set("strokeWidth", this._path.strokeWidth);
    result.set("strokeColor", this._path.strokeColor!.toString());
    return result;
  }

  addPoint(x: number, y: number) {
    this._path.add(new paper.Point(x, y));
    this._path.smooth();
  }
}
