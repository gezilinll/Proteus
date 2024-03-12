<template>
    <div class="function-container" @click="presenter.handleFitToScreenClicked">
        <div class="function-item-container">
            <v-tooltip activator="parent" location="top">Fit to screen</v-tooltip>
            <span class="function-item">
                <svg-icon name="fit-to-screen" stroke-width="2" width="2em" height="2em"></svg-icon>
            </span>
        </div>
        <div class="function-item-container" @click="presenter.handleZoomOutClicked">
            <v-tooltip activator="parent" location="top">Zoom out</v-tooltip>
            <span class="function-item">
                <svg-icon name="zoom-out" width="2em" height="2em"></svg-icon>
            </span>
        </div>
        <div class="function-item-container" @click="presenter.handleZoomTo100Clicked">
            <v-tooltip activator="parent" location="top">Zoom to 100%</v-tooltip>
            <div class="function-item">
                <p class="content zoom-value">
                    {{ presenter.currentZoom.value + '%' }}
                </p>
            </div>
        </div>
        <div class="function-item-container" @click="presenter.handleZoomInClicked">
            <v-tooltip activator="parent" location="top">Zoom in</v-tooltip>
            <span class="function-item">
                <svg-icon name="zoom-in" width="2em" height="2em"></svg-icon>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import usePresenter from './toolbox-presenter';

const presenter = usePresenter();
</script>

<style lang="less" scoped>
@import url('../style/variables.less');
@import url('../style/common.less');

@height: 50px;
@itemSize: 40px;
@margin: 5px;
.function-container {
    display: flex;
    position: absolute;
    right: 24px;
    bottom: 12px;
    width: 200px;
    height: 50px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.function-item-container {
    box-sizing: border-box;
    margin: @margin;
    width: @itemSize;
    height: @itemSize;
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
}

.function-item {
    .g-center();
    box-sizing: border-box;
    margin: @margin;
    height: @itemSize - (2 * @margin);
    width: @itemSize - (2 * @margin);
}

.content {
    &:hover {
        color: blue;
    }
}

.zoom-value {
    font-size: 18px;
    font-family: 'Gill Sans', sans-serif;
}
</style>
./ToolsBarPresenter ./toolbox-presenter
