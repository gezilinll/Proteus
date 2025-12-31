/**
 * 深拷贝工具
 * 用于 Command 快照存储
 */

/**
 * 深拷贝对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Map) {
    const cloned = new Map();
    obj.forEach((value, key) => {
      cloned.set(key, deepClone(value));
    });
    return cloned as unknown as T;
  }

  if (obj instanceof Set) {
    const cloned = new Set();
    obj.forEach((value) => {
      cloned.add(deepClone(value));
    });
    return cloned as unknown as T;
  }

  // 普通对象
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (cloned as any)[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

