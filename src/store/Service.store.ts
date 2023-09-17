import { defineStore } from 'pinia';
import { BoardService } from '../board/BoardService';

interface State {
    board?: BoardService;
}

export const useServiceStore = defineStore('services', {
    state: (): State => {
        return {
            board: undefined,
        };
    },
    actions: {},
});
