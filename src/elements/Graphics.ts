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

  replaceWithSVG(svg: string) {
    const strokeColor = this._path.strokeColor;
    const strokeWidth = this._path.strokeWidth;

    this._path.remove();
    this._path = new paper.Path(svg);
    this._path.strokeColor = strokeColor;
    this._path.strokeWidth = strokeWidth;
  }

  addPoint(x: number, y: number) {
    this._path.add(new paper.Point(x, y));
    this._path.smooth();
  }

  get pathData() {
    return this._path.pathData;
  }
}
