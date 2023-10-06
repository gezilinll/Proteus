import { defineStore } from 'pinia';
import { UserModel } from '../model/UserModel';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: { id: '', name: '', color: '', mouseX: 0, mouseY: 0 } as UserModel,
            others: new Map<string, UserModel>(),
            othersPeedID: new Map<string, UserModel>(),
            token: '',
        };
    },
    actions: {
        isTourist() {
            return !this.self.id && !this.token;
        },

        isValidUser() {
            return this.self.id && this.self.name;
        },

        addOtherUser(user: UserModel) {
            this.others.set(user.id, user);
            this.othersPeedID.set(user.peerID!, user);
        },

        hasOtherUserByID(id: string) {
            return this.others.has(id);
        },

        getOtherUserByPeerID(id: string) {
            return this.othersPeedID.get(id);
        },
    },
});
