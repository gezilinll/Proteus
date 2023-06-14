<template>
    <div>
        <div v-if="isSoloMode">
            <input v-model="roomID" :placeholder="newRoomID" @keydown.space.prevent />
            <button @click="createOrJoinRoom">{{ buttonText }}</button>
        </div>
        <div v-if="isWhiteboardMode">
            <button @click="joinVideoChat">Join Video Chat</button>
        </div>
        <div v-if="isVideoChatMode" class="video-container">
            <video
                id="producer-video"
                style="width: 180px; height: 180px; margin: 10px; object-fit: cover"
                autoplay
            ></video>
            <div
                style="
                    width: 1px;
                    height: 180px;
                    background-color: rgb(111, 108, 108);
                    margin-top: 10px;
                    margin-bottom: 10px;
                "
            ></div>
            <div v-for="item in consumers">
                <PeerView :name="item.name" :track="item.track"></PeerView>
            </div>
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
const roomID = ref<string>();
const buttonText = computed(() => {
    return !roomID.value ? 'CREATE ROOM' : 'JOIN ROOM';
});

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
    room.join(roomID.value ?? newRoomID);
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
