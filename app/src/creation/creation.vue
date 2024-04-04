<template>
    <div class="function-container">
        <div
            :class="
                editor.mouseType === 'select'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleSelectClicked"
        >
            <v-tooltip activator="parent" location="right">Select</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="selector"
                    :color="editor.mouseType === 'select' ? 'blue' : 'black'"
                ></svg-icon>
            </span>
        </div>
        <div
            :class="
                editor.mouseType === 'grab'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleGrabClicked"
        >
            <v-tooltip activator="parent" location="right">Drag this board</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="grab"
                    viewBox="0 0 36 36"
                    width="30px"
                    height="30px"
                    :color="editor.mouseType === 'grab' ? 'blue' : 'black'"
                ></svg-icon>
            </span>
        </div>
        <div
            :class="
                editor.mouseType === 'brush'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleBrushClicked"
        >
            <v-tooltip activator="parent" location="right">Pen</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="brush"
                    :stroke="editor.mouseType === 'brush' ? 'blue' : 'black'"
                    strokeWidth="2"
                    :color="editor.mouseType === 'brush' ? 'blue' : 'black'"
                ></svg-icon>
            </span>
        </div>
        <div
            :class="
                editor.mouseType === 'text'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleTextClicked"
        >
            <v-tooltip activator="parent" location="right">Text</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="text"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    :color="editor.mouseType === 'text' ? 'blue' : 'black'"
                ></svg-icon>
            </span>
        </div>

        <div
            :class="
                editor.mouseType === 'shape'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleShapeClicked"
        >
            <v-tooltip activator="parent" location="right">Shape</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="shape"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    :color="editor.mouseType === 'shape' ? 'blue' : 'black'"
                ></svg-icon>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useBoardStore } from '@blitz/editor';

import usePresenter from './creation-presenter';
const editor = useBoardStore();

const presenter = usePresenter();
</script>

<style lang="less" scoped>
@width: 50px;
@height: 500px;
@margin: 5px;
@itemHeight: 40px;
.function-container {
    position: absolute;
    left: 8px;
    top: 180px;
    width: @width;
    height: @height;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.function-item-container {
    box-sizing: border-box;
    margin: @margin;
    height: @itemHeight;
    width: @width - (2 * @margin);
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
}

.function-item-container-selected {
    &:extend(.function-item-container);
    background-color: rgba(0, 0, 255, 0.2);
    border-radius: 2px;
}

.function-item {
    display: inline-block;
    box-sizing: border-box;
    margin: @margin;
    height: @itemHeight - (2 * @margin);
    width: @width - (4 * @margin);
}
</style>
