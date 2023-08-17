<template>
    <div class="user-container">
        <div
            class="user-item-container"
            :title="presenter.model.self.value.nickName"
            @click="presenter.fakeOtherLogin"
        >
            <span> {{ presenter.model.self.value.nickName }} </span>
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
            v-if="presenter.model.others.value.length > 0"
            v-for="user in presenter.model.others.value"
            :title="user.nickName"
        >
            <span> {{ user.nickName }} </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import usePresenter from './UserPanelPresenter';

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
    border: solid #5b6dcd 2px;
    border-color: black;
}
</style>
