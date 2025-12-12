import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useRef, useContext, useEffect } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { FaShoppingCart, FaUser, FaSignInAlt, FaSearch, FaBars, FaTimes, FaBox, FaTruck, FaHome, FaTools, FaShieldAlt, FaTree } from "react-icons/fa";
import { Context } from '../../context/index';
import { observer } from "mobx-react-lite";
import { ACCOUNT_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, ABOUTUS_ROUTE } from "../../utils/consts";
import { SearchInput } from "../search/SearchInput";

// Категории для древесины и стройматериалов
const categories = [
    {
        id: 1,
        name: "Пиломатериалы",
        description: "Обрезные и необрезные",
        icon: <FaTree className="text-[#340A09] text-[20px]" />,
        subcategories: ["Доска обрезная", "Доска необрезная", "Брус", "Брусок", "Рейка", "Горбыль"]
    },
    {
        id: 2,
        name: "Строганые погонажные изделия",
        description: "Профилированные материалы",
        icon: <FaTools className="text-[#340A09] text-[20px]" />,
        subcategories: ["Вагонка", "Имитация бруса", "Блок-хаус", "Планкен", "Плинтус", "Наличник"]
    },
    {
        id: 3,
        name: "Листовые материалы на древесной основе",
        description: "Панели и плиты",
        icon: <FaBox className="text-[#340A09] text-[20px]" />,
        subcategories: ["Фанера", "ДСП", "ДВП", "ОСБ", "МДФ", "ХДФ", "ЦСП"]
    },
    {
        id: 4,
        name: "Клееные и инженерные изделия",
        description: "Технологичные материалы",
        icon: <FaHome className="text-[#340A09] text-[20px]" />,
        subcategories: ["Клееный брус", "Балки LVL", "Клееная фанера", "Мебельные щиты", "Паркетная доска"]
    },
    {
        id: 5,
        name: "Столярные изделия и готовые элементы",
        description: "Готовые конструкции",
        icon: <FaTools className="text-[#340A09] text-[20px]" />,
        subcategories: ["Лестницы", "Двери", "Окна", "Мебельные фасады", "Резные элементы"]
    },
    {
        id: 6,
        name: "Специальные и защищённые материалы",
        description: "Обработанная древесина",
        icon: <FaShieldAlt className="text-[#340A09] text-[20px]" />,
        subcategories: ["Термодревесина", "Импрегнированная древесина", "Антисептированные материалы", "Огнезащитные материалы"]
    },
    {
        id: 7,
        name: "Техническая и поделочная древесина",
        description: "Специальное назначение",
        icon: <FaTruck className="text-[#340A09] text-[20px]" />,
        subcategories: ["Поддоны", "Тару", "Опалубку", "Рудничную стойку", "Поделочные породы"]
    }
];

// Функция для получения URL аватара
const getAvatarUrl = () => {
    return null;
};

