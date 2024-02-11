import { Subject } from "rxjs";
import { Plugin } from "./plugin";
import { Element } from "./element";

export interface Editor {
    readonly events: {
        readonly changeElement: Subject<Element>;
    };

    registerPlugin(plugin: Plugin): void;
    unregisterPlugin(plugin: Plugin): void;
}
