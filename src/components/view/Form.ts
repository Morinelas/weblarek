import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _onSubmit?: (data: T) => void;

  constructor(protected readonly container: HTMLElement, template: HTMLTemplateElement) {
    super(container);
    
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Не удалось клонировать элемент из шаблона');
    
    this.container = element;
    
    this._form = this.container as HTMLFormElement;
    this._submitButton = this.container.querySelector('.button') as HTMLButtonElement;
    this._errors = this.container.querySelector('.form__errors') as HTMLElement;
    
    // Устанавливаем слушатель на отправку формы
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
  }

  // Установить значение поля
  setValue(field: keyof T, value: string): void {
    const input = this._form.querySelector(`[name="${String(field)}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  // Валидация формы (должна быть переопределена в дочерних классах)
  protected validate(): boolean {
    return true;
  }

  // Показать ошибки
  showErrors(errors: Partial<Record<keyof T, string>>): void {
    if (this._errors) {
      const errorMessages = Object.values(errors).filter(Boolean).join(', ');
      this._errors.textContent = errorMessages;
    }
  }

  // Заблокировать/разблокировать кнопку
  toggleButton(state: boolean): void {
    if (this._submitButton) {
      this._submitButton.disabled = !state;
    }
  }

  // Обработчик отправки формы (будет переопределен в дочерних классах)
  protected onSubmit(): void {}

  render(data?: Partial<T>): HTMLElement {
    if (data) {
      Object.assign(this, data);
    }
    return this.container;
  }
}