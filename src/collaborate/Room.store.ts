import { defineStore } from 'pinia';
import { User } from './User';
import { WhiteBoard } from './WhiteBoard';
import { VideoChat } from './VideoChat';

export enum RoomState {
    SOLO,
    WHITEBOARD,
    VIDEO,
}

export const useRoomStore = defineStore('room', {
    state: () => {
        return {
            status: RoomState.SOLO,
            whiteBoard: new WhiteBoard(),
            videoChat: new VideoChat(),
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
