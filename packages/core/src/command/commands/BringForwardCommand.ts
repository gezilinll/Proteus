import { Command } from '../Command';
import { Scene } from '../../scene/Scene';

/**
 * 上移一层命令
 */
export class BringForwardCommand implements Command {
  constructor(
    private scene: Scene,
    private elementId: string
  ) {}

  execute(): void {
    this.scene.moveUp(this.elementId);
  }

  undo(): void {
    this.scene.moveDown(this.elementId);
  }

  get description(): string {
    return `Bring element ${this.elementId} forward`;
  }
}

