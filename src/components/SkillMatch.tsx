
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface Skill {
  name: string;
  matched: boolean;
  importance: 'high' | 'medium' | 'low';
}

interface SkillMatchProps {
  skills: Skill[];
  resumeSkills: string[];
}

export function SkillMatch({ skills, resumeSkills }: SkillMatchProps) {
  const [matchedSkills, setMatchedSkills] = useState<Skill[]>([]);
  const [unmatchedSkills, setUnmatchedSkills] = useState<Skill[]>([]);
  
  useEffect(() => {
    // Compare job skills with resume skills
    const matched: Skill[] = [];
    const unmatched: Skill[] = [];
    
    skills.forEach(skill => {
      // Check if the skill exists in the resume (case insensitive)
      const isMatched = resumeSkills.some(
        resumeSkill => resumeSkill.toLowerCase() === skill.name.toLowerCase()
      );
      
      const skillWithMatch = {
        ...skill,
        matched: isMatched
      };
      
      if (isMatched) {
        matched.push(skillWithMatch);
      } else {
        unmatched.push(skillWithMatch);
      }
    });
    
    // Sort by importance
    const sortByImportance = (a: Skill, b: Skill) => {
      const importanceMap = { high: 3, medium: 2, low: 1 };
      return importanceMap[b.importance] - importanceMap[a.importance];
    };
    
    setMatchedSkills(matched.sort(sortByImportance));
    setUnmatchedSkills(unmatched.sort(sortByImportance));
  }, [skills, resumeSkills]);
  
  const importanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-red-200 bg-red-50 text-red-700';
      case 'medium': return 'border-amber-200 bg-amber-50 text-amber-700';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };
  
  const getImportanceLabel = (importance: string) => {
    switch (importance) {
      case 'high': return 'Critical';
      case 'medium': return 'Important';
      case 'low': return 'Preferred';
      default: return '';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-subtle p-6 mb-6">
      <h3 className="text-xl font-semibold mb-4">Skill Match Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="font-medium">Matched Skills ({matchedSkills.length})</h4>
          </div>
          
          <div className="space-y-3">
            {matchedSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800"
              >
                <span className="font-medium text-green-800 dark:text-green-200">{skill.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${importanceColor(skill.importance)}`}>
                  {getImportanceLabel(skill.importance)}
                </span>
              </motion.div>
            ))}
            
            {matchedSkills.length === 0 && (
              <p className="text-muted-foreground text-sm italic">No matched skills found</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-medium">Missing Skills ({unmatchedSkills.length})</h4>
          </div>
          
          <div className="space-y-3">
            {unmatchedSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800"
              >
                <span className="font-medium text-red-800 dark:text-red-200">{skill.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full border ${importanceColor(skill.importance)}`}>
                  {getImportanceLabel(skill.importance)}
                </span>
              </motion.div>
            ))}
            
            {unmatchedSkills.length === 0 && (
              <p className="text-muted-foreground text-sm italic">No missing skills - perfect match!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
