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
                service.setup(editorStore.currentBoard.id, {
                    id: userStore.self.id,
                    name: userStore.self.userName,
                });
                service.joinWhiteboard();
            }
        },
        { immediate: true }
    );

    const joinVideoChat = () => {
        service.joinVideoChat();
    };

    return { joinVideoChat };
};

export default usePresenter;