export const NavBar = observer(() => {
    const { user, tkans } = useContext(Context);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false); // Каталог
    const [mobileNav, setMobileNav] = useState(false); // Мобильное меню
    const [showSearch, setShowSearch] = useState(false); // Мобильный поиск
    const timeoutRef = useRef(null);
    const [activeCategory, setActiveCategory] = useState(null);

    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) { // Только для десктопа
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) { // Только для десктопа
            timeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                setActiveCategory(null);
            }, 300);
        }
    };

    const handleCategoryMouseEnter = (categoryId) => {
        if (window.innerWidth >= 1024) {
            setActiveCategory(categoryId);
        }
    };

    const handleCatalogClick = () => {
        if (window.innerWidth < 1024) { // Только для мобильных и планшетов
            setIsOpen(!isOpen);
        }
    };

    // Обработка клика на якорные ссылки AboutUs
    const handleAboutUsLinkClick = (e, hash) => {
        if (location.pathname === ABOUTUS_ROUTE) {
            e.preventDefault();
            window.location.hash = hash;
            window.dispatchEvent(new CustomEvent('scrollToHash', { detail: { hash: hash.replace('#', '') } }));
            return false;
        }
        return true;
    };

    // Обработчик поиска
    const handleSearch = (query) => {
        console.log("Search query:", query);
    };

    // Закрытие поиска
    const handleCloseSearch = () => {
        setShowSearch(false);
    };

    return (
        <header className="w-full bg-[#F1F0EE] text-dark font-inter sticky top-0 z-50 shadow-sm">
            {/* Верхняя панель (desktop only) */}
            <section className="hidden md:flex items-center py-[5px] text-sm bg-[#F1F0EE] border-b border-[#e4e2de] relative h-[50px]">
                <div className="max-w-[1440px] w-full mx-auto flex items-center relative px-[20px] md:px-[50px]">
                    <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 whitespace-nowrap">
                        <NavLink to={ABOUTUS_ROUTE} className="text-[#888888] text-[14px] font-medium hover:text-accentDark transition-colors py-[5px] whitespace-nowrap">
                            О нас
                        </NavLink>
                        <Link 
                            to={`${ABOUTUS_ROUTE}#pay`} 
                            onClick={(e) => handleAboutUsLinkClick(e, '#pay')}
                            className="text-[#888888] text-[14px] font-medium hover:text-accentDark transition-colors py-[5px] whitespace-nowrap"
                        >
                            Оплата и доставка
                        </Link>
                        <Link 
                            to={`${ABOUTUS_ROUTE}#questions`} 
                            onClick={(e) => handleAboutUsLinkClick(e, '#questions')}
                            className="text-[#888888] text-[14px] font-medium hover:text-accentDark transition-colors py-[5px] whitespace-nowrap"
                        >
                            Часто задаваемые вопросы
                        </Link>
                        <Link 
                            to={`${ABOUTUS_ROUTE}#contacts`} 
                            onClick={(e) => handleAboutUsLinkClick(e, '#contacts')}
                            className="text-[#888888] text-[14px] font-medium hover:text-accentDark transition-colors py-[5px] whitespace-nowrap"
                        >
                            Контакты
                        </Link>
                    </nav>
                </div>
            </section>

            {/* Основная панель навигации */}
            <section className="flex items-center h-[80px] bg-[#F1F0EE] relative">
               <div className="max-w-[1440px] w-full mx-auto flex items-center justify-between px-[20px] md:px-[50px]">
                    {/* Левая часть - Логотип */}
                    <div className="flex items-center">
                        <NavLink to={SHOP_ROUTE} className="flex items-center gap-[10px]">
                            <img
                                src="/logo.png"
                                alt="Логотип магазина материалов"
                                className="h-[60px] w-auto md:h-[70px] rounded-lg"
                            />
                        </NavLink>
                    </div>

                    {/* Навигация для десктопа */}
                    <div className="hidden lg:flex items-center gap-[10px] ml-[20px]">
                        {/* Кнопка Каталог */}
                        <div className="relative">
                            <button
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={handleCatalogClick}
                                className="flex items-center gap-[6px] px-[12px] py-[8px] bg-[#340A09] text-white rounded-[8px] text-[16px] font-medium leading-[1.2] hover:bg-[#4a0e0d] transition-colors whitespace-nowrap group"
                            >
                                Каталог
                            </button>

                            {/* Выпадающее меню категорий для десктопа */}
                            {isOpen && (
                                <div
                                    className="absolute left-0 mt-2 transition-all duration-300 ease-in-out z-50 animate-fadeIn"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 min-w-[600px] max-w-[800px] flex overflow-hidden">
                                        {/* Основные категории */}
                                        <div className="w-1/2 border-r border-gray-100">
                                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                                <h3 className="text-[16px] font-semibold text-[#340A09]">Категории материалов</h3>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto">
                                                {categories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                            activeCategory === category.id ? 'bg-gray-50' : ''
                                                        }`}
                                                        onMouseEnter={() => handleCategoryMouseEnter(category.id)}
                                                        onClick={() => {
                                                            // Здесь можно добавить переход на страницу категории
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-shrink-0">
                                                                {category.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-[15px] font-medium text-gray-900">
                                                                    {category.name}
                                                                </h4>
                                                                <p className="text-[13px] text-gray-500 mt-1">
                                                                    {category.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Подкатегории */}
                                        <div className="w-1/2">
                                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                                <h3 className="text-[16px] font-semibold text-[#340A09]">
                                                    {activeCategory 
                                                        ? `${categories.find(c => c.id === activeCategory)?.name}`
                                                        : 'Выберите категорию'
                                                    }
                                                </h3>
                                            </div>
                                            <div className="max-h-[500px] overflow-y-auto p-4">
                                                {activeCategory ? (
                                                    <div>
                                                        <ul className="space-y-2">
                                                            {categories
                                                                .find(c => c.id === activeCategory)
                                                                ?.subcategories.map((sub, index) => (
                                                                    <li key={index}>
                                                                        <Link
                                                                            to={`/category/${activeCategory}?subcategory=${encodeURIComponent(sub)}`}
                                                                            className="block p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-[#340A09] transition-colors"
                                                                            onClick={() => setIsOpen(false)}
                                                                        >
                                                                            {sub}
                                                                        </Link>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-10">
                                                        <div className="text-gray-400 mb-2">
                                                            <FaBox className="text-[40px] mx-auto" />
                                                        </div>
                                                        <p className="text-gray-500">Наведите на категорию для просмотра подкатегорий</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Работы из наших материалов */}
                        <Link 
                            to="/our_works" 
                            className="flex items-center px-[10px] py-[8px] text-[#101010] text-[16px] font-medium leading-[1.2] rounded-[8px] transition-colors whitespace-nowrap hover:bg-white"
                        >
                            Работы из наших материалов
                        </Link>
                    </div>

                    {/* Правая часть - Поиск и иконки */}
                    <div className="flex items-center gap-[24px]">
                        {/* Поиск — desktop */}
                        <div className="hidden md:flex">
                            <SearchInput 
                                placeholder="Поиск материалов"
                                onSearch={handleSearch}
                            />
                        </div>

                        {/* ПРОФИЛЬ с новой иконкой */}
                        {user.isAuth ? 
                            <NavLink to={ACCOUNT_ROUTE} className="hidden md:flex items-center gap-2 group">
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                    <FaUser className="text-[#101010] text-[20px] group-hover:text-[#340A09] transition-colors" />
                                </div>
                            </NavLink>
                            :
                            <Link to={LOGIN_ROUTE} className="hidden md:flex items-center gap-2 group">
                                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                                    <FaSignInAlt className="text-[#101010] text-[20px] group-hover:text-[#340A09] transition-colors" />
                                </div>
                            </Link>
                        }

                        {/* Бургер меню с новой иконкой */}
                        <button
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setMobileNav(!mobileNav)}
                        >
                            {mobileNav ? (
                                <FaTimes className="text-[#101010] text-[24px]" />
                            ) : (
                                <FaBars className="text-[#101010] text-[24px]" />
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* ====== Поиск под хедером (mobile & tablet) ====== */}
            {showSearch && (
                <div
                    className="md:hidden bg-[#F1F0EE] border-b border-dark/10 py-3 overflow-visible"
                    style={{ zIndex: 60 }}
                >
                    <div className="flex flex-col px-4 relative">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[#101010] text-[18px] font-medium">Поиск</h3>
                            <button 
                                onClick={handleCloseSearch}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                                <FaTimes className="text-[#101010] text-[20px]" />
                            </button>
                        </div>
                        
                        <div className="relative z-[70]">
                            <SearchInput 
                                placeholder="Поиск материалов"
                                onSearch={handleSearch}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ====== Мобильное меню (полноэкранное) ====== */}
            <div
                className={`fixed inset-0 bg-[#F1F0EE] z-40 transform transition-transform duration-300 ${
                    mobileNav ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Шапка мобильного меню */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#e4e2de]">
                    <NavLink 
                        to={SHOP_ROUTE} 
                        onClick={() => setMobileNav(false)}
                        className="flex items-center gap-2"
                    >
                        <img
                            src="/logo.png"
                            alt="Логотип магазина материалов"
                            className="h-[30px] w-auto"
                        />
                    </NavLink>

                    <div className="flex items-center gap-3">
                        {/* Поиск в мобильном меню */}
                        <button
                            onClick={() => {
                                setShowSearch(true);
                                setMobileNav(false);
                            }}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <FaSearch className="text-[#101010] text-[20px]" />
                        </button>

                        {/* Крестик для закрытия меню */}
                        <button 
                            onClick={() => setMobileNav(false)}
                            className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                            <FaTimes className="text-[#101010] text-[24px]" />
                        </button>
                    </div>
                </div>

                {/* Основное содержимое меню */}
                <div className="px-6 py-6 h-[calc(100vh-80px)] overflow-y-auto">
                    {/* Кнопка Каталог */}
                    <div className="mb-6">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center justify-between px-4 py-3 bg-[#340A09] text-white rounded-lg text-[16px] font-medium leading-[1.2] hover:bg-[#860202] transition-colors w-full"
                        >
                            <span>Каталог</span>
                            <span>{isOpen ? "−" : "+"}</span>
                        </button>

                        {/* Категории для мобильного меню */}
                        {isOpen && (
                            <div className="mt-4 space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <button
                                            onClick={() => {
                                                // Здесь можно добавить переход или развернуть подкатегории
                                                console.log('Selected category:', category.name);
                                            }}
                                            className="flex items-center gap-3 p-4 w-full text-left hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex-shrink-0">
                                                {category.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[15px] font-medium text-gray-900">
                                                    {category.name}
                                                </h4>
                                                <p className="text-[13px] text-gray-500 mt-1">
                                                    {category.description}
                                                </p>
                                            </div>
                                        </button>
                                        {/* Можно добавить подкатегории по клику */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Скидки и акции */}
                    <div className="flex flex-col gap-3 mb-6">
                        <Link 
                            to="/discounts" 
                            onClick={() => setMobileNav(false)}
                            className="hover:text-[#432928] transition-colors"
                            style={{ 
                                display: 'flex',
                                padding: '6px 0',
                                alignItems: 'flex-start',
                                fontFamily: 'Inter', 
                                fontSize: '16px', 
                                fontStyle: 'normal', 
                                fontWeight: '500', 
                                lineHeight: '120%',
                                color: '#101010'
                            }}
                        >
                            Скидки и акции
                        </Link>
                        
                        <div 
                            style={{ 
                                height: '1px',
                                alignSelf: 'stretch',
                                backgroundColor: '#e4e2de'
                            }}
                        />
                    </div>

                    {/* Навигационные ссылки */}
                    <nav className="space-y-6 mb-8">
                        <NavLink 
                            to={ABOUTUS_ROUTE} 
                            onClick={() => setMobileNav(false)}
                            className="block text-[18px] font-medium text-[#888] hover:text-[#432928] transition-colors"
                        >
                            О нас
                        </NavLink>
                        
                        <Link 
                            to={`${ABOUTUS_ROUTE}#pay`} 
                            onClick={(e) => {
                                handleAboutUsLinkClick(e, '#pay');
                                setMobileNav(false);
                            }}
                            className="block text-[18px] font-medium text-[#888] hover:text-[#432928] transition-colors"
                        >
                            Оплата и доставка
                        </Link>
                        
                        <Link 
                            to={`${ABOUTUS_ROUTE}#questions`} 
                            onClick={(e) => {
                                handleAboutUsLinkClick(e, '#questions');
                                setMobileNav(false);
                            }}
                            className="block text-[18px] font-medium text-[#888] hover:text-[#432928] transition-colors"
                        >
                            Часто задаваемые вопросы
                        </Link>

                        <Link 
                            to={`${ABOUTUS_ROUTE}#contacts`} 
                            onClick={(e) => {
                                handleAboutUsLinkClick(e, '#contacts');
                                setMobileNav(false);
                            }}
                            className="block text-[18px] font-medium text-[#888] hover:text-[#432928] transition-colors"
                        >
                            Контакты
                        </Link>
                    </nav>

                    {/* Иконки корзины и профиля в мобильном меню */}
                    <div className="border-t border-[#e4e2de] pt-6 mt-auto">
                        <div className="flex justify-between items-center">
                            {/* Левая часть - иконки */}
                            <div className="flex items-center gap-4">
                                {/* Профиль в мобильном меню */}
                                {user.isAuth ? 
                                    <NavLink 
                                        to={ACCOUNT_ROUTE} 
                                        onClick={() => setMobileNav(false)}
                                        className="p-2 hover:bg-white rounded-lg transition-colors inline-block"
                                    >
                                        <FaUser className="text-[#101010] text-[24px]" />
                                    </NavLink>
                                    :
                                    <Link 
                                        to={LOGIN_ROUTE} 
                                        onClick={() => setMobileNav(false)}
                                        className="p-2 hover:bg-white rounded-lg transition-colors inline-block"
                                    >
                                        <FaSignInAlt className="text-[#101010] text-[24px]" />
                                    </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
});