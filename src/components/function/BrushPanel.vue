<template>
    <div>
        <div
            class="brush-panel"
            :class="{
                'disable-mouse-event': disablePanelEvents,
            }"
        >
            <span
                aria-hidden="true"
                class="brush-type"
                :class="{
                    'brush-type-selected': brushType === BrushType.Pen,
                }"
                :style="{ color: penColor }"
                @click="brushType = BrushType.Pen"
                title="Pen"
            >
                <svg
                    width="185"
                    height="51"
                    viewBox="0 0 185 51"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M182.49 28.48c1.44-.22 2.51-1.44 2.51-2.87 0-1.42-1.05-2.64-2.48-2.87l-22.85-3.65c-4.02-.64-7.67 2.41-7.67 6.41 0 3.98 3.61 7.03 7.61 6.42l22.88-3.44Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M159.554 31.55h-.001c-3.779.576-7.178-2.306-7.178-6.05 0-3.761 3.436-6.645 7.236-6.04l22.849 3.65c1.253.202 2.165 1.268 2.165 2.5 0 1.239-.928 2.306-2.191 2.5h-.001l-22.879 3.44Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path
                        d="M163 18.57 108.92 4.31C106.5 3.5 104 3 104 1v49c0-2 2.5-2.5 4.51-3.08L163 33.06V18.57Z"
                        fill="#EEE"
                    ></path>
                    <path
                        d="M163 18.57 108.92 4.31C106.5 3.5 104 3 104 1v49c0-2 2.5-2.5 4.51-3.08L163 33.06V18.57Z"
                        fill="url(#_2417137606__a)"
                    ></path>
                    <path
                        d="M163 18.57 108.92 4.31C106.5 3.5 104 3 104 1v49c0-2 2.5-2.5 4.51-3.08L163 33.06V18.57Z"
                        fill="url(#_2417137606__b)"
                        fill-opacity=".3"
                    ></path>
                    <path d="M81 1H0v49h81V1Z" fill="#EEE"></path>
                    <path d="M81 1H0v49h81V1Z" fill="url(#_2417137606__c)"></path>
                    <path d="M81 1H0v49h81V1Z" fill="url(#_2417137606__d)" fill-opacity=".3"></path>
                    <path
                        d="M104 50V1c0-.55-.45-1-1-1H82c-.55 0-1 .45-1 1v49c0 .55.45 1 1 1h21c.55 0 1-.45 1-1Z"
                        fill="#EEE"
                    ></path>
                    <path
                        d="M104 50V1c0-.55-.45-1-1-1H82c-.55 0-1 .45-1 1v49c0 .55.45 1 1 1h21c.55 0 1-.45 1-1Z"
                        fill="url(#_2417137606__e)"
                    ></path>
                    <path
                        d="M104 50V1c0-.55-.45-1-1-1H82c-.55 0-1 .45-1 1v49c0 .55.45 1 1 1h21c.55 0 1-.45 1-1Z"
                        fill="url(#_2417137606__f)"
                        fill-opacity=".3"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M163 18.57 108.92 4.31c-.31-.1-.61-.2-.92-.29-2.08-.66-3.97-1.26-4-2.97V1c0-.55-.45-1-1-1H82c-.55 0-1 .45-1 1H0v49h81c0 .55.45 1 1 1h21c.55 0 1-.45 1-1v-.04c.03-1.79 2.08-2.36 3.95-2.89.19-.05.38-.11.56-.16L163 33.06V18.57Z"
                        fill="url(#_2417137606__g)"
                        fill-opacity=".1"
                    ></path>
                    <path d="M95 0h-6v51h6V0Z" fill="currentColor"></path>
                    <path
                        d="M89.375 50.625V.375h5.25v50.25h-5.25Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path
                        d="M41.16 32.94c.81-.21 1.32-1.24 1.03-2.1-.1-.37-.41-.73-.59-1.05-.81-1.31-1.64-2.62-2.5-3.89l-.25-.41 3.44 2.36c1.6 1.37 3.29 2.62 5 3.86 1 .82 2.47.11 2.58-1.27.05-.49-.1-.99-.39-1.35l-.24-.32c-.32-.41-.64-.81-1-1.18-.02-.02-.03-.04-.03-.06l-2.75-4.51 4.39 2.23c.76.52 1.54.97 2.33 1.42.27.15.54.34.84.43.68.21 1.45-.15 1.77-.86.46-.88.07-2.08-.78-2.45a69.8 69.8 0 0 0-1.22-.6c-1.62-.79-3.26-1.55-4.95-2.21l-2.99-1.52c-.62-.37-1.32-.79-1.96-1.14l-.68-.37c-.51-.26-1.17-.15-1.59.28-.56.54-.68 1.54-.25 2.19.14.22.49.79.64 1.01.83 1.29 1.76 2.7 2.65 3.93L39.1 22.2c-.83-.71-1.69-1.37-2.55-2-.42-.32-.86-.64-1.3-.95-.49-.41-1.17-.51-1.71-.19-.69.39-1.03 1.39-.73 2.19.17.41.46.75.68 1.12.61.94 1.23 1.85 1.91 2.73l1.65 2.71-4.47-2.25c-.73-.54-1.49-1.01-2.26-1.46-.29-.15-.54-.34-.84-.45-.71-.22-1.54.17-1.87.9-.46.9-.08 2.13.76 2.55 0 0 .42.22.46.22 1.89.94 3.8 1.83 5.79 2.53-.03-.02-.07-.04-.08-.06l2.75 1.39c.88.58 1.81 1.1 2.72 1.59.24.19.78.3 1.15.17Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="m41.066 32.577-.015.004-.015.005a.935.935 0 0 1-.438.02.853.853 0 0 1-.355-.13l-.026-.02-.03-.016c-.907-.489-1.825-1.002-2.69-1.573l-.019-.012-.019-.01-2.75-1.39-1.011-.51.102.203c-1.633-.63-3.22-1.377-4.803-2.164l-.079-.039h-.02a5.489 5.489 0 0 1-.29-.144l-.047-.024-.013-.007-.003-.002h-.001l-.006-.003c-.31-.155-.557-.473-.676-.868-.12-.394-.098-.824.082-1.176l.004-.008.004-.009c.257-.568.895-.852 1.408-.698.114.042.226.102.354.177l.097.058c.1.06.213.128.328.188.762.445 1.506.906 2.218 1.433l.026.019.028.014 4.47 2.25 1.17.59-.68-1.12-1.65-2.71-.011-.018-.013-.016a39.922 39.922 0 0 1-1.889-2.7c-.082-.137-.177-.276-.264-.405a16.951 16.951 0 0 1-.1-.148 3.056 3.056 0 0 1-.285-.505c-.237-.642.052-1.436.566-1.726l.006-.004c.383-.227.891-.17 1.278.155l.012.01.013.009c.437.308.873.625 1.289.941l.005.005c.856.626 1.708 1.28 2.528 1.982l.015.012.015.011 4.56 3.16.518-.528c-.884-1.221-1.81-2.625-2.639-3.913l-.005-.008a27.477 27.477 0 0 1-.442-.695c-.075-.12-.143-.23-.192-.305l-.003-.006a1.34 1.34 0 0 1-.187-.886c.038-.327.176-.627.384-.827l.008-.008c.308-.315.79-.39 1.148-.21l.674.367c.594.325 1.242.712 1.834 1.065l.114.068.01.007.012.005 2.99 1.52.017.009.017.006c1.676.655 3.306 1.41 4.922 2.198h.001c.272.132.966.469 1.21.596l.011.006.012.005c.307.134.554.43.674.804.12.374.101.789-.076 1.128l-.005.01-.005.01c-.249.552-.833.805-1.317.656l-.003-.001c-.177-.053-.328-.143-.516-.254-.076-.045-.157-.093-.248-.144-.79-.45-1.557-.892-2.302-1.402l-.02-.014-.022-.011-4.39-2.23-1.178-.599.688 1.128 2.72 4.462a.486.486 0 0 0 .111.175c.344.353.653.738.971 1.146l.238.317.008.01c.227.282.35.683.309 1.077v.008c-.045.558-.36.964-.748 1.153a1.11 1.11 0 0 1-1.221-.143l-.009-.007-.009-.006c-1.71-1.24-3.389-2.482-4.976-3.842l-.015-.013-.017-.011-3.44-2.36-.532.504.25.41.005.008.005.007c.854 1.262 1.68 2.565 2.487 3.871.064.113.15.241.227.357l.105.16c.109.17.185.313.219.44l.003.011.004.01c.11.326.07.695-.084 1.01-.155.314-.407.536-.685.608Zm-6.19-2.955-.12.06.068-.135.008.009a.334.334 0 0 1 .043.066Z"
                        stroke="#000"
                        stroke-opacity=".07"
                        stroke-width=".75"
                    ></path>
                    <defs>
                        <linearGradient
                            id="_2417137606__a"
                            x1="133.5"
                            y1="1"
                            x2="133.5"
                            y2="64"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".245" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#C4C4C4"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__b"
                            x1="135.251"
                            y1="44.791"
                            x2="126.751"
                            y2="-6.209"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".13" stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".226" stop-color="#fff"></stop>
                            <stop offset=".394" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__c"
                            x1="40.5"
                            y1="1"
                            x2="40.5"
                            y2="55.5"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".245" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#C4C4C4"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__d"
                            x1="40.5"
                            y1="1"
                            x2="40.5"
                            y2="50"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".474" stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".75" stop-color="#fff"></stop>
                            <stop offset=".854" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__e"
                            x1="92.5"
                            y1="0"
                            x2="92.5"
                            y2="62"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".245" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#C4C4C4"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__f"
                            x1="92.5"
                            y1="54"
                            x2="92.5"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".157" stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".255" stop-color="#fff"></stop>
                            <stop offset=".529" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2417137606__g"
                            x1="160.654"
                            y1="58.613"
                            x2="-4.846"
                            y2="7.613"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#C9C9C9"></stop>
                            <stop offset="1" stop-color="#C9C9C9" stop-opacity="0"></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="['brush-type', brushType === BrushType.Marker ? 'brush-type-selected' : '']"
                :style="{ color: markerColor }"
                @click="brushType = BrushType.Marker"
                title="Marker"
            >
                <svg
                    width="184"
                    height="49"
                    viewBox="0 0 184 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M161.96 35.07h-.5v-21h.5c11.5 0 21.5 4.7 21.5 10.5s-10 10.5-21.5 10.5Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M161.85 34.695h-.015V14.445h.125c5.704 0 11.022 1.166 14.9 3.038 3.907 1.885 6.225 4.416 6.225 7.087 0 2.671-2.318 5.202-6.225 7.087-3.878 1.872-9.196 3.038-14.9 3.038H161.85Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path d="M89 0H0v49h89V0Z" fill="#EEE"></path>
                    <path
                        d="M89 0H0v49h89V0Z"
                        fill="url(#_2344601345__a)"
                        fill-opacity=".08"
                    ></path>
                    <path d="M89 44H0v3h89v-3Z" fill="#D9D9D9"></path>
                    <path d="M95 0h-6v49h6V0Z" fill="currentColor"></path>
                    <path
                        d="M89.375 48.625V.375h5.25v48.25h-5.25Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path d="M124 49H95V0h29a2 2 0 0 1 2 2v45a2 2 0 0 1-2 2Z" fill="#EEE"></path>
                    <path
                        d="M124 49H95V0h29a2 2 0 0 1 2 2v45a2 2 0 0 1-2 2Z"
                        fill="url(#_2344601345__b)"
                    ></path>
                    <path d="M126 47c.35 0 26-10 26-10V11.5L126 2v45Z" fill="#EEE"></path>
                    <path
                        d="M126 47c.35 0 26-10 26-10V11.5L126 2v45Z"
                        fill="url(#_2344601345__c)"
                    ></path>
                    <path
                        d="M163 13.4V35c0 1.1-.9 2-2 2h-9V11.4h9a2 2 0 0 1 2 2Z"
                        fill="#EEE"
                    ></path>
                    <path
                        d="M163 13.4V35c0 1.1-.9 2-2 2h-9V11.4h9a2 2 0 0 1 2 2Z"
                        fill="url(#_2344601345__d)"
                    ></path>
                    <path d="M163 13.4V35c0 1.1-.9 2-2 2V11.4a2 2 0 0 1 2 2Z" fill="#EEE"></path>
                    <path d="M126 44H95v3h31v-3Z" fill="#D9D9D9"></path>
                    <path
                        d="m126 46 26-10v-1l-26 10v1ZM161 35h-9v1h9v-1Z"
                        fill="#C9C9C9"
                        fill-opacity=".5"
                    ></path>
                    <path
                        d="M29.38 22.98c0-.47-.2.47 0 0l2.25-3.29 7.24 3.25-.91-3.25a3.694 3.694 0 0 1 4.89-4.44l10.88 4.21c1.91.74 2.85 2.88 2.11 4.78a3.697 3.697 0 0 1-4.78 2.11l-4-1.55.98 3.5c.38 1.36-.05 2.83-1.11 3.77a3.681 3.681 0 0 1-3.87.64L28 26l1.38-3.02Z"
                        fill="url(#_2344601345__e)"
                    ></path>
                    <path
                        d="m46.699 24.901.98 3.5a3.338 3.338 0 0 1-.998 3.388 3.306 3.306 0 0 1-3.472.577L28.5 25.812l1.186-2.596a1.53 1.53 0 0 0 .025-.054l2.052-3.001 6.954 3.121.731.328-.216-.771-.91-3.25a3.318 3.318 0 0 1 4.393-3.99l10.88 4.21a3.313 3.313 0 0 1 1.897 4.295A3.322 3.322 0 0 1 51.196 26l-4-1.55-.7-.271.203.721Zm-17.06-1.811-.259-.11h.266a.34.34 0 0 1 .018.074l-.004.006a.325.325 0 0 1-.022.03Zm.027.003Z"
                        stroke="url(#_2344601345__f)"
                        stroke-opacity=".07"
                        stroke-width=".75"
                    ></path>
                    <defs>
                        <linearGradient
                            id="_2344601345__a"
                            x1="44.5"
                            y1="0"
                            x2="44.5"
                            y2="54.5"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".245" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#C4C4C4"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2344601345__b"
                            x1="110.5"
                            y1="49"
                            x2="110.5"
                            y2="0"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#C4C4C4"></stop>
                            <stop offset=".725" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2344601345__c"
                            x1="134.358"
                            y1="53.324"
                            x2="141.358"
                            y2="2.324"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#C4C4C4"></stop>
                            <stop offset=".748" stop-color="#fff"></stop>
                            <stop offset=".889" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2344601345__d"
                            x1="157.5"
                            y1="43.5"
                            x2="157.5"
                            y2="11"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#C4C4C4"></stop>
                            <stop offset=".777" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2344601345__e"
                            x1="40.383"
                            y1="22.496"
                            x2="29.883"
                            y2="17.496"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".209" stop-color="currentColor"></stop>
                            <stop offset=".632" stop-color="currentColor" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_2344601345__f"
                            x1="55"
                            y1="23.5"
                            x2="29.5"
                            y2="24"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop></stop>
                            <stop offset="1" stop-opacity="0"></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="[
                    'brush-type',
                    brushType === BrushType.Highlighter ? 'brush-type-selected' : '',
                ]"
                :style="{ color: highlighterColor }"
                @click="brushType = BrushType.Highlighter"
                title="Highlighter"
            >
                <svg
                    width="183"
                    height="50"
                    viewBox="0 0 183 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M89 1H0v49h89V1Z" fill="#EEE"></path>
                    <path d="M89 1H0v49h89V1Z" fill="url(#_301050800__a)"></path>
                    <path
                        d="M125.39 50H89V1h36.39c.4 0 .78.12 1.11.34l9.43 6.3c4.93 3.3 10.74 5.06 16.67 5.06h8.4c1.1 0 2 .9 2 2v21.6c0 1.1-.9 2-2 2h-8.4a29.96 29.96 0 0 0-16.67 5.06l-9.43 6.3c-.32.22-.71.34-1.11.34Z"
                        fill="#EEE"
                    ></path>
                    <path
                        d="M125.39 50H89V1h36.39c.4 0 .78.12 1.11.34l9.43 6.3c4.93 3.3 10.74 5.06 16.67 5.06h8.4c1.1 0 2 .9 2 2v21.6c0 1.1-.9 2-2 2h-8.4a29.96 29.96 0 0 0-16.67 5.06l-9.43 6.3c-.32.22-.71.34-1.11.34Z"
                        fill="url(#_301050800__b)"
                    ></path>
                    <path
                        d="M176.25 15c.45 0 .84.3.96.73l5.43 19c.18.64-.3 1.27-.96 1.27H163V15h13.25Z"
                        fill="currentColor"
                    ></path>
                    <path
                        d="M176.849 15.83v.003l5.43 18.998v.001a.623.623 0 0 1-.599.793h-18.305v-20.25h12.875c.28 0 .524.186.599.456Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path d="M89 45H0v3h89v-3Z" fill="#D9D9D9"></path>
                    <path
                        d="M115.07 9c4.42 0 8.65 1.83 11.67 5.06 5.77 6.15 5.77 15.73 0 21.89a15.98 15.98 0 0 1-11.67 5.06H95V25c0-8.84 7.16-16 16-16h4.07Z"
                        fill="url(#_301050800__c)"
                        fill-opacity=".5"
                    ></path>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M89 48h35.42c.38 0 .75-.11 1.07-.31l10.67-6.74c4.8-3.03 10.36-4.64 16.03-4.64H161c1.1 0 2-.9 2-2v1c0 1.1-.9 2-2 2h-8.4a29.96 29.96 0 0 0-16.67 5.06l-9.43 6.3c-.33.22-.72.34-1.11.34H89V48Zm36.39-48Z"
                        fill="#C9C9C9"
                        fill-opacity=".5"
                    ></path>
                    <path d="M95 1h-6v49h6V1Z" fill="currentColor"></path>
                    <path
                        d="M89.375 49.625V1.375h5.25v48.25h-5.25Z"
                        stroke="#000"
                        stroke-opacity=".1"
                        stroke-width=".75"
                    ></path>
                    <path
                        d="m29 28.44 2.82-6.74 6.96 2.91-.9-3.21 4.83-4.4L56 22.14l-2.64 6.81-6.48-2.51.97 3.46-4.93 4.35L29 28.44Z"
                        fill="url(#_301050800__d)"
                    ></path>
                    <path
                        d="m39.141 24.509-.837-2.988 4.487-4.088 12.724 4.921-2.37 6.11-6.13-2.374-.698-.27.202.721.906 3.234-4.577 4.038-13.357-5.575 2.53-6.047 6.614 2.765.715.299-.209-.746Z"
                        stroke="url(#_301050800__e)"
                        stroke-opacity=".07"
                        stroke-width=".75"
                    ></path>
                    <defs>
                        <linearGradient
                            id="_301050800__a"
                            x1="44.5"
                            y1="1"
                            x2="44.5"
                            y2="55.5"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#fff" stop-opacity="0"></stop>
                            <stop offset=".245" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#C4C4C4"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_301050800__b"
                            x1="126"
                            y1="50"
                            x2="126"
                            y2="1"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop stop-color="#C4C4C4"></stop>
                            <stop offset=".725" stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_301050800__d"
                            x1="41.15"
                            y1="24.778"
                            x2="32.65"
                            y2="21.278"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset=".177" stop-color="currentColor"></stop>
                            <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
                        </linearGradient>
                        <linearGradient
                            id="_301050800__e"
                            x1="56"
                            y1="26"
                            x2="29"
                            y2="26"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop></stop>
                            <stop offset="1" stop-opacity="0"></stop>
                        </linearGradient>
                        <radialGradient
                            id="_301050800__c"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="matrix(-47 0 0 -32 129.001 41)"
                        >
                            <stop stop-color="#fff"></stop>
                            <stop offset="1" stop-color="#fff" stop-opacity="0"></stop>
                        </radialGradient>
                    </defs>
                </svg>
            </span>
            <br />
            <br />
            <span
                aria-hidden="true"
                :class="['brush-type', brushType === BrushType.Eraser ? 'brush-type-selected' : '']"
                @click="brushType = BrushType.Eraser"
                title="Eraser"
            >
                <img src="../assets/draw-eraser.svg" />
            </span>
            <br />
            <br />
            <button
                :class="[
                    brushType !== BrushType.Eraser && brushType !== BrushType.Selector
                        ? 'brush-color'
                        : 'brush-color-disabled',
                    brushConfig === BrushConfig.Color &&
                    brushType !== BrushType.Eraser &&
                    brushType !== BrushType.Selector
                        ? 'brush-color-selected'
                        : '',
                ]"
                @click="
                    brushConfig =
                        brushConfig === BrushConfig.Color ? BrushConfig.None : BrushConfig.Color
                "
                :disabled="brushType === BrushType.Eraser || brushType === BrushType.Selector"
                title="Color"
            ></button>
            <br />
            <br />
            <span aria-hidden="true" title="Weight">
                <img
                    src="../assets/draw-settings.svg"
                    :class="[
                        brushType !== BrushType.Eraser && brushType !== BrushType.Selector
                            ? 'brush-weight'
                            : 'brush-weight-disabled',
                        brushConfig === BrushConfig.Weight &&
                        brushType !== BrushType.Eraser &&
                        brushType !== BrushType.Selector
                            ? 'brush-weight-selected'
                            : '',
                    ]"
                    @click="
                        brushConfig =
                            brushConfig === BrushConfig.Weight
                                ? BrushConfig.None
                                : BrushConfig.Weight
                    "
                    :disabled="brushType === BrushType.Eraser || brushType === BrushType.Selector"
                />
            </span>
        </div>
        <v-color-picker
            :class="{
                'disable-mouse-event': disablePanelEvents,
            }"
            style="position: absolute; left: 200px; top: 200px"
            v-model="brushColor"
            elevation="10"
            v-if="
                brushConfig === BrushConfig.Color &&
                brushType !== BrushType.Eraser &&
                brushType !== BrushType.Selector
            "
        ></v-color-picker>
        <v-card
            class="mx-auto"
            :class="{
                'disable-mouse-event': disablePanelEvents,
            }"
            style="position: absolute; left: 200px; top: 280px; width: 400px"
            elevation="10"
            v-if="
                brushConfig === BrushConfig.Weight &&
                brushType !== BrushType.Eraser &&
                brushType !== BrushType.Selector
            "
        >
            <v-card-text>
                <v-row justify="space-between">
                    <v-col class="text-left">
                        <span v-text="brushWeight" style="font-size: 48px"></span>
                        <span class="subheading font-weight-light me-1">PX</span>
                    </v-col>
                </v-row>
                <v-slider v-model="brushWeight" track-color="grey" min="4" max="100" :step="1">
                    <template v-slot:prepend>
                        <v-btn
                            size="small"
                            variant="text"
                            icon="mdi-minus"
                            :color="'indigo'"
                            @click="weightDecrement"
                        ></v-btn>
                    </template>

                    <template v-slot:append>
                        <v-btn
                            size="small"
                            variant="text"
                            icon="mdi-plus"
                            :color="'indigo'"
                            @click="weightIncrement"
                        ></v-btn>
                    </template>
                </v-slider>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEditorStore, BrushType, BrushConfig } from '../../Editor.store';
