export interface IWebItem {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
}

export interface IOrderResult {
    id: string
    total: number,  
}

export interface IOrder {
    payment: PaymentMethod,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
} 

export interface IAppState {
    catalog: IWebItem[];
    basket: string[];
    order: IOrder | null;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type PaymentMethod = 'cash' | 'card';
