import { nanoid } from 'nanoid';

/**
 * 生成唯一 ID
 * @returns 唯一标识符
 */
export function generateId(): string {
  return nanoid();
}

