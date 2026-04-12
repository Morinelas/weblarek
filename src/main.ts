import './scss/styles.scss';
import { API_URL } from './utils/constants';
// Импортируем тестовые данные
import { apiProducts } from './utils/data';

// Импортируем модели данных
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

// Импортируем типы для информации (чтобы TS понимал структуру)
import { IProduct } from './types';

// ============================================
// 1. ПРОВЕРКА РАБОТЫ КАТАЛОГА (CatalogModel)
// ============================================
console.log('========== ПРОВЕРКА КАТАЛОГА ==========');

const catalogModel = new CatalogModel();

// Проверяем setItems() и getItems()
console.log('1. Сохраняем товары в каталог...');
catalogModel.setItems(apiProducts.items);
console.log('2. Получаем массив товаров из каталога:');
console.log(catalogModel.getItems());
console.log(`   (всего товаров: ${catalogModel.getItems().length})`);

// Проверяем getProductById()
console.log('\n3. Ищем товар по id "1":');
const productById = catalogModel.getProductById('1');
console.log('   Найденный товар:', productById);

// Проверяем setSelectedProduct() и getSelectedProduct()
console.log('\n4. Сохраняем товар для подробного просмотра (выбираем товар с id "2"):');
const productToSelect = catalogModel.getProductById('2');
if (productToSelect) {
    catalogModel.setSelectedProduct(productToSelect);
    console.log('   Выбранный товар:', catalogModel.getSelectedProduct());
}

console.log('\n✅ Проверка каталога завершена\n');

// ============================================
// 2. ПРОВЕРКА РАБОТЫ КОРЗИНЫ (CartModel)
// ============================================
console.log('========== ПРОВЕРКА КОРЗИНЫ ==========');

const cartModel = new CartModel();

// Посмотрим, какие id есть на самом деле
const allProducts = catalogModel.getItems();
console.log('Доступные id товаров:', allProducts.map(p => ({ id: p.id, title: p.title })));

// Берем реальные товары из каталога
const productA = allProducts[0];  // первый товар
const productB = allProducts[1];  // второй товар

console.log('\n2. Добавляем товары в корзину:');
if (productA) {
    cartModel.addItem(productA);
    console.log(`   + Добавлен: ${productA.title} (${productA.price} ₽)`);
}
if (productB) {
    cartModel.addItem(productB);
    console.log(`   + Добавлен: ${productB.title} (${productB.price} ₽)`);
}

console.log(`\n3. Состояние корзины после добавления:`);
console.log(`   Товаров в корзине: ${cartModel.getCount()}`);
console.log(`   Общая стоимость: ${cartModel.getTotal()} ₽`);
console.log(`   Содержимое:`, cartModel.getItems());

// Проверяем contains() с реальным id
if (productA) {
    console.log(`\n4. Проверяем наличие товара с id "${productA.id}":`);
    console.log(`   Товар в корзине? ${cartModel.contains(productA.id) ? 'Да ✅' : 'Нет ❌'}`);
}

// Проверяем removeItem()
if (productA) {
    console.log(`\n5. Удаляем товар с id "${productA.id}" из корзины:`);
    cartModel.removeItem(productA.id);
    console.log(`   Товаров в корзине после удаления: ${cartModel.getCount()}`);
}

console.log('\n✅ Проверка корзины завершена\n');

// ============================================
// 3. ПРОВЕРКА РАБОТЫ ПОКУПАТЕЛЯ (BuyerModel)
// ============================================
console.log('========== ПРОВЕРКА МОДЕЛИ ПОКУПАТЕЛЯ ==========');

const buyerModel = new BuyerModel();

// Проверяем начальное состояние
console.log('1. Начальное состояние данных покупателя:');
console.log('   Данные:', buyerModel.getData());
console.log('   Валидность:', buyerModel.validate());
console.log('   Ошибки:', buyerModel.getErrors());

// Проверяем setField() - заполняем данные по одному полю
console.log('\n2. Заполняем данные покупателя (по одному полю):');
buyerModel.setField('email', 'test@example.com');
console.log('   ✓ Установлен email: test@example.com');
buyerModel.setField('phone', '+7 (999) 123-45-67');
console.log('   ✓ Установлен телефон: +7 (999) 123-45-67');
buyerModel.setField('address', 'г. Москва, ул. Тестовая, д. 1');
console.log('   ✓ Установлен адрес: г. Москва, ул. Тестовая, д. 1');
buyerModel.setField('payment', 'card');
console.log('   ✓ Установлен способ оплаты: card');

console.log('\n3. Данные покупателя после заполнения:');
console.log('   Данные:', buyerModel.getData());
console.log('   Валидность:', buyerModel.validate());
console.log('   Ошибки:', buyerModel.getErrors());

// Проверяем валидацию с неполными данными
console.log('\n4. Проверяем валидацию с неполными данными:');
const buyerModel2 = new BuyerModel();
buyerModel2.setField('email', 'test@example.com');
buyerModel2.setField('phone', '');
buyerModel2.setField('address', '');
console.log('   Данные (только email):', buyerModel2.getData());
console.log('   Валидность:', buyerModel2.validate());
console.log('   Ошибки:', buyerModel2.getErrors());

// Проверяем clear()
console.log('\n5. Очищаем данные покупателя:');
buyerModel.clear();
console.log('   Данные после очистки:', buyerModel.getData());
console.log('   Валидность:', buyerModel.validate());

console.log('\n✅ Проверка модели покупателя завершена\n');

// ============================================
// ИТОГОВЫЙ ВЫВОД
// ============================================
console.log('========== ВСЕ ПРОВЕРКИ ЗАВЕРШЕНЫ ==========');
console.log('✅ Модель каталога (CatalogModel) - работает');
console.log('✅ Модель корзины (CartModel) - работает');
console.log('✅ Модель покупателя (BuyerModel) - работает');
console.log('\n📝 Модели данных полностью самостоятельны и не зависят от UI');

// ============================================
// 4. ПОДКЛЮЧЕНИЕ К СЕРВЕРУ
// ============================================
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/WebLarekApi';
import { IProductsResponse } from './types';

async function loadProductsFromServer() {
  console.log('\n========== ЗАГРУЗКА ТОВАРОВ С СЕРВЕРА ==========');
  
  // Создаем экземпляр базового API с адресом из .env
  const baseApi = new Api(API_URL);
  
  // Создаем экземпляр нашего WebLarekApi
  const webLarekApi = new WebLarekApi(baseApi);
  
  try {
    // Получаем товары с сервера
    const productsResponse: IProductsResponse = await webLarekApi.getProducts();
    console.log('1. Ответ от сервера:', productsResponse);
    console.log(`2. Получено товаров: ${productsResponse.items.length}`);
    
    // Сохраняем товары в модель каталога
    catalogModel.setItems(productsResponse.items);
    console.log('3. Товары сохранены в каталог');
    
    // Проверяем, что сохранилось
    const savedProducts = catalogModel.getItems();
    console.log('4. Каталог после сохранения:');
    console.log(savedProducts);
    console.log(`   (всего товаров: ${savedProducts.length})`);
    
    // Выводим названия всех товаров для наглядности
    console.log('\n5. Список товаров в магазине:');
    savedProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title} — ${product.price} ₽`);
    });
    
  } catch (error) {
    console.error('Ошибка при загрузке товаров с сервера:', error);
  }
}

// Запускаем загрузку товаров с сервера
loadProductsFromServer();