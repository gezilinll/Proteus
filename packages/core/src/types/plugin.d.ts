import { Editor } from "./editor";

export interface Plugin {
    mount(editor: Editor): void;
    unmount(editor: Editor): void;
}