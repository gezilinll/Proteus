import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css'; // 使用了 snow 主题色
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebsocketProvider } from 'y-websocket';

// 使用 cursors 插件
Quill.register('modules/cursors', QuillCursors);

const quill = new Quill(document.querySelector('#app'), {
    modules: {
        cursors: true,
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
        ],
        history: {
            userOnly: true,
        },
    },
    placeholder: '前端西瓜哥...',
    theme: 'snow',
});

const ydoc = new Y.Doc();
const ytext = ydoc.getText('quill');
const provider = new WebsocketProvider('wss://demos.yjs.dev', 'quill-demo-room', ydoc);
const binding = new QuillBinding(ytext, quill, provider.awareness);