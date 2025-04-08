import React, { Suspense } from 'react';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import ChatBot from './components/ChatBot/ChatBot';

const Programs = React.lazy(() => import('./components/Programs/Programs'));
const AboutUs = React.lazy(() => import('./components/AboutUs/AboutUs'));
const Contacts = React.lazy(() => import('./components/Contacts/Contacts'));

const Home = ({ onLoginClick }) => {
    return (
        <main className="main">
            <ChatBot />
            <Header onLoginClick={onLoginClick}/>
            <MainContent />
            
            <Suspense fallback={<div>Загрузка программ...</div>}>
                <Programs />
            </Suspense>
            
            <Suspense fallback={<div>Загрузка информации о нас...</div>}>
                <AboutUs />
            </Suspense>
            
            <Suspense fallback={<div>Загрузка контактов...</div>}>
                <Contacts />
            </Suspense>
        </main>
    );
}
