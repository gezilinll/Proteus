<template>
    <div class="function-container">
        <div
            :class="
                model.type.value === 'selector'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleSelectorClicked"
        >
            <span class="function-item">
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                    data-testid="svg-icon"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M7 19l4.394-2.59 1.86 4.661a1 1 0 0 0 1.3.558l.499-.2a1 1 0 0 0 .557-1.3l-1.86-4.66L18.5 14 7 2v17z"
                        fill-rule="evenodd"
                        fill="currentColor"
                    ></path>
                </svg>
            </span>
        </div>
        <div
            :class="
                model.type.value === 'grab'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleGrabClicked"
        >
            <span class="function-item">
                <svg
                    width="30px"
                    height="30px"
                    viewBox="0 0 36 36"
                    version="1.1"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                    <path
                        d="M28.09,9.74a4,4,0,0,0-1.16.19c-.19-1.24-1.55-2.18-3.27-2.18A4,4,0,0,0,22.13,8,3.37,3.37,0,0,0,19,6.3a3.45,3.45,0,0,0-2.87,1.32,3.65,3.65,0,0,0-1.89-.51A3.05,3.05,0,0,0,11,9.89v.91c-1.06.4-4.11,1.8-4.91,4.84s.34,8,2.69,11.78a25.21,25.21,0,0,0,5.9,6.41.9.9,0,0,0,.53.17H25.55a.92.92,0,0,0,.55-.19,13.13,13.13,0,0,0,3.75-6.13A25.8,25.8,0,0,0,31.41,18v-5.5A3.08,3.08,0,0,0,28.09,9.74ZM29.61,18a24,24,0,0,1-1.47,9.15A12.46,12.46,0,0,1,25.2,32.2H15.47a23.75,23.75,0,0,1-5.2-5.72c-2.37-3.86-3-8.23-2.48-10.39A5.7,5.7,0,0,1,11,12.76v7.65a.9.9,0,0,0,1.8,0V9.89c0-.47.59-1,1.46-1s1.49.52,1.49,1v5.72h1.8V8.81c0-.28.58-.71,1.46-.71s1.53.48,1.53.75v6.89h1.8V10l.17-.12a2.1,2.1,0,0,1,1.18-.32c.93,0,1.5.44,1.5.68l0,6.5H27V11.87a1.91,1.91,0,0,1,1.12-.33c.86,0,1.52.51,1.52.94Z"
                        class="clr-i-outline clr-i-outline-path-1"
                    ></path>
                    <rect x="0" y="0" width="36" height="36" fill-opacity="0" />
                </svg>
            </span>
        </div>
        <div
            :class="
                model.type.value === 'brush'
                    ? 'function-item-container-selected'
                    : 'function-item-container'
            "
            @click="presenter.handleBrushClicked"
        >
            <span class="function-item">
                <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="2"
                        stroke="currentColor"
                        d="M13.4097 2.80282L19 18.1762V24C19 24.5523 18.5523 25 18 25H6C5.44771 25 5 24.5523 5 24V18.1762L10.5903 2.80282C11.069 1.48631 12.931 1.4863 13.4097 2.80282Z"
                    ></path>
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="2"
                        stroke="currentColor"
                        d="M8.57141 9H15.4286"
                    ></path>
                </svg>
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import usePresenter from './FunctionPresenter';
import { useAppStore } from '../App.store';

const presenter = usePresenter();
const { model } = presenter;
const appStore = useAppStore();

watch(
    () => model.type.value,
    () => {
        if (model.type.value === 'selector') {
            document.getElementsByTagName('body')[0].style.cursor = 'auto';
        } else if (model.type.value === 'grab') {
            document.getElementsByTagName('body')[0].style.cursor = 'grab';
        } else if (model.type.value === 'brush') {
            document.getElementsByTagName('body')[0].style.cursor =
                'url("cursor-brush.png") 0 10, auto';
        }
        appStore.functionType = model.type.value;
    }
);
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
    }
}

.function-item-container-selected {
    &:extend(.function-item-container);
    background-color: rgba(0, 0, 255, 0.2);
}

.function-item {
    display: inline-block;
    box-sizing: border-box;
    margin: @margin;
    height: @itemHeight - (2 * @margin);
    width: @width - (4 * @margin);
}
</style>
