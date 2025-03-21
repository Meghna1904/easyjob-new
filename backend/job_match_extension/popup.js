// popup.js (updated with backend integration)
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const resumeUpload = document.getElementById('resume-upload');
  const fileName = document.getElementById('file-name');
  const scanBtn = document.getElementById('scan-btn');
  const improveBtn = document.getElementById('improve-btn');
  const matchSection = document.getElementById('match-section');
  const suggestionsSection = document.getElementById('suggestions-section');
  const progressBar = document.getElementById('progress-bar');
  const matchValue = document.getElementById('match-value');
  const skillsMatch = document.getElementById('skills-match');
  const experienceMatch = document.getElementById('experience-match');
  const keywordsMatch = document.getElementById('keywords-match');
  const jobTitleText = document.getElementById('job-title-text');
  const jobCompany = document.getElementById('job-company');
  const missingSkillsList = document.getElementById('missing-skills-list');
  const aiSuggestions = document.getElementById('ai-suggestions');
  
  let resumeText = null;
  let resumeFile = null;
  let currentJobData = null;
  
  // Event listeners
  resumeUpload.addEventListener('change', handleResumeUpload);
  scanBtn.addEventListener('click', scanCurrentJob);
  improveBtn.addEventListener('click', generateSuggestions);
  
  // Check if a resume is already uploaded
  chrome.storage.local.get(['resume'], function(result) {
      if (result.resume) {
          resumeText = result.resume.text;
          fileName.textContent = result.resume.name;
          scanBtn.disabled = false;
      }
  });
  
  // Check if we have job data from the active tab
  checkForJobData();
  
  function handleResumeUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      fileName.textContent = file.name;
      resumeFile = file;
      
      const reader = new FileReader();
      reader.onload = function(e) {
          const text = e.target.result;
          resumeText = text;
          
          // Store in chrome storage
          chrome.storage.local.set({
              resume: {
                  text: text,
                  name: file.name
              }
          });
          
          scanBtn.disabled = false;
      };
      
      // Read as text for now - the backend will handle parsing
      reader.readAsText(file);
  }
  
  function checkForJobData() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "getJobData"}, function(response) {
              if (response && response.jobData) {
                  currentJobData = response.jobData;
                  jobTitleText.textContent = response.jobData.title;
                  jobCompany.textContent = response.jobData.company;
              }
          });
      });
  }
  
  function scanCurrentJob() {
      if (!resumeText || !currentJobData) return;
      
      // Show loading state
      scanBtn.textContent = "Analyzing...";
      scanBtn.disabled = true;
      
      // Use the backend parser through background.js
      chrome.runtime.sendMessage({
          action: "analyzeResume",
          resume: resumeText,
          jobDescription: currentJobData.description
      }, function(response) {
          // Reset button state
          scanBtn.textContent = "Scan Current Job";
          scanBtn.disabled = false;
          
          if (response && response.success) {
              displayMatchResults(response.data);
          } else {
              alert("Error analyzing resume. Please try again.");
              console.error(response.error);
          }
      });
  }
  
  function displayMatchResults(data) {
      // Show the match section
      matchSection.classList.remove('hidden');
      
      // Get the match percentages from backend response
      const skillsMatchValue = data.skillsMatch;
      const experienceMatchValue = data.experienceMatch;
      const keywordsMatchValue = data.keywordsMatch;
      const overallMatch = data.overallMatch;
      
      // Animate progress bar
      animateProgress(overallMatch);
      
      // Update match details
      skillsMatch.textContent = skillsMatchValue + '%';
      experienceMatch.textContent = experienceMatchValue + '%';
      keywordsMatch.textContent = keywordsMatchValue + '%';
      
      // Store analysis results for suggestions
      chrome.storage.local.set({
          analysisResults: data
      });
      
      // Enable improve button
      improveBtn.disabled = false;
  }
  
  function animateProgress(value) {
      let currentValue = 0;
      const interval = setInterval(() => {
          currentValue += 1;
          progressBar.style.width = currentValue + '%';
          matchValue.textContent = currentValue;
          
          if (currentValue >= value) {
              clearInterval(interval);
          }
      }, 20);
  }
  
  function generateSuggestions() {
      // Show loading state
      improveBtn.textContent = "Generating...";
      improveBtn.disabled = true;
      
      // Get stored analysis results
      chrome.storage.local.get(['analysisResults'], function(result) {
          if (result.analysisResults) {
              // Display the suggestions
              displaySuggestions(result.analysisResults);
          } else {
              // If no stored results, re-analyze
              scanCurrentJob();
          }
          
          // Reset button state
          improveBtn.textContent = "Generate Resume Suggestions";
          improveBtn.disabled = false;
      });
  }
  
  function displaySuggestions(data) {
      // Show suggestions section
      suggestionsSection.classList.remove('hidden');
      
      // Get missing skills from analysis
      const missingSkills = data.missingSkills || [];
      
      // Clear previous suggestions
      missingSkillsList.innerHTML = '';
      
      // Add missing skills to the list
      if (missingSkills.length > 0) {
          missingSkills.forEach(skill => {
              const li = document.createElement('li');
              li.textContent = skill;
              missingSkillsList.appendChild(li);
          });
      } else {
          const li = document.createElement('li');
          li.textContent = "No critical skills missing";
          missingSkillsList.appendChild(li);
      }
      
      // Add AI suggestions
      aiSuggestions.innerHTML = '';
      
      if (data.suggestions && data.suggestions.length > 0) {
          data.suggestions.forEach(suggestion => {
              const p = document.createElement('p');
              p.textContent = suggestion;
              aiSuggestions.appendChild(p);
          });
      } else {
          const p = document.createElement('p');
          p.textContent = "Your resume is well-matched to this job description.";
          aiSuggestions.appendChild(p);
      }
  }
});
