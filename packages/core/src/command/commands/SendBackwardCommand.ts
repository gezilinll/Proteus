import { Command } from '../Command';
import { Scene } from '../../scene/Scene';

/**
 * 下移一层命令
 */
export class SendBackwardCommand implements Command {
  constructor(
    private scene: Scene,
    private elementId: string
  ) {}

  execute(): void {
    this.scene.moveDown(this.elementId);
  }

  undo(): void {
    this.scene.moveUp(this.elementId);
  }

  get description(): string {
    return `Send element ${this.elementId} backward`;
  }
}

