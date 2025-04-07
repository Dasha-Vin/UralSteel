import React from 'react';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Programs from './components/Programs/Programs';
import AboutUs from './components/AboutUs/AboutUs';
import Contacts from './components/Contacts/Contacts';
import ChatBot from './components/ChatBot/ChatBot';

const Home = ({ onLoginClick }) => {
    return (
        <main className="main">
            <ChatBot />
            <Header onLoginClick={onLoginClick}/>
            <MainContent />
            <Programs />
            <AboutUs />
            <Contacts />
        </main>
    );
}

export default Home;