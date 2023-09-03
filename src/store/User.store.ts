import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: {} as UserModel,
            others: [] as UserModel[],
        };
    },
    actions: {
        isTourist() {
            return !this.self.id;
        },

        isValidUser() {
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
