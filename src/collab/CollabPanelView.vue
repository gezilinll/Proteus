<template>
    <div class="function-container">
        <div class="function-item-container">
            <span class="function-item">
                <svg viewBox="0 0 24 24" fill="none">
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="var(--svg-stroke-width)"
                        d="M11 4h10m-6 4h2m-12.5943-1.9315 9.4348 9.246c.3148.3085.135.8732-.2891.9084h-5.0514a.4679.4679 0 0 0-.285.1305l-3.4076 3.7094c-.3128.2998-.8074.0604-.8074-.3909v-13.41c0-.227.25-.346.4057-.1934Z"
                    ></path>
                    <path
                        fill="currentColor"
                        d="m13.8405 15.3145-9.4348-9.246c-.1558-.1527-.4057-.0335-.4057.1935v13.4099c0 .4513.4946.6907.8074.3909l3.4075-3.7094a.4679.4679 0 0 1 .2851-.1305h5.0514c.4241-.0352.6039-.5999.2891-.9084Z"
                    ></path>
                </svg>
            </span>
        </div>
        <div class="function-item-container">
            <span class="function-item">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M18.483 15.982a2 2 0 0 1-.81.663l-14.11 6.309a2 2 0 0 1-2.642-2.642L7.23 6.202a2 2 0 0 1 .376-.561c.298.615.695 1.286 1.177 1.987l-6.036 13.5 13.717-6.133c.733.444 1.416.779 2.02.988z"
                        fill="currentColor"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.448 13.89c-.447-1.065-1.366-2.43-2.7-3.764-1.333-1.333-2.698-2.252-3.763-2.699a4.585 4.585 0 0 0-.691-.234c.045.185.118.415.234.69.447 1.065 1.366 2.43 2.7 3.764 1.333 1.334 2.699 2.253 3.763 2.7.276.116.506.19.691.234a4.582 4.582 0 0 0-.234-.691zm.716.748h-.002.002zM8.812 7.136h.002-.002zm9.502 9.077c1.201-1.201-.21-4.56-3.151-7.5C12.22 5.77 8.863 4.36 7.662 5.56c-1.201 1.2.21 4.56 3.151 7.5 2.942 2.942 6.3 4.353 7.501 3.152z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M15.288 3.386a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"
                        fill="currentColor"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M23.425 10.887a1 1 0 0 1-1 1H20.49a1 1 0 0 1 0-2h1.936a1 1 0 0 1 1 1zM21.99 1.818a1 1 0 0 1 .866 1.117l-.305 2.428a1 1 0 0 1-1.101.87l-2.444-.268-.183 1.453a1 1 0 0 1-1.984-.25l.306-2.429a1 1 0 0 1 1.1-.87l2.444.268.183-1.452a1 1 0 0 1 1.117-.867z"
                        fill="currentColor"
                    ></path>
                </svg>
            </span>
        </div>
        <div class="function-item-container">
            <span class="function-item">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                    role="presentation"
                    focusable="false"
                >
                    <path
                        fill="currentColor"
                        d="M4 6v12.006L9.828 18 12 20.172 14.172 18h5.822L20 6H4zm0-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5l-3 3-3-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm7 5a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-6zm0 4a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-6zM7 9a1 1 0 1 0 0 2h1a1 1 0 0 0 0-2H7zm0 4a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2H7z"
                    ></path>
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
.function-container {
    display: flex;
    position: absolute;
    right: 240px;
    top: 12px;
    width: 150px;
    height: 50px;
    border-radius: 5px;
    background-color: white;
    cursor: pointer;
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
    height: @itemSize - (2 * @margin);
    width: @itemSize - (2 * @margin);
}

.content {
    &:hover {
        color: blue;
    }
}
</style>
