<template>
    <div class="container">
        <div class="top-bar">顶部栏</div>
        <div class="content">
            <div class="left-sidebar">左侧栏</div>
            <div class="right-content">右侧空白区域</div>
        </div>
        <div class="bottom-bar">底部栏</div>
    </div>
</template>

<style>
html,
body {
    height: 100%;
    margin: 0;
    padding: 0;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.top-bar,
.bottom-bar {
    height: 32px;
    background-color: #ccc;
}

.content {
    flex: 1;
    display: flex;
}

.left-sidebar {
    width: 32px;
    background-color: #1e1c1c;
}

.right-content {
    flex: 1;
    background-color: #f0f0f0;
}
</style>
