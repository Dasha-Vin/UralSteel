import React from 'react';
import './MainContent.css';
import line1Image from '../../assets/line1.png';
import mainImage from '../../assets/orig.jpg';

const MainContent = () => {
    const handleButtonClick = () => {
        // Выполняем плавную прокрутку к элементу с ID "programm"
        const targetElement = document.getElementById("programm");
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="main-content">
            <div className="container">
                <img src={line1Image} alt="line" className="line1" />

                <div className="main-info">
                    <h1 className="main-title">Программа переподготовки сотрудников</h1>
                    <img src={mainImage} alt="" className="main-image" />
                    <p className="main-text">Наша программа профессионального обучения, 
                        позволяет сотрудникам получить новые 
                        профессии за счёт предприятия. Эта программа 
                        помогла десяткам жителей Новотроицка и Орска 
                        освоить новые специальности. Новотроицкий 
                        политехнический колледж и Орский машиностроительный 
                        колледж готовят специалистов для Уральской 
                        Стали по различным направлениям, таким как 
                        слесарь-ремонтник, электромонтёр, горновой 
                        доменной печи и другие.</p>
                    <div className="main-action">
                        <button className="button" id="main-action-button" onClick={handleButtonClick}>
                            Зарегистрироваться
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MainContent;