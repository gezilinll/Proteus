import { createContext, useContext, ReactNode } from 'react';
import { Editor } from '@proteus/core';

/**
 * Editor Context
 */
export const EditorContext = createContext<Editor | null>(null);

/**
 * Editor Provider
 * 提供 Editor 实例给子组件
 */
export interface EditorProviderProps {
  editor: Editor;
  children: ReactNode;
}

export function EditorProvider({ editor, children }: EditorProviderProps) {
  return <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>;
}

/**
 * 使用 Editor Hook
 * 从 Context 获取 Editor 实例
 */
export function useEditorContext(): Editor {
  const editor = useContext(EditorContext);
  if (!editor) {
    throw new Error('useEditorContext must be used within EditorProvider');
  }
  return editor;
}

