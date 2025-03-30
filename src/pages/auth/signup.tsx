// src/pages/auth/signup.tsx
import React from 'react';
import SignupForm from '../../components/Auth/SignUpForm';

const SignupPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <SignupForm />
    </div>
  );
};

export default SignupPage;