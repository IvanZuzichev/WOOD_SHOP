import { Context } from '../../context/index';
import { useState, useRef, useContext } from "react";
import { observer } from "mobx-react-lite";
import { CATALOG_ROUTE, CATALOG_CLOTHING_ROUTE } from "../../utils/consts";

export const Typebar = observer(() => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Упрощенные категории для каталога
  const clothingCategories = [
    { id: 1, name: "Плательные ткани", slug: "dress-fabrics" },
    { id: 2, name: "Костюмные ткани", slug: "suit-fabrics" },
    { id: 3, name: "Блузочные ткани", slug: "blouse-fabrics" },
    { id: 4, name: "Трикотаж", slug: "knitwear" },
    { id: 5, name: "Джинсовые ткани", slug: "denim" },
    { id: 6, name: "Ткани для нижнего белья", slug: "lingerie-fabrics" },
  ];

  const homeCategories = [
    { id: 7, name: "Ткани для штор", slug: "curtain-fabrics" },
    { id: 8, name: "Обивочные ткани", slug: "upholstery-fabrics" },
    { id: 9, name: "Ткани для подушек", slug: "pillow-fabrics" },
    { id: 10, name: "Текстиль для кухни", slug: "kitchen-textiles" },
  ];

  // Обработчик клика по категории
  const handleCategoryClick = (categorySlug, type = 'clothing') => {
    console.log(`Selected category: ${categorySlug}, type: ${type}`);
  };

  return (
    <div className="bg-white shadow-xl rounded-[12px] border border-[#e4e2de] min-w-[400px] py-4">
      <div className="px-6 pb-3 border-b border-[#e4e2de]">
        <h3 className="font-inter font-semibold text-[18px] text-[#101010]">Каталог тканей</h3>
      </div>
      
      <div className="flex">
        {/* Левая колонка - Для одежды */}
        <div className="w-1/2 border-r border-[#e4e2de] py-3">
          <div className="px-6 mb-3">
            <h4 className="font-inter font-medium text-[16px] text-[#101010]">Для одежды</h4>
          </div>
          <div className="space-y-1">
            {clothingCategories.map((category) => (
              <a
                key={category.id}
                href={`${CATALOG_ROUTE}/${category.slug}`}
                className="block px-6 py-2 text-[14px] text-[#4D4D4D] hover:bg-[#F1F0EE] hover:text-[#101010] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.slug, 'clothing');
                }}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        {/* Правая колонка - Для дома */}
        <div className="w-1/2 py-3">
          <div className="px-6 mb-3">
            <h4 className="font-inter font-medium text-[16px] text-[#101010]">Для дома</h4>
          </div>
          <div className="space-y-1">
            {homeCategories.map((category) => (
              <a
                key={category.id}
                href={`${CATALOG_ROUTE}/${category.slug}`}
                className="block px-6 py-2 text-[14px] text-[#4D4D4D] hover:bg-[#F1F0EE] hover:text-[#101010] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  handleCategoryClick(category.slug, 'home');
                }}
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Нижняя часть - Все ткани */}
      <div className="mt-4 pt-4 border-t border-[#e4e2de] px-6">
        <a
          href={CATALOG_ROUTE}
          className="block w-full text-center py-3 bg-[#F1F0EE] text-[#101010] font-medium text-[14px] rounded-[8px] hover:bg-[#e4e2de] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            console.log("View all fabrics");
          }}
        >
          Смотреть все ткани
        </a>
      </div>
    </div>
  );
});