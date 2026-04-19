import { Component } from '../base/Component';
import { EventEmitter } from '../base/EventEmitter';

export class Modal extends Component<{}> {
  protected _modal: HTMLElement;
  protected _content: HTMLElement;
  protected _closeButton: HTMLButtonElement;
  protected _events: EventEmitter;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this._events = events;
    
    this._modal = this.container;
    this._content = this.container.querySelector('.modal__content') as HTMLElement;
    this._closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;
    
    // Закрытие по клику на крестик
    this._closeButton.addEventListener('click', () => {
      this.close();
    });
    
    // Закрытие по клику вне модального окна
    this._modal.addEventListener('click', (e) => {
      if (e.target === this._modal) {
        this.close();
      }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  // Открыть модальное окно
  open(): void {
    this._modal.classList.add('modal_active');
    this._events.emit('modal:open');
  }

  // Закрыть модальное окно
  close(): void {
    this._modal.classList.remove('modal_active');
    this._content.innerHTML = '';
  }

  // Установить контент
  setContent(content: HTMLElement): void {
    this._content.innerHTML = '';
    this._content.appendChild(content);
  }

  // Установить заголовок (опционально)
  setTitle(title: string): void {
    const titleElement = this._content.querySelector('.modal__title');
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  // Проверить, открыто ли окно
  get isOpen(): boolean {
    return this._modal.classList.contains('modal_active');
  }
}