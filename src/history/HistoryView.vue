<template>
    <div class="root-container">
        <div class="history-container">
            <h1 style="margin-left: 16px; margin-top: 16px">Recent boards</h1>
            <div class="record-list-container" v-if="!presenter.isLoading.value">
                <div class="create-record-container" @click="presenter.createBoard()">
                    <span class="create-record-icon-container">
                        <svg
                            fill="#ffffff"
                            width="64px"
                            height="64px"
                            viewBox="0 0 64 64"
                            version="1.1"
                            stroke="#ffffff"
                        >
                            <g>
                                <g>
                                    <path
                                        d="M30.034,29.948l0,-21.983l3.741,0l0,21.983l22.203,0l0,3.741l-22.203,0l0,22.203l-3.741,0l0,-22.203l-22.008,0l0,-3.741l22.008,0Z"
                                    />
                                </g>
                            </g>
                        </svg>
                    </span>
                    <span class="create-record-title-container" style="color: white"
                        >New board</span
                    >
                </div>
                <div
                    class="record-container"
                    v-for="(item, index) in model.records.value"
                    @click="presenter.openBoard(index)"
                >
                    <span class="record-icon-container">
                        <svg
                            width="120px"
                            height="120px"
                            viewBox="0 0 24 24"
                            enable-background="new 0 0 24 24"
                        >
                            <g id="Layer_6">
                                <g>
                                    <path
                                        d="M10,17v4c0,0.55-0.45,1-1,1H6c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1h3C9.55,16,10,16.45,10,17z"
                                        fill="#D34A4B"
                                    />
                                </g>
                                <g>
                                    <path
                                        d="M19,17v4c0,0.55-0.45,1-1,1h-3c-0.55,0-1-0.45-1-1v-4c0-0.55,0.45-1,1-1h3C18.55,16,19,16.45,19,17z"
                                        fill="#D34A4B"
                                    />
                                </g>
                                <g>
                                    <path
                                        d="M22,3v14c0,0.55-0.45,1-1,1H3c-0.55,0-1-0.45-1-1V3c0-0.55,0.45-1,1-1h18C21.55,2,22,2.45,22,3z"
                                        fill="#B0DA50"
                                    />
                                </g>
                                <path
                                    d="   M9,6"
                                    fill="none"
                                    stroke="#000000"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-miterlimit="10"
                                    stroke-width="2"
                                />
                                <g>
                                    <circle cx="7.5" cy="6.5" fill="#346EA1" r="1.5" />
                                    <path
                                        d="M17.4141,13l0.293-0.293c0.3906-0.3906,0.3906-1.0234,0-1.4141s-1.0234-0.3906-1.4141,0L16,11.5859    l-0.293-0.293c-0.3906-0.3906-1.0234-0.3906-1.4141,0s-0.3906,1.0234,0,1.4141L14.5859,13l-0.293,0.293    c-0.3906,0.3906-0.3906,1.0234,0,1.4141C14.4883,14.9023,14.7441,15,15,15s0.5117-0.0977,0.707-0.293L16,14.4141l0.293,0.293    C16.4883,14.9023,16.7441,15,17,15s0.5117-0.0977,0.707-0.293c0.3906-0.3906,0.3906-1.0234,0-1.4141L17.4141,13z"
                                        fill="#346EA1"
                                    />
                                    <path
                                        d="M15.0049,9.0996C15.0557,9.6133,15.4893,10,15.999,10c0.0273,0,0.0557-0.001,0.084-0.0039    c0.5508-0.0459,0.959-0.5283,0.9131-1.0791C16.8838,7.5625,15.4854,5,11,5c-0.5527,0-1,0.4473-1,1s0.4473,1,1,1    C14.6201,7,14.9756,8.8691,15.0049,9.0996z"
                                        fill="#346EA1"
                                    />
                                </g>
                            </g>
                        </svg>
                    </span>
                    <span class="record-title-container" style="color: black">{{
                        item.title
                    }}</span>
                </div>
            </div>

            <div class="progress-container" v-if="presenter.isLoading.value">
                <v-progress-circular
                    :size="120"
                    :width="7"
                    color="purple"
                    indeterminate
                ></v-progress-circular>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import usePresenter from './HistoryPresenter';

const presenter = usePresenter();

const { model } = presenter;

onMounted(() => {
    presenter.loadRecordList();
});
</script>

<style lang="less" scoped="true">
.root-container {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.3);
}

.history-container {
    width: 1080px;
    height: 720px;
    border-radius: 8px;
    background-color: white;
}

.record-list-container {
    display: flex;
    flex-flow: row wrap;
    margin: 16px;
    width: 1050px;
    overflow-y: auto;
    max-height: 600px;
}

.create-record-container {
    margin: 8px;
    width: 180px;
    height: 220px;
    background-color: #4262ff;
    border-radius: 4px;
    &:hover {
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
        cursor: pointer;
    }
}

.create-record-icon-container {
    width: 180px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.create-record-title-container {
    width: 180px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.record-container {
    box-sizing: content-box;
    margin: 8px;
    width: 180px;
    height: 220px;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    &:hover {
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
        cursor: pointer;
    }
}

.record-icon-container {
    width: 180px;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px 4px 0px 0px;
    background-color: #edfff2;
}

.record-title-container {
    width: 180px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.progress-container {
    width: 1080px;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
