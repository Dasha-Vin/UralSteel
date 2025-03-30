import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Импортируем хуки для работы с маршрутизацией
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './CourseDetails.css'; 
import Popup from './Popup'; 
import CourseDetailsImage from '../../assets/CourseDetails.png';
import Back from '../../assets/back.png';

const CourseDetails = () => {
    const { id } = useParams(); // Получаем идентификатор курса из URL
    const navigate = useNavigate(); // Хук для навигации между страницами
    const [course, setCourse] = useState(null); // Состояние для хранения информации о курсе
    const [error, setError] = useState(''); // Состояние для обработки ошибок
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Состояние для управления модальным окном

    useEffect(() => {
        // Функция для загрузки информации о курсе из Firestore
        const fetchCourseDetails = async () => {
            try {
                const courseDoc = doc(db, "courses", id); // Получаем ссылку на документ курса
                const courseSnapshot = await getDoc(courseDoc); // Загружаем документ

                if (courseSnapshot.exists()) {
                    // Если курс найден, сохраняем его данные в состоянии
                    setCourse({ id: courseSnapshot.id, ...courseSnapshot.data() });
                } else {
                    setError('Курс не найден'); // Выводим ошибку, если курс отсутствует
                }
            } catch (err) {
                console.error("Ошибка при получении данных курса: ", err);
                setError('Не удалось загрузить данные курса'); // Обрабатываем ошибку загрузки
            }
        };

        fetchCourseDetails(); // Вызываем функцию загрузки курса
    }, [id]); // Зависимость useEffect - обновление при изменении id курса

    // Если есть ошибка, отображаем сообщение
    if (error) return <p className="error-message">{error}</p>;
    // Если курс еще загружается, показываем индикатор загрузки
    if (!course) return <p className="loading-message">Загрузка...</p>;

    // Функция для переключения состояния модального окна
    const togglePopup = () => {
        setIsPopupOpen(prevState => {
            const newState = !prevState;
            // Блокируем скролл страницы, если модальное окно открыто
            if (newState) {
                document.body.classList.add('body_fixed');
            } else {
                document.body.classList.remove('body_fixed');
            }
            return newState;
        });
    };

    // Функция для возврата на главную страницу
    const handleBackClick = () => {
        navigate('/'); 
    };

    return (
        <div>
            {/* Кнопка возврата */}
            <div className="Arrow-back" onClick={handleBackClick}>
                <img className="backImage" src={Back} alt="Назад" />
                <h3 className="back">Назад</h3>
            </div>

            {/* Основная информация о курсе */}
            <div className="course-details container">
                <h1 className="common-title">{course.name}</h1>
                <img src={CourseDetailsImage} className='CourseDetailsImage' alt="Курс" />
                <p className="course-text">{course.text}</p>

                {/* Кнопка для регистрации на курс */}
                <button className="widthBtn widthBtn_inverted" onClick={togglePopup}>
                    Зарегистрироваться на курс
                </button>

                {/* Модальное окно для регистрации на курс */}
                <Popup isOpen={isPopupOpen} onClose={togglePopup} course={course} />
            </div>
        </div>
    );
};

export default CourseDetails;