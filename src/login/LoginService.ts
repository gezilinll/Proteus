import { LoginModel } from './LoginModel';
import { useUserStore } from '../collab/User.store';

export class LoginService {
    private _store = useUserStore();

    constructor(private _model: LoginModel) {}

    isTourist() {
        return !this._store.self.id;
    }

    isValidUser() {
        return this._store.self.id && this._store.self.userName;
    }

    requestGithubAuth() {
        const authorize_uri = 'https://github.com/login/oauth/authorize';
        const redirect_uri = 'http://localhost:7001/api/authorize/github';

        return `${authorize_uri}?client_id=2fc9877432c55cb75217&redirect_uri=${redirect_uri}`;
    }
}
