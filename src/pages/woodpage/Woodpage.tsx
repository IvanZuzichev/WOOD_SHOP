import { useEffect, useState, useContext, ChangeEvent, MouseEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styles from "./Tkanpage.module.scss";
import { Context } from '../../context/index';
import { cartAPI } from "../../http/api";
import { DEFAULT_PRODUCT_VALUES, DISCOUNT_TIERS, CONTACT_PHONE, TELEGRAM_LINK } from "../../utils/consts";
import { ProductSection } from "../../components/productsection/ProductSection";

// Определяем интерфейсы
interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  img?: string;
  images?: string[];
  description?: string;
  composition?: string;
  width?: string;
  density?: string;
  country?: string;
  typeId?: number;
  brandId?: number;
  stock?: number;
  article?: string;
}

interface TkanStore {
  selectedTkan: Product | null;
  isLoadingTkan: boolean;
  errorTkan: string | null;
  tkans: Product[];
  isLoading: boolean;
  error: string | null;
  fetchTkanById: (id: string) => Promise<void>;
  fetchTkans: () => Promise<void>;
}

interface DiscountTier {
  minQuantity: number;
  price: number;
  label?: string;
}

// Временная функция showToast
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Реализуйте вашу логику отображения toast уведомлений
};

export const Woodpage = observer(() => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const context = useContext(Context);
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState<number | string>(1.0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);



  const product = undefined;
  const isLoading =  false;
  const error = null;

  // Переносим проверки загрузки и ошибок в самое начало рендера
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          {error || "Товар не найден"}
        </div>
      </div>
    );
  }

  // Все функции, которые используют product, объявляем после проверок
  const images = product.images || (product.img ? [product.img] : []);
  const validImages = images.filter((img, idx) => !imageErrors.has(idx));
  const selectedImage = validImages[selectedImageIndex] || validImages[0] || null;

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
    if (selectedImageIndex === index) {
      const nextValidIndex = validImages.findIndex((_, idx) => idx !== index && !imageErrors.has(idx));
      if (nextValidIndex !== -1) {
        setSelectedImageIndex(nextValidIndex);
      }
    }
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (modalImageIndex < validImages.length - 1) {
      setModalImageIndex(modalImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (modalImageIndex > 0) {
      setModalImageIndex(modalImageIndex - 1);
    }
  };

  const handleDecrease = () => {
    const currentQty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
    if (currentQty > 0.5) {
      const newValue = Math.max(0.5, currentQty - 0.1);
      setQuantity(Math.round(newValue * 10) / 10);
    }
  };

  const handleIncrease = () => {
    const currentQty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
    if (currentQty >= 1000) {
      showToast('Максимальное количество: 1000 метров', 'error');
      return;
    }
    const newValue = Math.min(1000, currentQty + 0.1);
    setQuantity(Math.round(newValue * 10) / 10);
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleAddToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      const qty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
      await cartAPI.addToCart(product.id, qty);
      showToast('Товар добавлен в корзину', 'success');
    } catch (error: any) {
      console.error('Ошибка добавления в корзину:', error);
      showToast('Не удалось добавить товар в корзину', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      const qty = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
      await cartAPI.addToCart(product.id, qty);
    } catch (error: any) {
      console.error('Ошибка добавления в корзину:', error);
      showToast('Не удалось добавить товар в корзину', 'error');
      setIsAddingToCart(false);
    }
  };

  // Функция расчета цены с учетом персональных скидок
  const calculatePrice = (qty: number): number => {
    const basePrice = product.price;
    const baseDiscount = product.discount || 0;
    const baseDiscountPrice = product.discountPrice || (basePrice * (1 - baseDiscount / 100));
    
    // Проверяем персональные скидки от количества (от большего к меньшему)
    const sortedTiers = [...DISCOUNT_TIERS].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity) {
        return tier.price;
      }
    }
    
    // Если не достигнут порог персональных скидок, возвращаем базовую цену со скидкой
    return baseDiscountPrice;
  };

  // Текущая цена за метр с учетом всех скидок
  const qtyNumber = typeof quantity === 'number' ? quantity : parseFloat(quantity as string) || 0.5;
  const currentPricePerMeter = calculatePrice(qtyNumber);
  // Итоговая стоимость
  const totalPrice = Math.round(currentPricePerMeter * qtyNumber);
  
  // Определяем активную скидку для подсветки
  const getActiveTier = (qty: number): DiscountTier | null => {
    const sortedTiers = [...DISCOUNT_TIERS].sort((a, b) => b.minQuantity - a.minQuantity);
    return sortedTiers.find(tier => qty >= tier.minQuantity) || null;
  };
  
  const activeTier = getActiveTier(qtyNumber);
  const baseDiscountPrice = product.discountPrice || (product.price * (1 - (product.discount || 0) / 100));
  
  const description = product.description || '';
  const shouldShowReadMore = description.length > 200;
  const displayDescription = showFullDescription 
    ? description 
    : (shouldShowReadMore ? description.substring(0, 200) + '...' : description);

  // Проверяем есть ли скидка (корректная проверка)
  const hasDiscount = (product.discount || 0) > 0;

  // Подготавливаем данные для секций продуктов (аналогично Shop компоненту)
  const prepareProductsData = () => {
    
    const currentProductId = product.id;

    


    return {
    };
  };

  const productsData = prepareProductsData();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.imagesSection}>
          <div className={styles.mainImage} onClick={() => openModal(selectedImageIndex)}>
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name}
                onError={() => handleImageError(selectedImageIndex)}
              />
            ) : (
              <div className={styles.placeholderImage}>Нет изображения</div>
            )}
          </div>
          {validImages.length > 0 && (
            <div className={styles.thumbnailImages}>
              {validImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${selectedImageIndex === index ? styles.thumbnailActive : ''}`}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    openModal(index);
                  }}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    onError={() => handleImageError(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productHeader}>
            <div className={styles.productTitleSection}>
              <h1 className={styles.productTitle}>{product.name}</h1>
              <p className={styles.productArticle}>Артикул: {product.article || `KJ${product.id}`}</p>
            </div>
            {hasDiscount && (
              <div className={styles.discountBadge}>
                <span>Скидка {product.discount}%</span>
              </div>
            )}
          </div>
          
          <div className={styles.productActions}>
            <div className={styles.quantitySection}>
              <div className={styles.quantityControl}>
                <button
                  className={styles.quantityButton}
                  onClick={handleDecrease}
                  disabled={qtyNumber <= 0.5}
                >
                  <span>-</span>
                </button>
                <input
                  type="number"
                  step="0.1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  onBlur={handleQuantityBlur}
                  className={styles.quantityInput}
                />
                <button
                  className={styles.quantityButton}
                  onClick={handleIncrease}
                >
                  <span>+</span>
                </button>
              </div>
            </div>
            <div className={styles.priceSection}>
              {/* Показываем старую цену только если есть скидка */}
              {currentPricePerMeter < product.price && (
                <p className={styles.oldPrice}>{product.price} ₽ /м</p>
              )}
              <p className={styles.newPrice}>{Math.round(currentPricePerMeter)} ₽ /м</p>
              {qtyNumber > 0 && (
                <p className={styles.totalPrice}>Итого: {totalPrice} ₽</p>
              )}
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button 
              className={styles.addToCartButton} 
              onClick={handleAddToCart}
              disabled={isAddingToCart || (product.stock !== undefined && product.stock <= 0)}
            >
              {isAddingToCart ? 'Добавление...' : 'Добавить в корзину'}
            </button>
            <button 
              className={styles.buyNowButton} 
              onClick={handleBuyNow}
              disabled={isAddingToCart || (product.stock !== undefined && product.stock <= 0)}
            >
              {isAddingToCart ? 'Добавление...' : 'Купить в один клик'}
            </button>
          </div>

          {/* Блок персональных скидок */}
          {qtyNumber >= 5 && (
            <div className={styles.discountInfo}>
              <p className={styles.discountInfoLabel}>Персональные скидки от количества:</p>
              <p className={qtyNumber >= 5 && qtyNumber < 10 ? styles.discountTierActive : styles.discountInfoPrice}>
                От 5м одного отреза - 640 ₽
              </p>
              <p className={qtyNumber >= 10 ? styles.discountTierActive : styles.discountInfoPrice}>
                От 10м одного отреза - 420 ₽
              </p>
              <p className={styles.discountInfoContact}>
                Запросить цену от 30 метров:{" "}
                <a href={`tel:${CONTACT_PHONE}`} className={styles.discountInfoPhone}>
                  {CONTACT_PHONE}
                </a>
              </p>
              <a 
                href={TELEGRAM_LINK} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.discountInfoLink}
              >
                Телеграм
              </a>
            </div>
          )}
          {product.stock !== undefined && product.stock <= 0 && (
            <p className={styles.outOfStock}>Товар закончился</p>
          )}
          <div className={styles.productDetails}>
            <div className={styles.characteristics}>
              <h2 className={styles.sectionTitle}>Характеристики</h2>
              <div className={styles.characteristicsTable}>
                <div className={styles.characteristicsRow}>
                  <span className={styles.characteristicsLabel}>Состав</span>
                  <span className={styles.characteristicsValue}>{product.composition || DEFAULT_PRODUCT_VALUES.composition}</span>
                </div>
                <div className={styles.characteristicsRow}>
                  <span className={styles.characteristicsLabel}>Ширина</span>
                  <span className={styles.characteristicsValue}>{product.width || DEFAULT_PRODUCT_VALUES.width}</span>
                </div>
                <div className={styles.characteristicsRow}>
                  <span className={styles.characteristicsLabel}>Плотность</span>
                  <span className={styles.characteristicsValue}>{product.density || DEFAULT_PRODUCT_VALUES.density}</span>
                </div>
                <div className={styles.characteristicsRow}>
                  <span className={styles.characteristicsLabel}>Страна производства</span>
                  <span className={styles.characteristicsValue}>{product.country || DEFAULT_PRODUCT_VALUES.country}</span>
                </div>
              </div>
            </div>
            <div className={styles.description}>
              <h2 className={styles.sectionTitle}>Описание</h2>
              <div className={styles.descriptionContent}>
                <p className={styles.descriptionText}>
                  {displayDescription}
                </p>
                {shouldShowReadMore && (
                  <button
                    className={styles.readMoreButton}
                    onClick={() => setShowFullDescription(!showFullDescription)}
                  >
                    {showFullDescription ? 'Свернуть' : 'Читать полностью'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для просмотра изображений */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className={styles.modalImageContainer}>
              <img 
                src={validImages[modalImageIndex]} 
                alt={`${product.name} ${modalImageIndex + 1}`}
                className={styles.modalImage}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeButton} onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M0.530273 12.5303L6.53027 6.53027M12.5303 0.530273L6.53027 6.53027M6.53027 6.53027L0.530273 0.530273L12.5303 12.5303" stroke="#888888" strokeWidth="1.5"/>
                </svg>
              </button>
              <button className={styles.modalCloseText} onClick={closeModal}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});