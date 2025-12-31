import { describe, it, expect } from 'vitest';
import { deepClone } from './clone';

describe('deepClone', () => {
  it('should clone primitive values', () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone('hello')).toBe('hello');
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  it('should clone Date', () => {
    const date = new Date('2024-01-01');
    const cloned = deepClone(date);

    expect(cloned).not.toBe(date);
    expect(cloned.getTime()).toBe(date.getTime());
    expect(cloned instanceof Date).toBe(true);
  });

  it('should clone arrays', () => {
    const arr = [1, 2, [3, 4], { a: 5 }];
    const cloned = deepClone(arr);

    expect(cloned).not.toBe(arr);
    expect(cloned).toEqual(arr);
    expect(cloned[2]).not.toBe(arr[2]);
    expect(cloned[3]).not.toBe(arr[3]);
  });

  it('should clone objects', () => {
    const obj = {
      a: 1,
      b: 'hello',
      c: { nested: true },
      d: [1, 2, 3],
    };
    const cloned = deepClone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.c).not.toBe(obj.c);
    expect(cloned.d).not.toBe(obj.d);
  });

  it('should clone Map', () => {
    const map = new Map([
      ['a', 1],
      ['b', { nested: true }],
    ]);
    const cloned = deepClone(map);

    expect(cloned).not.toBe(map);
    expect(cloned.size).toBe(map.size);
    expect(cloned.get('a')).toBe(1);
    expect(cloned.get('b')).not.toBe(map.get('b'));
    expect(cloned.get('b')).toEqual({ nested: true });
  });

  it('should clone Set', () => {
    const set = new Set([1, 2, { a: 3 }]);
    const cloned = deepClone(set);

    expect(cloned).not.toBe(set);
    expect(cloned.size).toBe(set.size);
    expect(cloned.has(1)).toBe(true);
    expect(cloned.has(2)).toBe(true);
  });

  it('should clone nested structures', () => {
    const complex = {
      date: new Date('2024-01-01'),
      map: new Map([['key', { value: 123 }]]),
      set: new Set([1, 2, 3]),
      array: [
        { a: 1, b: { c: 2 } },
        [3, 4, { d: 5 }],
      ],
      nested: {
        deep: {
          deeper: {
            value: 'test',
          },
        },
      },
    };

    const cloned = deepClone(complex);

    expect(cloned).not.toBe(complex);
    expect(cloned.date).not.toBe(complex.date);
    expect(cloned.map).not.toBe(complex.map);
    expect(cloned.set).not.toBe(complex.set);
    expect(cloned.array).not.toBe(complex.array);
    expect(cloned.nested).not.toBe(complex.nested);
    expect(cloned.nested.deep).not.toBe(complex.nested.deep);
    expect(cloned.nested.deep.deeper).not.toBe(complex.nested.deep.deeper);

    // 修改克隆不应影响原对象
    cloned.nested.deep.deeper.value = 'modified';
    expect(complex.nested.deep.deeper.value).toBe('test');
  });

  it('should handle circular references (will cause stack overflow)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const circular: any = { a: 1 };
    circular.self = circular;

    // 注意：当前实现不支持循环引用，会栈溢出
    // 如果需要支持循环引用，需要使用 WeakMap 缓存
    // 这里我们只测试它会抛出错误（栈溢出）
    expect(() => deepClone(circular)).toThrow();
  });

  it('should clone objects with prototype', () => {
    class TestClass {
      constructor(public value: number) {}
    }

    const obj = new TestClass(42);
    const cloned = deepClone(obj);

    expect(cloned).not.toBe(obj);
    expect(cloned.value).toBe(42);
    // 注意：原型链不会被保留，这是深拷贝的常见行为
    expect(cloned instanceof TestClass).toBe(false);
  });

  it('should handle empty structures', () => {
    expect(deepClone({})).toEqual({});
    expect(deepClone([])).toEqual([]);
    expect(deepClone(new Map())).toEqual(new Map());
    expect(deepClone(new Set())).toEqual(new Set());
  });

  it('should handle arrays with holes', () => {
    const arr = [1, , 3]; // eslint-disable-line no-sparse-arrays
    const cloned = deepClone(arr);

    expect(cloned.length).toBe(3);
    expect(cloned[0]).toBe(1);
    expect(cloned[2]).toBe(3);
  });
});

