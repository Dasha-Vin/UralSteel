import React, { useEffect, useState } from 'react';
import './AboutUs.css'; // Подключите ваши стили

const AboutUs = () => {
    const [activeId, setActiveId] = useState(0);
    
    const slides = [
        { className: "gallery_image_title" },
        { className: "gallery_image_second" },
        { className: "gallery_image_third" },
        { className: "gallery_image_fourth" },
        { className: "gallery_image_five" },
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveId(prevId => (prevId + 1) % slides.length);
        }, 3000); // Смена слайдов каждые 3 секунды

        return () => clearInterval(intervalId); // Очистка интервала при размонтировании компонента
    }, [slides.length]);

    return (
        <section className="love" id="love">
            <div className="container">
                <h2 className="common-title">Уральская сталь</h2>
                <ul className="galleries">
                    <li className="gallery gallery-item-orange">
                        <div className="gallery-item-title">
                            Уральская сталь — это металлургический комбинат
                        </div>
                        <div className="gallery-item-text">Это один 
                            из ведущих производителей чёрной металлургии в России. 
                            Уральская сталь имеет богатую историю и множество достижений. 
                            Комбинат активно внедряет современные технологии и 
                            инновации, что позволяет ему оставаться конкурентоспособным 
                            на мировом рынке. Уральская сталь экспортирует свою продукцию 
                            в различные страны мира, обеспечивая рабочие места и 
                            развитие экономики региона.
                        </div>
                    </li>
                    <li className="gallery">
                        <div className="gallery__slides">
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`gallery__slide ${activeId === index ? 'gallery__slide_active' : ''}`}
                                    style={{
                                        transform: activeId === index ? 'translateX(0)' : 'translateX(-100%)',
                                        opacity: activeId === index ? '1' : '0'
                                    }}
                                    data-testid={`slide-${index}`} // Добавляем data-testid
                                >
                                    <div className={`gallery_box ${slide.className}`}></div>
                                </div>
                            ))}
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default AboutUs;