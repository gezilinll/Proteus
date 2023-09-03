<template>
    <div class="root-container">
        <div class="login-container">
            <div><h1>Register or Login in</h1></div>
            <div v-if="store.isTourist() && !presenter.isLoading()">
                <div>
                    <h4 style="font-size: 12px; color: rgba(0, 0, 0, 0.65)">
                        Create or log in to your account using your existing social media account.
                    </h4>
                </div>
                <br />
                <div
                    class="login-item"
                    style="background-color: rgb(63, 63, 63)"
                    @click="presenter.requestGithubAuth"
                >
                    <span style="margin-top: 5px">
                        <svg
                            fill="#000000"
                            width="30px"
                            height="30px"
                            viewBox="-518.4 -518.4 2956.80 2956.80"
                            xmlns="http://www.w3.org/2000/svg"
                            transform="rotate(0)"
                        >
                            <g stroke-width="0" transform="translate(0,0), scale(1)">
                                <rect
                                    x="-518.4"
                                    y="-518.4"
                                    width="2956.80"
                                    height="2956.80"
                                    rx="1478.4"
                                    fill="#ffffff"
                                    strokewidth="0"
                                ></rect>
                            </g>
                            <g
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke="#CCCCCC"
                                stroke-width="7.68"
                            ></g>
                            <g>
                                <path
                                    d="M1821.63 637.76c0-130.027-43.627-236.373-116.054-319.68 11.627-30.187 50.347-151.36-11.2-315.307 0 0-94.72-32-310.4 122.134-90.133-26.454-186.773-39.68-282.773-40.107-96 .427-192.64 13.653-282.667 40.107C602.749-29.227 507.923 2.773 507.923 2.773c-61.547 163.947-22.72 285.12-11.094 315.307-72.32 83.307-116.266 189.653-116.266 319.68 0 456.533 263.68 558.72 514.453 588.8 0 0-180.267 111.68-180.267 299.413-64.32 30.507-336.533 123.947-437.333-58.133 0 0-59.627-114.347-173.013-122.773 0 0-110.294-1.494-7.787 72.426 0 0 74.027 36.694 125.44 174.294 0 0 57.173 289.92 489.067 159.68 4.373 2.24 1.6 140.266 1.6 168.533h777.173s1.28-277.013 1.28-365.12c0-216.64-144.64-292.48-185.28-329.28 251.627-29.44 515.733-130.133 515.733-587.84"
                                    fill-rule="evenodd"
                                ></path>
                            </g>
                        </svg>
                    </span>
                    <span style="margin-left: 16px; color: white; font-weight: bold"
                        >Continue with Github</span
                    >
                </div>
            </div>
            <div
                class="progress-container"
                v-if="presenter.isLoading() || (!store.isTourist() && !store.isValidUser())"
            >
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="purple"
                    indeterminate
                ></v-progress-circular>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../store/User.store';
import usePresenter from './LoginPresenter';

const store = useUserStore();

const presenter = usePresenter();
</script>

<style lang="less">
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

.login-container {
    position: absolute;
    width: 430px;
    height: 230px;
    border-radius: 6px;
    padding-top: 24px;
    padding-left: 50px;
    padding-right: 50px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
    background-color: white;
}

.progress-container {
    position: absolute;
    width: 330px;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-item {
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-top: 4px;
    padding-bottom: 4px;

    &:hover {
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.7);
        cursor: pointer;
    }
}
</style>
../model/User.store
