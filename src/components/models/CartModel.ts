import { IProduct, ICartModel } from '../../types';

export class CartModel implements ICartModel {
  private _items: IProduct[] = [];

  // Получить массив товаров в корзине
  getItems(): IProduct[] {
    return this._items;
  }

  // Добавить товар в корзину
  addItem(product: IProduct): void {
    if (!this.contains(product.id)) {
      this._items.push(product);
    }
  }

  // Удалить товар из корзины по id
  removeItem(id: string): void {
    this._items = this._items.filter(product => product.id !== id);
  }

  // Очистить корзину
  clear(): void {
    this._items = [];
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