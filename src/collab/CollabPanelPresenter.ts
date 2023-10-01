import { watch } from 'vue';
import { useEditorStore } from '../store/Editor.store';
import { CollabPanelService } from './CollabPanelService';
import { useUserStore } from '../store/User.store';
import { useAppStore } from '../store/App.store';

const usePresenter = () => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const editorStore = useEditorStore();
    const service = new CollabPanelService();

    watch(
        () => editorStore.currentBoard.content,
        () => {
            if (editorStore.currentBoard.content) {
                service.setup(editorStore.currentBoard.id);
                service.joinWhiteboard();
            }
        },
        { immediate: true }
    );

    const joinVideoChat = () => {
        service.joinVideoChat();
        appStore.showVideoChatPanel = true;
    };

    watch(
        () => [userStore.self.mouseX, userStore.self.mouseY],
        (position) => {
            service.updateMousePosition(position[0], position[1]);
        }
    );

    return { joinVideoChat };
};

export default usePresenter;
