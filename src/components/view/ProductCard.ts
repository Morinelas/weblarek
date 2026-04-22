import { Card } from './Card';
import { categoryMap } from '../../utils/constants';

export abstract class ProductCard<T> extends Card<T> {
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    super(template);
    
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
  }

  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._title?.textContent || 'Товар');
    }
  }

  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      
      const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
      this._category.className = `card__category ${modifier}`;
    }
  }
}