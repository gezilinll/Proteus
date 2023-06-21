<template>
    <div>
        <div class="brush-panel">
            <span
                aria-hidden="true"
                :class="['brush-type', brushType === BrushType.Pen ? 'brush-type-selected' : '']"
                @click="brushType = BrushType.Pen"
            >
                <img src="../assets/draw-pen.svg" />
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="['brush-type', brushType === BrushType.Marker ? 'brush-type-selected' : '']"
                @click="brushType = BrushType.Marker"
            >
                <img src="../assets/draw-marker.svg" />
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="[
                    'brush-type',
                    brushType === BrushType.Highlighter ? 'brush-type-selected' : '',
                ]"
                @click="brushType = BrushType.Highlighter"
            >
                <img src="../assets/draw-highlighter.svg" />
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="['brush-type', brushType === BrushType.Eraser ? 'brush-type-selected' : '']"
                @click="brushType = BrushType.Eraser"
            >
                <img src="../assets/draw-eraser.svg" />
            </span>
            <br />
            <br />
            <div
                :class="[
                    'brush-color',
                    brushConfig === BrushConfig.Color ? 'brush-color-selected' : '',
                ]"
                @click="
                    brushConfig =
                        brushConfig === BrushConfig.Color ? BrushConfig.None : BrushConfig.Color
                "
            ></div>
            <br />
            <br />
            <span aria-hidden="true" class="brush-settings">
                <img src="../assets/draw-settings.svg" />
            </span>
        </div>
        <v-color-picker
            style="margin-left: 480px; margin-top: 180px"
            v-model="brushColor"
            v-if="brushConfig === BrushConfig.Color"
        ></v-color-picker>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEditorStore, BrushType, BrushConfig } from '../Editor.store';
import { storeToRefs } from 'pinia';

const store = useEditorStore();
const { brushType, brushConfig } = storeToRefs(store);

const brushColor = ref(store.penColor);
watch(brushType, () => {
    if (brushType.value === BrushType.Pen) {
        brushColor.value = store.penColor;
    } else if (brushType.value === BrushType.Marker) {
        brushColor.value = store.markerColor;
    } else if (brushType.value === BrushType.Highlighter) {
        brushColor.value = store.highlighterColor;
    }
});
watch(brushColor, () => {
    if (brushType.value === BrushType.Pen) {
        store.penColor = brushColor.value;
    } else if (brushType.value === BrushType.Marker) {
        store.markerColor = brushColor.value;
    } else if (brushType.value === BrushType.Highlighter) {
        store.highlighterColor = brushColor.value;
    }
});
</script>

<style>
.brush-panel {
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
    background-color: v-bind(brushColor);
    border-radius: 5px;
    margin-left: 38px;
    transition: box-shadow 0.3s ease;
}

.brush-color:hover,
.brush-color-selected {
    box-shadow: inset 0px 0 0 4px #000;
}

.brush-settings {
    margin-left: 38px;
}
</style>
