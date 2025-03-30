import React, { useState } from 'react';
import {  HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import Programs from './components/Programs/Programs';
import CourseDetails from './components/CourseDetails/CourseDetails';
import Popup from './components/CourseDetails/Popup';

const App = () => {
    const [userId, setUserId] = useState(null); // Состояние для хранения userId

    return (
        <Router basename="/">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login setUserId={setUserId} />} />
                <Route path="/profile" element={userId ? <Profile userId={userId} /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/programs" element={<Programs />} />
                <Route path="/courses/:id" element={<CourseDetails />} /> {/* Динамический маршрут для страниц курсов */}
                <Route path="/popup" element={<Popup />} />
            </Routes>
        </Router>
    );
}

export default App;

// basename="/"
