"""
Smart Job Recommendation Engine using Scikit-Learn TF-IDF Vectorizer and Cosine Similarity.
Provides explainable matching keywords and separate eligibility evaluations.
"""
from typing import List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.models.schemas import StudentProfile, JobItem, RecommendedJob, MatchExplanation
from app.services.text_processor import clean_text, extract_skills_from_text, tokenize_and_filter
from app.services.skill_dictionary import normalize_skill

def build_student_corpus(student: StudentProfile) -> Tuple[str, List[str]]:
    """
    Construct rich textual profile representation from declared skills, resume text, experience, and branch.
    """
    normalized_skills = [normalize_skill(s) for s in student.skills]
    extracted_from_resume = extract_skills_from_text(student.resume_text or "")
    
    # Combined unique skills
    all_student_skills = sorted(list(set(normalized_skills + extracted_from_resume)))
    
    parts = [
        " ".join(all_student_skills),
        " ".join(all_student_skills),  # Weighted skill presence
        clean_text(student.resume_text or ""),
        clean_text(student.experience or ""),
        clean_text(student.branch or "")
    ]
    return " ".join([p for p in parts if p]).strip(), all_student_skills

def build_job_corpus(job: JobItem) -> Tuple[str, List[str]]:
    """
    Construct rich textual job representation from title, description, and required skills.
    """
    normalized_skills = [normalize_skill(s) for s in job.required_skills]
    extracted_from_desc = extract_skills_from_text(job.description or "")
    all_job_skills = sorted(list(set(normalized_skills + extracted_from_desc)))
    
    parts = [
        clean_text(job.title or "") * 2,  # Weighted title
        " ".join(all_job_skills) * 2,     # Weighted required skills
        clean_text(job.description or "")
    ]
    return " ".join([p for p in parts if p]).strip(), all_job_skills

def check_eligibility(student: StudentProfile, job: JobItem) -> Tuple[bool, List[str]]:
    """
    Separately check recruiter-defined eligibility criteria without altering cosine similarity.
    """
    reasons = []
    is_eligible = True
    
    # 1. Minimum CGPA check
    if job.minimum_cgpa and job.minimum_cgpa > 0:
        student_cgpa = student.cgpa or 0.0
        if student_cgpa < job.minimum_cgpa:
            is_eligible = False
            reasons.append(f"Student CGPA ({student_cgpa:.2f}) is below minimum requirement ({job.minimum_cgpa:.2f})")
        else:
            reasons.append(f"CGPA requirement met ({student_cgpa:.2f} >= {job.minimum_cgpa:.2f})")
    
    # 2. Eligible branches check
    if job.eligible_branches and len(job.eligible_branches) > 0:
        student_branch = (student.branch or "").strip().lower()
        allowed = [b.strip().lower() for b in job.eligible_branches]
        if student_branch not in allowed:
            is_eligible = False
            reasons.append(f"Branch '{student.branch or 'N/A'}' not in eligible branches: {', '.join(job.eligible_branches)}")
        else:
            reasons.append(f"Branch '{student.branch}' is eligible")
            
    # 3. Graduation Year check
    if job.graduation_year:
        if student.graduation_year and student.graduation_year != job.graduation_year:
            is_eligible = False
            reasons.append(f"Graduation batch mismatch: Job requires {job.graduation_year}, profile has {student.graduation_year}")
        elif student.graduation_year:
            reasons.append(f"Graduation year {student.graduation_year} eligible")
            
    if not reasons:
        reasons.append("All recruiter criteria met or no restrictive constraints defined")
        
    return is_eligible, reasons

def rank_jobs(student: StudentProfile, jobs: List[JobItem], top_n: int = 10) -> List[RecommendedJob]:
    """
    TF-IDF Vectorization and Cosine Similarity calculation with explainable feature importance.
    """
    if not jobs:
        return []

    student_text, student_skills = build_student_corpus(student)
    
    # If student profile is completely empty
    if not student_text.strip():
        student_text = "general engineering software student"

    job_corpora = []
    job_skills_list = []
    for job in jobs:
        text, skills = build_job_corpus(job)
        job_corpora.append(text)
        job_skills_list.append(skills)

    # All documents: [student_doc, job_1_doc, job_2_doc, ...]
    all_docs = [student_text] + job_corpora

    # Initialize TF-IDF Vectorizer
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2500,
        sublinear_tf=True
    )

    tfidf_matrix = vectorizer.fit_transform(all_docs)
    student_vec = tfidf_matrix[0:1]
    job_vecs = tfidf_matrix[1:]

    # Calculate Cosine Similarities
    sim_scores = cosine_similarity(student_vec, job_vecs).flatten()

    feature_names = np.array(vectorizer.get_feature_names_out())
    student_dense = student_vec.toarray()[0]

    ranked_results: List[RecommendedJob] = []

    for idx, job in enumerate(jobs):
        raw_score = float(sim_scores[idx])
        # Scale to 0-100 percentage rounded to 1 decimal place
        percentage_score = round(max(0.0, min(100.0, raw_score * 100)), 1)
        
        # Skill matching
        j_skills = set(job_skills_list[idx])
        s_skills = set(student_skills)
        matched_skills = sorted(list(s_skills.intersection(j_skills)))
        missing_skills = sorted(list(j_skills - s_skills))

        # Contributing keywords: element-wise product of TF-IDF vectors
        job_dense = job_vecs[idx].toarray()[0]
        overlap_weights = student_dense * job_dense
        top_keyword_indices = overlap_weights.argsort()[::-1][:5]
        top_keywords = [
            feature_names[i] for i in top_keyword_indices
            if overlap_weights[i] > 0 and len(feature_names[i]) > 2
        ]

        # Eligibility check
        is_eligible, eligibility_reasons = check_eligibility(student, job)

        ranked_results.append(
            RecommendedJob(
                job_id=job.job_id,
                title=job.title,
                company_name=job.company_name,
                similarity_score=percentage_score,
                explanation=MatchExplanation(
                    matched_skills=matched_skills,
                    missing_skills=missing_skills,
                    contributing_keywords=top_keywords,
                    is_eligible=is_eligible,
                    eligibility_reasons=eligibility_reasons
                )
            )
        )

    # Rank primarily by similarity score descending
    ranked_results.sort(key=lambda x: x.similarity_score, reverse=True)
    return ranked_results[:top_n]
