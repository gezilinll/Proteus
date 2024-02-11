import { Subject } from 'rxjs';

import { Element } from './element';
import { Plugin } from './plugin';

export interface Editor {
    readonly events: {
        readonly changeElement: Subject<Element>;
    };

    registerPlugin(plugin: Plugin): void;
    unregisterPlugin(plugin: Plugin): void;
}
