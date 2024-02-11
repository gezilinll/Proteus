export interface Event<T> {
    name: string;
    listener: (args: T) => void;
}

export interface ChangeElementEvent extends Event<Element> {
    name: 'changeElement';
    listener: (args: Element) => void;
}