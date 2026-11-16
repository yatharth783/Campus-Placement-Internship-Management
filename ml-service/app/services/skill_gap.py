"""
Skill Gap Analysis service.
Evaluates profile skills against target job requirements, calculates coverage,
and generates actionable learning recommendations.
"""
from typing import List
from app.models.schemas import SkillGapRequest, SkillGapResponse
from app.services.text_processor import extract_skills_from_text
from app.services.skill_dictionary import normalize_skill, get_learning_recommendation

def analyze_skill_gap(request: SkillGapRequest) -> SkillGapResponse:
    """
    Perform deep skill gap analysis comparing student's profile & resume skills
    against explicit required skills and skills mentioned in job description.
    """
    # 1. Gather all student skills (profile declared + resume extracted)
    declared_student = {normalize_skill(s) for s in request.student_skills if s.strip()}
    extracted_from_resume = set(extract_skills_from_text(request.resume_text or ""))
    combined_student_skills = declared_student.union(extracted_from_resume)

    # 2. Gather all job skills (explicit required + description extracted)
    explicit_job_skills = {normalize_skill(s) for s in request.required_skills if s.strip()}
    extracted_from_desc = set(extract_skills_from_text(request.job_description or ""))
    combined_job_skills = explicit_job_skills.union(extracted_from_desc)

    # If no job skills are found at all, fall back to title tokens
    if not combined_job_skills:
        extracted_from_title = set(extract_skills_from_text(request.job_title or ""))
        combined_job_skills = extracted_from_title or {"general technical skills"}

    # 3. Compute matching and missing skills
    matching_skills = sorted(list(combined_student_skills.intersection(combined_job_skills)))
    missing_skills = sorted(list(combined_job_skills - combined_student_skills))

    # 4. Calculate skill coverage percentage
    total_required = len(combined_job_skills)
    matched_count = len(matching_skills)
    coverage = round((matched_count / total_required) * 100, 1) if total_required > 0 else 100.0

    # 5. Build recommended learning topics with specific actionable guidance
    recommended_topics = []
    for skill in missing_skills:
        guidance = get_learning_recommendation(skill)
        recommended_topics.append(f"{skill.title()}: {guidance}")

    # 6. Build balanced, polite advice note
    if coverage >= 80:
        advice_note = "Strong alignment! You possess most skills needed for this role. Consider polishing advanced project implementations."
    elif coverage >= 50:
        advice_note = "Moderate alignment. You have foundational skills; bridging the skills not found in your profile will substantially elevate your competitiveness."
    else:
        advice_note = "Growth opportunity. Several key technical competencies were not detected in your current profile. We recommend reviewing the learning roadmap below."

    return SkillGapResponse(
        job_title=request.job_title,
        matching_skills=matching_skills,
        skills_not_found_in_profile=missing_skills,
        skill_coverage_percentage=coverage,
        recommended_learning_topics=recommended_topics,
        advice_note=advice_note
    )
