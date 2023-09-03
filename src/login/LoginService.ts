import { UserModel } from '../store/User.store';
import axios from 'axios';
import { GITHUB_CLIENT_ID, SERVER_PREFIX } from '../Constants';

export class LoginService {
    constructor() {}

    requestGithubAuth() {
        const authorize_uri = 'https://github.com/login/oauth/authorize';
        const redirect_uri = `${SERVER_PREFIX}/api/authorize/github`;

        return `${authorize_uri}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}`;
    }

    getUserInfo(userID: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await axios.get(`${SERVER_PREFIX}/api/getUserInfo?id=${userID}`);
                resolve({ id: result.data.id, userName: result.data.userName } as UserModel);
            } catch (error) {
                console.log('getUserInfo failed');
                reject();
            }
        });
    }
}
