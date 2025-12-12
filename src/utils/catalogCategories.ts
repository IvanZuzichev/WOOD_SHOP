// Единый источник данных для категорий каталога

// Категории для одежды (древесины)
export const clothingCategories = [
  { name: "Пиломатериалы (обрезные и необрезные)", slug: "one" },
  { name: "Строганые погонажные изделия", slug: "two" },
  { name: "Листовые материалы на древесной основе", slug: "three" },
  { name: "Клееные и инженерные изделия", slug: "four" },
  { name: "Столярные изделия и готовые элементы", slug: "five" },
  { name: "Специальные и защищённые материалы", slug: "six" },
  { name: "Техническая и поделочная древесина", slug: "seven" },
];

// Удалите или закомментируйте несуществующие homeCategories
// Или создайте их, если нужны
export const homeCategories = []; // пустой массив или добавьте категории

// Преобразование в формат для Catalog.jsx (с id и дополнительными полями)
export const getClothingCategoriesForCatalog = () => {
  return clothingCategories.map((cat, index) => ({
    id: index + 1,
    name: cat.name,
    slug: cat.slug,
    hasSubmenu: false,
    parentId: null,
  }));
};

export const getHomeCategoriesForCatalog = () => {
  return homeCategories.map((cat, index) => ({
    id: index + 1,
    name: cat.name,
    slug: cat.slug,
    hasSubmenu: false,
    parentId: null,
  }));
};

// Получение массива названий для Typebar
export const getClothingCategoryNames = () => {
  return clothingCategories.map(cat => cat.name);
};

export const getHomeCategoryNames = () => {
  return homeCategories.map(cat => cat.name);
};

// Маппинг slug -> название для breadcrumbs
export const getCategoryNameMap = (isClothing = false) => {
  const categories = isClothing ? clothingCategories : homeCategories;
  const map: Record<string, string> = {};
  categories.forEach(cat => {
    map[cat.slug] = cat.name;
  });
  return map;
};

// Маппинг название -> slug для Typebar
export const getFabricSlugMap = () => {
  const map: Record<string, string> = {};
  [...clothingCategories, ...homeCategories].forEach(cat => {
    map[cat.name] = cat.slug;
  });
  return map;
};