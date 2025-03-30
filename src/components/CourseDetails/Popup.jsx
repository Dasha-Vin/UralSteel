import React, { useState } from 'react';
import './Popup.css';
import CloseImage from '../../assets/close.png';
import { db } from '../../firebaseConfig'; 
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const Popup = ({ isOpen, onClose, course }) => {
    // Состояния для хранения данных формы
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    // Состояния для управления видимостью паролей
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isChecked, setIsChecked] = useState(false);

    if (!isOpen) return null; // Если popup закрыт, не рендерим его

    // Функция для обработки отправки формы
    const handleSubmit = async () => {
        const newErrors = {};

        // Валидация полей формы
        if (!firstName) newErrors.firstName = "Пожалуйста, введите имя.";
        if (!lastName) newErrors.lastName = "Пожалуйста, введите фамилию.";
        if (!middleName) newErrors.middleName = "Пожалуйста, введите отчество.";
        if (!email) newErrors.email = "Пожалуйста, введите адрес электронной почты.";
        if (!password) newErrors.password = "Пожалуйста, введите пароль.";
        if (!confirmPassword) newErrors.confirmPassword = "Пожалуйста, подтвердите пароль.";

        if (!course) {
            alert("Ошибка: недоступен курс.");
            return;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают.";
        }

        if (password.length < 6) {
            newErrors.password = "Пароль должен содержать не менее 6 символов.";
        }

        if (!isChecked) {
            newErrors.checkbox = "Пожалуйста, подтвердите данные.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Проверка, существует ли уже пользователь с таким email
        const usersRef = collection(db, "employees");
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            newErrors.email = "Пользователь с таким логином уже существует. Пожалуйста, выберите другой логин.";
            setErrors(newErrors);
            return;
        }

        try {
            // Добавление нового пользователя в базу данных
            const docRef = await addDoc(collection(db, "employees"), {
                firstName,
                lastName,
                middleName,
                email,
                password,
                courseId: course.id,
                courseName: course.name,
                statusCourse: "На рассмотрении"
            });
            console.log("Документ успешно записан с ID: ", docRef.id);
            setSuccessMessage("Вашу заявку успешно отправили!");

            // Очистка полей формы
            setFirstName('');
            setLastName('');
            setMiddleName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setErrors({});

            // Автоматическое закрытие popup через 2 секунды
            setTimeout(() => {
                onClose();
                setSuccessMessage('');
            }, 2000);
        } catch (e) {
            console.error("Ошибка при добавлении документа: ", e);
            alert("Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.");
        }
    };

    return (
        <div className="popup popup_open">
            <div className="popup__content">
                <p className="popup__title">Записаться на курс</p>
                <p className="popup__text">Заполните форму, мы рассмотрим вашу заявку</p>

                {successMessage && <p className="success-message">{successMessage}</p>}

                {/* Поля ввода данных */}
                <input 
                    className="input" 
                    type="text" 
                    placeholder="Имя" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="error-message">{errors.firstName}</p>}

                <input 
                    className="input" 
                    type="text" 
                    placeholder="Фамилия" 
                    value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="error-message">{errors.lastName}</p>}

                <input 
                    className="input" 
                    type="text" 
                    placeholder="Отчество" 
                    value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                {errors.middleName && <p className="error-message">{errors.middleName}</p>}

                <input 
                    className="input" 
                    type="text" 
                    placeholder="Адрес электронной почты" 
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="error-message">{errors.email}</p>}

                {/* Поля пароля с возможностью скрытия/отображения */}
                <div className="password-container">
                    <input 
                        className="input" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Пароль" 
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(prev => !prev)} 
                        className="toggle-password">{showPassword ? "Скрыть" : "Показать"}</button>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}

                <div className="password-container">
                    <input 
                        className="input" 
                        type={showConfirmPassword ? "text" : "password"} 
                        placeholder="Повтор пароля" 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(prev => !prev)} 
                        className="toggle-password">{showConfirmPassword ? "Скрыть" : "Показать"}
                    </button>
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                <label className="checkbox-label">
                    <input 
                        type="checkbox" 
                        className="checkbox-input" 
                        checked={isChecked} 
                        onChange={(e) => setIsChecked(e.target.checked)}
                    />
                    Подтверждаю данные
                </label>
                {errors.checkbox && <p className="error-message">{errors.checkbox}</p>} {/* Сообщение об ошибке для чекбокса */}

                <button 
                    onClick={handleSubmit} 
                    className="widthBtn_popup">
                        Отправить
                </button>
                <div className="popup__close-btn" onClick={onClose}>
                    <img src={CloseImage} className='popup__close-btn' alt="Закрыть" />
                </div>
            </div>
        </div>
    );
};

export default Popup;