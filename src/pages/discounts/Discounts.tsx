import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo } from "react";
import { Context } from '../../context/index';
import { ProductCard } from "../../components/productcard/ProductCard";

export const Discounts = observer(() => {
  const { tkans } = useContext(Context);
  
  // Загружаем товары при монтировании компонента, если их нет
  useEffect(() => {
    if (!tkans.tkans || tkans.tkans.length === 0) {
      tkans.fetchTkans();
    }
  }, []);

  // Фильтруем товары со скидкой
  const discountedProducts = useMemo(() => {
    return tkans.tkans?.filter(product => 
      // Проверяем, есть ли скидка (больше 0%)
      product.discount > 0 || 
      // Или есть старая цена (значит была скидка)
      (product.oldPrice && product.price < product.oldPrice) ||
      // Или есть тег "sale", "discount" или "акция"
      product.tags?.some(tag => 
        ['sale', 'discount', 'акция', 'скидка', 'распродажа']
          .includes(tag.toLowerCase())
      )
    ) || [];
  }, [tkans.tkans]);

  // Сортируем товары по размеру скидки (от большей к меньшей)
  const sortedDiscountedProducts = useMemo(() => {
    return [...discountedProducts].sort((a, b) => {
      // Сначала по проценту скидки
      const discountA = a.discount || 0;
      const discountB = b.discount || 0;
      
      // Если у обоих есть процент скидки, сортируем по убыванию
      if (discountA > 0 && discountB > 0) {
        return discountB - discountA;
      }
      
      // Если только у одного есть процент скидки, он идет первым
      if (discountA > 0) return -1;
      if (discountB > 0) return 1;
      
      // Если нет процента скидки, но есть старая цена, вычисляем процент
      if (a.oldPrice && b.oldPrice) {
        const percentA = Math.round((1 - a.price / a.oldPrice) * 100);
        const percentB = Math.round((1 - b.price / b.oldPrice) * 100);
        return percentB - percentA;
      }
      
      if (a.oldPrice) return -1;
      if (b.oldPrice) return 1;
      
      return 0;
    });
  }, [discountedProducts]);

  // Хлебные крошки
  const breadcrumbsItems = [
    { label: 'Главная', link: '/' },
    { label: 'Скидки и акции', link: null }
  ];

  return (
    <div className="flex flex-col gap-[10px] items-center px-0 py-[20px] w-full bg-[#F1F0EE] min-h-screen">
      <div className="flex flex-col gap-[20px] items-start w-full max-w-[1440px] px-[20px] sm:px-[50px]">
       

        {/* Заголовок и количество товаров */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-[10px] w-full">
          <h1 className="font-inter font-semibold leading-[1.2] text-[#101010] text-[28px] sm:text-[38px] tracking-[-0.8px]">
            Скидки и акции
          </h1>
          <div className="flex gap-[10px] items-center justify-center pb-[6px]">
            <p className="font-inter font-medium leading-[1.2] text-[#888888] text-[16px] sm:text-[18px] tracking-[-0.4px] whitespace-nowrap">
              {sortedDiscountedProducts.length} {sortedDiscountedProducts.length === 1 ? "товар" : sortedDiscountedProducts.length < 5 ? "товара" : "товаров"} 
            </p>
          </div>
        </div>


        {/* Сетка товаров - адаптивная */}
        <div className="flex flex-col gap-[16px] items-start w-full">
          {tkans.isLoading ? (
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600"></div>
                <p className="text-lg text-gray-500">Загрузка товаров...</p>
              </div>
            </div>
          ) : tkans.error ? (
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-20 h-20 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-brown-500">Ошибка загрузки товаров</p>
                <p className="text-gray-400">{tkans.error}</p>
              </div>
            </div>
          ) : sortedDiscountedProducts.length > 0 ? (
            <>
              
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {sortedDiscountedProducts.map((product) => {
                  // Вычисляем процент скидки
                  let discountPercent = product.discount;
                  if (!discountPercent && product.oldPrice && product.price) {
                    discountPercent = Math.round((1 - product.price / product.oldPrice) * 100);
                  }
                  
                  return (
                    <div key={product.id} className="relative">
          
                     
                      
                      <ProductCard key={product.id} product={product} showHover={true} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-gray-500">Скидок нет</p>
                <p className="text-gray-400">
                  В данный момент нет товаров со скидкой. Следите за акциями!
                </p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-4 px-6 py-2 bg-[#340A09] text-white rounded-lg hover:bg-[#370e0d] transition-colors"
                >
                  Вернуться в магазин
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});