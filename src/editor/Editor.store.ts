import { defineStore } from 'pinia';
import { FunctionPanelItem } from './Defines';
import { Ref, ref } from 'vue';

export declare type OnWheelListener = () => void;
export declare type UnregisterListener = () => void;

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            wheelHooks: [] as OnWheelListener[],
            zoom: 100,
        };
    },
    actions: {
        registerWheel(listener: OnWheelListener): UnregisterListener {
            this.wheelHooks.push(listener);
            return () => {
                this.wheelHooks = this.wheelHooks.filter((entry) => entry != listener);
            };
        },
    },
});
