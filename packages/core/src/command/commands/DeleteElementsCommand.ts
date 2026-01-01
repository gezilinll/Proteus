import { Command } from '../Command';
import { Scene } from '../../scene/Scene';
import { BatchCommand } from './BatchCommand';
import { RemoveElementCommand } from './RemoveElementCommand';

/**
 * 删除元素命令
 */
export class DeleteElementsCommand implements Command {
  private batchCommand: BatchCommand;

  constructor(
    scene: Scene,
    private elementIds: string[]
  ) {
    const commands = elementIds.map((id) => new RemoveElementCommand(scene, id));
    this.batchCommand = new BatchCommand(commands);
  }

  execute(): void {
    this.batchCommand.execute();
  }

  undo(): void {
    this.batchCommand.undo();
  }

  get description(): string {
    return `Delete ${this.elementIds.length} elements`;
  }
}

