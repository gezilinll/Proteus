import { useEditor } from './useEditor';
import { useState, useCallback } from 'react';
import { Element } from '@proteus/core';

/**
 * 使用选择 Hook
 * 管理元素选择状态（基础版，后续会移到 Editor 中）
 */
export function useSelection() {
  const editor = useEditor();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const select = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const deselect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const selectMultiple = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedElements = useCallback((): Element[] => {
    return Array.from(selectedIds)
      .map((id) => editor.scene.get(id))
      .filter((el): el is Element => el !== undefined);
  }, [editor.scene, selectedIds]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    isSelected: (id: string) => selectedIds.has(id),
    select,
    deselect,
    selectMultiple,
    clearSelection,
    getSelectedElements,
  };
}

