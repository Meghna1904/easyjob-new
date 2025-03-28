import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ResumeData {
  name?: string;
  emails?: string[];
  phone_numbers?: string[];
  skills?: string[];
  experience?: Array<{
    id: number;
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
    skills: string[];
  }>;
  education?: Array<{
    id: number;
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  projects?: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string[];
  }>;
  certifications?: Array<{
    id: number;
    name: string;
    date: string;
    issuer: string;
  }>;
  achievements?: string[];
  summary?: string[];
  // Add other fields as needed
}

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};