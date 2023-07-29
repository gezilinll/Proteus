import { ElementType } from '../../Defines';

export abstract class ElementModel {
    abstract uuid: string;

    abstract type: ElementType;

    position = {
        left: 0,
        top: 0,
    };

    scale = {
        x: 1,
        y: 1,
    };
}
