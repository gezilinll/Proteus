import { Editor } from '../types';

export interface Plugin {
    name: string;
    mount(editor: Editor): void;
    unmount(editor: Editor): void;
}
