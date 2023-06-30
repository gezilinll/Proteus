<template>
    <div>
        <video
            :id="props.name"
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
    </div>
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
