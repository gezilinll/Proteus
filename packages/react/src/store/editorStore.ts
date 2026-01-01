import { create } from 'zustand';
import { Editor } from '@proteus/core';

/**
 * 编辑器状态
 */
export interface EditorState {
  /** Editor 实例 */
  editor: Editor | null;
  /** 是否已初始化 */
  initialized: boolean;
  /** 是否可以撤销 */
  canUndo: boolean;
  /** 是否可以重做 */
  canRedo: boolean;
}

/**
 * 编辑器操作
 */
export interface EditorActions {
  /** 设置 Editor 实例 */
  setEditor: (editor: Editor | null) => void;
  /** 初始化 Editor */
  initEditor: (canvas: HTMLCanvasElement, dpr?: number) => void;
  /** 销毁 Editor */
  destroyEditor: () => void;
  /** 更新撤销/重做状态 */
  updateUndoRedoState: () => void;
}

/**
 * 编辑器 Store
 * 使用 Zustand 管理编辑器全局状态
 */
export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
  // 初始状态
  editor: null,
  initialized: false,
  canUndo: false,
  canRedo: false,

  // Actions
  setEditor: (editor) => {
    set({
      editor,
      initialized: editor !== null,
      canUndo: editor?.canUndo() ?? false,
      canRedo: editor?.canRedo() ?? false,
    });
  },

  initEditor: (canvas, dpr) => {
    const { editor } = get();
    if (editor) {
      editor.init(canvas, dpr);
      set({
        initialized: true,
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
      });
    }
  },

  destroyEditor: () => {
    const { editor } = get();
    if (editor) {
      editor.destroy();
    }
    set({
      editor: null,
      initialized: false,
      canUndo: false,
      canRedo: false,
    });
  },

  updateUndoRedoState: () => {
    const { editor } = get();
    if (editor) {
      set({
        canUndo: editor.canUndo(),
        canRedo: editor.canRedo(),
      });
    }
  },
}));

