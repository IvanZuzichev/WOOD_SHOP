import { observer } from "mobx-react-lite";
import { useContext, useEffect, useMemo } from "react";
import { Context } from '../../context/index';
import { ProductCard } from "../../components/productcard/ProductCard";

export const New = observer(() => {
  const { tkans } = useContext(Context);
  
  // Загружаем товары при монтировании компонента, если их нет
  useEffect(() => {
    if (!tkans.tkans || tkans.tkans.length === 0) {
      tkans.fetchTkans();
    }
  }, []);

  // Мемоизируем отсортированные товары
  const sortedProducts = useMemo(() => {
    const allProducts = tkans.tkans || [];
    
    // Сортируем по ID в обратном порядке (от новых к старым)
    return [...allProducts].sort((a, b) => {
      // Если ID - числа
      if (typeof a.id === 'number' && typeof b.id === 'number') {
        return b.id - a.id;
      }
      // Если ID - строки
      if (typeof a.id === 'string' && typeof b.id === 'string') {
        return b.id.localeCompare(a.id);
      }
      // По умолчанию - без сортировки
      return 0;
    });
  }, [tkans.tkans]);

  // Хлебные крошки
  const breadcrumbsItems = [
    { label: 'Главная', link: '/' },
    { label: 'Новинки', link: null }
  ];

  return (
    <div className="flex flex-col gap-[10px] items-center px-0 py-[20px] w-full bg-[#F1F0EE] min-h-screen">
      <div className="flex flex-col gap-[20px] items-start w-full max-w-[1440px] px-[20px] sm:px-[50px]">

        {/* Заголовок и количество товаров */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-[10px] w-full">
          <h1 className="font-inter font-semibold leading-[1.2] text-[#101010] text-[28px] sm:text-[38px] tracking-[-0.8px]">
            Новинки
          </h1>
          <div className="flex gap-[10px] items-center justify-center pb-[6px]">
            <p className="font-inter font-medium leading-[1.2] text-[#888888] text-[16px] sm:text-[18px] tracking-[-0.4px] whitespace-nowrap">
              {sortedProducts.length} {sortedProducts.length === 1 ? "товар" : sortedProducts.length < 5 ? "товара" : "товаров"}
            </p>
          </div>
        </div>

        {/* Сетка товаров */}
        <div className="flex flex-col gap-[16px] items-start w-full">
          {tkans.isLoading ? (
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          ) : sortedProducts.length > 0 ? (
            <>
         
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {sortedProducts.map((product) => (
                  <div key={product.id} className="relative">
                    {/* Отображаем бейдж "Новинка" только если товар действительно новый */}
                    {(product.tags?.includes('new') || product.isNew) && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                          Новинка
                        </span>
                      </div>
                    )}
                    
                 
                    <ProductCard product={product} showHover={true} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg text-gray-500">Товары не найдены</p>
                <p className="text-gray-400">Каталог пуст или товары не загружены</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});