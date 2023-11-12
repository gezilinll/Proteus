<template>
    <div class="function-container">
        <div
            class="function-item-container"
            @click="presenter.handlePenClicked"
            v-tooltip.right="'Pen'"
        >
            <span class="function-item">
                <svg
                    :class="model.selected.value === 'pen' ? 'svg-item-selected' : 'svg-item'"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
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
        <div
            class="function-item-container"
            @click="presenter.handleHighlighterClicked"
            v-tooltip.right="'Highlighter'"
        >
            <span class="function-item">
                <svg
                    :class="
                        model.selected.value === 'highlighter' ? 'svg-item-selected' : 'svg-item'
                    "
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="2"
                        stroke="currentColor"
                        d="M18 13V14H19H19.1479C19.6705 14 20.1049 14.4023 20.145 14.9233L20.9201 25L3.07988 25L3.85501 14.9233C3.89508 14.4023 4.32953 14 4.85206 14H5H6V13V11.0002C6 10.4467 6.44716 10.0001 6.99837 10.0001H6.9984L17.0017 10.0001H17.0017C17.5529 10.0001 18 10.4467 18 11.0001V13Z"
                    ></path>
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        stroke-width="2"
                        stroke="currentColor"
                        d="M8 9C8 9.55228 8.44772 10 9 10H15C15.5523 10 16 9.55228 16 9V3.43961C16 2.80856 15.4227 2.33527 14.8039 2.45903L8.80389 3.65903C8.33646 3.75251 8 4.16293 8 4.63961V9Z"
                    ></path>
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        d="M17 13V15H7V13H17Z"
                    ></path>
                </svg>
            </span>
        </div>
        <div
            class="function-item-container"
            @click="presenter.handleEraserClicked"
            v-tooltip.right="'Eraser'"
        >
            <span class="function-item">
                <svg
                    viewBox="0 0 24 24"
                    :class="model.selected.value === 'eraser' ? 'svg-item-selected' : 'svg-item'"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        d="M6.32843 20L5.62132 20.7071L5.91421 21L6.32843 21L6.32843 20ZM11.9853 20L11.9853 21H11.9853V20ZM17.6421 21C18.1944 21 18.6421 20.5523 18.6421 20C18.6421 19.4477 18.1944 19 17.6421 19V21ZM17.6421 14.3431L18.3492 15.0503L18.3492 15.0503L17.6421 14.3431ZM3.5 14.3431L4.20711 15.0503L3.5 14.3431ZM20.4706 8.68629L19.7635 9.3934L19.7635 9.3934L20.4706 8.68629ZM20.4706 11.5147L19.7635 10.8076L19.7635 10.8076L20.4706 11.5147ZM16.2279 4.44365L16.935 3.73654L16.935 3.73654L16.2279 4.44365ZM13.3995 4.44365L12.6924 3.73654L12.6924 3.73654L13.3995 4.44365ZM15.5208 5.15076L19.7635 9.3934L21.1777 7.97919L16.935 3.73654L15.5208 5.15076ZM7.03553 19.2929L4.20711 16.4645L2.79289 17.8787L5.62132 20.7071L7.03553 19.2929ZM11.9853 19L6.32843 19L6.32843 21L11.9853 21L11.9853 19ZM11.9853 21H17.6421V19H11.9853V21ZM4.20711 15.0503L11.2782 7.97918L9.86396 6.56497L2.79289 13.636L4.20711 15.0503ZM11.2782 7.97918L14.1066 5.15076L12.6924 3.73654L9.86396 6.56497L11.2782 7.97918ZM19.7635 10.8076L16.935 13.636L18.3492 15.0503L21.1777 12.2218L19.7635 10.8076ZM16.935 13.636L11.2782 19.2929L12.6924 20.7071L18.3492 15.0503L16.935 13.636ZM9.86396 7.97918L16.935 15.0503L18.3492 13.636L11.2782 6.56497L9.86396 7.97918ZM4.20711 16.4645C3.81658 16.0739 3.81658 15.4408 4.20711 15.0503L2.79289 13.636C1.62132 14.8076 1.62132 16.7071 2.79289 17.8787L4.20711 16.4645ZM19.7635 9.3934C20.154 9.78392 20.154 10.4171 19.7635 10.8076L21.1777 12.2218C22.3492 11.0503 22.3492 9.15076 21.1777 7.97918L19.7635 9.3934ZM16.935 3.73654C15.7635 2.56497 13.864 2.56497 12.6924 3.73654L14.1066 5.15076C14.4971 4.76023 15.1303 4.76023 15.5208 5.15076L16.935 3.73654Z"
                    ></path>
                </svg>
            </span>
        </div>
        <div v-if="model.selected.value === 'pen'">
            <hr style="margin-left: 12px; margin-right: 12px; opacity: 0.7" />
            <div
                v-for="(item, index) in model.penConfigs"
                :class="
                    model.penConfigIndex.value === index
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
        <div v-if="model.selected.value === 'highlighter'">
            <hr style="margin-left: 12px; margin-right: 12px; opacity: 0.7" />

            <div
                v-for="(item, index) in model.highlighterConfigs"
                :class="
                    model.highlighterConfigIndex.value === index
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
            v-if="model.showConfigPanel.value"
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
                v-model="model.brushWeight.value"
                style="position: absolute; left: 12px; right: 12px; top: 16px"
                thumb-size="10px"
                min="2"
                max="30"
                :step="1"
            ></v-slider>
            <p style="position: absolute; font-size: 10px; left: 18px; top: 45px">Thickness</p>
            <v-color-picker
                style="position: absolute; left: 12px; right: 12px; top: 80px; border-radius: 0px"
                v-model="model.brushColor.value"
            ></v-color-picker>
        </div>
    </div>
</template>

<script lang="ts" setup>
import usePresenter from './BrushBarPresenter';

const presenter = usePresenter();
const { model } = presenter;
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
