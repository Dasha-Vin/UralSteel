import React from 'react';
import { Link } from 'react-router-dom';
import './Burger.css'; // Добавьте стили если необходимо
import closeIcon from '../../assets/close.png'; // Импортируйте изображение для закрытия
import Logo from '../../assets/logo.png';

const BURGER_OPENED_CLASSNAME = 'burger_open';
const BODY_FIXED_CLASSNAME2 = 'body_fixed';

const Burger = ({ isOpen, toggleBurger }) => {
    React.useEffect(() => {
        const bodyNode = document.querySelector('body');

        if (isOpen) {
            bodyNode.classList.add(BODY_FIXED_CLASSNAME2);
        } else {
            bodyNode.classList.remove(BODY_FIXED_CLASSNAME2);
        }

        return () => {
            // Убедимся, что класс удаляется при размонтировании компонента
            bodyNode.classList.remove(BODY_FIXED_CLASSNAME2);
        };
    }, [isOpen]);

    const handleClickOutside = (event) => {
        const burgerContentNode = event.currentTarget.querySelector('.js-burger_content');
    
        // Проверяем, был ли клик вне содержимого бургер-меню
        if (burgerContentNode && !burgerContentNode.contains(event.target)) {
            toggleBurger();
        }
    };

    const handleLinkClick = (event) => {
        event.preventDefault(); // Предотвратить переход по ссылке
        const targetId = event.currentTarget.getAttribute("data-link");
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className={`burger ${isOpen ? BURGER_OPENED_CLASSNAME : ''}`} onClick={handleClickOutside}>
            <div className="burger_content js-burger_content">
                <button className="burger_close-btn" onClick={toggleBurger}>
                    <img className="burger__close-image" src={closeIcon} alt="Закрыть" />
                </button>
                <nav className="burger-nav">
                    <div className="burger-logo">
                        <img className="logo" src={Logo} alt="Логотип" />
                        <h3 className="burger-title">Уральская сталь</h3>
                    </div>
                    <ul className="burger-navList">
                        <li className="menu-item burger-navItem">
                            <Link to="/login">Личный кабинет</Link>
                        </li>
                        <li className="menu-item burger-navItem">
                            <a data-link="programm" onClick={handleLinkClick}>Программы</a>
                        </li>
                        <li className="menu-item burger-navItem">
                            <a data-link="love" onClick={handleLinkClick}>О нас</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Burger;