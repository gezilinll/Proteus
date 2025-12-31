import { describe, it, expect, beforeEach } from 'vitest';
import { CommandHistory } from './CommandHistory';
import { Command } from './Command';

// Mock command for testing
class MockCommand implements Command {
  executed = false;
  undone = false;

  constructor(public description?: string) {}

  execute(): void {
    this.executed = true;
    this.undone = false;
  }

  undo(): void {
    this.undone = true;
    this.executed = false;
  }
}

describe('CommandHistory', () => {
  let history: CommandHistory;

  beforeEach(() => {
    history = new CommandHistory();
  });

  describe('execute', () => {
    it('should execute command', () => {
      const cmd = new MockCommand();
      history.execute(cmd);

      expect(cmd.executed).toBe(true);
      expect(history.canUndo()).toBe(true);
    });

    it('should add command to history', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();

      history.execute(cmd1);
      history.execute(cmd2);

      expect(history.getHistorySize()).toBe(2);
    });

    it('should clear redo history when new command executed', () => {
      const cmd1 = new MockCommand();
      const cmd2 = new MockCommand();
      const cmd3 = new MockCommand();

      history.execute(cmd1);
      history.execute(cmd2);
      history.undo();
      history.execute(cmd3);

      expect(history.canRedo()).toBe(false);
      expect(history.getHistorySize()).toBe(2);
    });
  });

  describe('undo', () => {
    it('should undo last command', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();

      expect(cmd.undone).toBe(true);
      expect(history.canUndo()).toBe(false);
    });

    it('should undo multiple commands in reverse order', () => {
      const cmd1 = new MockCommand('cmd1');
      const cmd2 = new MockCommand('cmd2');

      history.execute(cmd1);
      history.execute(cmd2);

      history.undo();
      expect(cmd2.undone).toBe(true);

      history.undo();
      expect(cmd1.undone).toBe(true);
    });

    it('should return false when nothing to undo', () => {
      expect(history.undo()).toBe(false);
    });
  });

  describe('redo', () => {
    it('should redo last undone command', () => {
      const cmd = new MockCommand();
      history.execute(cmd);
      history.undo();
      history.redo();

      expect(cmd.executed).toBe(true);
      expect(history.canRedo()).toBe(false);
    });

    it('should return false when nothing to redo', () => {
      expect(history.redo()).toBe(false);

      const cmd = new MockCommand();
      history.execute(cmd);
      expect(history.redo()).toBe(false);
    });
  });

  describe('history size limit', () => {
    it('should limit history size', () => {
      const history = new CommandHistory(3);

      for (let i = 0; i < 5; i++) {
        history.execute(new MockCommand(`cmd${i}`));
      }

      expect(history.getHistorySize()).toBe(3);
    });
  });

  describe('clear', () => {
    it('should clear all history', () => {
      history.execute(new MockCommand());
      history.execute(new MockCommand());
      history.clear();

      expect(history.getHistorySize()).toBe(0);
      expect(history.canUndo()).toBe(false);
      expect(history.canRedo()).toBe(false);
    });
  });
});

