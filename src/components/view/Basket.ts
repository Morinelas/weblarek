import { Component } from '../base/Component';
import { IBasketData } from '../../types';

export class Basket extends Component<IBasketData> {
  protected _list: HTMLElement;
  protected _totalPrice: HTMLElement;
  protected _orderButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onOrder: () => void) {
    if (!template) {
      throw new Error('Basket: template не найден');
    }
    
    const element = template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) {
      throw new Error('Basket: не удалось клонировать элемент из шаблона');
    }
    
    super(element);
    
    this._list = this.container.querySelector('.basket__list') as HTMLElement;
    this._totalPrice = this.container.querySelector('.basket__price') as HTMLElement;
    this._orderButton = this.container.querySelector('.basket__button') as HTMLButtonElement;
    
    if (this._orderButton) {
      this._orderButton.addEventListener('click', onOrder);
    }
  }

  updateItems(items: HTMLElement[]): void {
    if (this._list) {
      this._list.innerHTML = '';
      items.forEach(item => {
        this._list.appendChild(item);
      });
    }
    if (this._orderButton) {
      this._orderButton.disabled = items.length === 0;
    }
  }

  updateTotal(total: number): void {
    if (this._totalPrice) {
      this._totalPrice.textContent = `${total} синапсов`;
    }
  }
}