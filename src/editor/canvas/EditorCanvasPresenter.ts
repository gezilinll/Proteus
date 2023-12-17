import { EditorCanvasService } from './EditorCanvasService';
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBlitzStore } from '../../store/Blitz.store';
import { UserAwareness } from '../../service/collab/Whiteboard';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const { others } = storeToRefs(blitz);

    let editorCanvasService: EditorCanvasService | undefined = undefined;

    const setup = (canvas: HTMLCanvasElement) => {
        blitz.editorService.canvas.setup(canvas);
        editorCanvasService = new EditorCanvasService(
            canvas,
            blitz.editorService.canvas,
            blitz.editorService.board
        );
        watch(
            () => others.value,
            () => {
                for (const user of others.value) {
                    editorCanvasService!.updateUserAwareness(user as unknown as UserAwareness);
                }
            },
            { immediate: true, deep: true }
        );
    };

    return { setup };
};

export default usePresenter;
