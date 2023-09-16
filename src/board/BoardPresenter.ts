import { ref } from 'vue';
import { useUserStore } from '../store/User.store';
import { useModel } from './BoardModel';
import { BoardService } from './BoardService';
import { useEditorStore } from '../store/Editor.store';
import { BoardModel } from '../model/BoardModel';

const usePresenter = () => {
    const model = useModel();
    const userStore = useUserStore();
    const editorStore = useEditorStore();

    const service = new BoardService(model);

    const isLoading = ref(true);

    const loadBoardList = async () => {
        await service.loadBoardList(userStore.self.id);
        isLoading.value = false;
    };

    const createBoard = () => {
        isLoading.value = true;
        service.createBoard(userStore.self.id).then((board: BoardModel) => {
            editorStore.boardID = board.id;
            editorStore.boardTitle = board.title;
            editorStore.boardContent = board.content;
            isLoading.value = false;
        });
    };

    const openBoard = (index: number) => {
        editorStore.boardID = model.boards.value[index].id;
        editorStore.boardTitle = model.boards.value[index].title;
        editorStore.boardContent = model.boards.value[index].content;
    };

    return { model, isLoading, loadBoardList, createBoard, openBoard };
};

export default usePresenter;
