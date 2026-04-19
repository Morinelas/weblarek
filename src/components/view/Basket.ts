import { Component } from '../base/Component';
import { IBasketData } from '../../types';

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, template: HTMLTemplateElement, onOrder: () => void) {
    super(container);
    
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Не удалось клонировать элемент из шаблона');
    
    this.container = element;
    
    this._list = this.container.querySelector('.basket__list') as HTMLElement;
    this._totalPrice = this.container.querySelector('.basket__price') as HTMLElement;
    this._orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
    
    this._orderButton.addEventListener('click', onOrder);
  }

  // Обновить список товаров
  updateItems(items: HTMLElement[]): void {
    this._list.innerHTML = '';
    items.forEach(item => {
      this._list.appendChild(item);
    });
    
    // Если корзина пуста, блокируем кнопку
    this._orderButton.disabled = items.length === 0;
  }

  // Обновить общую сумму
  updateTotal(total: number): void {
    this._totalPrice.textContent = `${total} синапсов`;
  }

  render(data?: IBasketData): HTMLElement {
    if (data) {
      const itemsElements = data.items.map(item => {
        return item as unknown as HTMLElement;
      });
      this.updateItems(itemsElements);
      this.updateTotal(data.total);
    }
    return this.container;
  }
}