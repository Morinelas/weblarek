import { Component } from '../base/Component';
import { ISuccessData } from '../../types';

export class Success extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, template: HTMLTemplateElement, onClose: () => void) {
    super(container);
    
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Не удалось клонировать элемент из шаблона');
    
    this.container = element;
    
    this._description = this.container.querySelector('.order-success__description') as HTMLElement;
    this._closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    
    this._closeButton.addEventListener('click', onClose);
  }

  // Установить сумму заказа
  setTotal(total: number): void {
    this._description.textContent = `Списано ${total} синапсов`;
  }

  render(data?: ISuccessData): HTMLElement {
    if (data) {
      this.setTotal(data.total);
    }
    return this.container;
  }
}