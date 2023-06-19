<template>
    <div style="position: relative">
        <div class="function-panel-container">
            <div v-if="selectedFunction === FunctionType.Draw" class="draw-panel">
                <span
                    aria-hidden="true"
                    :class="['brush-type', drawType === DrawType.Pen ? 'brush-type-selected' : '']"
                    @click="drawType = DrawType.Pen"
                >
                    <img src="../assets/draw-pen.svg" />
                </span>
                <br />
                <br />
                <span
                    aria-hidden="true"
                    :class="[
                        'brush-type',
                        drawType === DrawType.Marker ? 'brush-type-selected' : '',
                    ]"
                    @click="drawType = DrawType.Marker"
                >
                    <img src="../assets/draw-marker.svg" />
                </span>
                <br />
                <br />
                <span
                    aria-hidden="true"
                    :class="[
                        'brush-type',
                        drawType === DrawType.Highlighter ? 'brush-type-selected' : '',
                    ]"
                    @click="drawType = DrawType.Highlighter"
                >
                    <img src="../assets/draw-highlighter.svg" />
                </span>
                <br />
                <br />
                <span
                    aria-hidden="true"
                    :class="[
                        'brush-type',
                        drawType === DrawType.Eraser ? 'brush-type-selected' : '',
                    ]"
                    @click="drawType = DrawType.Eraser"
                >
                    <img src="../assets/draw-eraser.svg" />
                </span>
                <br />
                <br />
                <div class="brush-color"></div>
                <br />
                <br />
                <span aria-hidden="true" class="brush-settings">
                    <img src="../assets/draw-settings.svg" />
                </span>
            </div>
        </div>
        <div
            :class="[
                'function-container',
                selectedFunction === FunctionType.Draw ? 'function-container-selected' : '',
            ]"
            @click="selectedFunction = FunctionType.Draw"
        >
            <span
                :class="[
                    'function-item',
                    selectedFunction === FunctionType.Draw ? 'function-item-selected' : '',
                ]"
            >
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M5.625 13.5H8.25a.75.75 0 0 0 0-1.5H5.625a2.625 2.625 0 1 0 0 5.25h10.5a1.125 1.125 0 0 1 0 2.25H11.25a.75.75 0 1 0 0 1.5h4.875a2.625 2.625 0 1 0 0-5.25h-10.5a1.125 1.125 0 0 1 0-2.25Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M17.25 3a.75.75 0 0 0-.529.221l-4.683 4.68a5.226 5.226 0 0 0-1.538 3.724v1.125a.75.75 0 0 0 .75.75h1.125a5.22 5.22 0 0 0 3.713-1.537l4.69-4.684A.75.75 0 0 0 21 6.75 3.75 3.75 0 0 0 17.25 3Zm-2.212 7.901A3.724 3.724 0 0 1 12.375 12H12v-.375A3.722 3.722 0 0 1 13.1 8.974l4.444-4.455A2.25 2.25 0 0 1 19.5 6.457l-4.462 4.444Z"
                        fill="currentColor"
                    ></path>
                </svg>
                <br />
                Draw
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore, FunctionType, DrawType } from '../Editor.store';
import { storeToRefs } from 'pinia';

const store = useEditorStore();
const { selectedFunction, drawType } = storeToRefs(store);
</script>

<style>
.function-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 58px;
}

.function-container:hover {
    cursor: pointer;
}

.function-container-selected {
    background-color: #333;
}

.function-item {
    color: #aaa;
}

.function-item:hover,
.function-item-selected {
    color: #fff;
}

.function-panel-container {
    position: absolute;
    width: 150px;
    top: 0;
    bottom: 0;
    left: 68px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.draw-panel {
    margin-left: 8px;
    border-radius: 10px;
    position: absolute;
    background-color: #333;
    top: 50px;
    bottom: 50px;
    left: 00px;
    right: 0px;
    padding-top: 18px;
    padding-bottom: 18px;
    -webkit-clip-path: polygon(0 0, 150% 0, 150% 100%, 0% 100%);
}

.brush-type {
    margin-left: -70px;
    cursor: pointer;
    transition: margin-left 100ms linear;
}

.brush-type:hover,
.brush-type-selected {
    margin-left: -10px;
}

.brush-color {
    width: 48px;
    height: 48px;
    background-color: #eaeaea;
    border-radius: 5px;
    margin-left: 38px;
    transition: box-shadow 0.3s ease;
}

.brush-color:hover {
    box-shadow: inset 0px 0 0 4px #000;
}

.brush-settings {
    margin-left: 38px;
}
</style>
