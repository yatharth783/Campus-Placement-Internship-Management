"""
CampusConnect ML Service FastAPI Application.
ML-Powered Career Assistant endpoints for recommendations, skill gap analysis, and resume feedback.
"""
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

from app.models.schemas import (
    RecommendRequest, RecommendResponse,
    SkillGapRequest, SkillGapResponse,
    ResumeFeedbackRequest, ResumeFeedbackResponse,
    ExtractResumeResponse
)
from app.services.job_matcher import rank_jobs
from app.services.skill_gap import analyze_skill_gap
from app.services.resume_parser import extract_text_from_pdf, generate_resume_feedback
from app.services.text_processor import extract_skills_from_text

app = FastAPI(
    title="CampusConnect ML-Powered Career Assistant API",
    description="Actual TF-IDF, Cosine Similarity, and NLP analysis service for student placement portal.",
    version="1.0.0"
)

# Enable CORS for communication from Node.js backend and React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
def health_check():
    """Health check endpoint to verify ML service status."""
    return {
        "status": "healthy",
        "service": "CampusConnect ML Service",
        "engine": "scikit-learn TF-IDF & Cosine Similarity + PyPDF",
        "version": "1.0.0"
    }

@app.post("/recommend-jobs", response_model=RecommendResponse, tags=["Career Assistant"])
def recommend_jobs(payload: RecommendRequest):
    """
    Feature 1: Smart Job Recommendation
    TF-IDF Vectorization & Cosine Similarity between student profile/resume and available job postings.
    Ranks jobs by similarity and returns explainable contributing keywords and separate eligibility results.
    """
    if not payload.jobs:
        return RecommendResponse(
            recommendations=[],
            total_jobs_evaluated=0,
            summary="No active job postings were provided for evaluation."
        )

    top_matches = rank_jobs(payload.student, payload.jobs, top_n=payload.top_n or 10)
    
    return RecommendResponse(
        recommendations=top_matches,
        total_jobs_evaluated=len(payload.jobs),
        summary=f"Evaluated {len(payload.jobs)} job postings. Ranked top {len(top_matches)} based on TF-IDF cosine similarity."
    )

@app.post("/skill-gap", response_model=SkillGapResponse, tags=["Career Assistant"])
def skill_gap(payload: SkillGapRequest):
    """
    Feature 2: Skill Gap Analysis
    Compares student's profile & resume skills against required job skills.
    Labels skills as matching or 'skills not found in profile' and provides targeted learning topics.
    """
    if not payload.job_title and not payload.job_description:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job title or job description must be provided for skill gap analysis."
        )

    return analyze_skill_gap(payload)

@app.post("/resume-feedback", response_model=ResumeFeedbackResponse, tags=["Career Assistant"])
def resume_feedback(payload: ResumeFeedbackRequest):
    """
    Feature 3: Resume Feedback
    Analyzes resume text against a specific target job, calculates similarity, identifies missing keywords,
    and returns practical constructive suggestions.
    """
    if not payload.resume_text or not payload.resume_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text cannot be empty."
        )

    return generate_resume_feedback(payload)

@app.post("/extract-resume", response_model=ExtractResumeResponse, tags=["Career Assistant"])
async def extract_resume(file: UploadFile = File(...)):
    """
    Extracts text and technical skills from uploaded PDF file using PyPDF.
    Validates file format and handles scanned/empty documents gracefully.
    """
    # 1. Validate file format
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF (.pdf) documents are accepted."
        )

    # 2. Read file bytes
    try:
        contents = await file.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded file: {str(e)}"
        )

    # 3. File size limit (e.g., 5MB)
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds maximum limit of 5MB."
        )

    # 4. Extract text using PyPDF
    text, page_count, warning = extract_text_from_pdf(contents)
    word_count = len(text.split()) if text else 0
    detected_skills = extract_skills_from_text(text) if text else []

    return ExtractResumeResponse(
        extracted_text=text,
        word_count=word_count,
        detected_skills=detected_skills,
        page_count=page_count,
        error_message=warning
    )
