import { defineStore } from 'pinia';
import { FunctionPanelItem } from '../Defines';
import { BoardModel } from '../model/BoardModel';
import { BoardService } from '../service/BoardService';
import { CollabService } from '../service/collab/CollabService';
import { UserModel } from '../model/UserModel';
import { UserService } from '../service/UserService';
import { CookieService } from '../service/CookieService';

export declare type OnWheelListener = (moveX: number, moveY: number) => void;
export declare type UnregisterListener = () => void;

export const useBlitzStore = defineStore('blitz', {
    state: () => {
        return {
            selectedFunction: 'selector' as FunctionPanelItem,
            brushConfig: {
                color: '#000000',
                weight: 2,
            },
            showVideoChatPanel: false,
            wheelHooks: [] as OnWheelListener[],
            zoom: 100,

            boardService: new BoardService(),
            collabService: new CollabService(),
            userService: new UserService(),
            cookieService: new CookieService(),

            self: { id: '', name: '', color: '', mouseX: 0, mouseY: 0 } as UserModel,
            others: [] as UserModel[],
            othersUserID: new Map<string, UserModel>(),
            othersPeerID: new Map<string, UserModel>(),
            token: '',
            userStreamFlag: 0,

            boards: [] as BoardModel[],
            currentBoard: {} as BoardModel,
        };
    },
    actions: {
        isValidBoard() {
            return (
                !!this.currentBoard.id && !!this.currentBoard.title && !!this.currentBoard.content
            );
        },

        registerWheel(listener: OnWheelListener): UnregisterListener {
            this.wheelHooks.push(listener);
            return () => {
                this.wheelHooks = this.wheelHooks.filter((entry) => entry != listener);
            };
        },

        isTourist(): boolean {
            return !this.self.id || !this.token;
        },

        isValidUser(): boolean {
            return !!this.self.id && !!this.self.name && !!this.token;
        },

        addOtherUser(user: UserModel) {
            if (!user.id || !user.name || !user.color || !user.peerID) {
                console.log('invalid other user');
                return;
            }
            this.others.push(user);
            this.othersUserID.set(user.id, user);
            this.othersPeerID.set(user.peerID!, user);
        },

        deleteOtherUser(user: UserModel) {
            this.others = this.others.filter((item) => item.peerID !== user.peerID);
            this.othersUserID.delete(user.id);
            this.othersPeerID.delete(user.peerID!);
        },

        hasOtherUserByID(id: string) {
            return this.othersUserID.has(id);
        },

        getOtherUserByUserID(id: string): UserModel | undefined {
            return this.othersUserID.get(id);
        },

        getOtherUserByPeerID(id: string): UserModel | undefined {
            return this.othersPeerID.get(id);
        },
    },
});
