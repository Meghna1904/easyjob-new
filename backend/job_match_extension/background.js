// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeResume") {
      fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume: message.resume,
          jobDescription: message.jobDescription
        })
      })
      .then(response => response.json())
      .then(data => {
        sendResponse({success: true, data: data});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({success: false, error: error.toString()});
      });
      
      return true; // Required to use sendResponse asynchronously
    }
  }); 