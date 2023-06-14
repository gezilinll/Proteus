import { defineStore } from 'pinia';
import { User } from './User';

export enum RoomState {
    SOLO,
    WHITEBOARD,
    VIDEO,
}

export const userRoomStore = defineStore('room', {
    state: () => {
        return {
            status: RoomState.SOLO,
            producer: null as User | null,
            consumers: [] as User[],
        };
    },
    actions: {
        setProducer(user: User) {
            this.producer = user;
            console.log('setProducer', this.producer);
        },

        addConsumer(user: User) {
            this.consumers.push(user);
        },
    },
});
