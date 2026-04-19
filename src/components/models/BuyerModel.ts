import { IBuyer, IBuyerModel, TPayment, TBuyerErrors } from '../../types';
import { EventEmitter } from '../base/EventEmitter';

export class BuyerModel implements IBuyerModel {
  private _payment: TPayment | null = null;  // пустое значение
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';
  private _events: EventEmitter;

  constructor(events: EventEmitter) {
    this._events = events;
  }
  
  // Сохранить значение конкретного поля
  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    switch (field) {
      case 'payment':
        this._payment = value as TPayment;
        break;
      case 'email':
        this._email = value as string;
        break;
      case 'phone':
        this._phone = value as string;
        break;
      case 'address':
        this._address = value as string;
        break;
    }
     // Генерируем событие об изменении данных
    this._events.emit('buyer:changed', this.getData());
    // Генерируем событие об изменении валидности
    this._events.emit('buyer:validity', this.validate());
  }

  // Получить все данные покупателя
  getData(): IBuyer {
    return {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  // Очистить данные покупателя
  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this._events.emit('buyer:changed', this.getData());
    this._events.emit('buyer:validity', false);
  }

  // Валидация всех полей
  validate(): boolean {
    return Object.keys(this.getErrors()).length === 0;
  }

  // Получить ошибки валидации для каждого поля
  getErrors(): TBuyerErrors {
    const errors: TBuyerErrors = {};

     // Проверка payment
    if (this._payment === null) {
    errors.payment = 'Выберите способ оплаты';
    }
    
    if (this._email.trim() === '') {
      errors.email = 'Укажите email';
    }
    
    if (this._phone.trim() === '') {
      errors.phone = 'Укажите телефон';
    }
    
    if (this._address.trim() === '') {
      errors.address = 'Укажите адрес';
    }
    
    return errors;
  }
}