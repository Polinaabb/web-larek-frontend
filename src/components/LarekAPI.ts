import { Api, ApiListResponse } from './base/api';
import { IWebItem, IOrder, IOrderResult } from '../types/index';

export interface ILarekAPI {
    getWebList: () => Promise<IWebItem[]>;
    getWebItem: (id: string) => Promise<IWebItem>;
    orderWeb: (order: IOrder) => Promise<IOrderResult>
}

export class LarekAPI extends Api implements ILarekAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn
    }

    getWebList(): Promise<IWebItem[]> {
        return this.get('/product').then((data: ApiListResponse<IWebItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    getWebItem(id: string): Promise<IWebItem> {
        return this.get(`/product/${id}`).then(
            (item: IWebItem) => ({
                ...item,
                image: this.cdn + item.image
            })
        );
    }

    orderWeb(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}