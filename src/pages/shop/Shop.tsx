import { observer } from "mobx-react-lite"
import { Context } from '../../context/index';
import { useContext, useEffect, useMemo } from "react";
import { MainSlider } from "../../components/mainslider/MainSlider.jsx"; 
import { ProductSection } from "../../components/productsection/ProductSection.jsx";

export let Shop = observer(() => {
    const { tkans } = useContext(Context)
    
    useEffect(() => {
        if (!tkans.tkans || tkans.tkans.length === 0 || tkans.tkans.length === 4) {
            tkans.fetchTkans();
        }
        tkans.fetchTypes();
        tkans.fetchBrands();
    }, []);
    
    // Слайды для главного слайдера
    const mainSlides = [
        {
            image: "/MainSlider/IMG1.JPG",
            title: "Материалы из дерева",
            subtitle: "Высококачественные материалы для строительства",
            textPosition: "center",
            buttonText: "Смотреть коллекцию"
        },
        {
            image: "/MainSlider/IMG2.JPEG", 
            title: "Самые качественные материалы",
            subtitle: "Контроль качества в каждой детали",
            textPosition: "center",
            buttonText: "В каталог"
        },
        {
            image: "/MainSlider/IMG3.PNG",
            title: "Новинки материалов",
            subtitle: "Самые новые матераиалы",
            textPosition: "center",
            buttonText: "Смотреть новинки"
        },
        {
            image: "/MainSlider/IMG4.PNG",
            title: "СКИДКИ ДО 90%",
            subtitle: "Выгодные предложения",
            textPosition: "center",
            buttonText: "Смотреть акции"
        }
    ];
    
    const productsData = useMemo(() => {
        const allProducts = tkans.tkans || [];
        
        const newArrivals = [...allProducts]
            .sort((a, b) => b.id - a.id)
            .slice(0, 4);
        
        const discountedProducts = allProducts
            .filter(product => product.discount > 0)
            .slice(0, 4);
        
        const combinations = [...allProducts]
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        
        return {
            newArrivals,
            discountedProducts,
            combinations
        };
    }, [tkans.tkans]);
    
    return(
        <>
        {/* Главный слайдер */}
        <div className="w-full">
            <MainSlider 
                slides={mainSlides}
                autoPlay={true}
                autoPlayInterval={5000}
            />
        </div>
        
        {/* Контент после слайдера */}
        <div className="max-w-[1440px] w-full mx-auto px-[20px] py-[40px]">
            {tkans.isLoading ? (
                <div className="flex justify-center items-center py-[40px]">
                    <div className="text-[#888888] text-[16px]">Загрузка товаров...</div>
                </div>
            ) : tkans.error ? (
                <div className="flex justify-center items-center py-[40px]">
                    <div className="text-[#340A09] text-[16px]">Ошибка загрузки: {tkans.error}</div>
                </div>
            ) : (
                <>
                    {/* Новинки */}
                    <ProductSection 
                        title="Новинки" 
                        products={productsData.newArrivals} 
                        sectionType="new"
                        keyPrefix="new"
                    />
                    
                    {/* Акции и скидки */}
                    <ProductSection 
                        title="Акции и скидки" 
                        products={productsData.discountedProducts} 
                        sectionType="discounts"  
                        keyPrefix="discounts"
                    />
                </>
            )}
        </div>
        </>
    )
})