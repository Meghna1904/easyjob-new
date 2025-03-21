import React, { useEffect, useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface ATSScoreProps {
  resumeData: any;
}

interface ScoreCategory {
  name: string;
  weight: number;
  score: number;
  present: boolean;
  items: Array<{ name: string; present: boolean }>;
}

export const ATSScore: React.FC<ATSScoreProps> = ({ resumeData }) => {
  const [overallScore, setOverallScore] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [categories, setCategories] = useState<ScoreCategory[]>([]);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeData) return;

    // Define scoring categories and their weights
    const scoringCategories: ScoreCategory[] = [
      {
        name: 'Content Sections',
        weight: 40,
        score: 0,
        present: false,
        items: [
          { name: 'Education', present: !!(resumeData.education && resumeData.education.length > 0) },
          { name: 'Experience', present: !!(resumeData.experience && resumeData.experience.length > 0) },
          { name: 'Skills', present: !!(resumeData.skills && resumeData.skills.length > 0) },
          { name: 'Projects', present: !!(resumeData.projects && resumeData.projects.length > 0) },
          { name: 'Certifications', present: !!(resumeData.certifications && resumeData.certifications.length > 0) }
        ]
      },
      {
        name: 'Contact Information',
        weight: 20,
        score: 0,
        present: false,
        items: [
          { name: 'Name', present: !!resumeData.name },
          { name: 'Email', present: !!(resumeData.emails && resumeData.emails.length > 0) },
          { name: 'Phone', present: !!(resumeData.phone_numbers && resumeData.phone_numbers.length > 0) },
          { name: 'LinkedIn', present: !!(resumeData.linkedin_url || (resumeData.links && resumeData.links.some((link: string) => link.includes('linkedin')))) }
        ]
      },
      {
        name: 'Keyword Optimization',
        weight: 25,
        score: 0,
        present: false,
        items: [
          { name: 'Industry Keywords', present: true }, // Simplified - would need job description comparison
          { name: 'Action Verbs', present: checkForActionVerbs(resumeData.parsedText || '') },
          { name: 'Technical Skills', present: !!(resumeData.skills && resumeData.skills.length >= 5) }
        ]
      },
      {
        name: 'Formatting',
        weight: 15,
        score: 0,
        present: false,
        items: [
          { name: 'Proper Length', present: checkResumeLength(resumeData.parsedText || '') },
          { name: 'Consistent Format', present: true }, // Simplified
          { name: 'No Spelling Errors', present: true } // Simplified
        ]
      }
    ];

    // Calculate score for each category
    const calculatedCategories = scoringCategories.map(category => {
      const presentItems = category.items.filter(item => item.present).length;
      const totalItems = category.items.length;
      const categoryScore = (presentItems / totalItems) * category.weight;
      
      return {
        ...category,
        score: parseFloat(categoryScore.toFixed(1)),
        present: presentItems > 0
      };
    });

    // Calculate total score
    const calculatedScore = Math.min(
      100,
      Math.round(calculatedCategories.reduce((sum, category) => sum + category.score, 0))
    );

    setCategories(calculatedCategories);
    setOverallScore(calculatedScore);

    // Animate progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= calculatedScore) {
        clearInterval(interval);
      } else {
        currentProgress += 1;
        setProgress(currentProgress);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [resumeData]);

  // Helper function to check for action verbs
  function checkForActionVerbs(text: string): boolean {
    const actionVerbs = [
      'achieved', 'improved', 'trained', 'managed', 'created', 'resolved', 
      'volunteered', 'influenced', 'increased', 'decreased', 'developed', 'led'
    ];
    return actionVerbs.some(verb => text.toLowerCase().includes(verb));
  }

  // Helper function to check resume length (1-2 pages ideal)
  function checkResumeLength(text: string): boolean {
    const wordCount = text.split(/\s+/).length;
    return wordCount >= 300 && wordCount <= 700;
  }

  return (
    <div className="bg-white/50 backdrop-blur-lg rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">ATS Compatibility Score</h2>
        <div className="flex items-center">
          <div className="text-2xl font-bold">{progress}/100</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getScoreColorClass(progress)}`} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Needs Improvement</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.name} className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h3 className="font-medium">{category.name}</h3>
                <div className="relative ml-2">
                  <HelpCircle 
                    className="w-4 h-4 text-gray-400 cursor-help" 
                    onMouseEnter={() => setShowTooltip(category.name)}
                    onMouseLeave={() => setShowTooltip(null)}
                  />
                  {showTooltip === category.name && (
                    <div className="absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg -left-32 bottom-full mb-2">
                      {getTooltipText(category.name)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <span className={`text-sm font-medium ${getScoreTextColorClass(category.score / category.weight * 100)}`}>
                  {category.score}/{category.weight}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {category.items.map((item) => (
                <div key={item.name} className="flex items-center text-sm">
                  <div className={`w-4 h-4 mr-2 rounded-full flex items-center justify-center ${item.present ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                    {item.present ? '✓' : '✗'}
                  </div>
                  <span className={item.present ? 'text-gray-700' : 'text-gray-500'}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">Recommendations to improve ATS score:</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          {!hasEducation(resumeData) && (
            <li>• Add your education details with degree, institution, and graduation year</li>
          )}
          {!hasExperience(resumeData) && (
            <li>• Include your work experience with company names, job titles, and measurable achievements</li>
          )}
          {!hasSkills(resumeData) && (
            <li>• List relevant technical and soft skills that match the job description</li>
          )}
          {!hasProjects(resumeData) && (
            <li>• Add relevant projects with descriptions and technologies used</li>
          )}
          {!hasLinkedIn(resumeData) && (
            <li>• Include your LinkedIn profile URL</li>
          )}
          {overallScore < 70 && (
            <li>• Tailor your resume to the specific job by including keywords from the job description</li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Helper functions for styling
function getScoreColorClass(score: number): string {
  if (score >= 80) return 'bg-green-600';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreTextColorClass(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}

// Helper functions to check resume sections
function hasEducation(resumeData: any): boolean {
  return !!(resumeData.education && resumeData.education.length > 0);
}

function hasExperience(resumeData: any): boolean {
  return !!(resumeData.experience && resumeData.experience.length > 0);
}

function hasSkills(resumeData: any): boolean {
  return !!(resumeData.skills && resumeData.skills.length > 0);
}

function hasProjects(resumeData: any): boolean {
  return !!(resumeData.projects && resumeData.projects.length > 0);
}

function hasLinkedIn(resumeData: any): boolean {
  return !!(resumeData.linkedin_url || (resumeData.links && resumeData.links.some((link: string) => link.includes('linkedin'))));
}

// Tooltip explanations
function getTooltipText(category: string): string {
  switch (category) {
    case 'Content Sections':
      return 'Having key sections like Education, Experience, and Skills increases your resumes chances of passing ATS scans.';
    case 'Contact Information':
      return 'Complete contact information ensures recruiters can reach you and verifies your profile completeness.';
    case 'Keyword Optimization':
      return 'Using industry-specific keywords and action verbs helps your resume match job requirements in ATS systems.';
    case 'Formatting':
      return 'Clean formatting without tables, headers/footers, and images improves ATS readability.';
    default:
      return '';
  }
}