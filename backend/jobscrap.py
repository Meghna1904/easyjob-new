from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import logging
import uuid
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  # Restrict CORS to frontend origin

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def fetch_joblistopia_jobs():
    url = "https://joblistopia.lovable.app/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    }
    try:
        logger.info(f"Fetching Joblistopia job listings from: {url}")
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        logger.error(f"Error fetching Joblistopia jobs: {e}")
        return None

def parse_joblistopia_jobs(html):
    if not html:
        logger.warning("No HTML content to parse, using mock data")
        return [
            {
                "id": str(uuid.uuid4()),
                "title": "Senior Frontend Developer",
                "company": "TechGlobe Inc.",
                "location": "San Francisco, CA",
                "salary": "$120,000 - $150,000",
                "description": "We are looking for an experienced Frontend Developer to join our team. The ideal candidate should have a strong understanding of Python, React, TypeScript, and modern frontend development practices.",
                "requirements": ["5+ years of experience in frontend development", "Strong proficiency in React, TypeScript, and modern JavaScript"],
                "postedDate": "2023-09-15",
                "matchScore": 0.8,
                "skills": ["Python", "React", "TypeScript", "CSS", "HTML", "JavaScript"],
                "link": "https://joblistopia.lovable.app/job1"
            }
        ]
    soup = BeautifulSoup(html, "html.parser")
    results = []
    job_cards = soup.select("div[class*='job'], li[class*='job'], article[class*='job']")
    logger.debug(f"Found {len(job_cards)} job cards in HTML")

    for card in job_cards:
        try:
            title = (card.find(["h1", "h2", "h3"]) or card.find("a", class_=lambda x: x and "title" in x.lower()) or {}).text.strip() or "No title"
            company = (card.find("span", class_=lambda x: x and "company" in x.lower()) or {}).text.strip() or "Unknown"
            location = (card.find("span", class_=lambda x: x and "location" in x.lower()) or {}).text.strip() or "Unknown"
            desc_elem = card.find("p") or card.find("div", class_=lambda x: x and "desc" in x.lower())
            description = desc_elem.text.strip() if desc_elem else "No description"
            link_elem = card.find("a")
            link = "https://joblistopia.lovable.app/" + link_elem["href"] if link_elem and "href" in link_elem.attrs and not link_elem["href"].startswith("http") else link_elem.get("href", "No link")

            job_id = str(uuid.uuid4())
            salary = f"${random.randint(60, 150)}K - ${random.randint(151, 200)}K"
            requirements = ["3+ years experience", "Bachelor's degree", "Strong communication skills"]
            posted_date = (datetime.now() - timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d")
            match_score = random.uniform(0.6, 0.95)
            skills = ["Python", "JavaScript", "React", "SQL", "AWS"]

            results.append({
                "id": job_id,
                "title": title,
                "company": company,
                "location": location,
                "salary": salary,
                "description": description,
                "requirements": requirements,
                "postedDate": posted_date,
                "matchScore": match_score,
                "skills": skills,
                "link": link
            })
        except Exception as e:
            logger.error(f"Error parsing job card: {e}")
            continue
    
    return results

@app.route('/', methods=['GET', 'POST'])
def match_jobs():
    logger.info("Received request at /api/match-jobs")
    
    if request.method == 'GET':
        html = fetch_joblistopia_jobs()
        all_jobs = parse_joblistopia_jobs(html)
        return jsonify({"jobs": all_jobs[:5]})
    
    data = request.get_json()
    logger.debug(f"Request data: {data}")

    skills = data.get('skills', [])
    if not skills:
        logger.warning("No skills provided in request")
        return jsonify({"error": "No skills provided"}), 400

    logger.debug(f"Received skills: {skills}")

    html = fetch_joblistopia_jobs()
    all_jobs = parse_joblistopia_jobs(html)

    matched_jobs = []
    for job in all_jobs:
        matched_skills = [skill for skill in skills if skill.lower() in job["description"].lower() or skill.lower() in job["title"].lower()]
        if matched_skills:
            job["matchScore"] = min(0.95, 0.6 + (len(matched_skills) * 0.1))
            matched_jobs.append(job)

    matched_jobs.sort(key=lambda x: x["matchScore"], reverse=True)  # Sort by match score
    logger.info(f"Returning {len(matched_jobs)} matched jobs")
    return jsonify({"jobs": matched_jobs[:5]})  # Return top 5 jobs

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)