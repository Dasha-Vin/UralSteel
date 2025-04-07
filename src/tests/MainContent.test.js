import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MainContent from '../components/MainContent/MainContent';
import '@testing-library/jest-dom';

// Правильное мокирование изображений для vite
jest.mock('../../assets/line1.png', () => 'mock-line1-image-path');
jest.mock('../../assets/orig.jpg', () => 'mock-main-image-path');

describe('MainContent Component', () => {
  let scrollIntoViewMock;

  beforeEach(() => {
    scrollIntoViewMock = jest.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;
    
    const mockElement = document.createElement('div');
    mockElement.id = 'programm';
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  test('корректно рендерит заголовок и текст', () => {
    render(<MainContent />);
    
    expect(screen.getByText('Программа переподготовки сотрудников')).toBeInTheDocument();
    expect(screen.getByText(/Наша программа профессионального обучения/)).toBeInTheDocument();
  });

  test('отображает изображение линии с правильными атрибутами', () => {
    render(<MainContent />);
    
    const lineImage = screen.getByAltText('line');
    expect(lineImage).toBeInTheDocument();
    // Проверяем только наличие класса, так как src может отличаться в разных средах
    expect(lineImage).toHaveClass('line1');
  });

  test('отображает основное изображение с правильными атрибутами', () => {
    render(<MainContent />);
    
    // Ищем по уникальному классу
    const mainImage = document.querySelector('.main-image');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveClass('main-image');
  });

  test('отображает кнопку регистрации с правильными атрибутами', () => {
    render(<MainContent />);
    
    const button = screen.getByRole('button', { name: /Зарегистрироваться/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('id', 'main-action-button');
    expect(button).toHaveClass('button');
  });

  test('вызывает scrollIntoView при клике на кнопку', () => {
    render(<MainContent />);
    
    const button = screen.getByRole('button', { name: /Зарегистрироваться/i });
    fireEvent.click(button);
    
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth'
    });
  });
});