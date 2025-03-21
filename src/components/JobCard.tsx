
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, DollarSign, Star, BookOpen } from 'lucide-react';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: string;
  matchScore: number;
  skills: string[];
}

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  // Format match score as percentage
  const matchPercentage = Math.round(job.matchScore * 100);
  
  // Determine color based on match score
  const getScoreColor = () => {
    if (matchPercentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (matchPercentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="subtle-card hover:translate-y-[-2px] group"
    >
      <div className="flex flex-col h-full p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-200">{job.title}</h3>
            <p className="text-lg text-foreground/80 mb-1">{job.company}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor()}`}>
            {matchPercentage}% Match
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Full-time</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{job.postedDate}</span>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {job.description}
        </p>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> 
            Key Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 5).map((skill, i) => (
              <span key={i} className="chip">
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="chip bg-secondary/50">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
          <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200">
            View Details
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors duration-200" title="Save Job">
            <Star className="h-5 w-5 text-muted-foreground hover:text-amber-500 transition-colors duration-200" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
