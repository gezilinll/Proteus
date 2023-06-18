<template>
    <div style="position: relative">
        <div
            style="
                position: absolute;
                width: 150px;
                top: 0;
                bottom: 0;
                left: 68px;
                display: flex;
                justify-content: center;
                align-items: center;
            "
        >
            <div
                v-if="selectedFunction === FunctionType.Draw"
                style="
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
                "
            >
                <div style="-webkit-clip-path: polygon(0 0, 150% 0, 150% 100%, 0% 100%)">
                    <span aria-hidden="true" class="brush-type">
                        <img src="../assets/draw-pen.svg" />
                    </span>
                </div>
            </div>
        </div>
        <div
            :class="[
                'function-container',
                selectedFunction === FunctionType.Draw ? 'function-container-selected' : '',
            ]"
            @click="useDrawFunction"
        >
            <span :class="['function-item', isSelected ? 'function-item-selected' : '']">
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
import { ref } from 'vue';
import { useEditorStore, FunctionType } from '../Editor.store';
import { storeToRefs } from 'pinia';

const store = useEditorStore();
const { selectedFunction } = storeToRefs(store);

const isSelected = ref<boolean>(false);

function useDrawFunction() {
    selectedFunction.value = FunctionType.Draw;
}
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

.function-item:hover {
    color: #fff;
}

.function-item-selected {
    color: #fff;
}

.brush-type {
    color: rgb(45, 144, 235);
    margin-left: -70px;
    cursor: pointer;
    transition: margin-left 100ms linear;
}

.brush-type:hover {
    margin-left: -20px;
}
</style>
