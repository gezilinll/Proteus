import { defineStore } from 'pinia';
import { UserModel } from '../model/UserModel';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: {} as UserModel,
            others: [] as UserModel[],
            token: '',
        };
    },
    actions: {
        isTourist() {
            return !this.self.id && !this.token;
        },

        isValidUser() {
            return this.self.id && this.self.userName;
        },

        hasOther(id: string) {
            return this.others.filter((item) => item.id === id).length > 0;
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
