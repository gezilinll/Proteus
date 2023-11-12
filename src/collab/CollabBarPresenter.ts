import { watch } from 'vue';
import { useBlitzStore } from '../store/Blitz.store';

const usePresenter = () => {
    const blitz = useBlitzStore();

    watch(
        () => blitz.currentBoard.content,
        () => {
            if (blitz.currentBoard.content) {
                blitz.collabService.setup(blitz.currentBoard.id);
                blitz.collabService.joinWhiteboard();
            }
        },
        { immediate: true }
    );

    const joinVideoChat = () => {
        blitz.collabService.joinVideoChat();
        blitz.showVideoChatPanel = true;
    };

    watch(
        () => [blitz.self.mouseX, blitz.self.mouseY],
        (position) => {
            blitz.collabService.updateMousePosition(position[0], position[1]);
        }
    );

    return { joinVideoChat };
};

export default usePresenter;
