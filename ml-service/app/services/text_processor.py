"""
NLP and Text Preprocessing Utilities for CampusConnect ML Service.
"""
import re
from typing import List, Set
from app.services.skill_dictionary import ALL_SKILLS, SKILL_ALIASES, normalize_skill

# Standard domain-relevant stopwords
STOPWORDS: Set[str] = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but",
    "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from",
    "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself", "him",
    "himself", "his", "how", "i", "if", "in", "into", "is", "it", "its", "itself", "just", "me",
    "more", "most", "my", "myself", "no", "nor", "not", "now", "of", "off", "on", "once", "only",
    "or", "other", "our", "ours", "ourselves", "out", "over", "own", "s", "same", "she", "should",
    "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves", "then",
    "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why",
    "will", "with", "would", "you", "your", "yours", "yourself", "yourselves", "role", "candidate",
    "responsibilities", "requirements", "experience", "looking", "team", "work", "working", "years"
}

def clean_text(text: str) -> str:
    """Preprocess and clean raw text by removing URLs, special symbols, and excess whitespace."""
    if not text:
        return ""
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    # Remove email addresses
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', ' ', text)
    # Normalize slashes and hyphens for tech terms (e.g., node.js, c++, c#)
    # Replace non-alphanumeric chars except those in tech terms: +, #, ., /
    text = re.sub(r'[^\w\s\+\#\./]', ' ', text)
    # Normalize multiple whitespaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extract technical skills from free-form text using taxonomy matching and alias normalization.
    Uses regex boundaries to avoid false positives (e.g., 'c' matching inside 'react').
    """
    if not text:
        return []
    
    cleaned = clean_text(text)
    detected = set()

    # Search for all canonical skills and aliases
    search_terms = sorted(list(ALL_SKILLS) + list(SKILL_ALIASES.keys()), key=lambda x: len(x), reverse=True)

    for term in search_terms:
        # Construct pattern handling special chars like +, #, .
        escaped_term = re.escape(term)
        # Use word boundaries or start/end of string
        pattern = rf'(?:^|[\s,;/()\[\]]){escaped_term}(?:[\s,;/()\[\].]|$)'
        if re.search(pattern, cleaned, re.IGNORECASE):
            canonical = normalize_skill(term)
            detected.add(canonical)

    return sorted(list(detected))

def tokenize_and_filter(text: str) -> List[str]:
    """Tokenize clean text and remove stopwords."""
    words = re.findall(r'[a-zA-Z0-9\+\#\.]+', clean_text(text))
    return [w for w in words if len(w) > 1 and w not in STOPWORDS]
