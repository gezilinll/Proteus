import axios from 'axios';
import { SERVER_URL } from '../Constants';
import { BoardModel } from '../model/RecordModel';
import { useBlitzStore } from '../store/Blitz.store';

export class BoardService {
    private _store = useBlitzStore();

    constructor() {}

    loadBoardList(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_URL}/board/findAll?userID=${userID}`);
                this._store.boards = result.data as BoardModel[];
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
                this._store.boards.push(result.data as BoardModel);
                resolve(this._store.boards.at(-1)!);
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
                Object.assign(this._store.currentBoard, result.data);
                resolve(this._store.currentBoard);
            } catch (error) {
                console.error('loadCurrentBoard failed');
                reject();
            }
        });
    }
}
