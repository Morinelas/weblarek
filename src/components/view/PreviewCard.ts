import { ProductCard } from './ProductCard';
import { IPreviewCardData } from '../../types';

export class PreviewCard extends ProductCard<IPreviewCardData> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  private _inCart: boolean = false;
  private _onAdd: () => void;
  private _onRemove: () => void;
  private _isAvailable: boolean = true;

  constructor(
    template: HTMLTemplateElement,
    onAdd: () => void,
    onRemove: () => void
  ) {
    super(template);
    
    this._description = this.container.querySelector('.card__text') as HTMLElement;
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
    this._onAdd = onAdd;
    this._onRemove = onRemove;
    
    if (this._button) {
      this._button.addEventListener('click', () => {
        if (!this._isAvailable) return;
        
        if (this._inCart) {
          this._onRemove();
        } else {
          this._onAdd();
        }
      });
    }
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  set price(value: number | null) {
    super.price = value;
    
    if (value === null) {
      this._isAvailable = false;
      if (this._button) {
        this._button.disabled = true;
        this._button.textContent = 'Недоступно';
      }
    } else {
      this._isAvailable = true;
      if (this._button) {
        this._button.disabled = false;
        this._button.textContent = this._inCart ? 'Удалить из корзины' : 'В корзину';
      }
    }
  }

  set inCart(value: boolean) {
    this._inCart = value;
    if (this._isAvailable && this._button && !this._button.disabled) {
      this._button.textContent = value ? 'Удалить из корзины' : 'В корзину';
    }
  }
}