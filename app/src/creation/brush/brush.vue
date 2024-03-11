<template>
    <div class="function-container">
        <div class="function-item-container" @click="presenter.handlePenClicked">
            <v-tooltip activator="parent" location="right">Pen</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="pen"
                    stroke-width="2"
                    :class="store.brushConfig.type === 'pen' ? 'svg-item-selected' : 'svg-item'"
                ></svg-icon>
            </span>
        </div>
        <div class="function-item-container" @click="presenter.handleHighlighterClicked">
            <v-tooltip activator="parent" location="right">Highlighter</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="highlighter"
                    stroke-width="2"
                    :class="
                        store.brushConfig.type === 'highlighter' ? 'svg-item-selected' : 'svg-item'
                    "
                ></svg-icon>
            </span>
        </div>
        <div class="function-item-container" @click="presenter.handleEraserClicked">
            <v-tooltip activator="parent" location="right">Eraser</v-tooltip>
            <span class="function-item">
                <svg-icon
                    name="eraser"
                    :class="store.brushConfig.type === 'eraser' ? 'svg-item-selected' : 'svg-item'"
                ></svg-icon>
            </span>
        </div>
        <div v-if="store.brushConfig.type === 'pen'">
            <hr style="margin-left: 12px; margin-right: 12px; opacity: 0.7" />
            <div
                v-for="(item, index) in store.brushConfig.penConfigs"
                :class="
                    store.brushConfig.currentPenConfigIndex === index
                        ? 'color-item-container-selected'
                        : 'color-item-container'
                "
                @click="presenter.handlePenConfigClicked(index)"
            >
                <div
                    class="color-item"
                    :style="{
                        width: item.weight + 'px',
                        height: item.weight + 'px',
                        backgroundColor: item.color,
                    }"
                ></div>
            </div>
        </div>
        <div v-if="store.brushConfig.type === 'highlighter'">
            <hr style="margin-left: 12px; margin-right: 12px; opacity: 0.7" />

            <div
                v-for="(item, index) in store.brushConfig.highlighterConfigs"
                :class="
                    store.brushConfig.currentHighlighterConfigIndex === index
                        ? 'color-item-container-selected'
                        : 'color-item-container'
                "
                @click="presenter.handleHighlighterConfigClicked(index)"
            >
                <div
                    class="color-item"
                    :style="{
                        width: item.weight + 'px',
                        height: item.weight + 'px',
                        backgroundColor: item.color,
                    }"
                ></div>
            </div>
        </div>
        <div
            v-if="presenter.showConfigPanel.value"
            style="
                position: absolute;
                left: 55px;
                top: 60px;
                width: 320px;
                height: 430px;
                background-color: white;
                border-radius: 6px;
            "
        >
            <v-slider
                v-model="store.brushConfig.currentWeight"
                style="position: absolute; left: 12px; right: 12px; top: 16px"
                thumb-size="10px"
                min="2"
                max="30"
                :step="1"
            ></v-slider>
            <p style="position: absolute; font-size: 10px; left: 18px; top: 45px">Thickness</p>
            <v-color-picker
                style="position: absolute; left: 12px; right: 12px; top: 80px; border-radius: 0px"
                v-model="store.brushConfig.currentColor"
            ></v-color-picker>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useCreationStore } from '../../store/creation';
import usePresenter from './brush-presenter';

const store = useCreationStore();

const presenter = usePresenter();
</script>

<style lang="less" scoped>
@width: 50px;
@height: 280px;
@margin: 5px;
@itemHeight: 40px;
.function-container {
    position: absolute;
    left: 68px;
    top: 220px;
    width: @width;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.function-item-container {
    box-sizing: border-box;
    margin: @margin;
    height: @itemHeight;
    width: @width - (2 * @margin);
}

.function-item {
    display: inline-block;
    box-sizing: border-box;
    margin: @margin;
    height: @itemHeight - (2 * @margin);
    width: @width - (4 * @margin);
}

.svg-item {
    color: black;
    &:hover {
        color: blue;
    }
}

.svg-item-selected {
    color: blue;
}

.color-item-container {
    box-sizing: border-box;
    display: flex;
    margin: 8px;
    height: 35px;
    width: 35px;
    border: 1px solid rgba(5, 0, 56, 0.2);
    border-radius: 50%;
    justify-content: center;
    align-items: center;
}

.color-item-container-selected {
    &:extend(.color-item-container);
    border: 2px solid #4262ff;
}

.color-item {
    box-sizing: border-box;
    height: 2px;
    width: 2px;
    background-color: black;
    border: 1px solid rgba(5, 0, 56, 0.2);
    border-radius: 50%;
}
</style>
