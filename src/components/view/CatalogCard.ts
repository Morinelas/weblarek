import { Card } from './Card';
import { ICatalogCardData } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CatalogCard extends Card<ICatalogCardData> {
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, template: HTMLTemplateElement, onClick: (id: string) => void) {
    super(container, template);
    
    this._button = this.container.querySelector('.card__button') as HTMLButtonElement;
   // Обработчик клика
    this.container.addEventListener('click', () => {
      onClick(this.id);
    });
  }

  // Переопределяем сеттер цены, чтобы управлять кнопкой
  set price(value: number | null) {
    super.price = value;
    
    // Если цена null (бесценно) — блокируем кнопку и меняем текст
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

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._title?.textContent || 'Товар');
    }
  }

  get id(): string {
    return this.container.dataset.id || '';
  }
}