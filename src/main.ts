// ============================================
// ИМПОРТЫ
// ============================================
import { API_URL, CDN_URL } from './utils/constants';
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
import { Header } from './components/view/Header';
import { Gallery } from './components/view/Gallery';
import { IProduct, IBuyer } from './types';
import './scss/styles.scss';

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

webLarekApi.getProducts()
  .then(data => {
    catalogModel.setItems(data.items);
  })
  .catch(err => console.error('Ошибка загрузки товаров:', err));

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
// Модальное окно
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Создаем компонент Header
const header = new Header(document.querySelector('.header') as HTMLElement);

// Создаем компонент галереи
const gallery = new Gallery(document.querySelector('.gallery') as HTMLElement);

// Корзина
const basket = new Basket(basketTemplate, () => {
  events.emit('basket:order');
});

// Форма заказа
const orderForm = new OrderForm(
  orderTemplate,
  (field, value) => {
    buyerModel.setField(field, value);
  },
  (data) => {
    events.emit('order:next');
  }
);

// Форма контактов
const contactsForm = new ContactsForm(
  contactsTemplate,
  (field, value) => {
    buyerModel.setField(field, value);
  },
  (data) => {
    events.emit('contacts:submit');
  }
);

// Компонент успешного заказа
const success = new Success(successTemplate, () => {
  modal.close();
  orderForm.reset();
  contactsForm.reset();
});

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ ПРЕЗЕНТЕРА
// ============================================

// 1. Каталог изменен - отрисовываем карточки
events.on('catalog:changed', (items: IProduct[]) => {
  const cards: HTMLElement[] = [];
  
  items.forEach(product => {
    const productId = product.id;
    const card = new CatalogCard(catalogTemplate, () => {
      events.emit('card:select', productId);
    });
    card.title = product.title;
    card.price = product.price;
    card.image = CDN_URL + product.image;
    card.category = product.category;
    cards.push(card.container);
  });
  
  gallery.renderCards(cards);
});

// 2. Выбран товар для просмотра - открываем модальное окно
events.on('catalog:selected', (product: IProduct | null) => {
  if (product) {
    const productId = product.id;
    const productData = product;
    
    const previewCard = new PreviewCard(
      previewTemplate,
      () => {
        cartModel.addItem(productData);
        previewCard.inCart = true;
        modal.close();
      },
      () => {
        cartModel.removeItem(productId);
        previewCard.inCart = false;
        modal.close();
      }
    );

    previewCard.title = product.title;
    previewCard.price = product.price;
    previewCard.image = CDN_URL + product.image;
    previewCard.category = product.category;
    previewCard.description = product.description;
    previewCard.inCart = cartModel.contains(product.id);
    
    modal.setContent(previewCard.container);
    modal.open();
  }
});

// 3. Корзина изменена - обновляем счетчик и содержимое
events.on('cart:changed', (data: { items: IProduct[], total: number, count: number }) => {
  header.count = data.count;
  
  if (basket) {
    const basketItems = data.items.map((item, index) => {
      const card = new BasketCard(basketCardTemplate, () => {
        events.emit('card:remove', item.id);
      });
      card.title = item.title;
      card.price = item.price;
      card.index = index + 1;
      return card.container;
    });
    basket.updateItems(basketItems);
    basket.updateTotal(data.total);
  }
});

// 4. Оформление заказа
events.on('basket:order', () => {
  orderForm.reset();  // сбрасываем предыдущие данные
  modal.setContent(orderForm.container);
  modal.open();
});

// 5. Переход к форме контактов
events.on('order:next', () => {
  contactsForm.reset();
  modal.setContent(contactsForm.container);
});

// 6. Отправка заказа
events.on('contacts:submit', async () => {
  if (!buyerModel.validate()) return;
  
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
    
    // Очищаем модели сразу после успешного заказа
    cartModel.clear();
    buyerModel.clear();
    orderForm.reset();
    contactsForm.reset();
    
    // Показываем экран успеха
    success.setTotal(result.total);
    modal.setContent(success.container);
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

// 7. Изменение данных покупателя - обновляем формы
events.on('buyer:changed', () => {
  const buyerData = buyerModel.getData();
  
  // Обновляем OrderForm
  if (orderForm) {
    orderForm.selectedPayment = buyerData.payment;
    orderForm.address = buyerData.address || '';
    
    const isValid = buyerModel.validateOrderStep();
    const errors = buyerModel.getOrderErrors();
    orderForm.setValid(isValid);
    orderForm.setErrors(errors);
  }
  
  // Обновляем ContactsForm
  if (contactsForm) {
    contactsForm.email = buyerData.email || '';
    contactsForm.phone = buyerData.phone || '';
    
    const isValid = buyerModel.validateContactsStep();
    const errors = buyerModel.getContactsErrors();
    contactsForm.setValid(isValid);
    contactsForm.setErrors(errors);
  }
});

// 8. Подписка на клик по корзине
header.onBasketClick(() => {
  const cartItems = cartModel.getItems();
  const basketItems = cartItems.map((item, index) => {
    const card = new BasketCard(basketCardTemplate, () => {
      cartModel.removeItem(item.id);
    });
    card.title = item.title;
    card.price = item.price;
    card.index = index + 1;
    return card.container;
  });
  basket.updateItems(basketItems);
  basket.updateTotal(cartModel.getTotal());
  
  modal.setContent(basket.container);
  modal.open();
});

// 9. Обработчик выбора карточки для просмотра
events.on('card:select', (productId: string) => {
  const selectedProduct = catalogModel.getProductById(productId);
  if (selectedProduct) {
    catalogModel.setSelectedProduct(selectedProduct);
  }
});

// 10. Обработчик удаления товара из корзины
events.on('card:remove', (productId: string) => {
  cartModel.removeItem(productId);
});