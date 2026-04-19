import { IProduct, ICartModel } from '../../types';
import { EventEmitter } from '../base/EventEmitter';

export class CartModel implements ICartModel {
  private _items: IProduct[] = [];
  private _events: EventEmitter;

  constructor(events: EventEmitter) {
    this._events = events;
  }

  // Получить массив товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавить товар в корзину
  addItem(product: IProduct): void {
    if (!this.contains(product.id)) {
      this._items.push(product);
      this._events.emit('cart:changed', {
        items: this._items,
        total: this.getTotal(),
        count: this.getCount()
      });
    }
  }

  // Удалить товар из корзины по id
  removeItem(id: string): void {
    const removed = this._items.find(item => item.id === id);
    this._items = this._items.filter(product => product.id !== id);
    this._events.emit('cart:changed', {
      items: this._items,
      total: this.getTotal(),
      count: this.getCount(),
      removed
    });
  }

  // Очистить корзину
  clear(): void {
    this._items = [];
    this._events.emit('cart:changed', {
      items: this._items,
      total: 0,
      count: 0
    });
    this._events.emit('cart:cleared');
  }

  // Получить общую стоимость всех товаров
  getTotal(): number {
    return this._items.reduce((sum, product) => {
      return sum + (product.price ?? 0);
    }, 0);
  }

  // Получить количество товаров в корзине
  getCount(): number {
    return this._items.length;
  }

  // Проверить наличие товара по id
  contains(id: string): boolean {
    return this._items.some(product => product.id === id);
  }
}