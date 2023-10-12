import { assert } from 'chai';
import { useUserStore } from './User.store';

describe('UserStore Tester', () => {
    const userStore = useUserStore();

    it('isTourist', () => {
        assert.equal(true, userStore.isTourist());
        userStore.self.id = 'uuid';
        assert.equal(true, userStore.isTourist());
        userStore.token = 'token';
        assert.equal(false, userStore.isTourist());
    });
});
