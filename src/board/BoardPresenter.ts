import { ref } from 'vue';
import { useUserStore } from '../store/User.store';
import { useModel } from './BoardModel';
import { BoardService } from './BoardService';
import { useEditorStore } from '../store/Editor.store';
import { BoardModel } from '../model/BoardModel';
import { useServiceStore } from '../store/Service.store';

const usePresenter = () => {
    const model = useModel();
    const userStore = useUserStore();
    const editorStore = useEditorStore();
    const serviceStore = useServiceStore();

    const service = new BoardService(model);
    serviceStore.board = service;
    editorStore.currentBoard = model.currentBoard;

    const isLoading = ref(true);

    const loadBoardList = async () => {
        await service.loadBoardList(userStore.self.id);
        isLoading.value = false;
    };

    const createBoard = () => {
        isLoading.value = true;
        service.createBoard(userStore.self.id).then((board: BoardModel) => {
            window.location.href = window.location.origin + `/?id=${board.id}`;
            isLoading.value = false;
        });
    };

    const prepareOpenBoard = (index: number) => {
        isLoading.value = true;
        window.location.href = window.location.origin + `/?id=${model.boards.value[index].id}`;
    };

    const loadCurrentBoard = (id: string) => {
        isLoading.value = true;
        service.loadCurrentBoard(id).then(() => (isLoading.value = false));
    };

    return { model, isLoading, loadBoardList, createBoard, prepareOpenBoard, loadCurrentBoard };
};

export default usePresenter;
