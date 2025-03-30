import React, { useState } from 'react';
import './Contacts.css'; // Подключите свои стили

const Contact = () => {

    return (
        <div className="container">
            <h2 className='contact'>Свяжитесь с нами</h2>
            
            <div className="contacts__block">
                {/* Телефонная ссылка */}
                <a className="contacts-phone" href="tel:+73537662153">+7 (3537) 66 21 53</a>  
                
                {/* Почтовая ссылка */}
                <a className="contacts-mail" href="mailto:info@uralsteel.com">info@uralsteel.com</a>
            </div>
        </div>
    );
};

export default Contact;