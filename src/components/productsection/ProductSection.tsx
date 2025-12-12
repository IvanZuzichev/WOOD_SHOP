import { Link } from "react-router-dom";
import { ProductCard } from "../productcard/ProductCard";
import { SHOP_ROUTE, DISCOUNTS_ROUTE, NEW_ROUTE } from "../../utils/consts";
import styles from "./ProductSection.module.scss";

export const ProductSection = ({ title, products, sectionType = "default", keyPrefix = "" }) => {
  // Определяем маршрут в зависимости от типа секции
  const getRoute = () => {
    switch(sectionType) {
      case "discounts":
        return DISCOUNTS_ROUTE || "/discounts";
      case "new":
        return NEW_ROUTE || "/new";
      default:
        return SHOP_ROUTE || "/shop";
    }
  };

  // Определяем текст для кнопки
  const getButtonText = () => {
    switch(sectionType) {
      case "discounts":
        return "Перейти к каталогу";
      case "new":
        return "Перейти к каталогу";
      default:
        return "Посмотреть к каталогу";
    }
  };

  // Определяем количество товаров для отображения в зависимости от устройства
  const getVisibleProducts = () => {
    // Для десктопа - 4 товара
    if (window.innerWidth >= 1440) {
      return products.slice(0, 4);
    }
    // Для планшета - 3 товара
    else if (window.innerWidth >= 744) {
      return products.slice(0, 3);
    }
    // Для телефона - 2 товара
    else {
      return products.slice(0, 2);
    }
  };

  const visibleProducts = getVisibleProducts();

  return (
    <div className="max-w-[1440px] w-full mx-auto px-[20px] sm:px-[50px] py-[40px]">
      <div className="flex flex-col gap-[16px]">
        {/* Заголовок блока */}
        <div className="flex items-center justify-between px-[10px] py-0 w-full">
          <div className="flex gap-[10px] items-center justify-center">
            <h2 className="font-inter font-semibold leading-[1.2] text-[#101010] text-[38px] tracking-[-0.8px] whitespace-nowrap">
              {title}
            </h2>
          </div>
          <Link 
            to={getRoute()}
            className="flex gap-[10px] items-center justify-center hover:opacity-80 transition-opacity"
          >
            <span className="font-inter font-medium leading-[1.2] text-[#101010] text-[16px] whitespace-nowrap">
              {getButtonText()}
            </span>
          </Link>
        </div>
        
        {/* Сетка товаров */}
        <div className={styles.productGrid}>
          {visibleProducts.map((product, index) => (
            <ProductCard 
              key={keyPrefix ? `${keyPrefix}-${product.id}` : product.id} 
              product={product} 
              showHover={true} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};