// ============================================
// ИМПОРТЫ
// ============================================
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';
import { WebLarekApi } from './components/WebLarekApi';
import { Modal } from './components/view/Modal';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';
import { CatalogCard } from './components/view/CatalogCard';
import { PreviewCard } from './components/view/PreviewCard';
import { BasketCard } from './components/view/BasketCard';
import { IProduct } from './types';
import './scss/styles.scss';
import { CDN_URL } from './utils/constants';

// ============================================
// ИНИЦИАЛИЗАЦИЯ БРОКЕРА СОБЫТИЙ И МОДЕЛЕЙ
// ============================================
const events = new EventEmitter();
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// ============================================
// ИНИЦИАЛИЗАЦИЯ API И ЗАГРУЗКА ТОВАРОВ
// ============================================
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// Загружаем товары с сервера
webLarekApi.getProducts()
  .then(data => {
    catalogModel.setItems(data.items);
  })
  .catch(err => console.error('Ошибка загрузки товаров:', err));

// ============================================
// DOM ЭЛЕМЕНТЫ
// ============================================
const gallery = document.querySelector('.gallery') as HTMLElement;
const basketHeaderButton = document.querySelector('.header__basket') as HTMLButtonElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;

// ============================================
// ТЕМПЛЕЙТЫ
// ============================================
const catalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// ============================================
// КОМПОНЕНТЫ
// ============================================
let modal: Modal;
let basket: Basket;
let orderForm: OrderForm;
let contactsForm: ContactsForm;
let success: Success;

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ПРЕЗЕНТЕРА
// ============================================

// 1. Каталог изменен - отрисовываем карточки
events.on('catalog:changed', (items: IProduct[]) => {
  gallery.innerHTML = '';
  items.forEach(product => {
    const card = new CatalogCard(gallery, catalogTemplate, (id) => {
      // Выбор карточки для просмотра
      const selectedProduct = catalogModel.getProductById(id);
      if (selectedProduct) {
        catalogModel.setSelectedProduct(selectedProduct);
      }
    });
    card.id = product.id;
    card.title = product.title;
    card.price = product.price;
    card.image = CDN_URL + product.image;
    card.category = product.category;
    gallery.appendChild(card.render());
  });
});

// 2. Выбран товар для просмотра - открываем модальное окно
events.on('catalog:selected', (product: IProduct | null) => {
  if (product) {
    const previewCard = new PreviewCard(
        gallery,
        previewTemplate,
        (id) => {
          // Добавляем товар в корзину
          cartModel.addItem(product);
          // Обновляем состояние кнопки
          previewCard.inCart = true;
          modal.close();
        },
        (id) => {
          // Удаляем товар из корзины
          cartModel.removeItem(id);
          // Обновляем состояние кнопки
          previewCard.inCart = false;
          modal.close();
        }
      );

    previewCard.id = product.id;
    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.image = CDN_URL + product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;

    // Проверяем, есть ли товар уже в корзине
    previewCard.inCart = cartModel.contains(product.id);
    modal.setContent(previewCard.render());
    modal.open();
  }
});

// 3. Корзина изменена - обновляем счетчик и содержимое
events.on('cart:changed', (data: { items: IProduct[], total: number, count: number }) => {
  basketCounter.textContent = String(data.count);
  
  if (basket) {
    const basketItems = data.items.map((item, index) => {
      const card = new BasketCard(gallery, basketCardTemplate, (id) => {
        cartModel.removeItem(id);
      });
      card.id = item.id;
      card.title = item.title;
      card.price = item.price;
      card.index = index + 1;
      return card.render();
    });
    basket.updateItems(basketItems);
    basket.updateTotal(data.total);
  }
});

// 4. Открытие корзины (по клику на иконку)
basketHeaderButton.addEventListener('click', () => {
  if (!basket) {
    basket = new Basket(gallery, basketTemplate, () => {
      events.emit('basket:order');
    });
  }
  
  const cartItems = cartModel.getItems();
  const basketItems = cartItems.map((item, index) => {
    const card = new BasketCard(gallery, basketCardTemplate, (id) => {
      cartModel.removeItem(id);
    });
    card.id = item.id;
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.render();
  });
  basket.updateItems(basketItems);
  basket.updateTotal(cartModel.getTotal());
  
  modal.setContent(basket.render());
  modal.open();
});

// 5. Оформление заказа
events.on('basket:order', () => {
  orderForm = new OrderForm(gallery, orderTemplate, (data) => {
    buyerModel.setField('payment', data.payment);
    buyerModel.setField('address', data.address);
    events.emit('order:next');
  });
  modal.setContent(orderForm.render());
});

// 6. Переход к форме контактов
events.on('order:next', () => {
  contactsForm = new ContactsForm(gallery, contactsTemplate, (data) => {
    buyerModel.setField('email', data.email);
    buyerModel.setField('phone', data.phone);
    events.emit('contacts:submit');
  });
  modal.setContent(contactsForm.render());
});

// 7. Отправка заказа
events.on('contacts:submit', async () => {
  const buyerData = buyerModel.getData();
  const orderData = {
    payment: buyerData.payment!,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cartModel.getTotal(),
    items: cartModel.getItems().map(item => item.id)
  };
  
  try {
    const result = await webLarekApi.postOrder(orderData);
    success = new Success(gallery, successTemplate, () => {
      modal.close();
      cartModel.clear();
      buyerModel.clear();
    });
    success.setTotal(result.total);
    modal.setContent(success.render());
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

// 8. Изменение валидности данных покупателя - обновляем состояние кнопок форм
events.on('buyer:validity', (isValid: boolean) => {
  if (orderForm) orderForm.toggleButton(isValid);
  if (contactsForm) contactsForm.toggleButton(isValid);
});

// 9. Модальное окно
modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);