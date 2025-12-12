🌲 WOOD SHOP - Интернет-магазин пиломатериалов и стройматериалов
<div align="center">

Полнофункциональный интернет-магазин для продажи пиломатериалов, строительных материалов и инструментов

</div>
📋 О проекте
WOOD SHOP - это личный pet-проект, созданный с нуля для демонстрации навыков современной веб-разработки. Проект включает полный цикл разработки интернет-магазина: от дизайна логотипа в Figma до развертывания с использованием Docker.

🎯 Основные возможности
<details> <summary><strong>📦 Для покупателей</strong></summary>
🛒 Каталог товаров с фильтрацией и поиском

🛍️ Корзина покупок с сохранением состояния

📱 Адаптивный дизайн для всех устройств

🔍 Расширенный поиск по параметрам товаров

⭐ Избранное и система оценок

📦 Отслеживание заказов в реальном времени

</details><details> <summary><strong>🛠️ Для администратора</strong></summary>
📊 Панель управления товарами и заказами

📈 Аналитика продаж и отчеты

🖼️ Управление галереей товаров

👥 Управление пользователями

💰 Настройка скидок и промокодов

</details>
🛠️ Технологический стек
Frontend
<div align="center">
Технология	Назначение	Версия
	UI библиотека	18.2+
	Статическая типизация	5.2+
	Tailwind, SCSS, SASS, CSS фреймворк	3.3+
	Маршрутизация	6.14+
	Управление состоянием	6.9+
	HTTP клиент	1.4+
</div>
Backend
<div align="center">
Технология	Назначение	Версия
	Серверная платформа	18+
	Веб фреймворк	4.18+
	База данных	15+
	Аутентификация	9.0+
	Документация API	4.19+
</div>
Инфраструктура
<div align="center">
Технология	Назначение	Версия
	Контейнеризация	24.0+
	Контроль версий	2.42+
	Дизайн интерфейса	-
	Линтинг кода	8.45+
	Форматирование кода	3.0+
</div>
🚀 Быстрый старт
⚙️ Предварительные требования
Node.js 18+

Docker 24.0+ и Docker Compose

Git 2.42+

npm 9.0+ или yarn 1.22+

📦 Установка и запуск
Вариант 1: Через Docker (рекомендуется)
bash
# 1️⃣ Клонировать репозиторий
git clone https://github.com/IvanZuzichev/WOOD_SHOP.git
cd wood-shop

# 2️⃣ Запустить в режиме разработки
npm run docker:dev

# 3️⃣ Открыть в браузере
# 🌐 http://localhost:3000
Вариант 2: Локальная установка
bash
# 1️⃣ Клонировать репозиторий
git clone https://github.com/IvanZuzichev/WOOD_SHOP.git
cd wood-shop

# 2️⃣ Установить зависимости
npm install

# 3️⃣ Запустить в режиме разработки
npm run dev

# 4️⃣ Проверить типы TypeScript
npm run type-check

# 5️⃣ Запустить линтер
npm run lint
Вариант 3: Продакшен сборка
bash
# Собрать и запустить продакшен версию
npm run docker:build-prod
npm run docker:up-prod

