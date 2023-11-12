import { reactive, ref } from 'vue';
import { BoardModel } from '../model/BoardModel';

export const useModel = () => {
    const boards = ref([] as BoardModel[]);
    const currentBoard = reactive({} as BoardModel);

    return { boards, currentBoard };
};

export type BoardPanelModel = ReturnType<typeof useModel>;
