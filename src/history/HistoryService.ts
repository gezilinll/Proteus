import axios from 'axios';
import { HistoryModel } from './HistoryModel';
import { SERVER_PREFIX } from '../Constants';
import { RecordModel } from '../model/RecordModel';

export class HistoryService {
    constructor(private _model: HistoryModel) {}

    loadRecordList(userID: string, token: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/record/findAll?userID=${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                this._model.records.value = result.data as RecordModel[];
                console.log('loadRecordList', this._model.records);
                resolve(null);
            } catch (error) {
                console.log('loadRecordList failed');
                reject();
            }
        });
    }

    createBoard(userID: string, token: string): Promise<RecordModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/record/create?userID=${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                resolve({ id: result.data.id, title: result.data.title } as RecordModel);
            } catch (error) {
                console.log('loadRecordList failed');
                reject();
            }
        });
    }
}
