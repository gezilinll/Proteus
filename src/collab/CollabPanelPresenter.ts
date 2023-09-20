import { watch } from 'vue';
import { useEditorStore } from '../store/Editor.store';
import { CollabPanelService } from './CollabPanelService';
import { useUserStore } from '../store/User.store';

const usePresenter = () => {
    const userStore = useUserStore();
    const editorStore = useEditorStore();
    const service = new CollabPanelService();

    watch(
        () => editorStore.currentBoard.content,
        () => {
            if (editorStore.currentBoard.content) {
                service.joinRoom(editorStore.currentBoard.id, userStore.self.id);
            }
        },
        { immediate: true }
    );

    return {};
};

export default usePresenter;
