import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _onSubmit?: (data: T) => void;

  constructor(template: HTMLTemplateElement) {
    if (!template) {
      throw new Error('Form: template не найден');
    }
    
    const element = template.content?.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) {
      throw new Error('Form: не удалось клонировать элемент из шаблона');
    }
    
    super(element);
    
    this._form = this.container as HTMLFormElement;
    this._submitButton = this.container.querySelector('.button') as HTMLButtonElement;
    this._errors = this.container.querySelector('.form__errors') as HTMLElement;
    
    if (this._form) {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.onSubmit();
    });
    }
  }

  setValue(field: keyof T, value: string): void {
    const input = this._form?.querySelector(`[name="${String(field)}"]`) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }

  protected validate(): boolean {
    return true;
  }

  showErrors(errors: Partial<Record<keyof T, string>>): void {
    if (this._errors) {
      const errorMessages = Object.values(errors).filter(Boolean).join(', ');
      this._errors.textContent = errorMessages;
    }
  }

  toggleButton(state: boolean): void {
    if (this._submitButton) {
      this._submitButton.disabled = !state;
    }
  }

  protected onSubmit(): void {}
}