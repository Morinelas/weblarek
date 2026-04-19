import { Component } from '../base/Component';
import { ISuccessData } from '../../types';

export class Success extends Component<ISuccessData> {
  protected _description: HTMLElement;
  protected _closeButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onClose: () => void) {
    // Проверяем, что template существует
    if (!template) {
      throw new Error('Success: template не найден');
    }
    
    const element = template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) {
      throw new Error('Success: не удалось клонировать элемент из шаблона');
    }
    
    super(element);
    
    this._description = this.container.querySelector('.order-success__description') as HTMLElement;
    this._closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;
    
    if (this._closeButton) {
      this._closeButton.addEventListener('click', onClose);
    }
  }

  setTotal(total: number): void {
    if (this._description) {
      this._description.textContent = `Списано ${total} синапсов`;
    }
  }
}