import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SelectionManager } from './SelectionManager';

describe('SelectionManager', () => {
  let manager: SelectionManager;

  beforeEach(() => {
    manager = new SelectionManager();
  });

  describe('initial state', () => {
    it('should start with empty selection', () => {
      expect(manager.isEmpty()).toBe(true);
      expect(manager.getCount()).toBe(0);
      expect(manager.getSelectedIds().size).toBe(0);
    });
  });

  describe('select', () => {
    it('should select a single element', () => {
      manager.select('element1');
      expect(manager.isSelected('element1')).toBe(true);
      expect(manager.getCount()).toBe(1);
    });

    it('should replace previous selection', () => {
      manager.select('element1');
      manager.select('element2');
      expect(manager.isSelected('element1')).toBe(false);
      expect(manager.isSelected('element2')).toBe(true);
      expect(manager.getCount()).toBe(1);
    });

    it('should emit selectionChanged event', () => {
      const listener = vi.fn();
      manager.on('selectionChanged', listener);

      manager.select('element1');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.any(Set));
      expect(listener.mock.calls[0][0].has('element1')).toBe(true);
    });
  });

  describe('add', () => {
    it('should add element to selection', () => {
      manager.select('element1');
      manager.add('element2');
      expect(manager.isSelected('element1')).toBe(true);
      expect(manager.isSelected('element2')).toBe(true);
      expect(manager.getCount()).toBe(2);
    });

    it('should not add duplicate', () => {
      manager.select('element1');
      manager.add('element1');
      expect(manager.getCount()).toBe(1);
    });
  });

  describe('deselect', () => {
    it('should remove element from selection', () => {
      manager.select('element1');
      manager.add('element2');
      manager.deselect('element1');
      expect(manager.isSelected('element1')).toBe(false);
      expect(manager.isSelected('element2')).toBe(true);
    });
  });

  describe('selectMultiple', () => {
    it('should select multiple elements', () => {
      manager.selectMultiple(['element1', 'element2', 'element3']);
      expect(manager.getCount()).toBe(3);
      expect(manager.isSelected('element1')).toBe(true);
      expect(manager.isSelected('element2')).toBe(true);
      expect(manager.isSelected('element3')).toBe(true);
    });

    it('should replace previous selection', () => {
      manager.select('element1');
      manager.selectMultiple(['element2', 'element3']);
      expect(manager.isSelected('element1')).toBe(false);
      expect(manager.isSelected('element2')).toBe(true);
      expect(manager.isSelected('element3')).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all selections', () => {
      manager.selectMultiple(['element1', 'element2']);
      manager.clear();
      expect(manager.isEmpty()).toBe(true);
    });

    it('should not emit if already empty', () => {
      const listener = vi.fn();
      manager.on('selectionChanged', listener);
      manager.clear();
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('toggle', () => {
    it('should add if not selected', () => {
      manager.toggle('element1');
      expect(manager.isSelected('element1')).toBe(true);
    });

    it('should remove if selected', () => {
      manager.select('element1');
      manager.toggle('element1');
      expect(manager.isSelected('element1')).toBe(false);
    });
  });
});

