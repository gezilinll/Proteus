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
        </div>
        <div v-for="item in consumers" v-if="isVideoChatMode">
            <PeerView :name="item.name" :track="item.track!"></PeerView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { userRoomStore, RoomState } from '../collaborate/Room.store';
import randomString from 'random-string';
import { Room } from '../collaborate/Room';
import { PeerView } from '.';
import { storeToRefs } from 'pinia';

const store = userRoomStore();
const { producer, consumers } = storeToRefs(store);
watch(producer, () => {
    const stream = new MediaStream();
    const videoElement = document.getElementById('producer-video') as HTMLVideoElement;
    stream.addTrack(producer.value!.track!);
    videoElement.srcObject = stream;
});

const room = new Room();

const newRoomID = randomString({ length: 8 }).toLowerCase();
const inputRoomID = ref<string>();
const roomID = ref<string>();
const buttonText = computed(() => {
    if (inputRoomID && inputRoomID.value && inputRoomID.value.length === 8) {
        return 'CREATE ROOM';
    }
    return 'JOIN ROOM';
});
const userName = ref<string>('');

const isSoloMode = computed(() => {
    return store.status === RoomState.SOLO;
});
const isWhiteboardMode = computed(() => {
    return store.status === RoomState.WHITEBOARD;
});
const isVideoChatMode = computed(() => {
    return store.status === RoomState.VIDEO;
});

function createOrJoinRoom() {
    roomID.value = buttonText.value === 'CREATE ROOM' ? inputRoomID.value! : newRoomID;
    room.join(roomID.value);
}

function joinVideoChat() {
    room.joinVideo();
}
</script>

<style>
.video-container {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
}
</style>
