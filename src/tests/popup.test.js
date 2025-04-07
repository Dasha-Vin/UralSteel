import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popup from '../components/CourseDetails/Popup';

// Мокаем console.log
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

// Мокаем Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(() => 'mock-collection'),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    empty: true, // Нет пользователей с таким email
    docs: []
  })),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

describe('Popup Component', () => {
  const mockCourse = { id: 1, name: 'Тестовый курс' };
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  const fillForm = async () => {
    await userEvent.type(screen.getByPlaceholderText('Имя'), 'Иван');
    await userEvent.type(screen.getByPlaceholderText('Фамилия'), 'Иванов');
    await userEvent.type(screen.getByPlaceholderText('Отчество'), 'Иванович');
    await userEvent.type(
      screen.getByPlaceholderText('Адрес электронной почты'),
      'test@test.com'
    );
    await userEvent.type(screen.getByPlaceholderText('Пароль'), 'Password123!');
    await userEvent.type(screen.getByPlaceholderText('Повтор пароля'), 'Password123!');
    await userEvent.click(screen.getByLabelText('Подтверждаю данные'));
  };

  test('успешная отправка формы с валидными данными', async () => {
    render(<Popup isOpen={true} onClose={mockOnClose} course={mockCourse} />);
    
    // Проверяем наличие всех полей формы
    expect(screen.getByPlaceholderText('Имя')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Фамилия')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Отчество')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Адрес электронной почты')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Повтор пароля')).toBeInTheDocument();
    expect(screen.getByLabelText('Подтверждаю данные')).toBeInTheDocument();

    // Заполняем форму
    await fillForm();
    
    // Отправляем форму
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }));
    
    // Ждем завершения асинхронных операций
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    // Проверяем вывод в консоль
    expect(console.log).toHaveBeenCalledWith('Документ успешно записан с ID: ', 'mock-id');
    
    // Проверяем, что нет сообщений об ошибке
    expect(screen.queryByText(/Пользователь с таким логином уже существует/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Ошибка/i)).not.toBeInTheDocument();
    
    // Если в компоненте есть сообщение об успехе, можно добавить проверку:
    // expect(await screen.findByText(/Форма успешно отправлена/i)).toBeInTheDocument();
    
    // Если компонент должен закрываться после отправки:
    // expect(mockOnClose).toHaveBeenCalledTimes(1);
  }, 10000);

  test('показывает ошибку при существующем email', async () => {
    // Мокаем getDocs для возврата существующего пользователя
    require('firebase/firestore').getDocs.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: '1', data: () => ({ email: 'test@test.com' }) }]
    });

    render(<Popup isOpen={true} onClose={mockOnClose} course={mockCourse} />);
    
    // Заполняем форму
    await fillForm();
    
    // Отправляем форму
    await userEvent.click(screen.getByRole('button', { name: /отправить/i }));
    
    // Проверяем сообщение об ошибке
    expect(await screen.findByText(/Пользователь с таким логином уже существует/i)).toBeInTheDocument();
  });
});