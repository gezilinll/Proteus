<template>
    <div class="root-container" id="root-container">
        <div class="stream-list-container">
            <div class="chat-window-container" v-if="self.videoStream">
                <video
                    id="video-producer-player"
                    style="position: absolute; width: 200px; height: 150px; object-fit: cover"
                    :srcObject.prop="self.videoStream"
                    autoplay
                ></video>
                <audio
                    id="audio-producer-player"
                    autoPlay
                    playsInline
                    :controls="false"
                    v-if="self.audioStream"
                    :srcObject.prop="self.audioStream"
                />
                <video
                    id="video-producer-player"
                    style="position: absolute; width: 200px; height: 150px; object-fit: cover"
                    autoplay
                ></video>
            </div>
            <div class="chat-window-container" v-for="userItem in others" v-if="hasOtherStream">
                <video
                    id="video-producer-player"
                    style="position: absolute; width: 200px; height: 150px; object-fit: cover"
                    v-if="userItem[1].videoStream"
                    :srcObject.prop="userItem[1].videoStream"
                    autoplay
                ></video>
                <audio
                    id="audio-producer-player"
                    autoPlay
                    playsInline
                    :controls="false"
                    v-if="userItem[1].audioStream"
                    :srcObject.prop="userItem[1].audioStream"
                />
            </div>
        </div>
        <div class="function-container"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../store/User.store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed } from 'vue';

const userStore = useUserStore();
const { self, others } = storeToRefs(userStore);

onMounted(() => {
    watch(
        () => self.value.audioStream || self.value.videoStream || others.value,
        () => {
            const videoHeight = 150,
                maxHeight = 485,
                functionHeight = 35;
            let containerHeight = functionHeight;
            if (self.value.videoStream || self.value.audioStream) {
                containerHeight += videoHeight;
            }
            for (const other of others.value) {
                if (other[1].videoStream || other[1].audioStream) {
                    containerHeight += videoHeight;
                }
            }
            containerHeight = Math.min(maxHeight, containerHeight);
            const root = document.getElementById('root-container');
            root!.style.height = containerHeight + 'px';
        },
        { immediate: true }
    );
});

const hasOtherStream = computed(() => {
    if (others.value.size === 0) {
        return false;
    }
    for (const other of others.value) {
        if (other[1].videoStream || other[1].audioStream) {
            return true;
        }
    }
    return false;
});
</script>

<style lang="less" scoped="true">
@import url('~@/../../style/Variables.less');
@import url('~@/../../style/Common.less');
.root-container {
    position: absolute;
    width: 200px;
    height: 235px;
    top: 80px;
    right: 26px;
    overflow: hidden;
    background-color: white;
    border-radius: 2px;
    cursor: auto;
}

.stream-list-container {
    position: absolute;
    left: 0;
    right: -17px; /* https://stackoverflow.com/questions/16670931/hide-scroll-bar-but-while-still-being-able-to-scroll */
    overflow-y: auto;

    display: flex;
    flex-flow: row wrap;
    max-height: 450px;
}

.function-container {
    display: flex;
    position: absolute;
    bottom: 0px;
    width: 200px;
    height: 35px;
    background-color: black;
    cursor: pointer;
}

.chat-window-container {
    width: 200px;
    height: 150px;
}
</style>
