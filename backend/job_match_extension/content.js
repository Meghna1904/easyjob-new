// Function to extract job description based on site
function extractJobDescription() {
  let jobDescription = '';
  console.log('Extracting job description from:', window.location.href);

  // LinkedIn
  if (window.location.hostname.includes('linkedin.com')) {
    return new Promise((resolve) => {
      const observer = new MutationObserver((mutations, obs) => {
        const descElement = document.querySelector('.description__text') || 
                            document.querySelector('.show-more-less-html__markup') || 
                            document.querySelector('.jobs-description-content__text') || 
                            document.querySelector('.jobs-details__main-content div[class*="description"]');
        if (descElement) {
          jobDescription = descElement.innerText;
          console.log('Found LinkedIn job description');
          obs.disconnect(); // Stop observing
          resolve(jobDescription.trim());
        }
      });

      // Start observing the document for changes
      observer.observe(document.body, { childList: true, subtree: true });

      // Fallback timeout in case the observer doesn't find anything
      setTimeout(() => {
        observer.disconnect();
        resolve('No description found on LinkedIn');
      }, 5000); // 5-second timeout
    });
  }

  // Indeed
  else if (window.location.hostname.includes('indeed.com')) {
    const descElement = document.querySelector('#jobDescriptionText') || 
                        document.querySelector('.jobsearch-JobComponent-description');
    jobDescription = descElement ? descElement.innerText : 'No description found on Indeed';
    console.log('Indeed selector result:', descElement ? 'Found' : 'Not found');
    return Promise.resolve(jobDescription.trim());
  }

  // SimplyHired
  else if (window.location.hostname.includes('simplyhired.com')) {
    const descElement = document.querySelector('.jobposting-description') || 
                        document.querySelector('.viewjob-description');
    jobDescription = descElement ? descElement.innerText : 'No description found on SimplyHired';
    console.log('SimplyHired selector result:', descElement ? 'Found' : 'Not found');
    return Promise.resolve(jobDescription.trim());
  }

  // Glassdoor
  else if (window.location.hostname.includes('glassdoor.com')) {
    const descElement = document.querySelector('.jobDescriptionContent') || 
                        document.querySelector('.desc');
    jobDescription = descElement ? descElement.innerText : 'No description found on Glassdoor';
    console.log('Glassdoor selector result:', descElement ? 'Found' : 'Not found');
    return Promise.resolve(jobDescription.trim());
  }

  // Fallback for other sites
  else {
    const descElement = document.querySelector('div[class*="description"]') || 
                        document.querySelector('section[class*="description"]') || 
                        document.querySelector('p[class*="description"]');
    jobDescription = descElement ? descElement.innerText : 'No description found on this site';
    console.log('Fallback selector result:', descElement ? 'Found' : 'Not found');
    return Promise.resolve(jobDescription.trim());
  }
}

// Handle message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getJobDescription') {
    extractJobDescription().then(jobDescription => {
      console.log('Sending job description:', jobDescription.substring(0, 100) + '...');
      sendResponse({ jobDescription });
    }).catch(error => {
      console.error('Error extracting job description:', error);
      sendResponse({ jobDescription: 'Error extracting job description' });
    });
    return true; // Keep message channel open for async response
  }
});