import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AboutUs from '../components/AboutUs/AboutUs';
import '@testing-library/jest-dom';

describe('AboutUs Component', () => {
  beforeEach(() => {
    // Мокаем таймеры
    jest.useFakeTimers();
  });

  afterEach(() => {
    // Восстанавливаем оригинальные таймеры
    jest.useRealTimers();
  });

  test('рендерит заголовок и основной текст', () => {
    render(<AboutUs />);
    
    expect(screen.getByText('Уральская сталь')).toBeInTheDocument();
    expect(screen.getByText(/Уральская сталь — это металлургический комбинат/)).toBeInTheDocument();
    expect(screen.getByText(/один из ведущих производителей чёрной металлургии в России/)).toBeInTheDocument();
  });

  test('отображает все слайды', () => {
    render(<AboutUs />);
    
    const slides = screen.getAllByTestId(/slide-/);
    expect(slides).toHaveLength(5);
  });

  test('первый слайд активен при начальной загрузке', () => {
    render(<AboutUs />);
    
    const firstSlide = screen.getByTestId('slide-0');
    expect(firstSlide).toHaveClass('gallery__slide_active');
    expect(firstSlide).toHaveStyle({
      transform: 'translateX(0)',
      opacity: '1'
    });
  });

  test('слайды автоматически переключаются каждые 3 секунды', () => {
    render(<AboutUs />);
    
    // Проверяем начальное состояние
    expect(screen.getByTestId('slide-0')).toHaveClass('gallery__slide_active');
    
    // Перемещаем время вперед на 3 секунды
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Теперь должен быть активен второй слайд
    expect(screen.getByTestId('slide-1')).toHaveClass('gallery__slide_active');
    expect(screen.getByTestId('slide-1')).toHaveStyle({
      transform: 'translateX(0)',
      opacity: '1'
    });
    
    // Еще 3 секунды
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Теперь третий слайд
    expect(screen.getByTestId('slide-2')).toHaveClass('gallery__slide_active');
  });

  test('циклически переключает слайды', () => {
    render(<AboutUs />);
    
    // Перемещаем время вперед на 15 секунд (5 слайдов * 3 секунды)
    act(() => {
      jest.advanceTimersByTime(15000);
    });
    
    // Должен снова быть активен первый слайд
    expect(screen.getByTestId('slide-0')).toHaveClass('gallery__slide_active');
  });

  test('очищает интервал при размонтировании', () => {
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<AboutUs />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});