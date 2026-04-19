import { ProductCard } from './ProductCard';
import { ICatalogCardData } from '../../types';

export class CatalogCard extends ProductCard<ICatalogCardData> {
  protected _button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, onClick: () => void) {
    super(template);
    
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
    
    // Клик по кнопке
    if (this._button) {
      this._button.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
      });
    }
    
    // Клик по всей карточке
    this.container.addEventListener('click', () => {
      onClick();
    });
  }

  set price(value: number | null) {
    super.price = value;
    
    if (value === null) {
      if (this._button) {
        this._button.disabled = true;
        this._button.textContent = 'Недоступно';
      }
    } else {
      if (this._button) {
        this._button.disabled = false;
        this._button.textContent = 'Купить';
      }
    }
  }
}