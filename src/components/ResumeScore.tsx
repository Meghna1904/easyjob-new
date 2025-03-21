import React from 'react';
import { BookOpen, Briefcase, Code, Award } from 'lucide-react';

interface ResumeScoreProps {
  resumeData: any;
}

export const ResumeScore: React.FC<ResumeScoreProps> = ({ resumeData }) => {
  const scoreSections = ['Education', 'Experience', 'Skills', 'Certifications','Projects'];

  const calculateScore = () => {
    let score = 0;
    scoreSections.forEach(section => {
      if (resumeData && resumeData[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0) {
        score += 20; // 25 points per section
      }
    });
    return Math.min(score, 100); // Cap at 100
  };

  const currentScore = resumeData ? calculateScore() : 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resume Score</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-gray-600 mb-1">Overall Score</p>
            <p className="text-3xl font-bold">{currentScore}<span className="text-gray-400 text-lg font-normal">/100</span></p>
          </div>
          <div className="w-24 h-24 relative">
            <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
              <path
                className="stroke-current text-gray-200"
                fill="none"
                strokeWidth="3"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-current ${getScoreColor(currentScore)}`}
                fill="none"
                strokeWidth="3"
                strokeDasharray={`${currentScore}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <span className="text-xl font-bold">{currentScore}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-700">Section Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scoreSections.map(section => {
              const isIncluded = resumeData?.[section.toLowerCase()] && resumeData[section.toLowerCase()].length > 0;
              return (
                <div key={section} className={`flex items-center p-4 rounded-lg border ${isIncluded ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${isIncluded ? 'bg-green-200' : 'bg-red-200'}`}>
                    {section === 'Education' && <BookOpen className={`w-5 h-5 ${isIncluded ? 'text-green-600' : 'text-red-600'}`} />}
                    {section === 'Experience' && <Briefcase className={`w-5 h-5 ${isIncluded ? 'text-green-600' : 'text-red-600'}`} />}
                    {section === 'Skills' && <Code className={`w-5 h-5 ${isIncluded ? 'text-green-600' : 'text-red-600'}`} />}
                    {section === 'Certifications' && <Award className={`w-5 h-5 ${isIncluded ? 'text-green-600' : 'text-red-600'}`} />}
                  </div>
                  <div>
                    <p className="font-medium">{section}</p>
                    <p className={`text-sm ${isIncluded ? 'text-green-600' : 'text-red-600'}`}>
                      {isIncluded ? 'Included' : 'Missing'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};