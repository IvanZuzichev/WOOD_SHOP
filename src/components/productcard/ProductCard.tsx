import { useState, useContext, MouseEvent, ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from '../../context/index';
import { cartAPI } from "../../http/api";
import { WOOD_ROUTE } from "../../utils/consts";
import styles from "./ProductCard.module.scss";

// Определяем интерфейс для пропсов
interface Product {
  id: number;
  name: string;
  price: number;
  img: string;
  stock?: number;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  showHover?: boolean;
}

interface ToastConfig {
  message: string;
  type: 'success' | 'error';
}

// Временная функция showToast - вам нужно реализовать её или импортировать
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Реализуйте вашу логику отображения toast уведомлений
};

export const ProductCard = observer(({ product, showHover = true }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState<number | string>(1.0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const location = useLocation();
  
  // Сохраняем информацию о каталоге при переходе на товар
  const handleProductClick = () => {
    const isClothingCatalog = location.pathname.includes('/catalog-clothing');
    const isHomeCatalog = location.pathname.includes('/catalog') && !location.pathname.includes('/catalog-clothing');
    if (isClothingCatalog || isHomeCatalog) {
      sessionStorage.setItem('productCatalogType', isClothingCatalog ? 'clothing' : 'home');
    }
  };
  
  // Цена за метр
  const pricePerMeter = product.price || 800;
  
  // Итоговая цена (с учетом скидки от 5 метров - 50%)
  const calculateTotalPrice = () => {
    const qty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
    if (qty >= 5) {
      return (pricePerMeter * qty * 0.5).toFixed(2);
    }
    return (pricePerMeter * qty).toFixed(2);
  };
  
  const totalPrice = calculateTotalPrice();
  
  const handleDecrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string);
    if (currentQty > 0.5) {
      const newValue = Math.max(0.5, currentQty - 0.1);
      setQuantity(Math.round(newValue * 10) / 10);
    }
  };
  
  const handleIncrease = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string);
    if (currentQty >= 1000) {
      showToast('Максимальное количество: 1000 метров', 'error');
      return;
    }
    const newValue = Math.min(1000, currentQty + 0.1);
    setQuantity(Math.round(newValue * 10) / 10);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const inputValue = e.target.value;
    if (inputValue === '' || inputValue === '.') {
      setQuantity('');
      return;
    }
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0.5 && value <= 1000) {
      setQuantity(value);
    }
  };

  const handleQuantityBlur = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const value = parseFloat(e.target.value);
    const currentValue = e.target.value;
    
    if (isNaN(value) || value < 0.5 || currentValue === '') {
      setQuantity(0.5);
    } else if (value > 1000) {
      setQuantity(1000);
      showToast('Максимальное количество: 1000 метров', 'error');
    } else {
      setQuantity(Math.round(value * 10) / 10);
    }
  };
  
  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    
    setIsAddingToCart(true);
    try {

      
      const qty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
      const response = await cartAPI.addToCart(product.id, qty);
      console.log('🛒 ProductCard: Ответ от API:', response);
      
      showToast('Товар добавлен в корзину', 'success');
      
      // Обновляем данные корзины в store
      
    } catch (error: any) {
      console.error('❌ ProductCard: Ошибка добавления в корзину:', error);
      console.error('❌ Детали ошибки:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      showToast('Не удалось добавить товар в корзину', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  return (
    <div 
      className={styles.productCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`${WOOD_ROUTE}/${product.id}`}
        className="flex flex-col items-center p-[10px] h-full relative z-0"
        onClick={handleProductClick}
      >
        {/* Изображение */}
        <div className={styles.imageContainer}>
          <img 
            src={product.img} 
            alt={product.name} 
            className={styles.productImage}
          />
          
          {/* Элемент с точками в левом нижнем углу */}
          <div className={styles.dotsIndicator}>
            <div className={styles.dotLarge}></div>
            <div className={styles.dotSmall}></div>
            <div className={styles.dotSmall}></div>
            <div className={styles.dotSmall}></div>
          </div>
        </div>
        
        {/* Контент по умолчанию */}
        <div className={styles.defaultContent}>
          <div className={styles.productInfo}>
            <p className={styles.productName}>
              {product.name}
            </p>
            <div className={styles.priceContainer}>
              <p className={styles.productPrice}>
                {product.price} ₽ /м
              </p>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Контент при наведении (если включен) - абсолютное позиционирование */}
      {showHover && (
        <div 
          className={`${styles.hoverCard} ${
            isHovered 
              ? styles.hoverCardVisible 
              : styles.hoverCardHidden
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Ссылка для перехода на детальную страницу - покрывает всю карточку */}
          <Link 
            to={`${WOOD_ROUTE}/${product.id}`}
            className={styles.productLink}
            onClick={handleProductClick}
          />
          
          {/* Статичная часть: изображение, название и цена */}
          <div className={styles.imageContainer}>
            <img 
              src={product.img} 
              alt={product.name}
              className={styles.productImage}
            />
            
            {/* Элемент с точками в левом нижнем углу */}
            <div className={styles.dotsIndicator}>
              <div className={styles.dotLarge}></div>
              <div className={styles.dotSmall}></div>
              <div className={styles.dotSmall}></div>
              <div className={styles.dotSmall}></div>
            </div>
          </div>
          
          <div className={styles.defaultContent}>
            <div className={styles.productInfo}>
              <p className={styles.productName}>
                {product.name}
              </p>
              <div className={styles.priceContainer}>
                <p className={styles.productPrice}>
                  {product.price} ₽ /м
                </p>
              </div>
            </div>
          </div>
          
          {/* Анимируется только самая нижняя часть с дополнительным контентом */}
          <div 
            className={`${styles.hoverContent} ${
              isHovered 
                ? styles.hoverContentVisible 
                : styles.hoverContentHidden
            }`}
          >
            <div className={styles.hoverActions}>
              <p className={styles.discountNote}>
                *Скидка от 5 метров
              </p>
              <div className={styles.actionsContainer}>
                <div className={styles.quantityPriceRow}>
                  <div className={styles.quantitySelector}>
                    <div className={styles.quantityControls}>
                      <button
                        onClick={handleDecrease}
                        disabled={typeof quantity === 'number' ? quantity <= 0.5 : parseFloat(quantity as string) <= 0.5}
                        className={`${styles.quantityButton} ${
                          (typeof quantity === 'number' ? quantity <= 0.5 : parseFloat(quantity as string) <= 0.5)
                            ? styles.quantityButtonDisabled 
                            : styles.quantityButtonActive
                        }`}
                      >
                        <p className={styles.quantityButtonText}>-</p>
                      </button>
                      <input
                        type="number"
                        step="0.1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={handleQuantityBlur}
                        onClick={(e) => e.stopPropagation()}
                        className={styles.quantityInput}
                      />
                      <button
                        onClick={handleIncrease}
                        className={`${styles.quantityButton} ${styles.quantityButtonActive}`}
                      >
                        <p className={styles.quantityButtonText}>+</p>
                      </button>
                    </div>
                  </div>
                  <p className={styles.totalPrice}>
                    {totalPrice} ₽
                  </p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (product.stock !== undefined && product.stock <= 0)}
                  className={`${styles.cartButton} ${
                    isAddingToCart || (product.stock !== undefined && product.stock <= 0)
                      ? styles.cartButtonDisabled
                      : styles.cartButtonActive
                  }`}
                >
                  <p className={styles.buttonText}>
                    {isAddingToCart 
                      ? 'Добавление...' 
                      : (product.stock !== undefined && product.stock <= 0)
                        ? 'Нет в наличии'
                        : 'В корзину'
                    }
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});