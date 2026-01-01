import { useEditorStore } from '../store/editorStore';
import { EditorContext } from '../context/EditorContext';
import { Editor } from '@proteus/core';
import { useContext } from 'react';

/**
 * 使用 Editor Hook
 * 优先从 Context 获取，如果没有则从 Store 获取
 */
export function useEditor(): Editor {
  // 同时获取两个来源的值（满足 hooks 规则）
  const contextEditor = useContext(EditorContext);
  const storeEditor = useEditorStore((state) => state.editor);

  // 优先使用 Context 中的 Editor
  const editor = contextEditor ?? storeEditor;

  if (!editor) {
    throw new Error('Editor is not initialized. Please use EditorProvider or initialize editor first.');
  }

  return editor;
}

/**
 * 使用 Editor Store Hook
 * 直接访问 Zustand store
 */
export function useEditorStoreState() {
  return useEditorStore();
}
