import { ref } from 'vue';
import { BoardModel } from '../model/RecordModel';
import { useBlitzStore } from '../store/Blitz.store';

const usePresenter = () => {
    const blitz = useBlitzStore();

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
        window.location.href = `${window.location.origin}/?id=${blitz.boards[index].id}`;
    };

    const loadCurrentBoard = (id: string) => {
        isLoading.value = true;
        blitz.boardService.loadCurrentBoard(id).then(() => (isLoading.value = false));
    };

    return { isLoading, loadBoardList, createBoard, prepareOpenBoard, loadCurrentBoard };
};

export default usePresenter;
