import styles from "./Footer.module.scss";
import { Link, useLocation } from "react-router-dom";
import { 
  CATALOG_ROUTE, 
  CATALOG_CLOTHING_ROUTE,
  ACCOUNT_ROUTE,
  ABOUTUS_ROUTE,
  PRIVACY_POLICY_ROUTE,
  TERMS_OF_SERVICE_ROUTE,
  DISCOUNTS_ROUTE
} from "../../utils/consts";
import { clothingCategories } from "../../utils/catalogCategories";

export const Footer = () => {
  const location = useLocation();
  
  // Определяем текущую категорию из URL
  const pathname = location.pathname;
  const isClothingCatalog = pathname.includes('/catalog-clothing');
  
  // Извлекаем slug категории из пути
  const getCurrentCategorySlug = () => {
    if (pathname.includes('/catalog-clothing/')) {
      return pathname.split('/catalog-clothing/')[1]?.split('/')[0] || null;
    }
    if (pathname.includes('/catalog/')) {
      return pathname.split('/catalog/')[1]?.split('/')[0] || null;
    }
    return null;
  };
  
  const currentCategorySlug = getCurrentCategorySlug();
  
  // Проверяем, является ли категория активной
  const isActiveCategory = (slug) => {
    if (!currentCategorySlug) return false;
    return currentCategorySlug === slug;
  };

  // Обработчик клика для прокрутки вверх
  const handleCategoryClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

   // Обработка клика на якорные ссылки AboutUs
    const handleAboutUsLinkClick = (e, hash) => {
      // Если уже на странице AboutUs, обновляем hash и делаем плавный скролл
      if (location.pathname === ABOUTUS_ROUTE) {
        e.preventDefault();
        window.location.hash = hash;
        // Вызываем событие для плавного скролла
        window.dispatchEvent(new CustomEvent('scrollToHash', { detail: { hash: hash.replace('#', '') } }));
        return false;
      }
      // Если не на странице AboutUs, разрешаем обычный переход
      return true;
    };

  return (
    <footer className={styles.wrapper}>
      <section className={styles.top_section}>
        <h3 className={styles.top_section_title}>
          Широкий выбор материалов со скидками до 90%
        </h3>
        <Link to={DISCOUNTS_ROUTE} className={styles.top_section_btn}>
          Перейти в каталог
        </Link>
      </section>

      <section className={styles.bottom_section}>
        <div className={styles.footer_content}>

          <div className={styles.footer_section}>
            <h3 className={styles.section_title}>Категории дерева</h3>
            <nav className={styles.nav} aria-label="Категории дерева">
              {clothingCategories.map((category, index) => {
                const isActive = isClothingCatalog && isActiveCategory(category.slug);
                return (
                  <Link 
                    key={index}
                    to={`${CATALOG_CLOTHING_ROUTE}/${category.slug}`} 
                    className={`${styles.link} ${isActive ? styles.link_active : ''}`}
                    onClick={handleCategoryClick}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className={styles.footer_section}>
            <h3 className={styles.section_title}>Компания</h3>
            <nav className={styles.nav} aria-label="Информация о компании">
              <Link to={ACCOUNT_ROUTE} className={styles.link}>
                Личный кабинет
              </Link>
               <Link 
            to={`${ABOUTUS_ROUTE}#about`} 
            onClick={(e) => {
              handleAboutUsLinkClick(e, '#about');
            }}   className={styles.link}>
                О нас
              </Link>
             <Link 
            to={`${ABOUTUS_ROUTE}#contacts`} 
            onClick={(e) => {
              handleAboutUsLinkClick(e, '#contacts');
            }} className={styles.link}>
                Контакты
              </Link>
              <Link
              to={`${ABOUTUS_ROUTE}#pay`} 
              onClick={(e) => handleAboutUsLinkClick(e, '#pay')} className={styles.link}>
                Оплата и доставка
              </Link>
              <Link
            to={`${ABOUTUS_ROUTE}#questions`} 
            onClick={(e) => {
              handleAboutUsLinkClick(e, '#questions');
            }} className={styles.link}>
                Часто задаваемые вопросы
              </Link>
              <Link to={PRIVACY_POLICY_ROUTE} className={styles.link}>
                Политика конфиденциальности
              </Link>
              <Link to={TERMS_OF_SERVICE_ROUTE} className={styles.link}>
                Условия пользования
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </footer>
  );
};


