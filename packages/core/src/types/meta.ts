/**
 * 元素元数据
 */
export interface ElementMeta {
  /** 元素名称（用户可编辑） */
  name?: string;
  /** 是否锁定（锁定后不可编辑） */
  locked?: boolean;
  /** 是否可见 */
  visible?: boolean;
  /** 创建时间戳 */
  createdAt?: number;
  /** 更新时间戳 */
  updatedAt?: number;
}

/**
 * 创建默认元数据
 */
export function createMeta(overrides?: Partial<ElementMeta>): ElementMeta {
  const now = Date.now();
  return {
    name: undefined,
    locked: false,
    visible: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

