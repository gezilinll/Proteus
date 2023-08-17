import { defineStore } from 'pinia';

export interface UserModel {
    id: string;
    nickName: string;
}

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: {} as UserModel,
            others: [] as UserModel[],
        };
    },
    actions: {
        isSelfValid() {
            return this.self.id && this.self.nickName;
        },

        selfLogin(id: string, nickName: string) {
            this.self.id = id;
            this.self.nickName = nickName;
        },

        otherLogin(id: string, nickName: string) {
            this.others.push({ id, nickName });
        },
    },
});
