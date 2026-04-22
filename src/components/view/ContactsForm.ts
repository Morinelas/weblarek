import { Form } from './Form';
import { IContactsFormData } from '../../types';

export class ContactsForm extends Form<IContactsFormData> {
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  private _onSubmitCallback?: (data: IContactsFormData) => void;

  constructor(
    template: HTMLTemplateElement, 
    onChange: (field: keyof IContactsFormData, value: string) => void,
    onSubmit: (data: IContactsFormData) => void
  ) {
    super(template);
    
    this._onSubmitCallback = onSubmit;
    
    this._emailInput = this.container.querySelector('[name="email"]') as HTMLInputElement;
    this._phoneInput = this.container.querySelector('[name="phone"]') as HTMLInputElement;
    this._submitButton = this.container.querySelector('.button') as HTMLButtonElement;
    
    this._emailInput.addEventListener('input', () => {
      onChange('email', this._emailInput.value);
    });
    
    this._phoneInput.addEventListener('input', () => {
      onChange('phone', this._phoneInput.value);
    });
  }

  set email(value: string) {
    this._emailInput.value = value;
  }

  set phone(value: string) {
    this._phoneInput.value = value;
  }

  setValid(isValid: boolean): void {
    this.toggleButton(isValid);
  }

  setErrors(errors: Partial<Record<keyof IContactsFormData, string>>): void {
    const filteredErrors: Partial<Record<keyof IContactsFormData, string>> = {};
    if (errors.email) filteredErrors.email = errors.email;
    if (errors.phone) filteredErrors.phone = errors.phone;
    this.showErrors(filteredErrors);
  }

  getData(): IContactsFormData {
    return {
      email: this._emailInput.value,
      phone: this._phoneInput.value
    };
  }

  reset(): void {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this.toggleButton(false);
    this.showErrors({});
  }

  protected onSubmit(): void {
    if (this._onSubmitCallback) {
      this._onSubmitCallback(this.getData());
    }
  }
}