<template>
    <div class="root-container" id="root-container">
        <div class="stream-list-container">
            <div class="chat-window-container">
                <span class="video-off-item" v-if="!self.videoStream">
                    <svg viewBox="0 0 600 600" version="1.1" id="svg9724" width="200" height="100">
                        <g
                            id="g10449"
                            transform="matrix(0.95173205,0,0,0.95115787,13.901174,12.168794)"
                            style="stroke-width: 1.05103"
                        >
                            <g
                                id="path10026"
                                inkscape:transform-center-x="-0.59233046"
                                inkscape:transform-center-y="-20.347403"
                                transform="matrix(1.3807551,0,0,1.2700888,273.60014,263.99768)"
                            />
                            <g
                                id="g11314"
                                transform="matrix(1.5092301,0,0,1.3955555,36.774048,-9.4503933)"
                                style="stroke-width: 50.6951"
                            />
                            <path
                                style="
                                    color: #000000;
                                    fill: #000000;
                                    stroke-width: 1.05103;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    -inkscape-stroke: none;
                                    paint-order: stroke fill markers;
                                "
                                d="m 248.07279,-12.793664 c -72.13241,0 -131.33949,59.250935 -131.33949,131.392074 0,38.92115 17.25502,74.07152 44.45432,98.20884 C 58.500207,254.84854 -14.606185,358.21398 -14.606185,477.846 a 35.037921,35.037921 0 0 0 35.034809,35.03543 H 188.95771 c 6.88866,-25.46243 17.91968,-49.15043 32.45932,-70.0688 H 58.235927 C 73.730605,344.39181 153.38526,271.2598 248.07279,271.2598 c 13.12286,0 25.94065,1.45153 38.35524,4.13353 4.26325,-42.80875 34.59589,-78.30933 74.73011,-90.32371 11.57931,-19.5408 18.25414,-42.27592 18.25414,-66.47121 0,-72.141139 -59.20709,-131.392074 -131.33949,-131.392074 z m 0,70.068794 c 34.24293,0 61.26987,27.028459 61.26987,61.32328 0,34.29482 -27.02694,61.3274 -61.26987,61.3274 -34.24293,0 -61.27192,-27.03258 -61.27192,-61.3274 0,-34.294821 27.02899,-61.32328 61.27192,-61.32328 z"
                                id="path295"
                            />
                            <path
                                id="path295-3"
                                style="
                                    color: #000000;
                                    fill: #000000;
                                    stroke-width: 1.05103;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    -inkscape-stroke: none;
                                    paint-order: stroke fill markers;
                                "
                                d="m 405.68024,197.47637 c -57.70598,0 -105.07159,47.40151 -105.07159,105.11449 0,31.13694 13.80343,59.25664 35.56289,78.56652 -82.15001,30.43306 -140.63449,113.12556 -140.63449,208.83127 a 28.030337,28.030337 0 0 0 28.0273,28.0278 h 182.11589 182.11452 a 28.030337,28.030337 0 0 0 28.0286,-28.0278 c 0,-95.70539 -58.4835,-178.39795 -140.63307,-208.83127 21.75947,-19.30988 35.56153,-47.42958 35.56153,-78.56652 0,-57.71298 -47.3656,-105.11449 -105.07158,-105.11449 z m 0,56.05559 c 27.39437,0 49.01562,21.62301 49.01562,49.0589 0,27.43588 -21.62125,49.06164 -49.01562,49.06164 -27.39437,0 -49.017,-21.62576 -49.017,-49.06164 0,-27.43589 21.62263,-49.0589 49.017,-49.0589 z m 0,171.18664 c 75.7501,0 139.47372,58.50552 151.86952,137.24226 H 405.68024 253.81075 C 266.2065,483.22412 329.93014,424.7186 405.68024,424.7186 Z"
                            />
                        </g>
                    </svg>
                </span>
                <video
                    id="video-producer-player"
                    style="position: absolute; width: 200px; height: 150px; object-fit: cover"
                    v-if="self.videoStream"
                    :srcObject.prop="self.videoStream"
                    autoplay
                ></video>
                <audio
                    autoPlay
                    playsInline
                    :controls="false"
                    v-if="self.audioStream"
                    :srcObject.prop="self.audioStream"
                />
            </div>
            <div class="chat-window-container" v-for="userItem in others" v-if="hasOtherStream">
                <span class="video-off-item" v-if="!userItem.videoStream">
                    <svg viewBox="0 0 600 600" version="1.1" id="svg9724" width="200" height="100">
                        <g
                            id="g10449"
                            transform="matrix(0.95173205,0,0,0.95115787,13.901174,12.168794)"
                            style="stroke-width: 1.05103"
                        >
                            <g
                                id="path10026"
                                inkscape:transform-center-x="-0.59233046"
                                inkscape:transform-center-y="-20.347403"
                                transform="matrix(1.3807551,0,0,1.2700888,273.60014,263.99768)"
                            />
                            <g
                                id="g11314"
                                transform="matrix(1.5092301,0,0,1.3955555,36.774048,-9.4503933)"
                                style="stroke-width: 50.6951"
                            />
                            <path
                                style="
                                    color: #000000;
                                    fill: #000000;
                                    stroke-width: 1.05103;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    -inkscape-stroke: none;
                                    paint-order: stroke fill markers;
                                "
                                d="m 248.07279,-12.793664 c -72.13241,0 -131.33949,59.250935 -131.33949,131.392074 0,38.92115 17.25502,74.07152 44.45432,98.20884 C 58.500207,254.84854 -14.606185,358.21398 -14.606185,477.846 a 35.037921,35.037921 0 0 0 35.034809,35.03543 H 188.95771 c 6.88866,-25.46243 17.91968,-49.15043 32.45932,-70.0688 H 58.235927 C 73.730605,344.39181 153.38526,271.2598 248.07279,271.2598 c 13.12286,0 25.94065,1.45153 38.35524,4.13353 4.26325,-42.80875 34.59589,-78.30933 74.73011,-90.32371 11.57931,-19.5408 18.25414,-42.27592 18.25414,-66.47121 0,-72.141139 -59.20709,-131.392074 -131.33949,-131.392074 z m 0,70.068794 c 34.24293,0 61.26987,27.028459 61.26987,61.32328 0,34.29482 -27.02694,61.3274 -61.26987,61.3274 -34.24293,0 -61.27192,-27.03258 -61.27192,-61.3274 0,-34.294821 27.02899,-61.32328 61.27192,-61.32328 z"
                                id="path295"
                            />
                            <path
                                id="path295-3"
                                style="
                                    color: #000000;
                                    fill: #000000;
                                    stroke-width: 1.05103;
                                    stroke-linecap: round;
                                    stroke-linejoin: round;
                                    -inkscape-stroke: none;
                                    paint-order: stroke fill markers;
                                "
                                d="m 405.68024,197.47637 c -57.70598,0 -105.07159,47.40151 -105.07159,105.11449 0,31.13694 13.80343,59.25664 35.56289,78.56652 -82.15001,30.43306 -140.63449,113.12556 -140.63449,208.83127 a 28.030337,28.030337 0 0 0 28.0273,28.0278 h 182.11589 182.11452 a 28.030337,28.030337 0 0 0 28.0286,-28.0278 c 0,-95.70539 -58.4835,-178.39795 -140.63307,-208.83127 21.75947,-19.30988 35.56153,-47.42958 35.56153,-78.56652 0,-57.71298 -47.3656,-105.11449 -105.07158,-105.11449 z m 0,56.05559 c 27.39437,0 49.01562,21.62301 49.01562,49.0589 0,27.43588 -21.62125,49.06164 -49.01562,49.06164 -27.39437,0 -49.017,-21.62576 -49.017,-49.06164 0,-27.43589 21.62263,-49.0589 49.017,-49.0589 z m 0,171.18664 c 75.7501,0 139.47372,58.50552 151.86952,137.24226 H 405.68024 253.81075 C 266.2065,483.22412 329.93014,424.7186 405.68024,424.7186 Z"
                            />
                        </g>
                    </svg>
                </span>
                <video
                    style="position: absolute; width: 200px; height: 150px; object-fit: cover"
                    v-if="userItem.videoStream"
                    :srcObject.prop="userItem.videoStream"
                    autoplay
                ></video>
                <audio
                    autoPlay
                    playsInline
                    :controls="false"
                    v-if="userItem.audioStream"
                    :srcObject.prop="userItem.audioStream"
                />
            </div>
        </div>
        <div class="function-container">
            <div class="function-item-container" @click="presenter.switchAudio">
                <span class="function-item" style="padding: 12px" v-if="self.audioStream">
                    <svg
                        fill="#000000"
                        width="45px"
                        height="35px"
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1129.432 113v1694.148H903.545l-451.772-451.773V564.773L903.545 113h225.887Zm542.545 248.057C1832.017 521.097 1920 733.882 1920 960.107c0 226.226-87.983 438.898-248.023 598.938l-79.851-79.85c138.694-138.582 214.93-323.018 214.93-519.087 0-196.183-76.236-380.506-214.93-519.2ZM338.83 564.773v790.602H169.415C75.672 1355.375 0 1279.703 0 1185.96V734.187c0-93.742 75.672-169.414 169.415-169.414H338.83Zm1093.922 36.085c95.776 97.018 148.407 224.644 148.407 359.16 0 134.628-52.631 262.253-148.407 359.272l-80.303-79.174c74.656-75.897 115.767-175.4 115.767-280.099 0-104.585-41.111-204.088-115.767-279.986Z"
                            fill-rule="evenodd"
                        />
                    </svg>
                </span>
                <span class="function-item" style="padding: 12px" v-if="!self.audioStream">
                    <svg
                        fill="#000000"
                        width="45px"
                        height="35px"
                        viewBox="0 0 1920 1920"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1129.433 113v1694.15H903.547l-451.774-451.773V564.773L903.547 113h225.886ZM338.83 564.773v790.604H169.415c-92.806 0-167.9-74.166-169.392-166.609L0 1185.962V734.188c0-92.805 74.166-167.9 166.608-169.392l2.807-.023H338.83ZM1789.951 635 1920 764.926 1724.988 959.94 1920 1154.95 1789.951 1285l-194.89-195.012L1400.05 1285 1270 1154.951l195.012-195.012L1270 764.926 1400.049 635l195.012 195.012L1789.951 635Z"
                            fill-rule="evenodd"
                        />
                    </svg>
                </span>
            </div>
            <div class="function-item-container" @click="presenter.switchVideo">
                <span class="function-item" v-if="self.videoStream">
                    <svg
                        width="45px"
                        height="35px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16 10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 15.099 21 15.5615 20.806 15.8257C20.6369 16.056 20.3773 16.203 20.0928 16.2295C19.7665 16.2599 19.3699 16.022 18.5768 15.5461L16 14M6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C16 16.4802 16 15.9201 16 14.8V9.2C16 8.0799 16 7.51984 15.782 7.09202C15.5903 6.71569 15.2843 6.40973 14.908 6.21799C14.4802 6 13.9201 6 12.8 6H6.2C5.0799 6 4.51984 6 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18Z"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </span>
                <span class="function-item" v-if="!self.videoStream">
                    <svg
                        width="45px"
                        height="35px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M11.65 6H12.8C13.9201 6 14.4802 6 14.908 6.21799C15.2843 6.40973 15.5903 6.71569 15.782 7.09202C16 7.51984 16 8.0799 16 9.2V10L18.5768 8.45392C19.3699 7.97803 19.7665 7.74009 20.0928 7.77051C20.3773 7.79703 20.6369 7.944 20.806 8.17433C21 8.43848 21 8.90095 21 9.8259V14.1741C21 14.679 21 15.0462 20.9684 15.3184M3 3L6.00005 6.00005M21 21L15.9819 15.9819M6.00005 6.00005C5.01167 6.00082 4.49359 6.01337 4.09202 6.21799C3.71569 6.40973 3.40973 6.71569 3.21799 7.09202C3 7.51984 3 8.07989 3 9.2V14.8C3 15.9201 3 16.4802 3.21799 16.908C3.40973 17.2843 3.71569 17.5903 4.09202 17.782C4.51984 18 5.07989 18 6.2 18H12.8C13.9201 18 14.4802 18 14.908 17.782C15.2843 17.5903 15.5903 17.2843 15.782 16.908C15.9049 16.6668 15.9585 16.3837 15.9819 15.9819M6.00005 6.00005L15.9819 15.9819"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </span>
            </div>
            <div class="function-item-container">
                <span class="function-item">
                    <svg
                        width="45px"
                        height="35px"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                    >
                        <g fill="#000000">
                            <path
                                d="M3.25 2A2.25 2.25 0 001 4.25v1.23a.75.75 0 001.5 0V4.25a.75.75 0 01.75-.75h9.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H9.724a.75.75 0 000 1.5h3.026A2.25 2.25 0 0015 11.75v-7.5A2.25 2.25 0 0012.75 2h-9.5z"
                            />

                            <path
                                d="M1.833 7.505a.75.75 0 10-.166 1.49 4.91 4.91 0 014.338 4.338.75.75 0 101.49-.166 6.41 6.41 0 00-5.662-5.662z"
                            />

                            <path
                                d="M1.9 10.062a.75.75 0 00-.3 1.47A2.394 2.394 0 013.468 13.4a.75.75 0 101.47-.3A3.894 3.894 0 001.9 10.062z"
                            />
                        </g>
                    </svg>
                </span>
            </div>
            <span class="text-content" @click="presenter.leave()"> Leave </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../store/User.store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { computed } from 'vue';
import usePresenter from './VideoChatPanelPresenter';

const presenter = usePresenter();
const userStore = useUserStore();
const { self, others, userStreamFlag } = storeToRefs(userStore);

onMounted(() => {
    watch(
        () => userStreamFlag.value,
        () => {
            const videoHeight = 150,
                maxHeight = 485,
                functionHeight = 35;
            let containerHeight = videoHeight + functionHeight; // keep self
            for (const other of others.value) {
                if (other.videoStream || other.audioStream) {
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
    if (others.value.length === 0) {
        return false;
    }
    for (const other of others.value) {
        if (other.videoStream || other.audioStream) {
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
    border: 2px solid #d9e5f9;
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
    background-color: rgb(243, 243, 243);
    cursor: pointer;
}
.function-item-container {
    box-sizing: border-box;
    width: 45px;
    height: 35px;
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
}

.function-item {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 35px;
    width: 45px;
    padding-left: 10px;
    padding-right: 10px;
}

.video-off-item {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    height: 100px;
    width: 200px;
    margin-top: 20px;
}

.chat-window-container {
    width: 200px;
    height: 150px;
}

.text-content {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: red;
    font-family: @g-font-family;
    height: 35px;
    width: 65px;
    font-weight: 600;
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
}
</style>
