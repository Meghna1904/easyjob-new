// src/pages/about.tsx
import React, { useState, useEffect } from 'react';

// Testimonial interface
interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar: string;
}

// FAQ interface
interface FAQ {
  question: string;
  answer: string;
}

const AboutPage: React.FC = () => {
  // State for testimonials slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Sample testimonials data
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Alex Johnson",
      position: "Software Engineer",
      company: "TechCorp",
      content: "EasyJob helped me find my dream position in just two weeks! The skill matching was incredibly accurate.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Sarah Williams",
      position: "Marketing Director",
      company: "Creative Solutions",
      content: "The skill insights feature gave me valuable feedback on what I needed to improve to land my ideal role.",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Data Analyst",
      company: "DataMetrics",
      content: "I was amazed at how well EasyJob matched my skills to relevant positions. Saved me countless hours of searching.",
      avatar: "/api/placeholder/40/40"
    }
  ];

  // Sample FAQs
  const faqs: FAQ[] = [
    {
      question: "How does EasyJob match me with jobs?",
      answer: "EasyJob uses advanced AI algorithms to analyze your resume and extract key skills, experiences, and qualifications. We then compare these against thousands of job listings to find positions that best match your profile. Our matching considers not just keywords, but the context and relevance of your skills to each position."
    },
    {
      question: "Is my resume data secure?",
      answer: "Absolutely. We take data security very seriously. Your resume data is encrypted and stored securely. We never share your personal information with employers without your explicit permission. You can delete your data from our system at any time through your account settings."
    },
    {
      question: "Can I use EasyJob if I'm changing careers?",
      answer: "Yes! EasyJob is particularly helpful for career changers. Our system identifies transferable skills and suggests jobs where your existing abilities can be valuable, even in a new industry. We also provide skill gap analysis to help you identify areas to focus on for your career transition."
    },
    {
      question: "How often are job matches updated?",
      answer: "Our job database is updated daily, and your matches are refreshed every time you log in. We constantly scan for new opportunities that match your profile, ensuring you never miss out on relevant openings."
    }
  ];

  // Stats that will animate
  const stats = [
    { label: "Job Seekers Helped", value: 250000, suffix: "+" },
    { label: "Success Rate", value: 89, suffix: "%" },
    { label: "Partner Companies", value: 1200, suffix: "+" },
    { label: "Average Time to Hire", value: 18, suffix: " days" }
  ];

  // Handle scrolling for animations
  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !isStatsVisible) {
          setIsStatsVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isStatsVisible]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About EasyJob</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Connecting talented people with their perfect career opportunities through intelligent matching.
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section with Animation */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                <p className="text-lg text-blue-700 italic">
                  "To revolutionize how people find jobs by creating perfect matches between talents and opportunities."
                </p>
              </div>
              <p className="text-gray-700 mb-4">
                At EasyJob, we're on a mission to simplify the job search process by connecting job seekers with opportunities that match their unique skills and experience. We believe that finding the right job shouldn't be complicated, and that everyone deserves a career that aligns with their talents and aspirations.
              </p>
              <p className="text-gray-700">
                Using advanced AI and machine learning technology, we analyze your resume and match it with job listings from across the web, providing you with personalized recommendations and insights to help you land your dream job.
              </p>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section id="stats-section" className="mb-16">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">EasyJob By The Numbers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                      {isStatsVisible ? (
                        <CountUp 
                          target={stat.value} 
                          suffix={stat.suffix} 
                          duration={2000 + index * 200} 
                        />
                      ) : (
                        `0${stat.suffix}`
                      )}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-5 rounded-lg relative group transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1. Upload Your Resume</h3>
                  <p className="text-gray-600">
                    Simply upload your resume in PDF, DOCX, or TXT format. Our AI will analyze your experience, skills, and qualifications.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg relative group transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">2. Get Matched</h3>
                  <p className="text-gray-600">
                    Our algorithm matches your profile with thousands of job listings to find the best opportunities for you.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg relative group transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">3. Apply with Confidence</h3>
                  <p className="text-gray-600">
                    Review your matches, get insights on your skills, and apply to jobs with a higher chance of success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Success Stories</h2>
              
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-in-out" 
                    style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                  >
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <div className="flex items-center mb-4">
                            <img 
                              className="h-10 w-10 rounded-full mr-4" 
                              src={testimonial.avatar} 
                              alt={testimonial.name} 
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                              <p className="text-sm text-gray-600">{testimonial.position} at {testimonial.company}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 italic">"{testimonial.content}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-2 w-2 mx-1 rounded-full ${
                        currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="mb-16">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleFaq(index)}
                      aria-expanded={expandedFaq === index}
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <svg 
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedFaq === index ? 'max-h-96 p-4' : 'max-h-0'
                      }`}
                    >
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Get In Touch</h3>
                  <p className="text-gray-600 mb-4">
                    Have questions or feedback? Our team is here to help!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">support@easyjob.com</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">Monday-Friday, 9am-5pm EST</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h3>
                  <p className="text-gray-600 mb-4">
                    Stay updated with our latest news and job tips.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-400 hover:text-blue-600 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-800 hover:text-blue-900 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a href="#" className="text-pink-600 hover:text-pink-700 transition-colors">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// CountUp component to animate numbers
const CountUp: React.FC<{ target: number; suffix: string; duration: number }> = ({ target, suffix, duration }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (count < target) {
      const increment = Math.ceil(target / (duration / 50));
      const timer = setTimeout(() => {
        setCount(prevCount => {
          const newCount = prevCount + increment;
          return newCount >= target ? target : newCount;
        });
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [count, target, duration]);
  
  return <span>{count}{suffix}</span>;
};

export default AboutPage;