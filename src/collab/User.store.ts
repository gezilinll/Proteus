import { defineStore } from 'pinia';

export interface UserModel {
    id: string;
    userName: string;
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
            return this.self.id && this.self.userName;
        },

        selfLogin(id: string, userName: string) {
            this.self.id = id;
            this.self.userName = userName;
        },

        otherLogin(id: string, userName: string) {
            this.others.push({ id, userName });
        },
    },
});
