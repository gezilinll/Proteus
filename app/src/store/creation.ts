import { defineStore } from 'pinia';

export type MouseType = 'grab' | 'select' | 'brush' | 'text' | 'shape';

interface State {
    mouseType: MouseType;
}

export const useCreationStore = defineStore('creation', {
    state: () => {
        return {
            mouseType: 'select',
        } as State;
    },
    actions: {},
});
