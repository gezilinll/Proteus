import { defineStore } from 'pinia';
import { UserModel } from '../model/UserModel';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: { id: '', name: '', color: '', mouseX: 0, mouseY: 0 } as UserModel,
            others: [] as UserModel[],
            othersUserID: new Map<string, UserModel>(),
            othersPeerID: new Map<string, UserModel>(),
            token: '',
            userStreamFlag: 0,
        };
    },
    actions: {
        isTourist() {
            return !this.self.id || !this.token;
        },

        isValidUser() {
            return this.self.id && this.self.name && this.token;
        },

        addOtherUser(user: UserModel) {
            this.others.push(user);
            this.othersUserID.set(user.id, user);
            this.othersPeerID.set(user.peerID!, user);
        },

        deleteOtherUser(user: UserModel) {
            this.others = this.others.filter((item) => item.peerID !== user.peerID);
            this.othersUserID.delete(user.id);
            this.othersPeerID.delete(user.peerID!);
        },

        hasOtherUserByID(id: string) {
            return this.othersUserID.has(id);
        },

        getOtherUserByUserID(id: string): UserModel | undefined {
            return this.othersUserID.get(id);
        },

        getOtherUserByPeerID(id: string): UserModel | undefined {
            return this.othersPeerID.get(id);
        },
    },
});
