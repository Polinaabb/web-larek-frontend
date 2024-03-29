import { Form } from './Form';
import { PaymentMethod } from '../../types';
import { IEvents } from '../base/events';


interface IOrder {
    payment: PaymentMethod;
    address: string;
}

export class Order extends Form<IOrder> {
    protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._buttons = Array.from(container.querySelectorAll('.button_alt'));

        this._buttons.forEach((element) =>
            element.addEventListener('click', (event: MouseEvent) => {
                const target = event.target as HTMLButtonElement;
                const name = target.name;
                this.setClass(name);
                events.emit('payment:changed', { target: name });
            })
        );
    }

    setClass(name: string): void {
        this._buttons.forEach((button) => {
            if (button.name === name) {
                button.classList.add('button_alt-active')
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(address: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value =
            address;
    }
}
