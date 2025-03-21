import React from 'react';

interface ResumeDetailsProps {
  resumeData: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ResumeDetails: React.FC<ResumeDetailsProps> = ({ resumeData, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
  ];

  const renderEducation = () => {
    if (!resumeData?.education || resumeData.education.length === 0) {
      return <p className="text-gray-500">No education information found.</p>;
    }
    return (
      <div className="space-y-6">
        {resumeData.education.map((edu: any, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-3 h-3 bg-gray-900 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{edu.degree || 'Degree not specified'}</h3>
              <p className="text-gray-600">{edu.institution || 'Institution not specified'}</p>
              <p className="text-gray-600">{edu.start_date} - {edu.end_date}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (!resumeData?.experience || resumeData.experience.length === 0) {
      return <p className="text-gray-500">No experience information found.</p>;
    }
    return (
      <div className="space-y-8">
        {resumeData.experience.map((exp: any, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-3 h-3 bg-gray-900 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{exp.title || 'Position not specified'}</h3>
                  <p className="text-gray-600">{exp.company || 'Company not specified'}</p>
                </div>
                <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                  {exp.start_date} - {exp.end_date}
                </span>
              </div>
              <p className="text-gray-600">{exp.description}</p>
              {exp.skills && exp.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {exp.skills.map((skill: string, skillIndex: number) => (
                    <span key={skillIndex} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (!resumeData?.skills || resumeData.skills.length === 0) {
      return <p className="text-gray-500">No skills information found.</p>;
    }
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {resumeData.skills.map((skill: string, index: number) => (
            <div key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-center">
              {skill}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (!resumeData?.projects || resumeData.projects.length === 0) {
      return <p className="text-gray-500">No projects information found.</p>;
    }
    return (
      <div className="space-y-6">
        {resumeData.projects.map((project: any, index: number) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-3 h-3 bg-gray-900 rounded-full mt-2 mr-4"></div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{project.name || 'Project not specified'}</h3>
              <p className="text-gray-600">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.technologies.map((tech: string, techIndex: number) => (
                    <span key={techIndex} className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="font-semibold text-lg">{resumeData?.name || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold text-lg">{resumeData?.emails?.[0] || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-1">Contact</p>
              <p className="font-semibold text-lg">{resumeData?.phone_numbers?.[0] || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'experience':
        return renderExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-white rounded-t-xl shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">Resume Details</h2>
        <div className="text-sm text-gray-600 py-1 px-3 bg-gray-100 rounded-full">
          {resumeData.resumeType || 'N/A'}
        </div>
      </div>
      <div className="border-b">
        <nav className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-lg font-medium transition-colors duration-200 relative
                ${activeTab === tab.id ? 'text-black' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black"></div>
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
};
