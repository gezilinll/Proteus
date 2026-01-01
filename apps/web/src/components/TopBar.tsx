import { MoreHorizontal, Upload, Users } from 'lucide-react';
import { Editor } from '@proteus/core';
import { runPerformanceSuite, checkMemoryLeak } from '../utils/performanceTest';

interface TopBarProps {
  editor: Editor;
}

/**
 * 顶部导航栏 - Miro 风格
 * 分区域的浮动设计
 */
export function TopBar({ editor }: TopBarProps) {
  const handlePerformanceTest = async () => {
    console.log('开始性能测试...');
    const results = await runPerformanceSuite(editor, [10, 50, 100]);
    console.log('性能测试结果:', results);
    alert(`性能测试完成！\n${results.map(r => `${r.elementCount}个元素: ${r.fps.toFixed(1)} FPS`).join('\n')}`);
  };

  const handleMemoryLeakTest = async () => {
    console.log('开始内存泄漏检测...');
    const result = await checkMemoryLeak(editor, 100);
    console.log('内存泄漏检测结果:', result);
    if (result.leakDetected) {
      alert(`⚠️ 检测到潜在内存泄漏！\n初始内存: ${result.initialMemory?.toFixed(2)} MB\n最终内存: ${result.finalMemory?.toFixed(2)} MB`);
    } else {
      alert(`✅ 未检测到内存泄漏\n初始内存: ${result.initialMemory?.toFixed(2)} MB\n最终内存: ${result.finalMemory?.toFixed(2)} MB`);
    }
  };

  return (
    <div className="flex items-center justify-between">
      {/* 左侧区域 */}
      <div className="flex items-center gap-2">
        {/* Logo + 文件名 区块 */}
        <div className="flex items-center gap-3 bg-white rounded-lg shadow-md border border-gray-200 px-3 py-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-[10px]">📄</span>
            </div>
            <span className="text-gray-800 font-medium text-sm">Untitled</span>
          </div>
        </div>

        {/* 菜单区块 */}
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200">
          <button className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={18} />
          </button>
          <button className="p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
            <Upload size={18} />
          </button>
        </div>

        {/* Upgrade 按钮 */}
        <button className="px-3 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Upgrade
        </button>
      </div>

      {/* 右侧区域 */}
      <div className="flex items-center gap-2">
        {/* 协作头像区块 */}
        <div className="flex items-center bg-white rounded-lg shadow-md border border-gray-200 px-2 py-1.5">
          <div className="flex items-center -space-x-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-medium">Y</span>
            </div>
            <button className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Users size={12} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Present 按钮 */}
        <button className="px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <span className="text-blue-500">▶</span>
          Present
        </button>

        {/* Share 按钮 */}
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg shadow-md transition-colors">
          Share
        </button>

        {/* 开发工具：性能测试按钮（仅开发环境） */}
        {import.meta.env.DEV && (
          <>
            <button
              onClick={handlePerformanceTest}
              className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium rounded-lg shadow-md transition-colors"
              title="性能测试"
            >
              ⚡ Test
            </button>
            <button
              onClick={handleMemoryLeakTest}
              className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg shadow-md transition-colors"
              title="内存泄漏检测"
            >
              🧪 Memory
            </button>
          </>
        )}
      </div>
    </div>
  );
}
