<template>
    <div class="user-container">
        <div
            class="user-item-container"
            :style="{ border: 'solid ' + self.color + ' 2px' }"
            v-tooltip.bottom="self.name"
        >
            <span class="text-content">
                {{ self.name[0].toUpperCase() }}
            </span>
        </div>
        <div
            style="
                border: 0.5px solid rgba(0, 0, 0, 0.2);
                height: 25px;
                margin-top: 3px;
                margin-left: 1px;
                margin-right: 3px;
            "
            v-if="others.length > 0"
        ></div>
        <div
            class="user-item-container"
            v-if="others.length > 0"
            :style="{ border: 'solid ' + others[0].color + ' 2px' }"
            v-tooltip.bottom="others[0].name"
        >
            <span class="text-content">
                {{ others[0].name[0].toUpperCase() }}
            </span>
        </div>
        <div
            class="user-item-container"
            style="background-color: white; border: solid #dbd9d9 2px"
            v-if="others.length > 1"
            v-tooltip.bottom="others.length - 1 + ' others'"
        >
            <span class="text-content">
                {{ '+' + (others.length - 1) }}
            </span>
        </div>

        <div class="share-container" v-tooltip.bottom="'Shared with others'">
            <span class="text-content" style="color: white"> Share </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/User.store';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();

const { self, others } = storeToRefs(userStore);
</script>

<style lang="less" scoped>
@import url('../style/Variables.less');
@import url('../style/Common.less');
.user-container {
    display: flex;
    position: absolute;
    padding: 10px;
    right: 24px;
    top: 12px;
    height: 50px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
}

.user-item-container {
    .g-center();
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: aquamarine;
    border-radius: 50%;
}

.share-container {
    box-sizing: border-box;
    .g-center();
    width: 55px;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: blueviolet;
    border-radius: 4px;
    &:hover {
        background-color: blue;
    }
}

.text-content {
    font-size: 16px;
    font-family: @g-font-family;
}
</style>
