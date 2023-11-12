import { useBlitzStore } from '../store/Blitz.store';
import axios from 'axios';

export class CookieService {
    private _store = useBlitzStore();

    constructor() {}

    initFromCookie() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('id')) {
            document.cookie = `id=${urlParams.get('id')!}`;
            this._initFromCookie();
        } else if (urlParams.has('userID') && urlParams.has('token')) {
            document.cookie = `accessToken=${urlParams.get('token')!}`;
            document.cookie = `userID=${urlParams.get('userID')!}`;
            document.cookie = 'id=';
            window.location.href = window.location.origin;
        } else {
            document.cookie = 'id=';
            this._initFromCookie();
        }
    }

    _initFromCookie() {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            ?.split('=')[1];
        const userID = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userID='))
            ?.split('=')[1];
        if (userID) {
            this._store.self.id = userID;
        }
        if (token) {
            axios.defaults.headers.common.Authorization = `Bearer ${token}`;
            this._store.token = token;
        }
    }
}
