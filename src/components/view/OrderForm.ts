import { Form } from './Form';
import { IOrderFormData } from '../../types';

export class OrderForm extends Form<IOrderFormData> {
  protected _paymentButtons: NodeListOf<HTMLButtonElement>;
  protected _addressInput: HTMLInputElement;
  private _onChange: (field: keyof IOrderFormData, value: string) => void;

  constructor(
    template: HTMLTemplateElement, 
    onChange: (field: keyof IOrderFormData, value: string) => void,
    onSubmit: (data: IOrderFormData) => void
  ) {
    super(template);
    
    this._onChange = onChange;
    this._onSubmitCallback = onSubmit;
    
    this._paymentButtons = this.container.querySelectorAll('.order__buttons .button');
    this._addressInput = this.container.querySelector('[name="address"]') as HTMLInputElement;
    this._submitButton = this.container.querySelector('.order__button') as HTMLButtonElement;
    
    // Вызываем onChange, без изменения внешнего вида
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this._onChange('payment', button.name);
      });
    });
    
    this._addressInput.addEventListener('input', () => {
      this._onChange('address', this._addressInput.value);
    });
  }

  // Сеттер для выделения активной кнопки оплаты (вызывается из презентера)
  set selectedPayment(value: string | null) {
    this._paymentButtons.forEach(button => {
      if (button.name === value) {
        button.classList.add('button_alt-active');
      } else {
        button.classList.remove('button_alt-active');
      }
    });
  }

  // Сеттер для значения адреса
  set address(value: string) {
    this._addressInput.value = value;
  }

  setValid(isValid: boolean): void {
    this.toggleButton(isValid);
  }

  setErrors(errors: Partial<Record<keyof IOrderFormData, string>>): void {
    const filteredErrors: Partial<Record<keyof IOrderFormData, string>> = {};
    if (errors.payment) filteredErrors.payment = errors.payment;
    if (errors.address) filteredErrors.address = errors.address;
    this.showErrors(filteredErrors);
  }

  getData(): IOrderFormData {
    let payment: 'cash' | 'card' | null = null;
    this._paymentButtons.forEach(button => {
      if (button.classList.contains('button_alt-active')) {
        payment = button.name as 'cash' | 'card';
      }
    });
    return {
      payment: payment!,
      address: this._addressInput.value
    };
  }

  reset(): void {
    this.selectedPayment = null;
    this.address = '';
    this.toggleButton(false);
    this.showErrors({});
  }

  protected onSubmit(): void {
    if (this._onSubmitCallback && this.validate()) {
      this._onSubmitCallback(this.getData());
    }
  }

  protected validate(): boolean {
    const paymentSelected = this.container.querySelector('.button_alt-active') !== null;
    return paymentSelected && this._addressInput.value.trim() !== '';
  }
}