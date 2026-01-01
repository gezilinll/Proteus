import { Command } from '../Command';
import { Scene } from '../../scene/Scene';
import { Element } from '../../types/element';
import { distributeElements, DistributionType } from '../../utils/alignment';
import { BatchCommand } from './BatchCommand';
import { UpdateElementCommand } from './UpdateElementCommand';

/**
 * 分布元素命令
 */
export class DistributeElementsCommand implements Command {
  private batchCommand: BatchCommand;

  constructor(
    scene: Scene,
    private elementIds: string[],
    private distribution: DistributionType
  ) {
    const elements = elementIds
      .map((id) => scene.get(id))
      .filter((el) => el !== undefined) as Element[];

    if (elements.length < 3) {
      throw new Error('At least 3 elements required for distribution');
    }

    // 计算分布后的位置
    const updates = distributeElements(elements, distribution);

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
    return `Distribute ${this.elementIds.length} elements ${this.distribution}`;
  }
}

