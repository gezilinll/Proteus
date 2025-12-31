/**
 * 元素样式
 */
export interface Style {
  /** 填充颜色 */
  fill?: string;
  /** 描边颜色 */
  stroke?: string;
  /** 描边宽度 */
  strokeWidth?: number;
  /** 透明度 (0-1) */
  opacity?: number;
  /** 圆角（仅矩形） */
  borderRadius?: number;
  /** 字体大小（仅文字） */
  fontSize?: number;
  /** 字体族（仅文字） */
  fontFamily?: string;
  /** 字体粗细（仅文字） */
  fontWeight?: string | number;
  /** 文字内容（仅文字） */
  text?: string;
  /** 图片 URL（仅图片） */
  imageUrl?: string;
}

/**
 * 创建默认样式
 */
export function createStyle(overrides?: Partial<Style>): Style {
  return {
    fill: '#3b82f6',
    stroke: '#1e40af',
    strokeWidth: 2,
    opacity: 1,
    ...overrides,
  };
}

