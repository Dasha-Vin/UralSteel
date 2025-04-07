import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/Header/Header';
import '@testing-library/jest-dom';

// Мокаем изображение логотипа
jest.mock('../../assets/logo.png', () => 'test-logo-path');

// Исправляем путь к компоненту Burger
jest.mock('../components/Burger/Burger', () => ({
  __esModule: true,
  default: () => <div data-testid="burger-menu">Burger Menu Mock</div>
}));

describe('Header Component - Functional Tests', () => {
  beforeEach(() => {
    // Мокаем scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  test('1. Отображает логотип и заголовок', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const logo = screen.getByAltText('Логотип');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'test-logo-path');
    expect(screen.getByText('Уральская сталь')).toBeInTheDocument();
  });

  test('2. Отображает пункты основного меню', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Программы' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'О нас' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Личный кабинет' })).toBeInTheDocument();
  });

  test('3. Обрабатывает клик по ссылкам с плавной прокруткой', () => {
    const mockElement = {
      scrollIntoView: jest.fn()
    };
    document.getElementById = jest.fn().mockReturnValue(mockElement);
    
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const programLink = screen.getByText('Программы');
    fireEvent.click(programLink);
    
    expect(document.getElementById).toHaveBeenCalled();
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth'
    });
  });

  test('4. Содержит правильную ссылку на страницу входа', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const accountLink = screen.getByRole('link', { name: 'Личный кабинет' });
    expect(accountLink).toHaveAttribute('href', '/login');
  });

  test('5. Отображает бургер-меню', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByTestId('burger-menu')).toBeInTheDocument();
  });
});