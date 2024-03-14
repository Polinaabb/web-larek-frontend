import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, sinaps: number, actions: ISuccessActions) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        this.setText(this._total, 'списано ' + sinaps + ' синапсов');

        this._close.addEventListener('click', actions.onClick);
    };
};