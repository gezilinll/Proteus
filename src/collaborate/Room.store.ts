import { defineStore } from 'pinia';
import { User, UserMedia } from './User';
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
            roomID: '',
            roomName: '',
            status: RoomState.SOLO,
            user: {
                id: "",
                nickname: "",
            } as User,
            producer: {
            } as UserMedia,
            consumers: new Map<string, UserMedia>(),
        };
    },
});
