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
                this._model.boards.value.push(result.data as BoardModel);
                resolve(this._model.boards.value.at(-1)!);
            } catch (error) {
                console.log('createBoard failed');
                reject();
            }
        });
    }

    loadCurrentBoard(id: string): Promise<BoardModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/board/find?id=${id}`);
                Object.assign(this._model.currentBoard, result.data);
                resolve(this._model.currentBoard);
            } catch (error) {
                console.log('loadCurrentBoard failed');
                reject();
            }
        });
    }
}
