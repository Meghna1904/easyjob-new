import React, { useEffect, useState } from 'react';
import JobCard from '../components/JobCard';
import { useResume } from '../context/ResumeContext';
import { ResumeDetails } from '../components/ResumeDetails';
import { useNavigate } from 'react-router-dom';

interface Job {
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

const JobsPage: React.FC = () => {
  const { resumeData } = useResume();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  console.log('JobsPage rendered');
  console.log('Resume Data in JobsPage:', resumeData);

  useEffect(() => {
    console.log('useEffect triggered');
    if (!resumeData) {
      console.log('No resumeData, redirecting to homepage');
      navigate('/');
      return;
    }

    const fetchJobs = async () => {
      if (!resumeData.skills || resumeData.skills.length === 0) {
        console.log('No skills available');
        setError('No skills available. Please upload a resume on the homepage.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching jobs with skills:', resumeData.skills);
        const response = await fetch('http://localhost:5001/api/match-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: resumeData.skills }),
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch jobs: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Received jobs:', data.jobs);
        setJobs(data.jobs || []);
      } catch (err: any) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'An error occurred while fetching jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [resumeData, navigate]);

  if (!resumeData) {
    return <div>Redirecting to homepage...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Jobs Matched to Your Resume</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Details Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {resumeData ? (
                <ResumeDetails
                  resumeData={resumeData}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              ) : (
                <p className="text-gray-600">No resume data available. Please upload a resume on the homepage.</p>
              )}
            </div>
          </div>

          {/* Matched Jobs Section */}
          <div className="lg:col-span-2">
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
              <p className="text-gray-600">Loading jobs...</p>
            ) : jobs.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {jobs.map((job, index) => (
                  <JobCard key={job.id} job={job} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No jobs matched. Please upload a resume on the homepage.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;