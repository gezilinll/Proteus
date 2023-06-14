<template>
    <video
        :id="props.name"
        style="
            width: 180px;
            height: 180px;
            margin-left: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
            object-fit: cover;
        "
        autoplay
    ></video>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const props = defineProps({
    name: String,
    track: MediaStreamTrack,
});

onMounted(() => {
    const stream = new MediaStream();
    const videoElement = document.getElementById(props.name!) as HTMLVideoElement;
    stream.addTrack(props.track!);
    videoElement.srcObject = stream;
});
</script>
