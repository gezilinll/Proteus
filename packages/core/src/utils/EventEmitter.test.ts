import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEmitter } from './EventEmitter';

interface TestEvents {
  test: [value: string];
  data: [id: number, name: string];
  empty: [];
}

describe('EventEmitter', () => {
  let emitter: EventEmitter<TestEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<TestEvents>();
  });

  describe('on and emit', () => {
    it('should subscribe and emit event', () => {
      let received = '';
      emitter.on('test', (value) => {
        received = value;
      });

      emitter.emit('test', 'hello');
      expect(received).toBe('hello');
    });

    it('should support multiple listeners', () => {
      const calls: string[] = [];
      emitter.on('test', (value) => calls.push(`1: ${value}`));
      emitter.on('test', (value) => calls.push(`2: ${value}`));

      emitter.emit('test', 'hello');
      expect(calls).toEqual(['1: hello', '2: hello']);
    });

    it('should support multiple arguments', () => {
      let receivedId = 0;
      let receivedName = '';
      emitter.on('data', (id, name) => {
        receivedId = id;
        receivedName = name;
      });

      emitter.emit('data', 123, 'test');
      expect(receivedId).toBe(123);
      expect(receivedName).toBe('test');
    });

    it('should support events without arguments', () => {
      let called = false;
      emitter.on('empty', () => {
        called = true;
      });

      emitter.emit('empty');
      expect(called).toBe(true);
    });
  });

  describe('off', () => {
    it('should unsubscribe listener', () => {
      let callCount = 0;
      const listener = () => {
        callCount++;
      };

      emitter.on('test', listener);
      emitter.emit('test', 'hello');
      expect(callCount).toBe(1);

      emitter.off('test', listener);
      emitter.emit('test', 'hello');
      expect(callCount).toBe(1); // 不再增加
    });

    it('should remove event when no listeners left', () => {
      const listener = () => {};
      emitter.on('test', listener);
      expect(emitter.listenerCount('test')).toBe(1);

      emitter.off('test', listener);
      expect(emitter.listenerCount('test')).toBe(0);
    });

    it('should handle unsubscribing non-existent listener', () => {
      const listener = () => {};
      expect(() => emitter.off('test', listener)).not.toThrow();
    });
  });

  describe('unsubscribe function', () => {
    it('should return unsubscribe function', () => {
      let callCount = 0;
      const listener = () => {
        callCount++;
      };

      const unsubscribe = emitter.on('test', listener);
      emitter.emit('test', 'hello');
      expect(callCount).toBe(1);

      unsubscribe();
      emitter.emit('test', 'hello');
      expect(callCount).toBe(1); // 不再增加
    });
  });

  describe('clear', () => {
    it('should remove all listeners', () => {
      let callCount = 0;
      emitter.on('test', () => callCount++);
      emitter.on('data', () => callCount++);

      emitter.clear();
      emitter.emit('test', 'hello');
      emitter.emit('data', 1, 'test');

      expect(callCount).toBe(0);
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      expect(emitter.listenerCount('test')).toBe(0);

      emitter.on('test', () => {});
      expect(emitter.listenerCount('test')).toBe(1);

      emitter.on('test', () => {});
      expect(emitter.listenerCount('test')).toBe(2);

      emitter.off('test', () => {});
      expect(emitter.listenerCount('test')).toBe(2); // 匿名函数无法匹配

      const listener = () => {};
      emitter.on('test', listener);
      emitter.off('test', listener);
      expect(emitter.listenerCount('test')).toBe(2); // 之前两个还在
    });

    it('should return 0 for non-existent event', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(emitter.listenerCount('test' as any)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle multiple emits', () => {
      const calls: string[] = [];
      emitter.on('test', (value) => calls.push(value));

      emitter.emit('test', '1');
      emitter.emit('test', '2');
      emitter.emit('test', '3');

      expect(calls).toEqual(['1', '2', '3']);
    });

    it('should continue executing listeners even if one throws', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // 捕获 console.error 调用
      });

      emitter.on('test', () => {
        throw new Error('test error');
      });

      let received = '';
      emitter.on('test', (value) => {
        received = value;
      });

      // 第一个 listener 抛出错误，但后续应该继续执行
      emitter.emit('test', 'hello');
      expect(received).toBe('hello'); // 第二个 listener 应该执行了
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

