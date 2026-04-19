import { Component } from '../base/Component';

export abstract class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Не удалось клонировать элемент из шаблона');
    
    super(element);
    
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
  }

  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
  }
}