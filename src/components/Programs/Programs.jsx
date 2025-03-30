import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig'; // Импорт конфигурации Firebase
import { collection, getDocs } from "firebase/firestore"; // Импортируем функции Firestore для работы с базой данных
import { useNavigate } from 'react-router-dom'; // Импортируем useNavigate для навигации между страницами
import './Programs.css'; // Подключение стилей
import line3Image from '../../assets/line3.png'; // Импорт изображения линии

const Programs = () => {
    const [services, setServices] = useState([]); // Состояние для хранения списка программ
    const [error, setError] = useState(''); // Состояние для хранения возможных ошибок при загрузке данных
    const navigate = useNavigate(); // Хук для навигации по страницам

    useEffect(() => {
        // Функция для получения списка курсов из Firestore
        const fetchCourses = async () => {
            try {
                const coursesCollection = collection(db, "courses"); // Получаем коллекцию "courses" из Firestore
                const courseSnapshot = await getDocs(coursesCollection); // Загружаем данные из Firestore
                const courseList = courseSnapshot.docs.map(doc => ({
                    id: doc.id, // Получаем ID документа
                    name: doc.data().name, // Получаем имя курса
                }));
                
                setServices(courseList); // Устанавливаем полученные курсы в состояние
            } catch (err) {
                console.error("Ошибка при получении курсов: ", err);
                setError('Не удалось загрузить курсы'); // Устанавливаем сообщение об ошибке в случае неудачи
            }
        };

        fetchCourses(); // Вызываем функцию для загрузки данных при монтировании компонента
    }, []); // Пустой массив зависимостей означает, что useEffect выполняется только один раз при загрузке компонента

    // Функция для обработки клика по курсу и перенаправления на страницу курса
    const handleServiceClick = (id) => {
        navigate(`/courses/${id}`); // Перенаправление на страницу выбранного курса по его ID
    };

    return (
        <section className="main-programm" id="programm">
            <h2 className="common-title" id="programms">Программы переподготовки</h2>
            <img src={line3Image} alt="line" className="line3" /> {/* Отображение изображения линии */}
            <div className="container">
                {error && <p>{error}</p>} {/* Отображение сообщения об ошибке, если оно есть */}
                <ul className="programms">
                    {services.map((service) => ( // Перебираем список курсов и отображаем каждый курс
                        <li className="programm" key={service.id}>
                            <div className="programm__text" onClick={() => handleServiceClick(service.id)}>
                                <span>{service.name}</span> {/* Используем <span>, чтобы не было лишнего перехода */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default Programs;