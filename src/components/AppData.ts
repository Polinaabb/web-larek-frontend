import { IAppState, IOrder, IWebItem, FormErrors, PaymentMethod } from "../types";
import { Model } from "./base/Model";
import { IContacts } from "./common/Contacts";

export type CatalogChangeEvent = {
    catalog: WebItem[]
};

export class WebItem extends Model<IWebItem>{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

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
        this.emitChanges('itemsBasket:changed');
    }

    removeInBasket(id: string): void {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.emitChanges('itemsBasket:changed');
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
        this.emitChanges('itemsBasket:changed');
    }

    getTotal() {
        return this.basket.reduce((summ, product) => summ + product.price, 0);
    }

    setCatalog(items: IWebItem[]) {
        this.catalog = items.map(item => new WebItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: WebItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    contentBasket(): IWebItem[] {
        return this.basket
    }

    checkBasket(item: IWebItem) {
        return this.basket.includes(item);
    }

    setOrder(): void {
        this.order.total = this.getTotal();
        this.order.items = this.contentBasket().map((item) => item.id);
    }

    setOrderField(field: keyof Partial<IContacts>, value: string): void {
        this.order[field] = value;
        this.validateOrderForm();
    }

    dataPayment(itemPayment: PaymentMethod): void {
        this.order.payment = itemPayment;
        this.validateOrder();
    }

    dataAddress(itemAddress: string): void {
        this.order.address = itemAddress;
        this.validateOrder();
    }

    dataEmail(itemEmail: string): void {
        this.order.email = itemEmail;
        this.validateOrderForm();
    }

    dataPhone(itemPhone: string): void {
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