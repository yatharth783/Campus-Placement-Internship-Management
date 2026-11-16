import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.text_processor import extract_skills_from_text, clean_text
from app.services.skill_dictionary import normalize_skill
from app.services.job_matcher import rank_jobs
from app.services.skill_gap import analyze_skill_gap
from app.services.resume_parser import generate_resume_feedback
from app.models.schemas import StudentProfile, JobItem, SkillGapRequest, ResumeFeedbackRequest

def run_tests():
    print("--- Running ML Service Direct Verification Tests ---")

    # 1. Skill Extraction Test
    sample_text = "Proficient in Python, React, and Node.js with MongoDB and Docker experience."
    skills = extract_skills_from_text(sample_text)
    print("Extracted skills:", skills)
    assert "python" in skills, "python should be extracted"
    assert "react" in skills, "react should be extracted"
    assert "node.js" in skills, "node.js should be extracted"
    assert "mongodb" in skills, "mongodb should be extracted"
    assert "docker" in skills, "docker should be extracted"
    print("[PASS] Skill extraction test passed!")

    # 2. Smart Job Recommendation Test
    student = StudentProfile(
        student_id="stud_01",
        skills=["react", "javascript", "tailwind", "node.js"],
        resume_text="Built full stack web application with React frontend and Express backend.",
        branch="Computer Science",
        cgpa=8.5,
        graduation_year=2026
    )

    jobs = [
        JobItem(
            job_id="job_frontend",
            title="Frontend React Developer",
            company_name="Tech Corp",
            description="Looking for a React developer experienced with JavaScript, Tailwind CSS, and REST APIs.",
            required_skills=["react", "javascript", "tailwind"],
            minimum_cgpa=7.5,
            eligible_branches=["computer science", "information technology"],
            graduation_year=2026
        ),
        JobItem(
            job_id="job_embedded",
            title="Embedded Systems Firmware Engineer",
            company_name="Hardware Inc",
            description="Requires microcontroller programming, C, C++, RTOS, and PCB design.",
            required_skills=["c", "c++", "rtos"],
            minimum_cgpa=8.0,
            eligible_branches=["electronics", "electrical"],
            graduation_year=2026
        )
    ]

    ranked = rank_jobs(student, jobs, top_n=5)
    print(f"Ranked {len(ranked)} jobs:")
    for r in ranked:
        print(f"  - {r.title} ({r.company_name}): Similarity = {r.similarity_score}%, Eligible = {r.explanation.is_eligible}")
    
    assert ranked[0].job_id == "job_frontend", "Frontend job should rank first"
    assert ranked[0].similarity_score > ranked[1].similarity_score, "Frontend similarity should exceed embedded similarity"
    assert ranked[0].explanation.is_eligible is True, "Student should be eligible for Frontend role"
    assert ranked[1].explanation.is_eligible is False, "Student should be ineligible for Embedded role due to branch mismatch"
    print("[PASS] Smart Job Recommendation test passed!")

    # 3. Skill Gap Analysis Test
    gap_req = SkillGapRequest(
        student_skills=["python", "pandas", "numpy"],
        resume_text="Experienced with Python data analysis, NumPy, and Pandas manipulation.",
        job_title="Machine Learning Engineer",
        job_description="We need an ML Engineer with deep knowledge of Python, Scikit-learn, TensorFlow, and Docker.",
        required_skills=["python", "scikit-learn", "tensorflow", "docker"]
    )
    gap_res = analyze_skill_gap(gap_req)
    print(f"Skill Gap Result for {gap_res.job_title}:")
    print(f"  Matching: {gap_res.matching_skills}")
    print(f"  Not Found: {gap_res.skills_not_found_in_profile}")
    print(f"  Coverage: {gap_res.skill_coverage_percentage}%")
    assert "python" in gap_res.matching_skills
    assert "tensorflow" in gap_res.skills_not_found_in_profile
    assert gap_res.skill_coverage_percentage > 0
    print("[PASS] Skill Gap Analysis test passed!")

    # 4. Resume Feedback Test
    fb_req = ResumeFeedbackRequest(
        resume_text="John Doe. Software Developer with experience in building scalable REST APIs using Python, FastAPI, and PostgreSQL. Engineered microservices and improved latency by 25%.",
        job_title="Backend Python Developer",
        job_description="Looking for Backend Engineer with FastAPI, PostgreSQL, and Docker containerization.",
        required_skills=["fastapi", "postgresql", "docker"]
    )
    fb_res = generate_resume_feedback(fb_req)
    print(f"Resume Feedback:")
    print(f"  Similarity: {fb_res.similarity_score}%")
    print(f"  Detected: {fb_res.detected_skills}")
    print(f"  Missing: {fb_res.missing_job_keywords}")
    print(f"  Word Count: {fb_res.word_count}")
    print(f"  Readability: {fb_res.readability_level}")
    print(f"  Suggestions: {fb_res.practical_suggestions[:2]}")
    assert fb_res.similarity_score > 0
    assert "fastapi" in fb_res.detected_skills
    assert "docker" in fb_res.missing_job_keywords
    print("[PASS] Resume Feedback test passed!")

    print("\n[ALL TESTS PASSED] ALL ML SERVICE UNIT & INTEGRATION TESTS COMPLETED SUCCESSFULLY!")

if __name__ == "__main__":
    run_tests()
