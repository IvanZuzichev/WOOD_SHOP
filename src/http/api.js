// src/http/api.js
// Базовый URL API (можно вынести в переменные окружения)
const API_URL = import.meta.env.VITE_API_URL || 'https://cms.centertkani.ru/api';

// Утилита для работы с куками
const cookieUtils = {
  get(name) {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  set(name, value, days = 7, path = '/') {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=" + path + "; SameSite=Lax";
  },

  remove(name, path = '/') {
    if (typeof document === 'undefined') return;
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=' + path + ';';
  }
};

// Утилита для получения токена из всех возможных источников
const getAuthToken = () => {
  const token =
    localStorage.getItem('authToken') ||
    cookieUtils.get('authToken') ||
    null;

  console.log('🔐 getAuthToken - Токен найден:', token ? `присутствует (${token.substring(0, 20)}...)` : 'отсутствует');
  return token;
};

// Утилита для получения заголовков с авторизацией
const getHeaders = (includeAuth = true, isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ getHeaders - Токен не найден, запрос без авторизации');
    }
  }

  return headers;
};

// Базовый класс для работы с API
class ApiService {
  constructor(baseURL = API_URL) {
    this.baseURL = baseURL;
  }

  async _handleResponse(response) {
    console.log('🔵 API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      let errorDetails = null;

      if (response.status === 401) {
        errorMessage = "Необходима авторизация";
        localStorage.removeItem('authToken');
      } else if (response.status === 403) {
        errorMessage = "Доступ запрещен";
      } else if (response.status === 404) {
        errorMessage = "Ресурс не найден";
      } else if (response.status === 500) {
        errorMessage = "Ошибка сервера";
      }

      try {
        const responseClone = response.clone();
        const errorData = await responseClone.json();
        errorDetails = errorData;

        if (errorData.error) {
          const strapiError = errorData.error;
          if (strapiError.details && strapiError.details.errors) {
            const validationErrors = strapiError.details.errors.map(err =>
              `${err.path.join('.')}: ${err.message}`
            ).join(', ');
            errorMessage = `Ошибка валидации: ${validationErrors}`;
          } else if (strapiError.message) {
            errorMessage = strapiError.message;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.data === null && errorData.error) {
          const err = errorData.error;
          if (err.message) {
            errorMessage = err.message;
          } else if (err.name) {
            errorMessage = `Ошибка ${err.name}`;
          }
        }

      } catch (parseError) {
        try {
          const text = await response.text();
          if (text) {
            errorMessage = text;
          }
        } catch {
          // Если не удалось прочитать, используем стандартное сообщение
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.statusText = response.statusText;
      error.details = errorDetails;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (data.success === false || data.error === true) {
      const error = new Error(data.message || 'Ошибка запроса');
      error.status = response.status;
      throw error;
    }

    if (data.success === true) {
      const { success, ...rest } = data;
      return rest;
    }

    return data;
  }

  async get(endpoint, params = {}, includeAuth = true) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}${endpoint}${queryString ? `?${queryString}` : ''}`;

      console.log('API GET Request:', { url });

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(includeAuth),
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  async post(endpoint, data = {}, includeAuth = true, isFormData = false) {
    try {
      const body = isFormData ? data : JSON.stringify(data);

      console.log('API POST Request:', {
        url: `${this.baseURL}${endpoint}`,
        isFormData
      });

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(includeAuth, isFormData),
        body: body,
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  async put(endpoint, data = {}, includeAuth = true, isFormData = false) {
    try {
      const body = isFormData ? data : JSON.stringify(data);
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(includeAuth, isFormData),
        body: body,
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  async delete(endpoint, data = {}, includeAuth = true) {
    try {
      console.log('🗑️ API DELETE Request:', { url: `${this.baseURL}${endpoint}` });

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(includeAuth),
        body: data && Object.keys(data).length > 0 ? JSON.stringify(data) : undefined,
      });

      return await this._handleResponse(response);
    } catch (error) {
      console.error('❌ API DELETE Error:', error);
      throw error;
    }
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthToken() {
    return getAuthToken();
  }
}

// Создаем экземпляр API сервиса
const api = new ApiService();

// Моковые данные для материалов дерева (ткани для дерева/лдсп/мдф)
const mockWoodMaterials = [
  {
    id: 1,
    title: "Шпон ясеня натуральный",
    description: "Натуральный шпон ясеня для отделки мебели и интерьера",
    price: 850,
    discount: 15,
    discount_price: 722,
    article: "SHVON-ASH-001",
    composition: "Натуральный шпон ясеня",
    width: "630 мм",
    density: "0.65 г/см³",
    country: "Россия",
    category: "Шпон",
    brand: "WoodMaster",
    is_new: true,
    images: [
      {
        url: "/materials/wood/1/1.jpg",
        alt: "Шпон ясеня"
      },
      {
        url: "/materials/wood/1/2.jpg",
        alt: "Шпон ясеня - текстура"
      }
    ],
    stock: 45,
    characteristics: {
      thickness: "0.6 мм",
      length: "2500 мм",
      moisture: "8%",
      fire_resistance: "B2"
    }
  },
  {
    id: 2,
    title: "Пленка ПВХ под дуб",
    description: "ПВХ пленка с текстурой дуба для оклейки МДФ и ДСП",
    price: 320,
    discount: 0,
    discount_price: 320,
    article: "PVK-DUB-002",
    composition: "Поливинилхлорид",
    width: "1370 мм",
    density: "1.4 г/см³",
    country: "Германия",
    category: "Пленки",
    brand: "Renolit",
    is_new: false,
    images: [
      {
        url: "/materials/wood/2/1.jpg",
        alt: "Пленка ПВХ дуб"
      }
    ],
    stock: 120,
    characteristics: {
      thickness: "0.4 мм",
      roll_length: "50 м",
      adhesive: "Клейкая основа",
      temperature_range: "-20°C до +80°C"
    }
  },
  {
    id: 3,
    title: "Ламинированное ДСП Эггер",
    description: "Ламинированная древесно-стружечная плита премиум класса",
    price: 1850,
    discount: 10,
    discount_price: 1665,
    article: "LDS-EGG-003",
    composition: "ДСП, меламиновая пленка",
    width: "2070 мм",
    density: "650 кг/м³",
    country: "Австрия",
    category: "ЛДСП",
    brand: "Egger",
    is_new: true,
    images: [
      {
        url: "/materials/wood/3/1.jpg",
        alt: "ЛДСП Эггер"
      },
      {
        url: "/materials/wood/3/2.jpg",
        alt: "ЛДСП структура"
      }
    ],
    stock: 28,
    characteristics: {
      thickness: "16 мм",
      size: "2800x2070 мм",
      formaldehyde: "E0.5",
      weight: "70 кг"
    }
  },
  {
    id: 4,
    title: "МДФ крашеный матовый",
    description: "Окрашенная МДФ плита матового покрытия",
    price: 2150,
    discount: 5,
    discount_price: 2042,
    article: "MDF-PNT-004",
    composition: "МДФ, полиуретановая краска",
    width: "1220 мм",
    density: "850 кг/м³",
    country: "Россия",
    category: "МДФ",
    brand: "Kronospan",
    is_new: false,
    images: [
      {
        url: "/materials/wood/4/1.jpg",
        alt: "МДФ крашеный"
      }
    ],
    stock: 35,
    characteristics: {
      thickness: "18 мм",
      size: "2440x1220 мм",
      color: "Белый матовый",
      surface: "Гладкая"
    }
  },
  {
    id: 5,
    title: "Шпон ореха радиальный срез",
    description: "Элитный шпон ореха радиального среза",
    price: 1250,
    discount: 20,
    discount_price: 1000,
    article: "SHVON-WAL-005",
    composition: "Натуральный шпон ореха",
    width: "600 мм",
    density: "0.68 г/см³",
    country: "Италия",
    category: "Шпон",
    brand: "Alpi",
    is_new: true,
    images: [
      {
        url: "/materials/wood/5/1.jpg",
        alt: "Шпон ореха"
      },
      {
        url: "/materials/wood/5/2.jpg",
        alt: "Текстура ореха"
      }
    ],
    stock: 18,
    characteristics: {
      thickness: "0.7 мм",
      length: "2400 мм",
      cut_type: "Радиальный",
      grade: "A"
    }
  },
  {
    id: 6,
    title: "Пленка акриловая под ясень",
    description: "Акриловая пленка 3D эффект под ясень",
    price: 450,
    discount: 0,
    discount_price: 450,
    article: "ACR-ASH-006",
    composition: "Акрил, ПВХ",
    width: "1250 мм",
    density: "1.2 г/см³",
    country: "Корея",
    category: "Пленки",
    brand: "LG Hausys",
    is_new: true,
    images: [
      {
        url: "/materials/wood/6/1.jpg",
        alt: "Акриловая пленка"
      }
    ],
    stock: 75,
    characteristics: {
      thickness: "0.5 мм",
      roll_length: "30 м",
      effect: "3D текстура",
      scratch_resistance: "Высокая"
    }
  },
  {
    id: 7,
    title: "ЛДСП Kronospan глянец",
    description: "Ламинированное ДСП с глянцевой поверхностью",
    price: 1950,
    discount: 12,
    discount_price: 1716,
    article: "LDS-KRN-007",
    composition: "ДСП, глянцевая пленка",
    width: "1830 мм",
    density: "680 кг/м³",
    country: "Польша",
    category: "ЛДСП",
    brand: "Kronospan",
    is_new: false,
    images: [
      {
        url: "/materials/wood/7/1.jpg",
        alt: "ЛДСП глянец"
      }
    ],
    stock: 42,
    characteristics: {
      thickness: "25 мм",
      size: "2620x1830 мм",
      surface: "Глянцевая",
      color: "Черный"
    }
  },
  {
    id: 8,
    title: "МДФ фрезерованный",
    description: "Фрезерованная МДФ плита для декоративных элементов",
    price: 2750,
    discount: 8,
    discount_price: 2530,
    article: "MDF-FRE-008",
    composition: "МДФ высокой плотности",
    width: "1220 мм",
    density: "900 кг/м³",
    country: "Германия",
    category: "МДФ",
    brand: "Egger",
    is_new: true,
    images: [
      {
        url: "/materials/wood/8/1.jpg",
        alt: "Фрезерованный МДФ"
      },
      {
        url: "/materials/wood/8/2.jpg",
        alt: "Узор МДФ"
      }
    ],
    stock: 22,
    characteristics: {
      thickness: "22 мм",
      size: "2440x1220 мм",
      pattern: "Рельефный",
      paintability: "Отличная"
    }
  }
];

// Моковые категории для деревянных материалов
const mockWoodCategories = [
  {
    id: 1,
    name: "Шпон",
    slug: "shpon",
    description: "Натуральный шпон для отделки мебели",
    image: "/categories/shon.jpg",
    product_count: 12
  },
  {
    id: 2,
    name: "Пленки",
    slug: "plenki",
    description: "ПВХ и акриловые пленки для оклейки",
    image: "/categories/plenki.jpg",
    product_count: 25
  },
  {
    id: 3,
    name: "ЛДСП",
    slug: "ldsp",
    description: "Ламинированное ДСП различных марок",
    image: "/categories/ldsp.jpg",
    product_count: 18
  },
  {
    id: 4,
    name: "МДФ",
    slug: "mdf",
    description: "МДФ плиты различных плотностей",
    image: "/categories/mdf.jpg",
    product_count: 15
  }
];

// Моковые бренды для деревянных материалов
const mockWoodBrands = [
  {
    id: 1,
    name: "Egger",
    slug: "egger",
    description: "Австрийский производитель древесных плит",
    logo: "/brands/egger.png",
    country: "Австрия"
  },
  {
    id: 2,
    name: "Kronospan",
    slug: "kronospan",
    description: "Мировой лидер в производстве древесных плит",
    logo: "/brands/kronospan.png",
    country: "Польша"
  },
  {
    id: 3,
    name: "Alpi",
    slug: "alpi",
    description: "Итальянский производитель элитного шпона",
    logo: "/brands/alpi.png",
    country: "Италия"
  },
  {
    id: 4,
    name: "Renolit",
    slug: "renolit",
    description: "Немецкий производитель ПВХ пленок",
    logo: "/brands/renolit.png",
    country: "Германия"
  },
  {
    id: 5,
    name: "LG Hausys",
    slug: "lg-hausys",
    description: "Корейский производитель акриловых пленок",
    logo: "/brands/lg-hausys.png",
    country: "Корея"
  },
  {
    id: 6,
    name: "WoodMaster",
    slug: "woodmaster",
    description: "Российский производитель шпона",
    logo: "/brands/woodmaster.png",
    country: "Россия"
  }
];

// Утилита для фильтрации моковых данных
const filterMockProducts = (products, params = {}) => {
  let filtered = [...products];
  
  if (params.categoryId) {
    filtered = filtered.filter(product => 
      product.category.toLowerCase() === params.categoryId.toLowerCase()
    );
  }
  
  if (params.brandId) {
    filtered = filtered.filter(product => 
      product.brand.toLowerCase() === params.brandId.toLowerCase()
    );
  }
  
  if (params.is_new) {
    filtered = filtered.filter(product => product.is_new === true);
  }
  
  if (params.discount) {
    filtered = filtered.filter(product => product.discount > 0);
  }
  
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filtered = filtered.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.article.toLowerCase().includes(searchTerm)
    );
  }
  
  if (params.sort) {
    switch(params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'discount':
        filtered.sort((a, b) => b.discount - a.discount);
        break;
    }
  }
  
  const page = params.page || 1;
  const pageSize = params.pageSize || 12;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const paginatedData = filtered.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    meta: {
      pagination: {
        page: page,
        pageSize: pageSize,
        pageCount: Math.ceil(filtered.length / pageSize),
        total: filtered.length
      }
    }
  };
};

// Моковый API для корзины (cartAPI)
export const cartAPI = {
  // Получить корзину - моковые данные
  getCart: async () => {
    console.log('cartAPI.getCart: Моковый запрос корзины');
    return new Promise((resolve) => {
      setTimeout(() => {
        // Возвращаем пустую корзину или моковые данные
        const mockCart = {
          items: [],
          total: 0,
          total_items: 0
        };
        console.log('cartAPI.getCart: Моковая корзина возвращена');
        resolve(mockCart);
      }, 300);
    });
  },

  // Добавить товар в корзину - мок
  addToCart: async (productId, quantity = 1) => {
    console.log('cartAPI.addToCart: Моковое добавление товара:', { productId, quantity });
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Товар добавлен в корзину',
          cart_item: {
            product_id: productId,
            quantity: quantity
          }
        };
        console.log('cartAPI.addToCart: Моковый ответ:', mockResponse);
        resolve(mockResponse);
      }, 300);
    });
  },

  // Обновить количество товара - мок
  updateCart: async (productId, quantity) => {
    console.log('cartAPI.updateCart: Моковое обновление товара:', { productId, quantity });
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Корзина обновлена'
        };
        console.log('cartAPI.updateCart: Моковый ответ:', mockResponse);
        resolve(mockResponse);
      }, 300);
    });
  },

  // Удалить товар из корзины - мок
  removeFromCart: async (productId) => {
    console.log('cartAPI.removeFromCart: Моковое удаление товара:', { productId });
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Товар удален из корзины'
        };
        console.log('cartAPI.removeFromCart: Моковый ответ:', mockResponse);
        resolve(mockResponse);
      }, 300);
    });
  },

  // Очистить корзину - мок
  clearCart: async () => {
    console.log('cartAPI.clearCart: Моковая очистка корзины');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Корзина очищена'
        };
        console.log('cartAPI.clearCart: Моковый ответ:', mockResponse);
        resolve(mockResponse);
      }, 300);
    });
  }
};

// Обновляем методы для каталога товаров - используем моковые данные
export const catalogAPI = {
  // Получить все товары с фильтрацией
  getProducts: async (params = {}) => {
    console.log('📡 Получение моковых товаров с параметрами:', params);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = filterMockProducts(mockWoodMaterials, params);
        console.log('✅ Моковые товары возвращены:', result.data.length, 'шт.');
        resolve(result);
      }, 300);
    });
  },

  // Получить товар по ID
  getProduct: async (id) => {
    console.log('📡 Получение мокового товара по ID:', id);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockWoodMaterials.find(p => p.id == id);
        if (product) {
          console.log('✅ Моковый товар найден:', product.title);
          resolve({ data: product });
        } else {
          console.log('❌ Моковый товар не найден');
          reject(new Error('Товар не найден'));
        }
      }, 200);
    });
  },

  // Получить категории
  getCategories: async () => {
    console.log('📡 Получение моковых категорий');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Моковые категории возвращены:', mockWoodCategories.length, 'шт.');
        resolve({ data: mockWoodCategories });
      }, 200);
    });
  },

  // Получить бренды
  getBrands: async () => {
    console.log('📡 Получение моковых брендов');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Моковые бренды возвращены:', mockWoodBrands.length, 'шт.');
        resolve({ data: mockWoodBrands });
      }, 200);
    });
  },

  // Получить новинки
  getNewArrivals: async (limit = 4) => {
    console.log('📡 Получение моковых новинок');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newArrivals = mockWoodMaterials
          .filter(product => product.is_new)
          .slice(0, limit);
        console.log('✅ Моковые новинки возвращены:', newArrivals.length, 'шт.');
        resolve({ data: newArrivals });
      }, 150);
    });
  },

  // Получить товары со скидкой
  getDiscounted: async (limit = 4) => {
    console.log('📡 Получение моковых товаров со скидкой');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const discounted = mockWoodMaterials
          .filter(product => product.discount > 0)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, limit);
        console.log('✅ Моковые товары со скидкой возвращены:', discounted.length, 'шт.');
        resolve({ data: discounted });
      }, 150);
    });
  },

  // Получить случайные товары
  getRandomProducts: async (limit = 4) => {
    console.log('📡 Получение случайных моковых товаров');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const shuffled = [...mockWoodMaterials]
          .sort(() => 0.5 - Math.random())
          .slice(0, limit);
        console.log('✅ Случайные моковые товары возвращены:', shuffled.length, 'шт.');
        resolve({ data: shuffled });
      }, 150);
    });
  }
};

// Обновляем методы для tkans (для обратной совместимости)
export const tkansAPI = {
  getAll: async (params = {}) => {
    return catalogAPI.getProducts(params);
  },
  
  getById: async (id) => {
    return catalogAPI.getProduct(id);
  },
  
  getTypes: async () => {
    return catalogAPI.getCategories();
  },
  
  getBrands: async () => {
    return catalogAPI.getBrands();
  },
  
  // Новые методы для магазина тканей
  fetchTkans: async () => {
    console.log('📡 Загрузка моковых тканей');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Моковые ткани загружены:', mockWoodMaterials.length, 'шт.');
        resolve(mockWoodMaterials);
      }, 500);
    });
  },
  
  fetchTypes: async () => {
    console.log('📡 Загрузка моковых категорий (типов)');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Моковые категории загружены');
        resolve(mockWoodCategories);
      }, 300);
    });
  },
  
  fetchBrands: async () => {
    console.log('📡 Загрузка моковых брендов');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Моковые бренды загружены');
        resolve(mockWoodBrands);
      }, 300);
    });
  }
};

// Моковый API для аутентификации
export const authAPI = {
  // Вход - мок
  login: async (email, password) => {
    console.log('authAPI.login: Моковый вход:', { email });
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          jwt: 'mock-jwt-token-123456',
          user: {
            id: 1,
            username: email,
            email: email,
            role: 'authenticated'
          }
        };
        console.log('authAPI.login: Моковый ответ');
        resolve(mockResponse);
      }, 300);
    });
  },

  // Регистрация - мок
  register: async (userData) => {
    console.log('authAPI.register: Моковая регистрация:', userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Регистрация успешна',
          user: {
            id: Date.now(),
            ...userData
          }
        };
        console.log('authAPI.register: Моковый ответ');
        resolve(mockResponse);
      }, 300);
    });
  },

  // Проверка аутентификации - мок
  checkAuth: async () => {
    console.log('authAPI.checkAuth: Моковая проверка аутентификации');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          id: 1,
          username: 'user@example.com',
          email: 'user@example.com',
          role: 'authenticated'
        };
        console.log('authAPI.checkAuth: Моковый ответ');
        resolve(mockResponse);
      }, 200);
    });
  },

  // Удаление аккаунта - мок
  deleteAccount: async () => {
    console.log('authAPI.deleteAccount: Моковое удаление аккаунта');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Аккаунт удален'
        };
        console.log('authAPI.deleteAccount: Моковый ответ');
        resolve(mockResponse);
      }, 300);
    });
  },

  // Обновление профиля - мок
  updateProfile: async (userData) => {
    console.log('authAPI.updateProfile: Моковое обновление профиля:', userData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Профиль обновлен',
          user: userData
        };
        console.log('authAPI.updateProfile: Моковый ответ');
        resolve(mockResponse);
      }, 300);
    });
  },

  // Выход из системы - мок
  logout: async () => {
    console.log('authAPI.logout: Моковый выход');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          message: 'Выход выполнен'
        };
        console.log('authAPI.logout: Моковый ответ');
        resolve(mockResponse);
      }, 200);
    });
  }
};

// Моковый API для заказов
export const ordersAPI = {
  // Создать заказ - мок
  createOrder: async (orderData = {}) => {
    console.log('📤 ordersAPI.createOrder: Моковый заказ:', orderData);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse = {
          success: true,
          order_id: Date.now(),
          order_number: `ORD-${Date.now()}`,
          message: 'Заказ успешно создан'
        };
        console.log('✅ ordersAPI.createOrder: Моковый заказ создан');
        resolve(mockResponse);
      }, 500);
    });
  },

  // Получить список заказов - мок
  getMyOrders: async () => {
    console.log('ordersAPI.getMyOrders: Моковые заказы');
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockOrders = [
          {
            id: 1,
            order_number: 'ORD-001',
            status: 'completed',
            total: 4500,
            created_at: '2024-01-15'
          },
          {
            id: 2,
            order_number: 'ORD-002',
            status: 'processing',
            total: 3200,
            created_at: '2024-01-16'
          }
        ];
        console.log('ordersAPI.getMyOrders: Моковые заказы возвращены');
        resolve({ data: mockOrders });
      }, 300);
    });
  },

  // Получить детали заказа - мок
  getOrder: async (orderId) => {
    console.log('ordersAPI.getOrder: Моковый заказ по ID:', orderId);
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockOrder = {
          id: orderId,
          order_number: `ORD-${orderId}`,
          status: 'completed',
          total: 4500,
          created_at: '2024-01-15',
          items: [
            {
              id: 1,
              product_id: 1,
              quantity: 2,
              price: 850
            },
            {
              id: 2,
              product_id: 2,
              quantity: 1,
              price: 320
            }
          ]
        };
        console.log('ordersAPI.getOrder: Моковый заказ возвращен');
        resolve({ data: mockOrder });
      }, 300);
    });
  }
};

// Обновляем функцию для получения URL изображения
export const getImageUrl = (imageData) => {
  console.log('🖼️ Получение URL изображения (моковое):', imageData);
  
  if (typeof imageData === 'string') {
    return imageData;
  }
  
  if (imageData && imageData.url) {
    return imageData.url;
  }
  
  if (Array.isArray(imageData) && imageData.length > 0) {
    return imageData[0].url || '/default-textile.jpg';
  }
  
  return '/default-textile.jpg';
};

// Пустые API для остальных функций (чтобы не было ошибок)
export const worksAPI = {
  getAll: async () => ({ data: [] }),
  getById: async () => ({ data: {} })
};

export const contactAPI = {
  sendMessage: async () => ({ success: true, message: 'Сообщение отправлено' })
};

export const notificationsAPI = {
  getNotifications: async () => ({ data: [] }),
  createNotification: async () => ({ success: true })
};

export const adminAPI = {
  // Пустые методы для админки
  getProducts: async () => ({ data: [] }),
  getStats: async () => ({ data: {} })
};

export default api;