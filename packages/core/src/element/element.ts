import { v4 as uuidv4 } from 'uuid';

export abstract class Element {
    readonly type: 'invalid' | 'graphics' = 'invalid';
    readonly id: string;

    constructor() {
        this.id = this.type + uuidv4();
    }
}
