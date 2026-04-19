import { Form } from './Form';
import { IOrderFormData } from '../../types';

export class OrderForm extends Form<IOrderFormData> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;
  protected _selectedPayment: string | null = null;

  constructor(container: HTMLElement, template: HTMLTemplateElement, onSubmit: (data: IOrderFormData) => void) {
    super(container, template);
    
    this._paymentButtons = this.container.querySelectorAll('.order__buttons .button');
    this._addressInput = this.container.querySelector('[name="address"]') as HTMLInputElement;
    this._submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;

    // Устанавливаем обработчики на кнопки оплаты
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.selectPayment(button.name);
      });
    });
    
    // Слушаем изменение адреса
    this._addressInput.addEventListener('input', () => {
      this.validateAndNotify();
    });
    
    // Сохраняем колбэк для отправки
    this._onSubmit = onSubmit;
  }

  // Выбрать способ оплаты
  private selectPayment(payment: string): void {
    this._selectedPayment = payment;
    
    // Обновляем активный класс на кнопках
    this._paymentButtons.forEach(button => {
      if (button.name === payment) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });

    this.validateAndNotify();
  }

  // Валидация формы
  protected validate(): boolean {
    const addressValid = this._addressInput.value.trim() !== '';
    const paymentValid = this._selectedPayment !== null;
    return addressValid && paymentValid;
  }

  // Проверить и уведомить о валидности
  private validateAndNotify(): void {
    const isValid = this.validate();
    this.toggleButton(isValid);
    
    // Показываем ошибки если есть
    const errors: Partial<Record<keyof IOrderFormData, string>> = {};
    if (this._addressInput.value.trim() === '') {
      errors.address = 'Необходимо указать адрес';
    }
    if (this._selectedPayment === null) {
      errors.payment = 'Выберите способ оплаты';
    }
    this.showErrors(errors);
  }

  protected validate(): boolean {
    const addressValid = this._addressInput.value.trim() !== '';
    const paymentValid = this._selectedPayment !== null;
    return addressValid && paymentValid;
  }

  // Отправка формы
  protected onSubmit(): void {
    if (this.validate() && this._onSubmit) {
      this._onSubmit({
        payment: this._selectedPayment as 'cash' | 'card',
        address: this._addressInput.value
      });
    }
  }

  // Сброс формы
  reset(): void {
    this._selectedPayment = null;
    this._addressInput.value = '';
    this._paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
    });
    this.toggleButton(false);
    this.showErrors({});
  }
}