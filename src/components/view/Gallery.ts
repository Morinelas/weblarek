import { Component } from '../base/Component';

export class Gallery extends Component<{ items: HTMLElement[] }> {
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._container = container;
  }

  // Отрисовать карточки
  renderCards(cards: HTMLElement[]): void {
    this._container.innerHTML = '';
    cards.forEach(card => {
      this._container.appendChild(card);
    });
  }

  // Очистить галерею
  clear(): void {
    this._container.innerHTML = '';
  }
}