import { IAppState, IOrder, IWebItem, FormErrors, PaymentMethod } from "../types";
import { Model } from "./base/Model";
import { IContacts } from "./common/Contacts";

export type CatalogChangeEvent = {
    catalog: IWebItem[]
};

export class AppState extends Model<IAppState> {
    basket: IWebItem[] = [];
    catalog: IWebItem[] = [];
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        payment: 'card',
        address: '',
        total: 0
    };
    preview: string | null;
    formErrors: FormErrors = {};

    throwInBasket(item: IWebItem): void {
        this.basket.push(item);
        this.emitChanges('basket:change');
    }

    removeInBasket(id: string): void {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.emitChanges('basket:change');
    }

    clearOrder(): void {
        this.order = {
            email: '',
            phone: '',
            items: [],
            payment: 'card',
            address: '',
            total: 0
        }
    }

    clearBasket(): void {
        this.basket = [];
        this.clearOrder();
        this.emitChanges('basket:change');
    }

    getTotal() {
        return this.basket.reduce((summ, product) => summ + product.price, 0);
    }

    setCatalog(items: IWebItem[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IWebItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    checkContentBasket(): IWebItem[] {
        return this.basket
    }

    checkBasket(item: IWebItem) {
        return this.basket.includes(item);
    }

    setOrder(): void {
        this.order.total = this.getTotal();
        this.order.items = this.checkContentBasket().map((item) => item.id);
    }

    setOrderField(field: keyof Partial<IContacts>, value: string): void {
        this.order[field] = value;
        this.validateOrderForm();
    }

    setPayment(itemPayment: PaymentMethod): void {
        this.order.payment = itemPayment;
        this.validateOrder();
    }

    setAddress(itemAddress: string): void {
        this.order.address = itemAddress;
        this.validateOrder();
    }

    setEmail(itemEmail: string): void {
        this.order.email = itemEmail;
        this.validateOrderForm();
    }

    setPhone(itemPhone: string): void {
        this.order.phone = itemPhone;
        this.validateOrderForm();
    }

    validateOrder(): void {
        const errors: FormErrors = {};
        if (!this.order.payment) {
            errors.payment = 'Необходимо указать способ оплаты';
        }
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
    }

    validateOrderForm() {
        const errors: FormErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formContactsErrors:change', this.formErrors);
    }

}