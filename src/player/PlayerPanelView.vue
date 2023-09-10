<template>
    <div class="user-container">
        <div
            class="user-item-container"
            :style="{ border: 'solid ' + presenter.model.self.value.color + ' 2px' }"
            :title="presenter.model.self.value.userName"
            @click="presenter.fakeOtherLogin"
        >
            <span> {{ presenter.model.self.value.userName[0].toUpperCase() }} </span>
        </div>
        <div
            style="
                border: 0.5px solid rgba(0, 0, 0, 0.3);
                height: 25px;
                margin-top: 3px;
                margin-left: 3px;
                margin-right: 3px;
            "
            v-if="presenter.model.others.value.length > 0"
        ></div>
        <div
            class="user-item-container"
            :style="{ border: 'solid ' + presenter.model.others.value[0].color + ' 2px' }"
            v-if="presenter.model.others.value.length > 0"
            :title="presenter.model.others.value[0].userName"
        >
            <span> {{ presenter.model.others.value[0].userName[0] }} </span>
        </div>
        <div
            class="user-item-container"
            style="background-color: white; border: solid #dbd9d9 2px"
            v-if="presenter.model.others.value.length > 1"
            :title="presenter.model.others.value[0].userName"
        >
            <span style="font-size: 10px; font-weight: bold">
                {{ '+' + (presenter.model.others.value.length - 1) }}
            </span>
        </div>
        <div class="share-container">
            <span style="color: white; font-size: 14px; font-weight: bold"> Share </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import usePresenter from './PlayerPanelPresenter';

const presenter = usePresenter();
</script>

<style lang="less" scoped>
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
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    background-color: aquamarine;
    border-radius: 50%;
}

.share-container {
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
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
</style>
./PlayerPanelPresenter
