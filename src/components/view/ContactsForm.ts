import { Form } from './Form';
import { IContactsFormData } from '../../types';

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _onSubmit?: (data: IContactsFormData) => void;

  constructor(container: HTMLElement, template: HTMLTemplateElement, onSubmit: (data: IContactsFormData) => void) {
    super(container, template);
    
    this._emailInput = this.container.querySelector('[name="email"]') as HTMLInputElement;
    this._phoneInput = this.container.querySelector('[name="phone"]') as HTMLInputElement;
    this._onSubmit = onSubmit;
    
    // Слушаем изменения полей
    this._emailInput.addEventListener('input', () => {
      this.validateAndNotify();
    });
    
    this._phoneInput.addEventListener('input', () => {
      this.validateAndNotify();
    });
  }

  // Валидация формы
  protected validate(): boolean {
    const emailValid = this._emailInput.value.trim() !== '' && this._emailInput.value.includes('@');
    const phoneValid = this._phoneInput.value.trim() !== '';
    return emailValid && phoneValid;
  }

  // Проверить и уведомить о валидности
  private validateAndNotify(): void {
    const isValid = this.validate();
    this.toggleButton(isValid);
    
    // Показываем ошибки
    const errors: Partial<Record<keyof IContactsFormData, string>> = {};
    if (this._emailInput.value.trim() === '') {
      errors.email = 'Укажите email';
    } else if (!this._emailInput.value.includes('@')) {
      errors.email = 'Введите корректный email';
    }
    if (this._phoneInput.value.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    this.showErrors(errors);
  }

  // Отправка формы
  protected onSubmit(): void {
    if (this.validate() && this._onSubmit) {
      this._onSubmit({
        email: this._emailInput.value,
        phone: this._phoneInput.value
      });
    }
  }

  // Сброс формы
  reset(): void {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this.toggleButton(false);
    this.showErrors({});
  }
}