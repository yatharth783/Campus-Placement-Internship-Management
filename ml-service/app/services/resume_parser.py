"""
PDF Resume Parser and ATS-Style Feedback Engine using PyPDF and NLP text processing.
Handles scanned or empty PDFs gracefully with informative diagnostic messages.
"""
import io
from typing import Tuple, List, Optional
from pypdf import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.schemas import ResumeFeedbackRequest, ResumeFeedbackResponse, ExtractResumeResponse
from app.services.text_processor import clean_text, extract_skills_from_text, tokenize_and_filter
from app.services.skill_dictionary import normalize_skill

def extract_text_from_pdf(pdf_bytes: bytes) -> Tuple[str, int, Optional[str]]:
    """
    Extract text content from raw PDF bytes using PyPDF.
    Returns: (extracted_text, page_count, error_or_warning_message)
    """
    if not pdf_bytes:
        return "", 0, "Empty file uploaded."

    try:
        reader = PdfReader(io.BytesIO(pdf_bytes))
        page_count = len(reader.pages)
        if page_count == 0:
            return "", 0, "Uploaded PDF file contains no pages."

        extracted_text_parts = []
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            extracted_text_parts.append(page_text)

        full_text = "\n".join(extracted_text_parts).strip()

        # Check if the PDF is scanned or image-based with little/no selectable text
        if len(full_text.split()) < 15:
            warning = (
                "Notice: Very minimal text extracted. If this is a scanned or image-based PDF, "
                "PyPDF cannot extract text without OCR. Please consider uploading a text-based PDF "
                "exported from Microsoft Word, Google Docs, or LaTeX."
            )
            return full_text, page_count, warning

        return full_text, page_count, None

    except Exception as e:
        return "", 0, f"Error processing PDF document: {str(e)}. Please check if file is corrupted or password-protected."

def generate_resume_feedback(request: ResumeFeedbackRequest) -> ResumeFeedbackResponse:
    """
    Analyze resume text against target job description and required skills.
    Produces similarity score, detected skills, missing keywords, and actionable suggestions.
    """
    resume_raw = request.resume_text or ""
    words = resume_raw.split()
    word_count = len(words)

    # 1. Check for scanned / unreadable condition (< 10 words or < 40 chars)
    is_scanned_or_empty = word_count < 10 or len(resume_raw.strip()) < 40

    # 2. Extract skills from resume
    detected_skills = extract_skills_from_text(resume_raw)

    # 3. Clean job text and extract job skills/keywords
    job_desc = request.job_description or ""
    job_title = request.job_title or ""
    req_skills = [normalize_skill(s) for s in (request.required_skills or [])]

    job_extracted_skills = extract_skills_from_text(f"{job_title} {job_desc}")
    target_skills = sorted(list(set(req_skills + job_extracted_skills)))

    # Missing keywords / skills
    detected_set = set(detected_skills)
    missing_job_keywords = [s for s in target_skills if s not in detected_set]

    # 4. Calculate similarity score between resume and job description
    similarity_score = 0.0
    if not is_scanned_or_empty and (job_desc or target_skills):
        resume_cleaned = clean_text(resume_raw)
        job_cleaned = clean_text(f"{job_title} {job_desc} {' '.join(target_skills)}")
        
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), max_features=1500)
            matrix = vectorizer.fit_transform([resume_cleaned, job_cleaned])
            score = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])
            similarity_score = round(max(0.0, min(100.0, score * 100)), 1)
        except Exception:
            similarity_score = 0.0

    # 5. Determine readability and document length level
    if word_count < 150:
        readability_level = "Brief / Under-detailed"
    elif word_count <= 650:
        readability_level = "Optimal length for 1-page student resume"
    else:
        readability_level = "Comprehensive (ensure formatting is concise and 1-2 pages)"

    # 6. Practical actionable suggestions (realistic, non-ATS guaranteeing)
    suggestions = []

    if is_scanned_or_empty:
        suggestions.append("Your document contains very little extractable text. Ensure your PDF is generated with selectable text rather than image scans.")
        suggestions.append("Export directly as PDF from Google Docs, Overleaf LaTeX, or MS Word.")
    else:
        # Check action verbs
        action_verbs = ["developed", "built", "implemented", "designed", "created", "led", "optimized", "engineered", "achieved"]
        found_verbs = [v for v in action_verbs if v in resume_raw.lower()]
        if len(found_verbs) < 3:
            suggestions.append("Use strong action verbs (e.g., 'Engineered', 'Architected', 'Optimized', 'Deployed') to begin your bullet points.")

        # Check metrics/quantification
        has_metrics = any(char.isdigit() for char in resume_raw)
        if not has_metrics:
            suggestions.append("Quantify project outcomes with real impact metrics (e.g., 'improved query speed by 35%', 'supporting 500+ active users').")

        # Skill alignment suggestion
        if missing_job_keywords:
            top_missing = missing_job_keywords[:4]
            suggestions.append(f"Consider integrating experience or projects highlighting missing job keywords if applicable: {', '.join(top_missing)}.")

        # Section organization
        sections = ["education", "skills", "projects", "experience"]
        missing_sections = [sec for sec in sections if sec not in resume_raw.lower()]
        if missing_sections:
            suggestions.append(f"Standardize your resume structure by ensuring clear section headings: {', '.join([s.title() for s in missing_sections])}.")

        suggestions.append("Keep contact details, GitHub profile link, and LinkedIn profile visible at the header.")

    return ResumeFeedbackResponse(
        similarity_score=similarity_score,
        detected_skills=detected_skills,
        missing_job_keywords=missing_job_keywords,
        word_count=word_count,
        readability_level=readability_level,
        practical_suggestions=suggestions,
        is_scanned_or_empty=is_scanned_or_empty
    )
