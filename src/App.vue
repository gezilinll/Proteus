<template>
    <v-app>
        <div class="container">
            <div class="top-bar">
                <span
                    aria-hidden="true"
                    title="Select"
                    :class="[
                        mouseType === MouseType.Select ? 'mouse-cursor-selected' : 'mouse-cursor',
                    ]"
                    @click="store.useMouse(MouseType.Select)"
                    style="right: 400px"
                >
                    <svg
                        width="44"
                        height="40"
                        viewBox="0 0 44 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M16.2793 13.98L29.4852 21.9631L23.1384 23.6856L19.4364 29.2787L16.2793 13.98ZM17.7214 16.0203L19.9298 26.7215L22.5126 22.8193L26.9682 21.6101L17.7214 16.0203Z"
                            fill="rgba(255,255,255,0.8)"
                        ></path>
                    </svg>
                </span>
                <span
                    aria-hidden="true"
                    title="Drag"
                    :class="[
                        mouseType === MouseType.Drag ? 'mouse-cursor-selected' : 'mouse-cursor',
                    ]"
                    @click="store.useMouse(MouseType.Drag)"
                    style="right: 360px"
                >
                    <svg
                        width="44"
                        height="40"
                        viewBox="0 0 44 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M20.3953 11C20.3953 9.89543 21.2907 9 22.3953 9C23.2677 9 24.0096 9.55857 24.283 10.3376C24.601 10.1244 24.9836 10 25.3953 10C26.4998 10 27.3953 10.8954 27.3953 12V13.2676C27.6894 13.0974 28.031 13 28.3953 13C29.4998 13 30.3953 13.8954 30.3953 15L30.3953 23C30.3953 26.3137 27.709 29 24.3953 29H23.3953C21.5653 29 19.9262 28.1797 18.8271 26.8902C18.7996 26.8662 18.7724 26.8416 18.7455 26.8164L13.7406 22.1104C12.839 21.2628 12.7481 19.8444 13.5367 18.8895C14.309 17.9542 15.6644 17.7838 16.6422 18.5062L17.3953 19.0626V13C17.3953 11.8954 18.2907 11 19.3953 11C19.7596 11 20.1011 11.0974 20.3953 11.2676V11ZM21.3953 11C21.3953 10.4477 21.843 10 22.3953 10C22.9476 10 23.3953 10.4477 23.3953 11V18H24.3953V12C24.3953 11.9993 24.3953 11.9987 24.3953 11.998C24.3963 11.4466 24.8436 11 25.3953 11C25.9475 11 26.3953 11.4477 26.3953 12V18H27.3953V15C27.3953 14.4477 27.843 14 28.3953 14C28.9475 14 29.3953 14.4477 29.3953 15L29.3953 23C29.3953 25.7614 27.1567 28 24.3953 28H23.3953C21.842 28 20.4541 27.2917 19.5371 26.1805C19.5009 26.1514 19.4653 26.1205 19.4305 26.0878L14.4256 21.3819C13.9076 20.8949 13.8555 20.0739 14.3077 19.5262C14.7432 18.9989 15.4993 18.9052 16.0479 19.3105L18.3953 21.0448V13C18.3953 12.4477 18.843 12 19.3953 12C19.9475 12 20.3953 12.4477 20.3953 13V18H21.3953V11Z"
                            fill="rgba(255,255,255,0.8)"
                        ></path>
                    </svg>
                </span>
                <div style="position: absolute; right: 30px">
                    <v-slider
                        :max="300"
                        :min="10"
                        step="1"
                        v-model="zoom"
                        hide-details
                        thumb-size="16px"
                        style="width: 300px; margin-top: 5px"
                    >
                        <template v-slot:append>
                            <span style="font-weight: bold; color: rgba(1, 0, 0, 0.6)">{{
                                zoom + '%'
                            }}</span>
                        </template>
                    </v-slider>
                </div>
            </div>
            <div class="main-area">
                <div class="canvas-container">
                    <canvas
                        id="canvasForPixi"
                        @mousedown="onMouseDown"
                        @mousemove="onMouseMove"
                        @mouseup="onMouseUp"
                    ></canvas>
                    <ElementBox v-if="showElementBox" :box="elementBox"></ElementBox>
                </div>
                <FunctionPanel class="function-sidebar"></FunctionPanel>
                <BrushPanel v-if="selectedFunction === FunctionType.Brush"></BrushPanel>
            </div>
            <div class="bottom-bar">
                <Room></Room>
            </div>
        </div>
        <div id="authing_container" class="authing_container"></div>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Room, FunctionPanel, BrushPanel, ElementBox } from './components';
import { useEditorStore, FunctionType, MouseType } from './Editor.store';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useGuard } from "@authing/guard-vue3";
import type { User } from "@authing/guard-vue3";

const store = useEditorStore();
const { selectedFunction, mouseType, zoom, showElementBox, elementBox } = storeToRefs(store);

const guard = useGuard();

watch(mouseType, () => {
    if (mouseType.value === MouseType.Drag) {
        document.getElementsByTagName('body')[0].style.cursor = 'grab';
    } else {
        document.getElementsByTagName('body')[0].style.cursor = 'auto';
    }
});

watch(zoom, () => {
    store.editor.zoom(zoom.value / 100.0);
});

function onMouseDown(e: MouseEvent) {
    if (mouseType.value === MouseType.Drag) {
        document.getElementsByTagName('body')[0].style.cursor = 'grabbing';
    } else {
        store.editor.onMouseDown(e);
    }
}

function onMouseMove(e: MouseEvent) {
    if (document.getElementsByTagName('body')[0].style.cursor === 'grabbing') {
        store.editor.move(e.movementX, e.movementY);
    } else {
        store.editor.onMouseMove(e);
    }
}

function onMouseUp(e: MouseEvent) {
    if (mouseType.value === MouseType.Drag) {
        document.getElementsByTagName('body')[0].style.cursor = 'grab';
    } else {
        store.editor.onMouseUp(e);
    }
}

onMounted(() => {
    store.editor.pixi(document.getElementById('canvasForPixi') as HTMLCanvasElement);
    guard.start("#authing_container").then((userInfo: User) => {
        console.log("userInfo: ", userInfo);
    });
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}
img {
    -webkit-user-drag: none;
}
span {
    font-family: Andale Mono, monospace;
}

.container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}

.top-bar {
    width: 100vw;
    height: 46px;
    background: linear-gradient(70deg, #ced4f0, #8d9ef2);
    position: absolute;
}

.bottom-bar {
    height: 120px;
    background-color: #fff;
    box-shadow: inset 0px 0 0 4px #000;
    position: absolute;
    bottom: 0px;
    width: 100vw;
}

.main-area {
    position: absolute;
    top: 46px;
    bottom: 120px;
    width: 100vw;
}

.function-sidebar {
    position: absolute;
    width: 68px;
    height: 100%;
    background-color: #1e1c1c;
}

.canvas-container {
    position: absolute;
    left: 68px;
    right: 0px;
    height: 100%;
}

.mouse-cursor {
    width: 40px;
    position: absolute;
    background-color: rgba(128, 128, 128, 0.15);
}
.mouse-cursor:hover {
    background-color: rgba(128, 128, 128, 0.5);
}
.mouse-cursor-selected {
    width: 40px;
    position: absolute;
    background-color: rgba(128, 128, 128, 0.8);
}

.authing_container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
}
</style>
