import os
import re
import spacy
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
from contextlib import contextmanager
from PyPDF2 import PdfReader
from docx import Document

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://localhost:5173"}})

# Load the SpaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Skill Database (Extensive)
skill_db = {
    "Microsoft Office", "Product Management", "Roadmap Planning", "Agile Methodologies",
    "Data Analysis", "Market Research", "Business Analytics", "Wireframing",
    "Prototyping", "SQL", "Python", "Strategic Thinking", "Stakeholder Management",
    "Leadership", "Problem Solving", "Critical Thinking", "Adaptability", "Java",
    "HTML", "CSS", "JavaScript", "Next.js", "MySQL", "MongoDB", "Git", "GitHub",
    "Figma", "Koha", "PostgreSQL", "Firebase", "Unit Testing", "TypeScript", "SSR",
    "Vercel", "OOPS", "Data Structures", "Algorithms", "Database Optimization",
    "AWS", "Azure", "Docker", "Kubernetes", "CI/CD", "RESTful APIs", "GraphQL",
    "Machine Learning", "Deep Learning", "Natural Language Processing", "Data Science",
    "Statistical Analysis", "Communication Skills", "Teamwork", "Project Management",
    "Scrum", "Kanban", "UI/UX Design", "Responsive Design", "Mobile Development",
    "iOS Development", "Android Development", "React", "Angular", "Vue.js", "Node.js",
    "Express.js", "Django", "Flask", "Ruby on Rails", "C++", "C#", "Go", "Swift",
    "Kotlin", "PHP", "Bash Scripting", "PowerShell", "Linux", "Windows Server",
    "Networking", "Cybersecurity", "Cloud Computing", "DevOps", "Big Data", "Spark",
    "Hadoop", "Tableau", "Power BI", "Data Visualization", "Database Design", "SEO",
    "Digital Marketing", "Social Media Marketing", "Content Creation", "Technical Writing",
    "Negotiation", "Presentation Skills", "Mentoring", "Coaching", "Time Management",
    "Budgeting", "Risk Management", "Compliance", "Auditing", "Process Improvement"
}

# Utility Functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@contextmanager
def file_handler(file_path):
    try:
        yield file_path
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

def parse_pdf(file_path):
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PdfReader(file)
            return ''.join(page.extract_text() or '' for page in pdf_reader.pages)
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""

def parse_docx(file_path):
    try:
        doc = Document(file_path)
        return '\n'.join(paragraph.text for paragraph in doc.paragraphs)
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return ""

def extract_name(text):
    lines = text.split('\n')
    for line in lines[:3]:
        line = line.strip()
        parts = line.split()
        if 1 <= len(parts) <= 3 and not any(part.lower() in {"resume", "cv", "curriculum"} for part in parts):
            return line
    doc = nlp(text[:500])
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            return ent.text
    return "Unknown"

def extract_contact_info(text):
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
    phone_pattern = r'(?<!\d)(?:\+?\d{1,3}[-.\s]?)?\(?(?:\d{3})?\)?[-.\s]?\d{3}[-.\s]?\d{4}(?!\d)'
    emails = [email for email in re.findall(email_pattern, text) if len(email) >= 5]
    phones = [''.join(filter(str.isdigit, phone)) for phone in re.findall(phone_pattern, text) if 10 <= len(phone) <= 15]
    return emails, phones

def identify_section_boundaries(lines):
    section_headers = {
        "contact": ["contact information", "contact", "personal information"],
        "skills": ["skills", "technical skills", "core competencies", "expertise", "proficiencies"],
        "experience": ["experience", "work experience", "professional experience", "employment history", "work history"],
        "education": ["education", "academic background", "academic history", "educational background"],
        "certifications": ["certifications", "professional certifications", "credentials", "skill certifications", "certificates"],
        "projects": ["projects", "personal projects", "academic projects", "project experience"],
        "achievements": ["achievements", "accomplishments", "awards", "honors", "recognition"],
        "summary": ["summary", "profile", "objective", "professional summary"]
    }
    section_boundaries = {}
    current_section = None
    for i, line in enumerate(lines):
        line_lower = line.lower().strip()
        for section, headers in section_headers.items():
            if any(header in line_lower for header in headers):
                if current_section:
                    section_boundaries[current_section]["end"] = i
                current_section = section
                section_boundaries[current_section] = {"start": i + 1, "end": len(lines)}
    if current_section:
        section_boundaries[current_section]["end"] = len(lines)
    return section_boundaries

