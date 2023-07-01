import { defineStore } from 'pinia';
import { User } from './User';

export enum RoomState {
    SOLO,
    WHITEBOARD,
    VIDEO,
}

export const useRoomStore = defineStore('room', {
    state: () => {
        return {
            status: RoomState.SOLO,
            producer: {
                name: 'momo',
                video: true,
                audio: true,
                videoTrack: null,
                audioTrack: null,
            } as User,
            consumers: new Map<string, User>(),
        };
    },
});
