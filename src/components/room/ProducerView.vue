<template>
    <div>
        <video
            id="video-producer-player"
            style="
                position: absolute;
                left: 10px;
                top: 10px;
                width: 100px;
                height: 100px;
                object-fit: cover;
            "
            autoplay
        ></video>
        <audio id="audio-producer-player" autoPlay playsInline :controls="false" />
        <img
            :src="props.user.audio ? 'mic.svg' : 'mic-off.svg'"
            class="peer-icon"
            style="top: 10px"
            @click="
                {
                    {
                        emits('switchAudio', props.user);
                    }
                }
            "
        />
        <img
            :src="props.user.video ? 'camera.svg' : 'camera-off.svg'"
            class="peer-icon"
            style="top: 35px"
            @click="
                {
                    {
                        emits('switchVideo', props.user);
                    }
                }
            "
        />
        <img src="../../assets/switch-camera.svg" class="peer-icon" style="top: 60px" />
        <img src="../../assets/share-screen.svg" class="peer-icon" style="top: 85px" />
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { UserMedia } from '../../collaborate/User';

const props = defineProps<{
    user: UserMedia;
}>();
const emits = defineEmits(['switchAudio', 'switchVideo']);

onMounted(() => {
    const videoStream = new MediaStream();
    const videoElement = document.getElementById('video-producer-player') as HTMLVideoElement;
    videoStream.addTrack(props.user.videoTrack!);
    videoElement.srcObject = videoStream;

    // const audioStream = new MediaStream();
    // const audioElement = document.getElementById('audio-producer-player') as HTMLAudioElement;
    // audioStream.addTrack(props.user.audioTrack!);
    // audioElement.srcObject = audioStream;
});
</script>

<style>
.peer-icon {
    padding: 2px;
    width: 25px;
    height: 25px;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.1);
    left: 110px;
}
.peer-icon:hover {
    background-color: rgba(0, 0, 0, 0.4);
}
</style>
