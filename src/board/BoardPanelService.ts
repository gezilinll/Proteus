import axios from 'axios';
import { BoardPanelModel } from './BoardPanelModel';
import { SERVER_URL } from '../Constants';
import { BoardModel } from '../model/BoardModel';

export class BoardPanelService {
    constructor(private _model: BoardPanelModel) {}

    loadBoardList(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_URL}/board/findAll?userID=${userID}`);
                this._model.boards.value = result.data as BoardModel[];
                resolve(null);
            } catch (error) {
                console.error('loadBoardList failed');
                reject();
            }
        });
    }

    createBoard(userID: string): Promise<BoardModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_URL}/board/create?userID=${userID}`);
                this._model.boards.value.push(result.data as BoardModel);
                resolve(this._model.boards.value.at(-1)!);
            } catch (error) {
                console.error('createBoard failed');
                reject();
            }
        });
    }

    loadCurrentBoard(id: string): Promise<BoardModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_URL}/board/find?id=${id}`);
                Object.assign(this._model.currentBoard, result.data);
                resolve(this._model.currentBoard);
            } catch (error) {
                console.error('loadCurrentBoard failed');
                reject();
            }
        });
    }
}
