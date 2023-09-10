import { ref } from 'vue';
import { RecordModel } from '../model/RecordModel';

export const useModel = () => {
    const records = ref([] as RecordModel[]);

    return { records };
};

export type HistoryModel = ReturnType<typeof useModel>;
