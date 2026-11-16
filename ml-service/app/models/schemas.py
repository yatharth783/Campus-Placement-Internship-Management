from typing import List, Optional
from pydantic import BaseModel, Field

class JobItem(BaseModel):
    job_id: str
    title: str
    company_name: Optional[str] = "Corporate Partner"
    description: str
    required_skills: List[str] = []
    minimum_cgpa: Optional[float] = 0.0
    eligible_branches: Optional[List[str]] = []
    graduation_year: Optional[int] = None

class StudentProfile(BaseModel):
    student_id: Optional[str] = ""
    skills: List[str] = []
    resume_text: Optional[str] = ""
    branch: Optional[str] = ""
    cgpa: Optional[float] = 0.0
    graduation_year: Optional[int] = None
    experience: Optional[str] = ""

class RecommendRequest(BaseModel):
    student: StudentProfile
    jobs: List[JobItem]
    top_n: Optional[int] = 10

class MatchExplanation(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    contributing_keywords: List[str]
    is_eligible: bool
    eligibility_reasons: List[str]

class RecommendedJob(BaseModel):
    job_id: str
    title: str
    company_name: str
    similarity_score: float  # 0 to 100 percentage
    explanation: MatchExplanation

class RecommendResponse(BaseModel):
    recommendations: List[RecommendedJob]
    total_jobs_evaluated: int
    summary: str

class SkillGapRequest(BaseModel):
    student_skills: List[str] = []
    resume_text: Optional[str] = ""
    job_title: str
    job_description: str
    required_skills: List[str] = []

class SkillGapResponse(BaseModel):
    job_title: str
    matching_skills: List[str]
    skills_not_found_in_profile: List[str]
    skill_coverage_percentage: float
    recommended_learning_topics: List[str]
    advice_note: str

class ResumeFeedbackRequest(BaseModel):
    resume_text: str
    job_title: Optional[str] = ""
    job_description: Optional[str] = ""
    required_skills: Optional[List[str]] = []

class ResumeFeedbackResponse(BaseModel):
    similarity_score: float
    detected_skills: List[str]
    missing_job_keywords: List[str]
    word_count: int
    readability_level: str
    practical_suggestions: List[str]
    is_scanned_or_empty: bool

class ExtractResumeResponse(BaseModel):
    extracted_text: str
    word_count: int
    detected_skills: List[str]
    page_count: int
    error_message: Optional[str] = None
