import { ref } from 'vue';
import { useUserStore } from '../store/User.store';
import { useModel } from './HistoryModel';
import { HistoryService } from './HistoryService';

const usePresenter = () => {
    const model = useModel();
    const store = useUserStore();
    const service = new HistoryService(model);

    const isLoading = ref(true);

    const loadRecordList = async () => {
        await service.loadRecordList(store.self.id, store.token);
        isLoading.value = false;
    };

    return { model, isLoading, loadRecordList };
};

export default usePresenter;
