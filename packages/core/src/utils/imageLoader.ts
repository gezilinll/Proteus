/**
 * 图片加载器
 * 支持 URL、File、Base64 等多种图片源
 */

export interface ImageLoadResult {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export type ImageSource = string | File | HTMLImageElement;

/**
 * 从 URL 加载图片
 */
function loadFromUrl(url: string): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // 允许跨域（如果服务器支持）

    img.onload = () => {
      resolve({
        image: img,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image from URL: ${url}`));
    };

    img.src = url;
  });
}

/**
 * 从 File 对象加载图片
 */
function loadFromFile(file: File): Promise<ImageLoadResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`File is not an image: ${file.type}`));
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Failed to read file'));
        return;
      }

      loadFromUrl(dataUrl)
        .then(resolve)
        .catch(reject);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 从 Base64 字符串加载图片
 */
function loadFromBase64(base64: string): Promise<ImageLoadResult> {
  // Base64 字符串可能包含或不包含 data URL 前缀
  const dataUrl = base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
  return loadFromUrl(dataUrl);
}

/**
 * 从 HTMLImageElement 直接使用
 */
function loadFromImageElement(img: HTMLImageElement): Promise<ImageLoadResult> {
  return Promise.resolve({
    image: img,
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
  });
}

/**
 * 加载图片（自动识别类型）
 */
export async function loadImage(source: ImageSource): Promise<ImageLoadResult> {
  if (source instanceof File) {
    return loadFromFile(source);
  }

  if (source instanceof HTMLImageElement) {
    return loadFromImageElement(source);
  }

  if (typeof source === 'string') {
    // 判断是否为 Base64
    if (source.startsWith('data:') || source.length > 100 && !source.includes('://')) {
      return loadFromBase64(source);
    }
    // 否则作为 URL 处理
    return loadFromUrl(source);
  }

  throw new Error(`Unsupported image source type: ${typeof source}`);
}

/**
 * 将图片转换为 Base64
 */
export function imageToBase64(image: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL('image/png');
}

