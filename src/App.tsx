// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import UploadResume from './components/UploadResume';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import JobsPage from './pages/jobs';
import SkillsPage from './pages/skills';
import AboutPage from './pages/about';
import SignupPage from './pages/auth/signup';
import LoginPage from './pages/auth/login';
import ForgotPasswordPage from './pages/auth/forgot-password';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/upload-resume" element={<UploadResume />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;