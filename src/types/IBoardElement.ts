import { IBaseElement } from './IBaseElement';

export interface IBoardElement extends IBaseElement {
    elements: IBaseElement[];
}
