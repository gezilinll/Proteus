import { ref } from 'vue';
import { useUserStore } from '../store/User.store';
import { useModel } from './HistoryModel';
import { HistoryService } from './HistoryService';
import { useEditorStore } from '../store/Editor.store';
import { RecordModel } from '../model/RecordModel';

const usePresenter = () => {
    const model = useModel();
    const userStore = useUserStore();
    const editorStore = useEditorStore();

    const service = new HistoryService(model);

    const isLoading = ref(true);

    const loadRecordList = async () => {
        await service.loadRecordList(userStore.self.id, userStore.token);
        isLoading.value = false;
    };

    const createBoard = () => {
        isLoading.value = true;
        service.createBoard(userStore.self.id, userStore.token).then((record: RecordModel) => {
            editorStore.recordID = record.id;
            editorStore.recordTitle = record.title;
            editorStore.recordContent = record.content;
            isLoading.value = false;
        });
    };

    const openBoard = (index: number) => {
        editorStore.recordID = model.records.value[index].id;
        editorStore.recordTitle = model.records.value[index].title;
        editorStore.recordContent = model.records.value[index].content;
    };

    return { model, isLoading, loadRecordList, createBoard, openBoard };
};

export default usePresenter;
