import { Component } from '../base/Component';

export class Header extends Component<{ count: number }> {
  protected _basketButton: HTMLButtonElement;
  protected _counter: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this._basketButton = this.container.querySelector('.header__basket') as HTMLButtonElement;
    this._counter = this.container.querySelector('.header__basket-counter') as HTMLElement;
  }

  // Сеттер для обновления счетчика
  set count(value: number) {
    if (this._counter) {
      this._counter.textContent = String(value);
    }
  }

  // Метод для подписки на клик по корзине
  onBasketClick(callback: () => void): void {
    if (this._basketButton) {
      this._basketButton.addEventListener('click', callback);
    }
  }
}