def extract_skills_from_text(text):
    return [skill for skill in skill_db if re.search(r'\b' + re.escape(skill) + r'\b', text, re.IGNORECASE)]

def extract_date_info(text):
    date_pattern = r'\b(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2}|\d{4}|Present)\b'
    date_range_pattern = r'\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?|\d{4})\s*[-–]\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?|\d{4}|Present)\b'
    date_range_match = re.search(date_range_pattern, text, re.IGNORECASE)
    if date_range_match:
        return date_range_match.group(1).strip(), date_range_match.group(2).strip()
    date_match = re.search(date_pattern, text, re.IGNORECASE)
    return (date_match.group(0).strip(), "") if date_match else ("", "")

def extract_section_content(lines, section_boundaries, section_name):
    if section_name not in section_boundaries:
        return []
    start, end = section_boundaries[section_name]["start"], section_boundaries[section_name]["end"]
    content, entry = [], []
    for i in range(start, end):
        line = lines[i].strip()
        if section_name == "education":
            date_pattern = r'\b(?:\d{4}\s*-\s*(?:\d{4}|Present)|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{2,4})\b'
            degree_keywords = ["b.tech", "m.tech", "ph.d", "b.sc", "m.sc", "mba", "b.a", "m.a", "bachelor", "master", "associate", "doctorate", "higher secondary", "secondary"]
            if (re.search(date_pattern, line.lower()) or any(keyword in line.lower() for keyword in degree_keywords)) and entry:
                content.append(entry)
                entry = [line]
            elif not line:
                if entry:
                    content.append(entry)
                entry = []
            else:
                entry.append(line)
        else:
            if not line:
                if entry:
                    content.append(entry)
                entry = []
            else:
                entry.append(line)
    if entry:
        content.append(entry)
    return content
def parse_education(education_entries):
    formatted_education = []
    degree_patterns = [
        r'\b(B\.?Tech|M\.?Tech|Ph\.?D|B\.?Sc|M\.?Sc|MBA|B\.?A|M\.?A|B\.?S|M\.?S|Bachelor|Master|Associate|Doctorate|Higher Secondary|Secondary)\b',
        r'\b(Bachelor|Master|Doctor|Associate)s?\s+of\s+[A-Za-z\s]+\b',
        r'\bHigher Secondary Education\b',
        r'\bSecondary Education\b'
    ]
    for idx, entry in enumerate(education_entries):
        entry = "\n".join(entry) if isinstance(entry, list) else entry
        lines = entry.split('\n')
        start_date, end_date = "", ""
        degree, institution, description = "", "", ""
        if len(lines) >= 2:
            institution = lines[0].strip()
            degree_line = lines[1].strip()
            for pattern in degree_patterns:
                degree_match = re.search(pattern, degree_line, re.IGNORECASE)
                if degree_match:
                    degree = degree_line.replace(f"{start_date} - {end_date}", '').strip() if start_date and end_date else degree_line
                    break
            degree = degree or degree_line
        else:
            institution = lines[0].strip() if lines else "Institution not specified"
        description = " ".join(lines[2:]).strip() if len(lines) > 2 else ""
        formatted_education.append({
            "id": idx,
            "degree": degree or "Degree not specified",
            "institution": institution or "Institution not specified",
            "start_date": start_date,
            "end_date": end_date,
            "description": description
        })
    return formatted_education

def parse_experience(experience_entries):
    formatted_experience = []
    title_patterns = [
        r'\b(Developer|Engineer|Intern|Manager|Analyst|Designer|Consultant|Director|Lead|Coordinator|Specialist)\b',
        r'\b(Senior|Junior|Principal|Associate|Assistant)\s+[A-Za-z\s]+\b'
    ]
    for idx, entry in enumerate(experience_entries):
        entry = "\n".join(entry) if isinstance(entry, list) else entry
        lines = entry.split('\n')
        start_date, end_date = extract_date_info(entry)
        title, company, description = "", "", ""
        for line in lines:
            for pattern in title_patterns:
                title_match = re.search(pattern, line, re.IGNORECASE)
                if title_match and not title:
                    title = title_match.group(0)
            if any(indicator in line.lower() for indicator in ["at ", "for ", "with "]):
                parts = re.split(r'\bat\b|\bfor\b|\bwith\b', line, flags=re.IGNORECASE)
                if len(parts) > 1:
                    title = title or parts[0].strip()
                    company = parts[1].strip()
        if not title and not company and lines:
            title = lines[0].strip()
            company = lines[1].strip() if len(lines) >= 2 else "Company not specified"
        description = " ".join(line for line in lines if line.strip() and line.strip() not in {title, company}).strip()
        skills = extract_skills_from_text(description)
        formatted_experience.append({
            "id": idx,
            "title": title or "Position not specified",
            "company": company or "Company not specified",
            "start_date": start_date,
            "end_date": end_date,
            "description": description,
            "skills": skills
        })
    return formatted_experience

