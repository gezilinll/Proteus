import { Event } from "../editor/events";

export interface Plugin {
    name: string;
    events: Event<any>[];
}