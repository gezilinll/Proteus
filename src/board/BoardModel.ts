import { ref } from 'vue';
import { BoardModel } from '../model/BoardModel';

export const useModel = () => {
    const boards = ref([] as BoardModel[]);

    return { boards };
};

export type HistoryModel = ReturnType<typeof useModel>;
