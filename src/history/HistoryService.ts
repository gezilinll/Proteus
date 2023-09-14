import axios from 'axios';
import { HistoryModel } from './HistoryModel';
import { SERVER_PREFIX } from '../Constants';
import { RecordModel } from '../model/RecordModel';

export class HistoryService {
    constructor(private _model: HistoryModel) {}

    loadRecordList(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/record/findAll?userID=${userID}`);
                this._model.records.value = result.data as RecordModel[];
                resolve(null);
            } catch (error) {
                console.log('loadRecordList failed');
                reject();
            }
        });
    }

    createBoard(userID: string): Promise<RecordModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/record/create?userID=${userID}`);
                resolve({
                    id: result.data.id,
                    title: result.data.title,
                    content: result.data.content,
                } as RecordModel);
            } catch (error) {
                console.log('loadRecordList failed');
                reject();
            }
        });
    }
}