# Приложение будет доступно на порту 3001
# 🌐 http://localhost:3000
<pre>📁 Структура проекта
bash
wood-shop/
├── 📂 src/                           # Исходный код
│   ├── 📂 components/                # React компоненты
│   │   ├── 📂 ui/                    # Базовые UI компоненты
│   │   │   ├── Button/              # Кнопки
│   │   │   ├── Input/               # Поля ввода
│   │   │   ├── Card/                # Карточки товаров
│   │   │   └── Modal/               # Модальные окна
│   │   ├── 📂 layout/                # Компоненты макета
│   │   │   ├── Header/              # Шапка сайта
│   │   │   ├── Footer/              # Подвал сайта
│   │   │   ├── Sidebar/             # Боковая панель
│   │   │   └── Navigation/          # Навигация
│   │   ├── 📂 products/              # Компоненты товаров
│   │   │   ├── ProductCard/         # Карточка товара
│   │   │   ├── ProductList/         # Список товаров
│   │   │   ├── ProductGallery/      # Галерея товара
│   │   │   └── ProductFilters/      # Фильтры товаров
│   │   ├── 📂 cart/                  # Компоненты корзины
│   │   │   ├── CartItem/            # Элемент корзины
│   │   │   ├── CartList/            # Список корзины
│   │   │   └── CartTotal/           # Итоговая сумма
│   │   └── 📂 search/               # Компоненты поиска
│   │       └── SearchInput/         # Поле поиска
│   ├── 📂 pages/                     # Страницы приложения
│   │   ├── Home/                    # Главная страница
│   │   ├── Shop/                    # Страница магазина
│   │   ├── Product/                 # Страница товара
│   │   ├── Cart/                    # Страница корзины
│   │   ├── Checkout/                # Страница оформления
│   │   ├── Admin/                   # Админ панель
│   │   └── Auth/                    # Страницы авторизации
│   ├── 📂 hooks/                     # Кастомные хуки
│   │   ├── useCart.ts              # Хук корзины
│   │   ├── useProducts.ts          # Хук товаров
│   │   └── useAuth.ts              # Хук авторизации
│   ├── 📂 utils/                     # Вспомогательные функции
│   │   ├── formatters.ts           # Форматирование данных
│   │   ├── validators.ts           # Валидация
│   │   └── constants.ts            # Константы приложения
│   ├── 📂 types/                     # TypeScript типы
│   │   ├── product.types.ts        # Типы товаров
│   │   ├── cart.types.ts           # Типы корзины
│   │   └── user.types.ts           # Типы пользователей
│   ├── 📂 styles/                    # Стили
│   │   ├── globals.css             # Глобальные стили
│   │   ├── themes/                 # Темы оформления
│   │   └── animations/             # Анимации
│   ├── 📂 store/                     # Состояние приложения
│   │   ├── cart.store.ts           # Хранилище корзины
│   │   ├── products.store.ts       # Хранилище товаров
│   │   └── user.store.ts           # Хранилище пользователя
│   ├── 📂 api/                      # API клиент
│   │   ├── product.api.ts          # API товаров
│   │   ├── cart.api.ts             # API корзины
│   │   └── auth.api.ts             # API авторизации
│   └── App.tsx                     # Главный компонент
├── 📂 public/                       # Статические файлы
│   ├── index.html                  # HTML шаблон
│   ├── favicon.ico                 # Иконка сайта
│   └── images/                     # Изображения
├── 📂 server/                       # Серверная часть (опционально)
│   ├── 📂 routes/                   # Маршруты API
│   ├── 📂 controllers/              # Контроллеры
│   ├── 📂 models/                   # Модели данных
│   └── server.js                   # Главный файл сервера
├── 📂 docker/                       # Docker конфигурации
│   ├── Dockerfile                  # Dockerfile для сборки
│   ├── docker-compose.yml          # Docker Compose
│   └── nginx/                      # Nginx конфигурация
├── 📂 docs/                         # Документация
│   ├── api/                        # Документация API
│   ├── setup/                      # Инструкции по настройке
│   └── architecture/               # Архитектура проекта
├── 📜 .env.example                  # Пример переменных окружения
├── 📜 package.json                  # Зависимости проекта
├── 📜 tsconfig.json                # Конфигурация TypeScript
├── 📜 tailwind.config.js           # Конфигурация Tailwind
└── 📜 README.md                    # Этот файл
</pre>
🐳 Docker команды
<div align="center">
Команда	Описание	Пример
Разработка		
npm run docker:dev	Запуск dev сервера	npm run docker:dev
npm run docker:build	Сборка проекта	npm run docker:build
npm run docker:test	Запуск тестов	npm run docker:test
npm run docker:lint	Проверка кода линтером	npm run docker:lint
npm run docker:type	Проверка TypeScript типов	npm run docker:type
Продакшен		
npm run docker:prod	Запуск prod версии	npm run docker:prod
npm run docker:build-prod	Сборка prod образа	npm run docker:build-prod
npm run docker:up-prod	Развертывание prod	npm run docker:up-prod
Утилиты		
npm run docker:down	Остановка контейнеров	npm run docker:down
npm run docker:clean	Очистка Docker	npm run docker:clean
npm run docker:logs	Просмотр логов	npm run docker:logs
</div>

🌐 Функциональность
✅ Для пользователей
Просмотр каталога товаров с категориями

Умный поиск с автодополнением

Фильтрация по параметрам (материал, цена, размер)

Корзина покупок с сохранением состояния

Оформление заказа в 3 шага

Личный кабинет с историей заказов

