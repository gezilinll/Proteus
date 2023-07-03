import { defineStore } from 'pinia';
import { User } from './User';
import { Room } from './Room';

export enum RoomState {
    SOLO,
    WHITEBOARD,
    VIDEO,
}

export const useRoomStore = defineStore('room', {
    state: () => {
        return {
            room: new Room(),
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
