import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseResume } from '../utils/resumeParser';
import { ResumeViewer } from './ResumeViewer';
import { ResumeScore } from './ResumeScore';
import { ResumeDetails } from './ResumeDetails';
import { Upload, FileUp, Eye, EyeOff } from 'lucide-react';
import { FiCheck, FiX } from "react-icons/fi";
import { ArrowRight } from 'lucide-react';

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [showPdfPreview, setShowPdfPreview] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetUpload();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFileSelection(event.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setTimeout(() => handleUpload(selectedFile), 500);
  };

  const handleUpload = async (selectedFile: File = file!) => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      setAnalyzing(true);
  
      const data = await parseResume(selectedFile);
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      setResumeData(data);
      // Store the full resume data in the ResumeContext
      setResumeData(data);
      setAnalyzing(false);
      setUploadComplete(true);
    } catch (err) {
      setError('Error processing the resume. Please try again.');
      setLoading(false);
      setAnalyzing(false);
      console.error(err);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResumeData(null);
    setLoading(false);
    setAnalyzing(false);
    setError('');
    setUploadComplete(false);
    setShowPdfPreview(false);
    setActiveTab('overview');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-28">
      <AnimatePresence mode="wait">
        {!uploadComplete ? (
          <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key="upload-section"
          >
            <motion.div className="text-center mb-12" variants={itemVariants}>
              <h1 className="text-4xl font-bold mb-4 text-gray-900">Smart Resume Analyzer</h1>
              <p className="text-gray-600 text-lg">Upload your resume and get instant AI-powered insights</p>
            </motion.div>

            <motion.div
              className={`relative border-2 border-dashed rounded-xl overflow-hidden
                ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}
                ${!file ? 'hover:border-blue-400 hover:bg-blue-50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              variants={itemVariants}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={loading || analyzing}
              />
              <div className="text-center p-12">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                    <FileUp className="w-8 h-8 text-blue-500" />
                  </div>
                </motion.div>
                <h3 className="text-lg font-medium mb-2 text-gray-700">
                  {file ? file.name : 'Drag and drop your resume here'}
                </h3>
                <p className="text-sm text-gray-500">
                  {!file && 'or click to browse (PDF or DOCX)'}
                </p>
                {file && !loading && !analyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <button
                      onClick={() => handleUpload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium inline-flex items-center hover:bg-blue-700"
                    >
                      Analyze
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {(loading || analyzing) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                  >
                    <div className="relative">
                      {loading && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-16 h-16 relative"
                        >
                          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Upload className="h-6 w-6 text-blue-500" />
                          </div>
                        </motion.div>
                      )}
                      {analyzing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-16 h-16 relative"
                        >
                          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
                        </motion.div>
                      )}
                    </div>
                    <motion.p
                      className="mt-4 font-medium text-gray-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {loading ? 'Uploading...' : 'Analyzing your resume...'}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {error && (
              <motion.div
                className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <FiX className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {resumeData && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-gray-800">Resume Analysis</h1>
                  <button
                    onClick={resetUpload}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Upload Another Resume
                  </button>
                </div>
                <ResumeDetails resumeData={resumeData} activeTab={activeTab} setActiveTab={setActiveTab} />
                <ResumeScore resumeData={resumeData} />
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
                    <button
                      onClick={() => setShowPdfPreview(!showPdfPreview)}
                      className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg"
                    >
                      {showPdfPreview ? (
                        <>
                          <EyeOff className="w-5 h-5 mr-2" />
                          Hide Preview
                        </>
                      ) : (
                        <>
                          <Eye className="w-5 h-5 mr-2" />
                          Show Preview
                        </>
                      )}
                    </button>
                  </div>
                  {showPdfPreview && file && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <ResumeViewer file={file} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadResume;