import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../Home';
import '@testing-library/jest-dom';

// Мокаем все дочерние компоненты
jest.mock('../components/Header/Header', () => ({
  __esModule: true,
  default: jest.fn(({ onLoginClick }) => (
    <header data-testid="header" onClick={onLoginClick}>Mock Header</header>
  ))
}));

jest.mock('../components/MainContent/MainContent', () => ({
  __esModule: true,
  default: () => <div data-testid="main-content">Mock MainContent</div>
}));

jest.mock('../components/Programs/Programs', () => ({
  __esModule: true,
  default: () => <section data-testid="programs">Mock Programs</section>
}));

jest.mock('../components/AboutUs/AboutUs', () => ({
  __esModule: true,
  default: () => <section data-testid="about-us">Mock AboutUs</section>
}));

jest.mock('../components/Contacts/Contacts', () => ({
  __esModule: true,
  default: () => <section data-testid="contacts">Mock Contacts</section>
}));

jest.mock('../components/ChatBot/ChatBot', () => ({
  __esModule: true,
  default: () => <div data-testid="chatbot">Mock ChatBot</div>
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all child components', () => {
    render(<Home onLoginClick={() => {}} />);
    
    expect(screen.getByTestId('chatbot')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByTestId('programs')).toBeInTheDocument();
    expect(screen.getByTestId('about-us')).toBeInTheDocument();
    expect(screen.getByTestId('contacts')).toBeInTheDocument();
  });

  test('passes onLoginClick prop to Header component', () => {
    const mockLoginClick = jest.fn();
    render(<Home onLoginClick={mockLoginClick} />);
    
    fireEvent.click(screen.getByTestId('header'));
    expect(mockLoginClick).toHaveBeenCalledTimes(1);
  });

  test('renders components in correct order', () => {
    const { container } = render(<Home onLoginClick={() => {}} />);
    const main = container.querySelector('main');
    
    const children = Array.from(main.children);
    const expectedOrder = [
      'chatbot',
      'header',
      'main-content',
      'programs',
      'about-us',
      'contacts'
    ];
    
    expectedOrder.forEach((testId, index) => {
      expect(children[index].getAttribute('data-testid')).toBe(testId);
    });
  });

  test('applies correct className to main element', () => {
    const { container } = render(<Home onLoginClick={() => {}} />);
    expect(container.firstChild).toHaveClass('main');
  });
});