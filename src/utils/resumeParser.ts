import axios from 'axios';

export interface ResumeData {
  name: string;
  emails: string[];
  phone_numbers: string[];
  skills: string[];
  education: Array<{
    id: number;
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  experience: Array<{
    id: number;
    title: string;
    company: string;
    start_date: string;
    end_date: string;
    description: string;
    skills: string[]; // Changed from optional to required
  }>;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    technologies: string[];
    start_date?: string; // Added optional start date
    end_date?: string;   // Added optional end date
  }>;
  certifications: Array<{
    id: number;
    name: string;
    date: string;
    issuer: string; // Changed from optional to required
  }>;
  matched_jobs: any[];
  summary: string[];
  parsedText: string;
}

export const parseResume = async (file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append('resume', file);

  const timestamp = new Date().getTime();

  try {
    // Make the request to the backend
    const response = await axios.post(`http://127.0.0.1:5000/upload?t=${timestamp}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    // Log the raw response from the backend
    console.log('Raw backend response:', response.data);

    // Extract the data field from the response
    const extractedData = response.data?.data;
    if (!extractedData) {
      throw new Error('No data field in the backend response');
    }

    // Log the extracted data before transformation
    console.log('Extracted data from backend:', extractedData);

    // Validate and transform the data to match the ResumeData interface
    const resumeData: ResumeData = {
      name: typeof extractedData.name === 'string' ? extractedData.name : 'Not Found',
      emails: Array.isArray(extractedData.emails)
        ? extractedData.emails.filter((email: any) => typeof email === 'string')
        : ['Not Found'],
      phone_numbers: Array.isArray(extractedData.phone_numbers)
        ? extractedData.phone_numbers.filter((phone: any) => typeof phone === 'string')
        : ['Not Found'],
      skills: Array.isArray(extractedData.skills)
        ? extractedData.skills.filter((skill: any) => typeof skill === 'string')
        : [],
      education: Array.isArray(extractedData.education)
        ? extractedData.education.map((edu: any, index: number) => ({
            id: typeof edu.id === 'number' ? edu.id : index,
            degree: typeof edu.degree === 'string' ? edu.degree : 'Unknown Degree',
            institution: typeof edu.institution === 'string' ? edu.institution : 'Unknown Institution',
            start_date: typeof edu.start_date === 'string' ? edu.start_date : 'Not Specified',
            end_date: typeof edu.end_date === 'string' ? edu.end_date : 'Not Specified',
            description: typeof edu.description === 'string' ? edu.description : '',
          }))
        : [],
      experience: Array.isArray(extractedData.experience)
        ? extractedData.experience.map((exp: any, index: number) => ({
            id: typeof exp.id === 'number' ? exp.id : index,
            title: typeof exp.title === 'string' ? exp.title : 'Unknown Title',
            company: typeof exp.company === 'string' ? exp.company : 'Unknown Company',
            start_date: typeof exp.start_date === 'string' ? exp.start_date : 'Not Specified',
            end_date: typeof exp.end_date === 'string' ? exp.end_date : 'Not Specified',
            description: typeof exp.description === 'string' ? exp.description : 'No description provided',
            skills: Array.isArray(exp.skills)
              ? exp.skills.filter((skill: any) => typeof skill === 'string')
              : [], // Always return an array, even if empty
          }))
        : [],
      projects: Array.isArray(extractedData.projects)
        ? extractedData.projects.map((proj: any, index: number) => ({
            id: typeof proj.id === 'number' ? proj.id : index,
            name: typeof proj.name === 'string' ? proj.name : 'Unknown Project',
            description: typeof proj.description === 'string' ? proj.description : 'No description provided',
            technologies: Array.isArray(proj.technologies)
              ? proj.technologies.filter((tech: any) => typeof tech === 'string')
              : [],
            start_date: typeof proj.start_date === 'string' ? proj.start_date : undefined,
            end_date: typeof proj.end_date === 'string' ? proj.end_date : undefined,
          }))
        : [],
      certifications: Array.isArray(extractedData.certifications)
        ? extractedData.certifications.map((cert: any, index: number) => ({
            id: typeof cert.id === 'number' ? cert.id : index,
            name: typeof cert.name === 'string' ? cert.name : 'Unknown Certification',
            date: typeof cert.date === 'string' ? cert.date : 'Not Specified',
            issuer: typeof cert.issuer === 'string' ? cert.issuer : 'Unknown Issuer',
          }))
        : [],
      matched_jobs: Array.isArray(extractedData.matched_jobs) ? extractedData.matched_jobs : [],
      summary: Array.isArray(extractedData.summary)
        ? extractedData.summary.filter((item: any) => typeof item === 'string')
        : [],
      parsedText: typeof extractedData.parsedText === 'string' ? extractedData.parsedText : '',
    };

    // Log the final transformed data
    console.log('Transformed resume data:', resumeData);

    return resumeData;
  } catch (error: any) {
    console.error('Error parsing resume:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to parse resume. Please try again.');
  }
};