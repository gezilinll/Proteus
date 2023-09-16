import axios from 'axios';
import { HistoryModel } from './BoardModel';
import { SERVER_PREFIX } from '../Constants';
import { BoardModel } from '../model/BoardModel';

export class BoardService {
    constructor(private _model: HistoryModel) {}

    loadBoardList(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/board/findAll?userID=${userID}`);
                this._model.boards.value = result.data as BoardModel[];
                resolve(null);
            } catch (error) {
                console.log('loadBoardList failed');
                reject();
            }
        });
    }

    createBoard(userID: string): Promise<BoardModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/board/create?userID=${userID}`);
                resolve({
                    id: result.data.id,
                    title: result.data.title,
                    content: result.data.content,
                } as BoardModel);
            } catch (error) {
                console.log('createBoard failed');
                reject();
            }
        });
    }
}
