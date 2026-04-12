import { IApi, IProductsResponse, IOrderData, IOrderResult } from '../types';

export class WebLarekApi {  // нет наследования, только композиция
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

 async getProducts(): Promise<IProductsResponse> {
  const response = await this._api.get<IProductsResponse>('/product');
  return response;
 }

 async postOrder(orderData: IOrderData): Promise<IOrderResult> {
  const response = await this._api.post<IOrderResult>('/order/', orderData);
  return response;
 }
}