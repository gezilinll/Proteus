import axios from 'axios';
import { GITHUB_CLIENT_ID, SERVER_URL } from '../Constants';
import { UserModel } from '../model/UserModel';

export class UserService {
    constructor() {}

    getGithubAuthURL() {
        const authorize_uri = 'https://github.com/login/oauth/authorize';
        const redirect_uri = `${SERVER_URL}/auth/github`;

        return `${authorize_uri}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}`;
    }

    getUserInfo(userID: string): Promise<UserModel> {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('getUserInfo 1');
                const result = await axios.get(`${SERVER_URL}/user/findOne?id=${userID}`);
                console.log('getUserInfo', result);
                resolve({ id: result.data.id, name: result.data.name } as UserModel);
            } catch (error) {
                console.log('getUserInfo failed', error);
                // reject();
            }
        });
    }
}
