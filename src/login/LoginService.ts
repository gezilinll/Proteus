import { LoginModel } from './LoginModel';
import { UserModel } from '../collab/User.store';
import axios from 'axios';

export class LoginService {
    constructor(private _model: LoginModel) {}

    requestGithubAuth() {
        const authorize_uri = 'https://github.com/login/oauth/authorize';
        const redirect_uri = 'http://localhost:7001/api/authorize/github';

        return `${authorize_uri}?client_id=2fc9877432c55cb75217&redirect_uri=${redirect_uri}`;
    }

    getUserInfo(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(
                    `http://localhost:7001/api/getUserInfo?id=${userID}`
                );
                resolve({ id: result.data.id, userName: result.data.userName } as UserModel);
            } catch (error) {
                console.log('getUserInfo failed');
                reject();
            }
        });
    }
}
