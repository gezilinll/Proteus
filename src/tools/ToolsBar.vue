<template>
    <div class="function-container" @click="presenter.handleFitToScreenClicked">
        <div class="function-item-container" v-tooltip.top="'Fit to screen'">
            <span class="function-item">
                <svg
                    class="content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2">
                        <path d="M2 6v12V6zm20 0v12V6zM6 12h12"></path>
                        <path stroke-linecap="round" d="m8 9-3 3 3 3m8-6 3 3-3 3"></path>
                    </g>
                </svg>
            </span>
        </div>
        <div
            class="function-item-container"
            @click="presenter.handleZoomOutClicked"
            v-tooltip.top="'Zoom out'"
        >
            <span class="function-item">
                <svg
                    class="content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path fill="currentColor" d="M18 13H6a1 1 0 0 1 0-2h12a1 1 0 0 1 0 2z"></path>
                </svg>
            </span>
        </div>
        <div
            class="function-item-container"
            @click="presenter.handleZoomTo100Clicked"
            v-tooltip.top="'Zoom to 100%'"
        >
            <div class="function-item">
                <p class="content zoom-value">
                    {{ model.current.value + '%' }}
                </p>
            </div>
        </div>
        <div
            class="function-item-container"
            @click="presenter.handleZoomInClicked"
            v-tooltip.top="'Zoom in'"
        >
            <span class="function-item">
                <svg
                    class="content"
                    xmlns="http://www.w3.org/2000/svg"
                    width="2em"
                    height="2em"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        fill="currentColor"
                        d="M18 13h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5V6a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                    ></path>
                </svg>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import usePresenter from './ToolsBarPresenter';

const presenter = usePresenter();
const { model } = presenter;
</script>

<style lang="less" scoped>
@import url('../style/Variables.less');
@import url('../style/Common.less');

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
./ToolsBarPresenter
