import { defineStore } from 'pinia';
import { UserModel } from '../model/UserModel';

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            self: { id: '', name: '', color: '', mouseX: 0, mouseY: 0 } as UserModel,
            others: [] as UserModel[],
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

        hasOther(id: string) {
            return this.others.filter((item) => item.id === id).length > 0;
        },
    },
});
