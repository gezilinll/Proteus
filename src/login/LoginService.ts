import { LoginModel } from './LoginModel';

export class LoginService {
    constructor(private _model: LoginModel) {}

    requestGithubAuth() {
        const authorize_uri = 'https://github.com/login/oauth/authorize';
        const redirect_uri = 'http://localhost:8080/oauth/redirect';

        return `${authorize_uri}?client_id=2fc9877432c55cb75217&redirect_uri=${redirect_uri}`;
    }
}
