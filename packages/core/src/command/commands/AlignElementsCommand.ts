import { Command } from '../Command';
import { Scene } from '../../scene/Scene';
import { Element } from '../../types/element';
import { alignElements, AlignmentType } from '../../utils/alignment';
import { BatchCommand } from './BatchCommand';
import { UpdateElementCommand } from './UpdateElementCommand';

/**
 * 对齐元素命令
 */
export class AlignElementsCommand implements Command {
  private batchCommand: BatchCommand;

  constructor(
    scene: Scene,
    private elementIds: string[],
    private alignment: AlignmentType
  ) {
    const elements = elementIds
      .map((id) => scene.get(id))
      .filter((el) => el !== undefined) as Element[];

    if (elements.length === 0) {
      throw new Error('No elements to align');
    }

    // 计算对齐后的位置
    const updates = alignElements(elements, alignment);

    // 创建批量更新命令
    const commands = Array.from(updates.entries()).map(([id, { x, y }]) => {
      const element = scene.get(id);
      if (!element) {
        throw new Error(`Element with id "${id}" not found`);
      }
      return new UpdateElementCommand(scene, id, {
        transform: {
          ...element.transform,
          x,
          y,
        },
      });
    });

    this.batchCommand = new BatchCommand(commands);
  }

  execute(): void {
    this.batchCommand.execute();
  }

  undo(): void {
    this.batchCommand.undo();
  }

  get description(): string {
    return `Align ${this.elementIds.length} elements ${this.alignment}`;
  }
}

