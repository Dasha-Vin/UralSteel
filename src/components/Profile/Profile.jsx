import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Profile = ({ userId }) => {
    const [employee, setEmployee] = useState(null);
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Функция для получения данных о сотруднике и курсе
        const fetchEmployeeData = async () => {
            setLoading(true);

            // Проверяем, предоставлен ли userId
            if (!userId) {
                console.error('userId не предоставлен');
                setLoading(false); 
                return; // Выходим из функции, если userId отсутствует
            }

            try {
                // Получение данных о сотруднике из Firestore
                const employeeRef = doc(db, 'employees', userId);
                const docSnap = await getDoc(employeeRef);

                if (docSnap.exists()) {
                    const employeeData = docSnap.data();
                    setEmployee(employeeData);

                    // Если у сотрудника есть курс, получаем информацию о нём
                    if (employeeData.courseId) {
                        const courseRef = doc(db, 'courses', employeeData.courseId);
                        const courseSnap = await getDoc(courseRef);
                        
                        if (courseSnap.exists()) {
                            const courseData = courseSnap.data();
                            // Преобразуем дату начала в строку
                            if (courseData.startDate && courseData.startDate.seconds) {
                                courseData.startDate = new Date(courseData.startDate.seconds * 1000).toLocaleDateString();
                            }
                            setCourseDetails(courseData);
                        } else {
                            console.log("Курс не существует");
                        }
                    }
                } else {
                    console.error("Документ сотрудников не существует");
                }
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData(); // Вызов функции для получения данных
    }, [userId]);

    // Отображение индикатора загрузки
    if (loading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className="profile-container">
            <h2 className='PersonalAccount'>Личный кабинет</h2>
            {employee ? ( // Проверяем, есть ли данные о сотруднике
                <div className="profile-info">
                    <p><strong>Имя:</strong> {employee.firstName}</p>
                    <p><strong>Фамилия:</strong> {employee.lastName}</p>
                    <p><strong>Отчество:</strong> {employee.middleName}</p>
                    <p><strong>Курс:</strong> {employee.courseName}</p>
                    <p><strong>Статус заявки:</strong> {employee.statusCourse}</p>
                    {courseDetails && ( // Проверяем, есть ли детали курса
                        <>
                            <p><strong>Дата начала:</strong> {courseDetails.startDate}</p> {/* Дата начала курса */}
                            <p><strong>Место проведения:</strong> {courseDetails.location}</p> {/* Местопроведение курса */}
                        </>
                    )}
                </div>
            ) : (
                <p>Информация о пользователе недоступна.</p>
            )}
            <button onClick={() => navigate('/')} className="go-home-button">
                На главную страницу
            </button>
        </div>
    );
};

export default Profile;