import { Card } from './Card';
import { IBasketCardData } from '../../types';

export class BasketCard extends Card<IBasketCardData> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onRemove: () => void) {
    super(template);
    
    this._index = this.container.querySelector('.basket__item-index') as HTMLElement;
    this._deleteButton = this.container.querySelector('.basket__item-delete') as HTMLButtonElement;
    
    if (this._deleteButton) {
      this._deleteButton.addEventListener('click', () => {
        onRemove();
      });
    }
  }

  set index(value: number) {
    if (this._index) {
      this._index.textContent = String(value);
    }
  }
}