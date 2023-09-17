import { defineStore } from 'pinia';
import { BoardModel } from '../model/BoardModel';

export declare type OnWheelListener = (moveX: number, moveY: number) => void;
export declare type UnregisterListener = () => void;

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            currentBoard: {} as BoardModel,
            wheelHooks: [] as OnWheelListener[],
            zoom: 100,
        };
    },
    actions: {
        isValidBoard() {
            return (
                !!this.currentBoard.id && !!this.currentBoard.title && !!this.currentBoard.content
            );
        },

        registerWheel(listener: OnWheelListener): UnregisterListener {
            this.wheelHooks.push(listener);
            return () => {
                this.wheelHooks = this.wheelHooks.filter((entry) => entry != listener);
            };
        },
    },
});
