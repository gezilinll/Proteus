export interface IBaseElement {
    uuid: string;

    type: 'invalid' | 'board' | 'brush';

    position: {
        left: number;
        top: number;
    };

    scale: {
        x: number;
        y: number;
    };
}
