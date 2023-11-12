import { ref } from 'vue';
import { useModel } from './BoardPanelModel';
import { BoardModel } from '../model/BoardModel';
import { useBlitzStore } from '../store/Blitz.store';

const usePresenter = () => {
    const model = useModel();
    const blitz = useBlitzStore();
    model.currentBoard = blitz.currentBoard;

    const isLoading = ref(true);

    const loadBoardList = async () => {
        await blitz.boardService.loadBoardList(blitz.self.id);
        isLoading.value = false;
    };

    const createBoard = () => {
        isLoading.value = true;
        blitz.boardService.createBoard(blitz.self.id).then((board: BoardModel) => {
            window.location.href = `${window.location.origin}/?id=${board.id}`;
        });
    };

    const prepareOpenBoard = (index: number) => {
        isLoading.value = true;
        window.location.href = `${window.location.origin}/?id=${model.boards.value[index].id}`;
    };

    const loadCurrentBoard = (id: string) => {
        isLoading.value = true;
        blitz.boardService.loadCurrentBoard(id).then(() => (isLoading.value = false));
    };

    return { model, isLoading, loadBoardList, createBoard, prepareOpenBoard, loadCurrentBoard };
};

export default usePresenter;
