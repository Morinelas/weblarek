import { Api } from './base/Api';
import { IApi, IProductsResponse, IOrderData, IOrderResult } from '../types';

export class WebLarekApi extends Api {
  private _api: IApi;

  constructor(api: IApi) {
    super(''); // базовый URL не нужен, т.к. api уже содержит baseUrl
    this._api = api;
  }

  // GET запрос на получение списка товаров
  async getProducts(): Promise<IProductsResponse> {
    const response = await this._api.get('/product');
    return response as IProductsResponse;
  }

  // POST запрос на отправку заказа
  async postOrder(orderData: IOrderData): Promise<IOrderResult> {
    const response = await this._api.post('/order/', orderData);
    return response as IOrderResult;
  }
}