def parse_projects(project_entries):
    formatted_projects = []
    for idx, entry in enumerate(project_entries):
        entry = "\n".join(entry) if isinstance(entry, list) else entry
        lines = entry.split('\n')
        name = lines[0].strip() if lines else "Project not specified"
        description = " ".join(lines[1:]).strip() if len(lines) > 1 else ""
        technologies = extract_skills_from_text(description)
        formatted_projects.append({
            "id": idx,
            "name": name,
            "description": description,
            "technologies": technologies
        })
    return formatted_projects

def parse_certifications(certification_entries):
    formatted_certifications = []
    for idx, entry in enumerate(certification_entries):
        entry = "\n".join(entry) if isinstance(entry, list) else entry
        date, _ = extract_date_info(entry)
        name = entry.strip()
        issuer_match = re.search(r'(?:by|from|issued by|awarded by)\s+([A-Za-z\s]+)', entry, re.IGNORECASE)
        issuer = issuer_match.group(1).strip() if issuer_match else None
        name = name.replace(issuer_match.group(0), "").strip() if issuer_match else name
        name = name.replace(date, "").strip() if date else name
        formatted_certifications.append({
            "id": idx,
            "name": name or "Certification not specified",
            "date": date,
            "issuer": issuer
        })
    return formatted_certifications

def parse_resume(text):
    lines = [line.strip() for line in text.split('\n')]
    section_boundaries = identify_section_boundaries(lines)
    skills_section = extract_section_content(lines, section_boundaries, "skills")
    experience_section = extract_section_content(lines, section_boundaries, "experience")
    education_section = extract_section_content(lines, section_boundaries, "education")
    certification_section = extract_section_content(lines, section_boundaries, "certifications")
    project_section = extract_section_content(lines, section_boundaries, "projects")
    achievement_section = extract_section_content(lines, section_boundaries, "achievements")
    summary_section = extract_section_content(lines, section_boundaries, "summary")
    skills_content = [item for sublist in skills_section for item in sublist]
    experience_content = experience_section
    education_content = education_section
    certification_content = certification_section
    project_content = project_section
    achievement_content = achievement_section
    summary_content = [item for sublist in summary_section for item in sublist]
    skills = extract_skills_from_text(" ".join(skills_content)) or extract_skills_from_text(text)
    formatted_experience = parse_experience(experience_content)
    formatted_education = parse_education(education_content)
    formatted_projects = parse_projects(project_content)
    formatted_certifications = parse_certifications(certification_content)
    for exp in formatted_experience:
        skills.extend(skill for skill in exp.get("skills", []) if skill not in skills)
    for proj in formatted_projects:
        skills.extend(tech for tech in proj.get("technologies", []) if tech not in skills)
    return {
        "skills": skills,
        "experience": formatted_experience,
        "education": formatted_education,
        "certifications": formatted_certifications,
        "projects": formatted_projects,
        "achievements": [" ".join(entry) for entry in achievement_section],
        "summary": summary_content
    }

# Flask Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['resume']
    if not file or file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    try:
        file.save(file_path)
        with file_handler(file_path) as fp:
            text = parse_pdf(fp) if filename.endswith('.pdf') else parse_docx(fp)
            if not text.strip():
                return jsonify({'error': 'Empty or unreadable file'}), 400
            name = extract_name(text)
            emails, phones = extract_contact_info(text)
            parsed_data = parse_resume(text)
            response_data = {
                'name': name,
                'emails': emails,
                'phone_numbers': phones,
                'skills': parsed_data['skills'],
                'education': parsed_data['education'],
                'experience': parsed_data['experience'],
                'projects': parsed_data['projects'],
                'certifications': parsed_data['certifications'],
                'matched_jobs': [],
                'summary': parsed_data['summary'],
                'parsedText': text
            }
            return jsonify({'success': True, 'data': response_data})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': f'Processing error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
