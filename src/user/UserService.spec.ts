import { assert } from 'chai';
import { UserService } from './UserService';
import { SERVER_URL } from '../Constants';
import { UserModel } from '../model/UserModel';

describe('UserService Tester', () => {
    const userService = new UserService();

    // it('getGithubAuthURL', () => {
    //     assert.equal(
    //         'https://github.com/login/oauth/authorize?client_id=2fc9877432c55cb75217&redirect_uri=http://localhost:7001/auth/github',
    //         userService.getGithubAuthURL()
    //     );
    // });

    function getUserInfoTester() {
        // return a promise that resolves after 1 second
        return new Cypress.Promise((resolve, reject) => {
            userService
                .getUserInfo('uuid')
                .then((userModel) => {
                    resolve(userModel);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    it('getUserInfo', () => {
        cy.intercept(
            {
                method: 'GET',
                path: '/user/findOne?id=uuid',
            },
            (req) => {
                req.reply({ id: 'uuid', name: 'name' } as UserModel);
            }
        ).as('getUserInfo');
        cy.wrap(null).then(() => {
            // return a promise to cy.then() that
            // is awaited until it resolves
            return userService.getUserInfo('uuid').then((userModel) => {
                assert.equal('uuid', (userModel as UserModel).id);
                assert.equal('name', (userModel as UserModel).name);
                console.log('bbb');
            });
        });
        cy.wait('@getUserInfo', { timeout: 5000 }).then(() => {
            console.log('AAAA');
        });
    });
});
