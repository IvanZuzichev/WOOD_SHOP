import { useState, useEffect } from "react";
import styles from "./MainSlider.module.scss";

// SVG иконки стрелок
const ChevronLeftIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

export const MainSlider = ({ 
    slides, 
    autoPlay = true, 
    autoPlayInterval = 5000,
    showArrows = true 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };
    
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };
    
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };
    
    useEffect(() => {
        if (!autoPlay) return;
        
        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
        
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, currentSlide]);
    
    return (
        <div className={styles.sliderContainer}>
            {/* Слайды */}
            <div className={styles.slidesWrapper}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            transform: `translateX(-${currentSlide * 100}%)`
                        }}
                    >
                        {/* Затемнение для лучшей читаемости текста */}
                        <div className={styles.overlay}></div>
                        
                        {/* Текст на слайде */}
                        <div className={`${styles.slideContent} ${styles[slide.textPosition || 'left']}`}>
                            <h2 className={styles.slideTitle}>{slide.title}</h2>
                            {slide.subtitle && (
                                <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                            )}
                            {slide.buttonText && (
                                <button className={styles.slideButton}>
                                    {slide.buttonText}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
       
        </div>
    );
};