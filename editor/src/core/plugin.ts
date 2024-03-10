import { Editor } from './editor';

export interface Plugin {
    name: string;
    mount(editor: Editor): void;
    unmount(editor: Editor): void;
}
