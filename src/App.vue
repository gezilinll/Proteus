<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView v-if="userStore.isSelfValid()"></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <ZoomPanelView v-if="userStore.isSelfValid()"></ZoomPanelView>
        <CollabPanelView v-if="userStore.isSelfValid()"></CollabPanelView>
        <UserPanelView v-if="userStore.isSelfValid()"></UserPanelView>
        <div
            id="loginContainer"
            class="app-container"
            style="background-color: rgba(0, 0, 0, 0.3)"
            v-if="!userStore.isSelfValid()"
        ></div>
    </v-app>
</template>

<script setup lang="ts">
import { EditorView } from './editor';
import { FunctionView } from './function';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { CollabPanelView } from './collab';
import { UserPanelView } from './collab';
import { useAppStore } from './App.store';
import { useUserStore } from './collab/User.store';
import { storeToRefs } from 'pinia';
import { useGuard } from '@authing/guard-vue3';
import type { AuthenticationClient, User } from '@authing/guard-vue3';
import { onMounted } from 'vue';

const store = useAppStore();
const { selectedFunction } = storeToRefs(store);

const userStore = useUserStore();
const guard = useGuard();
onMounted(() => {
    guard.getAuthClient().then((client: AuthenticationClient) => {
        client.getCurrentUser().then((user: User | null) => {
            if (user) {
                userStore.selfLogin(user.id, user.nickname!);
            } else {
                guard.start('#loginContainer').then((userInfo: User) => {
                    userStore.selfLogin(userInfo.id, userInfo.nickname!);
                });
            }
        });
    });
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}
</style>
./collab/User.store