import { storeToRefs } from 'pinia';

const store = useEditorStore();
const {
    brushType,
    brushConfig,
    penColor,
    markerColor,
    highlighterColor,
    penWeight,
    markerWeight,
    highlighterWeight,
    disablePanelEvents,
} = storeToRefs(store);

const brushColor = ref(store.penColor);
watch(brushColor, () => {
    if (brushType.value === BrushType.Pen) {
        penColor.value = brushColor.value;
    } else if (brushType.value === BrushType.Marker) {
        markerColor.value = brushColor.value;
    } else if (brushType.value === BrushType.Highlighter) {
        highlighterColor.value = brushColor.value;
    }
});

const brushWeight = ref(penWeight.value);
function weightDecrement() {
    brushWeight.value -= 1;
}
function weightIncrement() {
    brushWeight.value += 1;
}
watch(brushWeight, () => {
    if (brushType.value === BrushType.Pen) {
        penWeight.value = brushWeight.value;
    } else if (brushType.value === BrushType.Marker) {
        markerWeight.value = brushWeight.value;
    } else if (brushType.value === BrushType.Highlighter) {
        highlighterWeight.value = brushWeight.value;
    }
});

watch(brushType, () => {
    if (brushType.value === BrushType.Pen) {
        brushColor.value = penColor.value;
        brushWeight.value = penWeight.value;
    } else if (brushType.value === BrushType.Marker) {
        brushColor.value = markerColor.value;
        brushWeight.value = markerWeight.value;
    } else if (brushType.value === BrushType.Highlighter) {
        brushColor.value = highlighterColor.value;
        brushWeight.value = highlighterWeight.value;
    }
    brushConfig.value = BrushConfig.None;
});
</script>

