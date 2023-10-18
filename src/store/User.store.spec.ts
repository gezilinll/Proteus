import { assert } from 'chai';
import { useUserStore } from './User.store';
import { UserModel } from '../model/UserModel';

describe('UserStore Tester', () => {
    const userStore = useUserStore();

    it('defaultValue', () => {
        assert.equal(0, userStore.others.length);
        assert.equal(0, userStore.othersPeerID.size);
        assert.equal(0, userStore.othersUserID.size);
    });

    it('isTourist', () => {
        assert.equal(true, userStore.isTourist());
        userStore.self.id = 'uuid';
        assert.equal(true, userStore.isTourist());
        userStore.token = 'token';
        assert.equal(false, userStore.isTourist());
    });

    it('isValidUser', () => {
        assert.equal(false, userStore.isValidUser());
        userStore.self.id = 'uuid';
        assert.equal(false, userStore.isValidUser());
        userStore.token = 'token';
        assert.equal(false, userStore.isValidUser());
        userStore.self.name = 'name';
        assert.equal(true, userStore.isValidUser());
    });

    it('addOtherUser', () => {
        userStore.addOtherUser({} as UserModel);
        assert.equal(0, userStore.others.length);
        userStore.addOtherUser({ id: 'uuid' } as UserModel);
        assert.equal(0, userStore.others.length);
        userStore.addOtherUser({ id: 'uuid', name: 'name' } as UserModel);
        assert.equal(0, userStore.others.length);
        userStore.addOtherUser({ id: 'uuid', name: 'name', color: '#ffffff' } as UserModel);
        assert.equal(0, userStore.others.length);
        userStore.addOtherUser({
            id: 'uuid',
            name: 'name',
            color: '#ffffff',
            peerID: 'peerID',
        } as UserModel);
        assert.equal(1, userStore.others.length);
        assert.equal(1, userStore.othersPeerID.size);
        assert.equal(1, userStore.othersUserID.size);
        assert.equal('uuid', userStore.othersPeerID.get('peerID')!.id);
        assert.equal('peerID', userStore.othersUserID.get('uuid')!.peerID);
    });

    it('deleteOtherUser', () => {
        const user = {
            id: 'uuid',
            name: 'name',
            color: '#ffffff',
            peerID: 'peerID',
        } as UserModel;
        userStore.addOtherUser(user);
        userStore.deleteOtherUser(user);
        assert.equal(0, userStore.others.length);
        assert.equal(0, userStore.othersPeerID.size);
        assert.equal(0, userStore.othersUserID.size);
    });

    it('hasOtherUserByID', () => {
        const user = {
            id: 'uuid',
            name: 'name',
            color: '#ffffff',
            peerID: 'peerID',
        } as UserModel;
        userStore.addOtherUser(user);
        assert.equal(true, userStore.hasOtherUserByID('uuid'));
        assert.equal(false, userStore.hasOtherUserByID('uuid2'));
    });

    it('getOtherUserByUserID', () => {
        const user = {
            id: 'uuid',
            name: 'name',
            color: '#ffffff',
            peerID: 'peerID',
        } as UserModel;
        userStore.addOtherUser(user);
        assert.equal('uuid', userStore.getOtherUserByUserID('uuid')!.id);
        assert.equal(undefined, userStore.getOtherUserByUserID('uuid2'));
    });

    it('getOtherUserByPeerID', () => {
        const user = {
            id: 'uuid',
            name: 'name',
            color: '#ffffff',
            peerID: 'peerID',
        } as UserModel;
        userStore.addOtherUser(user);
        assert.equal('peerID', userStore.getOtherUserByPeerID('peerID')!.peerID);
        assert.equal(undefined, userStore.getOtherUserByPeerID('peerID2'));
    });
});
