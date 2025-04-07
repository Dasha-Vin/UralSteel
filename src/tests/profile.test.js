import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// 1. Сначала объявляем все мок-функции
const mockGetDoc = jest.fn();
const mockNavigate = jest.fn();

// 2. Затем мокируем модули
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn((path, ...segments) => ({
    path: `${path}/${segments.join('/')}`,
    type: 'document'
  })),
  getDoc: (...args) => mockGetDoc(...args)
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 3. Затем импортируем тестируемый компонент
import Profile from '../components/Profile/Profile';

describe('Profile Component Tests', () => {
  const mockUserId = 'user123';
  const mockEmployeeData = {
    firstName: 'Иван',
    lastName: 'Иванов',
    middleName: 'Иванович',
    courseName: 'React для начинающих',
    statusCourse: 'Одобрено',
    courseId: 'course123'
  };

  const mockCourseData = {
    startDate: { seconds: 1672531200 }, // 1 января 2023
    location: 'Онлайн'
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockGetDoc.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('1. Displays loading indicator initially', () => {
    mockGetDoc.mockImplementation(() => new Promise(() => {}));
    
    render(
      <MemoryRouter>
        <Profile userId={mockUserId} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  test('2. Displays employee data after successful load', async () => {
    // 1. Настраиваем моки для Firestore
    mockGetDoc.mockImplementation((ref) => {
      if (ref.path === 'employees/user123') {
        return Promise.resolve({
          exists: () => true,
          data: () => mockEmployeeData
        });
      }
      if (ref.path === 'courses/course123') {
        return Promise.resolve({
          exists: () => true,
          data: () => ({
            ...mockCourseData,
            startDate: new Date(mockCourseData.startDate.seconds * 1000)
          })
        });
      }
      return Promise.resolve({ exists: () => false });
    });
  
    // 2. Рендерим компонент
    render(
      <MemoryRouter>
        <Profile userId={mockUserId} />
      </MemoryRouter>
    );
  
    // 3. Ждем завершения загрузки
    await waitFor(() => {
      expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
    });
  
    // 4. Выводим текущее состояние DOM для отладки
    screen.debug();
  
    // 5. Проверяем отображение данных
    // Проверяем заголовок
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /личный кабинет/i })).toBeInTheDocument();
    });
  
    // Проверяем основные данные сотрудника
    const employeeFields = [
      { label: 'Имя:', value: mockEmployeeData.firstName },
      { label: 'Фамилия:', value: mockEmployeeData.lastName },
      { label: 'Отчество:', value: mockEmployeeData.middleName },
      { label: 'Курс:', value: mockEmployeeData.courseName },
      { label: 'Статус заявки:', value: mockEmployeeData.statusCourse }
    ];
  
    employeeFields.forEach(async ({ label, value }) => {
      await waitFor(() => {
        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
        expect(labelElement.nextSibling).toHaveTextContent(value);
      });
    });
  
    // Проверяем данные курса
    const formattedDate = new Date(mockCourseData.startDate.seconds * 1000)
      .toLocaleDateString('ru-RU');
    
    const courseFields = [
      { label: 'Дата начала:', value: formattedDate },
      { label: 'Место проведения:', value: mockCourseData.location }
    ];
  
    courseFields.forEach(async ({ label, value }) => {
      await waitFor(() => {
        const labelElement = screen.getByText(label);
        expect(labelElement).toBeInTheDocument();
        expect(labelElement.nextSibling).toHaveTextContent(value);
      });
    });
  });

  test('3. Displays error when userId is not provided', () => {
    render(
      <MemoryRouter>
        <Profile userId={null} />
      </MemoryRouter>
    );

    expect(screen.getByText('Информация о пользователе недоступна.')).toBeInTheDocument();
    expect(screen.queryByText('Загрузка...')).not.toBeInTheDocument();
  });

  test('4. Navigates to home on button click', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => mockEmployeeData
    });

    render(
      <MemoryRouter>
        <Profile userId={mockUserId} />
      </MemoryRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText('На главную страницу'));
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('5. Handles error during data loading', async () => {
    mockGetDoc.mockRejectedValue(new Error('Test error'));

    render(
      <MemoryRouter>
        <Profile userId={mockUserId} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Информация о пользователе недоступна.')).toBeInTheDocument();
    });
  });

  test('6. Handles missing course data', async () => {
    const employeeWithoutCourse = { ...mockEmployeeData, courseId: null };
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => employeeWithoutCourse
    });

    render(
      <MemoryRouter>
        <Profile userId={mockUserId} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Дата начала:')).not.toBeInTheDocument();
      expect(screen.queryByText('Место проведения:')).not.toBeInTheDocument();
    });
  });
});