import { Card } from './Card';
import { IPreviewCardData } from '../../types';

export class PreviewCard extends Card<IPreviewCardData> {
  protected _description: HTMLElement;
  protected _button: HTMLButtonElement;
  private _inCart: boolean = false;
  private _onAdd: (id: string) => void;
  private _onRemove: (id: string) => void;
  private _isAvailable: boolean = true;

  constructor(
    container: HTMLElement, 
    template: HTMLTemplateElement, 
    onAdd: (id: string) => void,
    onRemove: (id: string) => void
  ) {
    super(container, template);
    
    this._description = this.container.querySelector('.card__text') as HTMLElement;
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
    this._onAdd = onAdd;
    this._onRemove = onRemove;
    
    this._button.addEventListener('click', () => {
      if (!this._isAvailable) return; // Если товар недоступен — ничего не делаем
      
      if (this._inCart) {
        this._onRemove(this.id);
      } else {
        this._onAdd(this.id);
      }
    });
  }

  set description(value: string) {
    if (this._description) {
      this._description.textContent = value;
    }
  }

  // Переопределяем сеттер цены
  set price(value: number | null) {
    super.price = value;
    
    // Если цена null (бесценно) — блокируем кнопку и меняем текст
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