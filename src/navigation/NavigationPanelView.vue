<template>
    <div class="navi-container">
        <div class="logo-container">
            <span class="logo">
                <img src="logo.svg" />
            </span>
        </div>
        <div
            style="
                border: 0.5px solid rgba(0, 0, 0, 0.2);
                height: 35px;
                margin-top: 8px;
                margin-left: 1px;
                margin-right: 1px;
            "
        ></div>
        <div class="title-container">
            <span class="title"> Untitled</span>
        </div>
        <div
            style="
                border: 0.5px solid rgba(0, 0, 0, 0.2);
                height: 35px;
                margin-top: 8px;
                margin-left: 1px;
                margin-right: 1px;
            "
        ></div>
        <div class="function-item-container">
            <span class="function-item">
                <svg viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_1908_1049)">
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M21 13v6c0 .5523-.4477 1-1 1h-16c-.5523 0-1-.4477-1-1v-6m9 1v-11m0 0 4 4.5m-4-4.5-4 4.5"
                        ></path>
                    </g>
                    <defs>
                        <clipPath id="clip0_1908_1049">
                            <path fill="none" d="M0 0h24v24h-24z"></path>
                        </clipPath>
                    </defs>
                </svg>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
@height: 50px;
@itemSize: 40px;
@margin: 5px;
.navi-container {
    display: flex;
    position: absolute;
    left: 8px;
    top: 12px;
    height: 50px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.logo-container {
    box-sizing: border-box;
    margin: @margin;
    width: @itemSize * 2;
    height: @itemSize;
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
}

.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: @margin;
    height: @itemSize - (2 * @margin);
}

.title-container {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: @margin;
    margin-left: @margin * 2;
    margin-right: @margin * 2;
    padding-left: @margin;
    padding-right: @margin;
    padding-top: 5px;
    height: @itemSize;
    font-size: 18px;
    &:hover {
        background-color: rgba(0, 0, 255, 0.1);
        border-radius: 2px;
    }
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
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin: @margin;
    padding: 3px;
    height: @itemSize - (2 * @margin);
    width: @itemSize - (2 * @margin);
}
</style>