Система избранного для сохранения товаров

Отзывы и рейтинги товаров

Сравнение товаров в таблице

Адаптивный дизайн для мобильных устройств

✅ Для администратора
Панель управления с аналитикой

CRUD операции для товаров

Управление заказами (статусы, уведомления)

Управление пользователями и ролями

Аналитика продаж с графиками

Загрузка изображений товаров

Настройка скидок и промокодов

Управление контентом страниц

⚙️ Технические особенности
TypeScript для надежности кода

Оптимизация производительности (lazy loading, code splitting)

SEO оптимизация (мета-теги, семантическая верстка)

PWA готовность (офлайн режим, push-уведомления)

Международная поддержка (i18n готовность)

Доступность (ARIA атрибуты, клавиатурная навигация)

Безопасность (валидация, защита от XSS/CSRF)

📊 Производительность
⚡ Оптимизации
Lazy Loading компонентов и изображений

Code Splitting для уменьшения начальной загрузки

Tree Shaking для удаления неиспользуемого кода

Мемоизация с помощью React.memo и useMemo

Виртуализация длинных списков

Оптимизация изображений (WebP, lazy loading)

📈 Метрики производительности
bash
# Lighthouse результаты
├── Performance:         95/100
├── Accessibility:       100/100
├── Best Practices:      100/100
├── SEO:                 100/100
└── PWA:                 92/100
🔒 Безопасность
🛡️ Меры безопасности
JWT токены с refresh механизмом

HTTPS в продакшене с Let's Encrypt

Валидация данных на клиенте и сервере

Защита от XSS через sanitization

CSRF токены для форм

Rate Limiting API эндпоинтов

Логирование подозрительной активности

🔐 Аутентификация и авторизация
typescript
// Пример защищенного маршрута
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
🧪 Тестирование
🧪 Типы тестов
bash
# Unit тесты компонентов
npm test -- --testPathPattern=components

# Интеграционные тесты страниц
npm test -- --testPathPattern=pages

# E2E тесты (Cypress)
npm run cypress:open

🤝 Вклад в проект
Мы приветствуем вклад в проект! Вот как вы можете помочь:

📝 Шаги для участия:
Форкните репозиторий

Создайте ветку для вашей фичи:

bash
git checkout -b feature/amazing-feature
Закоммитьте изменения с семантическими коммитами:

bash
git commit -m "feat: add amazing feature"
Запушьте в ветку:

bash
git push origin feature/amazing-feature
Откройте Pull Request

🏷️ Соглашение о коммитах:
bash
feat:     Новая функциональность
fix:      Исправление ошибок
docs:     Изменения в документации
style:    Форматирование, пропущенные точки с запятой и т.д.
refactor: Рефакторинг кода
test:     Добавление тестов
chore:    Изменения в сборке, зависимостях
🔍 Code Review процесс:
Проверка кода на соответствие стандартам

Тестирование новой функциональности

Документирование изменений

Одобрение от мейнтейнеров

Мердж в основную ветку

📝 Лицензия
<div align="center">
© 2025 Зюзичев Иван. Все права защищены.

Этот проект создан для портфолио и демонстрации навыков.

Не предназначено для коммерческого использования без разрешения автора.

</div>
👨‍💻 Автор
<div align="center">
Зюзичев Иван
FullStack разработчик | React/TypeScript специалист
📬 Контакты
<div align="center">
Платформа	Ссылка	Описание
📧 Email	ivan.ziuzichev@gmail.com	Основная почта
💬 Telegram	@Ivanziz	Быстрая связь
💻 GitHub	@IvanZuzichev	Портфолио проектов
💼 LinkedIn	Иван Зюзичев	Профессиональный профиль
📝 Habr Career	Профиль	Резюме и проекты
</div>
🎓 Навыки
<div align="center">
javascript
const skills = {
  frontend: ["React", "TypeScript", "JavaScript", "Next.js", "Vue.js"],
  backend: ["Node.js", "Express", "NestJS", "Python", "FastAPI"],
  databases: ["PostgreSQL", "MongoDB", "Redis", "Firebase"],
  devops: ["Docker", "AWS", "CI/CD", "Nginx", "Linux"],
  tools: ["Git", "Figma", "Webpack", "Jest", "Cypress"],
  softSkills: ["Коммуникация", "Тайм-менеджмент", "Решение проблем", "Командная работа"]
};
</div>