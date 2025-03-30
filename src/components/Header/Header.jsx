import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Импортируйте Link
import './Header.css';
import Logo from '../../assets/logo.png';
import Burger from '../Burger/Burger'; 

const Header = () => {
    const [isBurgerOpen, setIsBurgerOpen] = useState(false);

    const toggleBurger = () => {
        setIsBurgerOpen(prevState => !prevState);
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
        <header className="header">
            <div className="container">
                <div className="header-logo">
                    <img className="logo" src={Logo} alt="Логотип" />
                    <h3 className="header-title">Уральская сталь</h3>
                </div>
                <nav className="menu">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <a href="#" data-link="programm" onClick={handleLinkClick}>Программы</a>
                        </li>
                        <li className="menu-item">
                            <a href="#" data-link="love" onClick={handleLinkClick}>О нас</a>
                        </li>
                        <li className="menu-item">
                            <Link to="/login">Личный кабинет</Link> {/* Используйте Link вместо обычной ссылки */}
                        </li>
                    </ul>
                </nav>
                <button className="burger_btn" onClick={toggleBurger}></button>
                <Burger isOpen={isBurgerOpen} toggleBurger={toggleBurger} />
            </div>
        </header>
    );
};

export default Header;