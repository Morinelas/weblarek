import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';

export abstract class Card<T> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _category?: HTMLElement;

  constructor(protected readonly container: HTMLElement, template: HTMLTemplateElement) {
    super(container);
    
    // Клонируем содержимое шаблона
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Не удалось клонировать элемент из шаблона');
    
    // Заменяем контейнер на клонированный элемент
    this.container = element;
    
    // Находим элементы
    this._title = this.container.querySelector('.card__title') as HTMLElement;
    this._price = this.container.querySelector('.card__price') as HTMLElement;
    this._image = this.container.querySelector('.card__image') as HTMLImageElement;
    this._category = this.container.querySelector('.card__category') as HTMLElement;
  }

  // Сеттер для заголовка
  set title(value: string) {
    if (this._title) {
      this._title.textContent = value;
    }
  }

  // Сеттер для цены
  set price(value: number | null) {
    if (this._price) {
      this._price.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
  }

  // Сеттер для изображения
  set image(value: string) {
    if (this._image) {
      this.setImage(this._image, value, this._title?.textContent || 'Товар');
    }
  }

  // Сеттер для категории
  set category(value: string) {
    if (this._category) {
      this._category.textContent = value;
      // Применяем модификатор для фона из categoryMap
      const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
      this._category.classList.add(modifier);
    }
  }

  // Рендер
  render(data?: Partial<T>): HTMLElement {
    if (data) {
      Object.assign(this, data);
    }
    return this.container;
  }
}