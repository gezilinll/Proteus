import { defineStore } from 'pinia';

export declare type OnWheelListener = (moveX: number, moveY: number) => void;
export declare type UnregisterListener = () => void;

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            recordID: '',
            wheelHooks: [] as OnWheelListener[],
            zoom: 100,
        };
    },
    actions: {
        isValidRecord() {
            return !!this.recordID;
        },

        registerWheel(listener: OnWheelListener): UnregisterListener {
            this.wheelHooks.push(listener);
            return () => {
                this.wheelHooks = this.wheelHooks.filter((entry) => entry != listener);
            };
        },
    },
});