<style>
.brush-panel {
    scale: 0.7;
    border-radius: 10px;
    position: absolute;
    background-color: #333;
    left: 50px;
    width: 160px;
    top: -70px;
    height: 500px;
    padding-top: 16px;
    padding-bottom: 16px;
    -webkit-clip-path: polygon(0 0, 150% 0, 150% 100%, 0% 100%);
}

.brush-type {
    margin-left: -70px;
    cursor: pointer;
    transition: margin-left 100ms linear;
}
.brush-type:hover,
.brush-type-selected {
    margin-left: 0px;
}

.brush-color {
    width: 48px;
    height: 48px;
    background-color: v-bind(brushColor);
    border-radius: 5px;
    margin-left: 56px;
    transition: box-shadow 0.3s ease;
}
.brush-color-disabled {
    width: 48px;
    height: 48px;
    background-color: grey;
    border-radius: 5px;
    margin-left: 56px;
}
.brush-color:hover,
.brush-color-selected {
    box-shadow: inset 0px 0 0 4px #000;
}

.brush-weight {
    margin-left: 56px;
    padding: 5px;
}
.brush-weight-disabled {
    margin-left: 56px;
    padding: 5px;
}
.brush-weight:hover {
    background-color: rgba(255, 255, 255, 0.2);
}
.brush-weight-selected {
    background-color: rgba(255, 255, 255, 0.15);
}

.disable-mouse-event {
    pointer-events: none;
}
</style>
