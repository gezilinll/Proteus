import { describe, it, expect } from 'vitest';
import { BatchCommand } from './BatchCommand';
import { Command } from '../Command';

// Mock command for testing
class MockCommand implements Command {
  executed = false;
  undone = false;
  executionOrder: number[] = [];
  undoOrder: number[] = [];

  constructor(public id: number) {}

  execute(): void {
    this.executed = true;
    this.executionOrder.push(this.id);
  }

  undo(): void {
    this.undone = true;
    this.undoOrder.push(this.id);
  }
}

describe('BatchCommand', () => {
  it('should execute all commands in order', () => {
    const cmd1 = new MockCommand(1);
    const cmd2 = new MockCommand(2);
    const cmd3 = new MockCommand(3);

    const batch = new BatchCommand([cmd1, cmd2, cmd3]);
    batch.execute();

    expect(cmd1.executed).toBe(true);
    expect(cmd2.executed).toBe(true);
    expect(cmd3.executed).toBe(true);
  });

  it('should undo all commands in reverse order', () => {
    const cmd1 = new MockCommand(1);
    const cmd2 = new MockCommand(2);
    const cmd3 = new MockCommand(3);

    const batch = new BatchCommand([cmd1, cmd2, cmd3]);
    batch.execute();
    batch.undo();

    expect(cmd1.undone).toBe(true);
    expect(cmd2.undone).toBe(true);
    expect(cmd3.undone).toBe(true);
  });

  it('should add command to batch', () => {
    const cmd1 = new MockCommand(1);
    const cmd2 = new MockCommand(2);

    const batch = new BatchCommand([cmd1]);
    expect(batch.size()).toBe(1);

    batch.add(cmd2);
    expect(batch.size()).toBe(2);

    batch.execute();
    expect(cmd1.executed).toBe(true);
    expect(cmd2.executed).toBe(true);
  });
});

