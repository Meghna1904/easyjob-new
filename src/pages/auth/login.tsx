// src/pages/auth/login.tsx
import React from 'react';
import LoginForm from '../../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <LoginForm />
    </div>
  );
};

export default LoginPage;