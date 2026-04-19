import { IProduct, ICatalogModel } from '../../types';
import { EventEmitter } from '../base/EventEmitter';

export class CatalogModel implements ICatalogModel {
  private _items: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;
  private _events: EventEmitter;

  constructor(events: EventEmitter) {
    this._events = events;
  }

  // Сохранить массив товаров
  setItems(products: IProduct[]): void {
    this._items = products;
    this._events.emit('catalog:changed', this._items);
  }

  // Получить массив товаров
  getItems(): IProduct[] {
    return this._items;
  }

  // Получить товар по id
  getProductById(id: string): IProduct | undefined {
    return this._items.find(product => product.id === id);
  }

  // Сохранить товар для подробного отображения
  setSelectedProduct(product: IProduct | null): void {
    this._selectedProduct = product;
    if (product) {
      this._events.emit('catalog:selected', product);
    } else {
      this._events.emit('catalog:selected', null);
    }
  }

  // Получить товар для подробного отображения
  getSelectedProduct(): IProduct | null {
    return this._selectedProduct;
  }
}