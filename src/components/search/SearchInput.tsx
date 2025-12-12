import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";

// Определяем интерфейсы
interface Product {
  id: number;
  name: string;
  price?: number;
  discount?: number;
  img?: string;
  [key: string]: any; // для остальных свойств продукта
}

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  products?: Product[];
}

export const SearchInput = ({ 
  placeholder = "Поиск пиломатериалов...", 
  onSearch, 
  className = "", 
  products = [] 
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Загружаем историю поиска из localStorage
  useEffect(() => {
    const savedQueries = localStorage.getItem("recentQueries");
    if (savedQueries) {
      try {
        setRecentQueries(JSON.parse(savedQueries));
      } catch (error) {
        console.error("Ошибка загрузки истории поиска:", error);
      }
    }
  }, []);

  // Результаты поиска
  const searchResults = searchValue
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : [];

  // Обработчик клика вне компонента
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsSearchFocused(false);
        setSelectedIndex(-1);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  // Показать дропдаун при фокусе
  useEffect(() => {
    if (isSearchFocused && (searchValue || recentQueries.length > 0)) {
      setShowDropdown(true);
    }
  }, [isSearchFocused, searchValue]);

  // Сброс индекса при изменении результатов
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  const handleClear = () => {
    setSearchValue("");
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSearch) onSearch("");
    inputRef.current?.focus();
  };

  const handleSearch = (query: string) => {
    if (query.trim() === "") return;
    
    if (onSearch) onSearch(query);
    
    // Сохраняем запрос в историю
    if (query && !recentQueries.includes(query)) {
      const updated = [query, ...recentQueries.slice(0, 4)];
      setRecentQueries(updated);
      localStorage.setItem("recentQueries", JSON.stringify(updated));
    }
    
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        if (selectedIndex >= 0 && searchResults.length > 0) {
          // Если выбран элемент из результатов
          handleResultClick(searchResults[selectedIndex]);
        } else {
          // Иначе обычный поиск
          handleSearch(searchValue);
        }
        break;
      
      case "ArrowDown":
        e.preventDefault();
        if (searchResults.length > 0) {
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : 0
          );
        }
        break;
      
      case "ArrowUp":
        e.preventDefault();
        if (searchResults.length > 0) {
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : searchResults.length - 1
          );
        }
        break;
      
      case "Escape":
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setShowDropdown(true);
  };

  const handleResultClick = (product: Product) => {
    navigate(`/product/${product.id}`);
    setShowDropdown(false);
    setSearchValue("");
    setSelectedIndex(-1);
  };

  const handleRecentQueryClick = (query: string) => {
    setSearchValue(query);
    setShowDropdown(false);
    handleSearch(query);
  };

  const formatPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) {
      const discountPrice = price * (1 - discount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold">{Math.round(discountPrice)} ₽</span>
          <span className="text-gray-400 line-through text-sm">{price} ₽</span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
      );
    }
    return <span className="font-semibold">{price} ₽</span>;
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className={`relative flex items-center bg-white rounded-full border transition-all duration-300 ${
          isSearchFocused 
            ? 'border-[#2C5530] shadow-lg' 
            : 'border-gray-300 hover:border-gray-400'
        } ${className}`}>
          {/* Иконка поиска слева */}
          <div className="absolute left-4 z-10">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-colors ${
                isSearchFocused ? 'text-[#2C5530]' : 'text-gray-400'
              }`}
            >
              <path 
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Поле ввода */}
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            onKeyDown={handleKeyPress}
            className="w-full pl-12 pr-12 py-3 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 rounded-full"
          />
          
          {/* Кнопка очистки/поиска */}
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-14 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M15 5L5 15M5 5L15 15" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          
          {/* Кнопка поиска */}
          <button
            onClick={() => handleSearch(searchValue)}
            disabled={!searchValue.trim()}
            className={`absolute right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              searchValue.trim() 
                ? 'bg-[#2C5530] hover:bg-[#3A6B41] cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            type="button"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8 13L13 8M13 8L8 3M13 8H3" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Выпадающий список результатов */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[480px] overflow-hidden"
        >
          {/* Недавние запросы */}
          {!searchValue && recentQueries.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Недавние запросы</h3>
                <button
                  onClick={() => {
                    setRecentQueries([]);
                    localStorage.removeItem("recentQueries");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Очистить
                </button>
              </div>
              <div className="space-y-1">
                {recentQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentQueryClick(query)}
                    className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-3 text-gray-400 group-hover:text-[#2C5530] transition-colors"
                    >
                      <path 
                        d="M12.6666 8.66667H8.66659V12.6667H7.33325V8.66667H3.33325V7.33333H7.33325V3.33333H8.66659V7.33333H12.6666V8.66667Z" 
                        fill="currentColor"
                      />
                    </svg>
                    <span className="text-gray-700">{query}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Результаты поиска */}
          {searchValue && searchResults.length > 0 && (
            <div className="divide-y divide-gray-100">
              <div className="p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-700">
                  Найдено {searchResults.length} товаров
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchResults.slice(0, 8).map((product, index) => (
                  <button
                    key={product.id}
                    onClick={() => handleResultClick(product)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center w-full p-4 text-left transition-all ${
                      selectedIndex === index 
                        ? 'bg-[#2C5530]/5 border-l-4 border-[#2C5530]' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {product.img ? (
                      <img 
                        src={product.img} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <svg 
                          width="24" 
                          height="24" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray-400"
                        >
                          <path 
                            d="M8 4L4 8M4 8L8 12M4 8H20M16 20L20 16M20 16L16 12M20 16H4" 
                            stroke="currentColor" 
                            strokeWidth="1.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </div>
                      {product.price && (
                        <div className="text-sm">
                          {formatPrice(product.price, product.discount)}
                        </div>
                      )}
                    </div>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 text-gray-400"
                    >
                      <path 
                        d="M6 12L10 8L6 4" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Если ничего не найдено */}
          {searchValue && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-400"
                >
                  <path 
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-gray-700 font-medium mb-2">Ничего не найдено</p>
              <p className="text-gray-500 text-sm">
                Попробуйте изменить запрос "{searchValue}"
              </p>
            </div>
          )}

          {/* Подсказка с популярными запросами */}
          {!searchValue && recentQueries.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-700 font-medium mb-4">Популярные запросы:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Дуб', 'Сосна', 'Береза', 'Осина', 'Фанера'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleRecentQueryClick(tag)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};