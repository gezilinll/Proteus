<template>
    <div>
        <div style="padding-top: 15px; padding-left: 100px" v-if="isSoloMode">
            <v-form>
                <v-container>
                    <v-row>
                        <v-col cols="12" sm="5">
                            <v-text-field
                                label="YOUR NAME"
                                counter
                                maxlength="20"
                                v-model="userName"
                                placeholder="momo"
                                persistent-placeholder
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="5">
                            <v-text-field
                                label="ROOM ID"
                                counter
                                maxlength="8"
                                v-model="inputRoomID"
                                :placeholder="newRoomID"
                                persistent-placeholder
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12" sm="2">
                            <v-btn
                                style="margin-top: 10px; margin-left: 16px"
                                elevation="2"
                                @click="createOrJoinRoom"
                            >
                                {{ buttonText }}
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </div>
        <div style="display: flex" v-if="isWhiteboardMode">
            <v-btn style="margin-top: 40px; margin-left: 15%" elevation="5" @click="joinVideoChat">
                Join Chat
            </v-btn>
            <v-card style="margin-top: 10px; margin-left: 28px" elevation="0">
                <template v-slot:title> Video Chat - {{ roomID }} </template>
                <v-card-text>
                    Now you can design your work with other people in this room({{ roomID }}), and
                    you can chat them through video chat, which we hope you do this too ^_^.
                </v-card-text>
            </v-card>
            <span
                aria-hidden="true"
                title="Invite"
                class="invite-icon-whiteboard"
                @click="copyRoomID"
            >
                <img src="../../assets/join-room-id.svg" style="width: 40px; height: 40px" />
            </span>
        </div>
        <div
            style="position: absolute; left: 0; top: 0; right: 50px; height: 100%"
            v-if="isVideoChatMode"
        >
            <ProducerView
                :user="producer"
                @switch-audio="switchAudio"
                @switch-video="switchVideo"
            ></ProducerView>
            <div v-for="item in consumers">
                <ConsumerView :name="item[1].name" :track="item[1].videoTrack!"></ConsumerView>
            </div>
        </div>
        <span
            v-if="isVideoChatMode"
            aria-hidden="true"
            title="Invite"
            class="invite-icon-video-chat"
            @click="copyRoomID"
        >
            <img src="../../assets/join-room-id.svg" style="width: 40px; height: 40px" />
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoomStore, RoomState } from '../../collaborate/Room.store';
import randomString from 'random-string';
import { ConsumerView, ProducerView } from '..';
import { storeToRefs } from 'pinia';
import { User } from '../../collaborate/User';

import { ElMessage } from 'element-plus'

const store = useRoomStore();
const { room, roomID, producer, consumers } = storeToRefs(store);

function switchAudio(user: User) {
    producer.value!.audio = !producer.value!.audio;
}

function switchVideo(user: User) {
    if (producer.value!.video) {
        room.value.disableWebcam();
    } else {
        room.value.enableWebcam();
    }
}

const newRoomID = randomString({ length: 8 }).toLowerCase();
const inputRoomID = ref<string>();
const buttonText = computed(() => {
    if (inputRoomID && inputRoomID.value && inputRoomID.value.length === 8) {
        return 'JOIN ROOM';
    }
    return 'CREATE ROOM';
});
const userName = ref<string>('');

const isSoloMode = computed(() => {
    return store.status === RoomState.SOLO;
});
const isWhiteboardMode = computed(() => {
    return store.status === RoomState.WHITEBOARD;
});
const isVideoChatMode = computed(() => {
    return store.status === RoomState.VIDEO && producer.value && producer.value.videoTrack;
});

function createOrJoinRoom() {
    roomID.value = buttonText.value === 'CREATE ROOM' ? newRoomID : inputRoomID.value!;
    room.value.joinWhiteBoard(roomID.value);
}

function joinVideoChat() {
    room.value.joinVideoChat(roomID.value);
}

function copyRoomID() {
    navigator.clipboard.writeText(roomID.value);
    ElMessage({
        showClose: false,
        message: 'Room ID has copied.',
        duration: 1000,
        type: 'info',
    });
}
</script>

<style>
.video-container {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
}

.invite-icon-whiteboard {
    margin-top: 45px;
    margin-left: 16px;
    width: 40px;
    height: 40px;
}
.invite-icon-whiteboard:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.invite-icon-video-chat {
    position: absolute;
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
}
.invite-icon-video-chat:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
