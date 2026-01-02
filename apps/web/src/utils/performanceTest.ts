/**
 * 性能测试工具
 * 用于测试编辑器在不同场景下的性能表现
 */

import { Editor, createElement, ElementType } from '@proteus/core';

export interface PerformanceMetrics {
  renderTime: number;
  fps: number;
  memoryUsage?: number;
  elementCount: number;
}

/**
 * 生成指定数量的测试元素
 */
export function generateTestElements(count: number): ReturnType<typeof createElement>[] {
  const elements: ReturnType<typeof createElement>[] = [];
  const cols = Math.ceil(Math.sqrt(count));
  const spacing = 150;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = col * spacing;
    const y = row * spacing;

    // 随机选择元素类型
    const typeIndex = i % 4;
    let element: ReturnType<typeof createElement>;

    switch (typeIndex) {
      case 0:
        // 矩形
        element = createElement(ElementType.RECTANGLE, {
          transform: {
            x,
            y,
            width: 100 + Math.random() * 50,
            height: 100 + Math.random() * 50,
            rotation: Math.random() * 360,
          },
          style: {
            fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
            stroke: '#000',
            strokeWidth: 2,
            opacity: 0.8 + Math.random() * 0.2,
          },
        });
        break;
      case 1:
        // 圆形
        element = createElement(ElementType.ELLIPSE, {
          transform: {
            x,
            y,
            width: 100 + Math.random() * 50,
            height: 100 + Math.random() * 50,
            rotation: Math.random() * 360,
          },
          style: {
            fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
            stroke: '#000',
            strokeWidth: 2,
            opacity: 0.8 + Math.random() * 0.2,
          },
        });
        break;
      case 2:
        // 文本
        element = createElement(ElementType.TEXT, {
          transform: {
            x,
            y,
            width: 150,
            height: 40,
            rotation: 0,
          },
          style: {
            text: `Text ${i + 1}`,
            fill: '#000',
            fontSize: 16,
            fontFamily: 'Arial',
            fontWeight: 'normal',
            textAlign: 'center',
          },
        });
        break;
      case 3:
        // 图片（使用占位符）
        element = createElement(ElementType.IMAGE, {
          transform: {
            x,
            y,
            width: 100,
            height: 100,
            rotation: 0,
          },
          style: {
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==',
            opacity: 1,
          },
        });
        break;
      default:
        // 默认矩形（实际上不会执行到这里）
        element = createElement(ElementType.RECTANGLE, {
          transform: { x, y, width: 100, height: 100, rotation: 0 },
          style: { fill: '#000', stroke: '#000', strokeWidth: 2, opacity: 1 },
        });
    }

    elements.push(element);
  }

  return elements;
}

/**
 * 测量渲染性能
 */
export async function measureRenderPerformance(
  editor: Editor,
  elementCount: number,
  iterations: number = 10
): Promise<PerformanceMetrics> {
  // 生成测试元素
  const elements = generateTestElements(elementCount);

  // 添加所有元素到场景
  const { AddElementCommand, BatchCommand } = await import('@proteus/core');
  const commands = elements.map((el) => new AddElementCommand(editor.scene, el));
  const batchCommand = new BatchCommand(commands);
  editor.executeCommand(batchCommand);

  // 等待渲染完成
  await new Promise((resolve) => setTimeout(resolve, 100));

  return new Promise<PerformanceMetrics>((resolve) => {
    const originalRequestRender = editor.requestRender.bind(editor);
    let frameCount = 0;
    const renderTimes: number[] = [];

    const wrappedRequestRender = () => {
      const start = performance.now();
      originalRequestRender();
      const end = performance.now();
      renderTimes.push(end - start);
      frameCount++;

      if (frameCount >= iterations) {
        const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
        const fps = 1000 / avgRenderTime;

        let memoryUsage: number | undefined;
        if ('memory' in performance) {
          memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
        }

        resolve({
          renderTime: avgRenderTime,
          fps,
          memoryUsage,
          elementCount,
        });
      }
    };

    editor.requestRender = wrappedRequestRender;
    wrappedRequestRender();

    // 触发多次渲染
    for (let i = 0; i < iterations - 1; i++) {
      setTimeout(() => wrappedRequestRender(), i * 16);
    }
  });
}

/**
 * 测试不同元素数量的性能
 */
export async function runPerformanceSuite(
  editor: Editor,
  elementCounts: number[] = [10, 50, 100, 200]
): Promise<PerformanceMetrics[]> {
  const results: PerformanceMetrics[] = [];

  for (const count of elementCounts) {
    // 清空场景
    const allIds = editor.scene.getAllIds();
    if (allIds.length > 0) {
      const { RemoveElementCommand, BatchCommand } = await import('@proteus/core');
      const commands = allIds.map((id) => new RemoveElementCommand(editor.scene, id));
      const batchCommand = new BatchCommand(commands);
      editor.executeCommand(batchCommand);
    }

    // 测量性能
    const metrics = await measureRenderPerformance(editor, count, 10);
    results.push(metrics);

    console.log(`Performance test (${count} elements):`, metrics);
  }

  return results;
}

/**
 * 内存泄漏检测
 */
export async function checkMemoryLeak(
  editor: Editor,
  iterations: number = 100
): Promise<{ initialMemory?: number; finalMemory?: number; leakDetected: boolean }> {
  let initialMemory: number | undefined;
  let finalMemory: number | undefined;

  if ('memory' in performance) {
    initialMemory = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
  }

  // 执行多次操作
  for (let i = 0; i < iterations; i++) {
    const element = createElement(ElementType.RECTANGLE, {
      transform: {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        width: 100,
        height: 100,
        rotation: 0,
      },
    });

    const { AddElementCommand, RemoveElementCommand } = await import('@proteus/core');
    editor.executeCommand(new AddElementCommand(editor.scene, element));
    editor.requestRender();

    // 随机删除
    if (Math.random() > 0.5) {
      const allIds = editor.scene.getAllIds();
      if (allIds.length > 0) {
        const randomId = allIds[Math.floor(Math.random() * allIds.length)];
        editor.executeCommand(new RemoveElementCommand(editor.scene, randomId));
        editor.requestRender();
      }
    }

    // 定期检查内存
    if (i % 10 === 0 && 'memory' in performance) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  // 等待垃圾回收
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if ('memory' in performance) {
    finalMemory = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
  }

  const leakDetected = !!(initialMemory && finalMemory && finalMemory > initialMemory * 1.5);

  return {
    initialMemory,
    finalMemory,
    leakDetected,
  };
}

