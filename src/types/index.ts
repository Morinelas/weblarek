export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Тип оплаты
export type TPayment = 'cash' | 'card';

// Интерфейс покупателя
export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Тип для ошибок валидации
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс для каталога (модель)
export interface ICatalogModel {
  items: IProduct[];
  selectedProduct: IProduct | null;
  setItems(products: IProduct[]): void;
  getItems(): IProduct[];
  getProductById(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct | null): void;
  getSelectedProduct(): IProduct | null;
}

// Интерфейс для корзины
export interface ICartModel {
  items: IProduct[];
  addItem(product: IProduct): void;
  removeItem(id: string): void;
  clear(): void;
  getTotal(): number;
  getCount(): number;
  contains(id: string): boolean;
  getItems(): IProduct[];
}

// Интерфейс для покупателя (модель)
export interface IBuyerModel {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void;
  getData(): IBuyer;
  clear(): void;
  validate(): boolean;
  getErrors(): TBuyerErrors;
}

// Ответ сервера при получении списка товаров
export interface IProductsResponse {
  total: number;
  items: IProduct[];
}

// Данные для отправки заказа (POST /order/)
export interface IOrderData {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];  // массив id товаров
}

// Ответ сервера после успешного оформления заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Интерфейс для API (уже есть в стартере, но уточним)
export interface IApi {
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: string): Promise<T>;
}
