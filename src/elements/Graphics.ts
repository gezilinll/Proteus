import { v4 as uuidv4 } from "uuid";

export class Graphics {
  id: string;

  constructor(uuid?: string) {
    this.id = uuid ?? uuidv4();
  }
}
