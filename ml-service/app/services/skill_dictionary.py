"""
Skill dictionary and taxonomy for CampusConnect ML Career Assistant.
Categorized and maintainable technical skills with alias normalization.
"""

SKILL_TAXONOMY = {
    "Programming Languages": [
        "python", "javascript", "typescript", "java", "c++", "c", "c#", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql"
    ],
    "Web & Frontend": [
        "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "angular",
        "html", "html5", "css", "css3", "tailwind", "tailwindcss", "bootstrap",
        "redux", "zustand", "sass", "webpack", "vite", "graphql", "rest api"
    ],
    "Backend & Frameworks": [
        "node.js", "nodejs", "express", "express.js", "fastapi", "django", "flask",
        "spring boot", "spring", "asp.net", "nest.js", "nestjs", "laravel", "rails"
    ],
    "Databases & Caching": [
        "mongodb", "postgresql", "postgres", "mysql", "sqlite", "redis", "cassandra",
        "oracle", "dynamodb", "elasticsearch", "neo4j", "firebase", "supabase"
    ],
    "Machine Learning & AI": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
        "pandas", "numpy", "matplotlib", "seaborn", "huggingface", "llm", "opencv",
        "xgboost", "data analysis", "data science"
    ],
    "DevOps & Cloud": [
        "docker", "kubernetes", "k8s", "aws", "amazon web services", "azure", "gcp",
        "google cloud", "ci/cd", "github actions", "jenkins", "terraform", "linux", "git"
    ],
    "Core CS & Systems": [
        "data structures", "algorithms", "dsa", "object oriented programming", "oops",
        "operating systems", "dbms", "computer networks", "system design", "distributed systems"
    ]
}

# Synonyms / Normalization Map
SKILL_ALIASES = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "node.js",
    "node": "node.js",
    "expressjs": "express",
    "express.js": "express",
    "cplusplus": "c++",
    "cpp": "c++",
    "golang": "go",
    "k8s": "kubernetes",
    "amazon web services": "aws",
    "google cloud platform": "gcp",
    "google cloud": "gcp",
    "postgres": "postgresql",
    "sklearn": "scikit-learn",
    "tf": "tensorflow",
    "natural language processing": "nlp",
    "ml": "machine learning",
    "dl": "deep learning",
    "dsa": "data structures & algorithms",
    "data structures": "data structures & algorithms",
    "algorithms": "data structures & algorithms",
    "oops": "object oriented programming",
    "tailwind": "tailwindcss"
}

# Flat set of all canonical skills (lowercase)
ALL_SKILLS = set()
for category, skills in SKILL_TAXONOMY.items():
    for s in skills:
        canon = SKILL_ALIASES.get(s.lower(), s.lower())
        ALL_SKILLS.add(canon)

def normalize_skill(skill: str) -> str:
    """Normalize skill name to standard canonical format."""
    clean = skill.strip().lower()
    return SKILL_ALIASES.get(clean, clean)

def get_learning_recommendation(skill: str) -> str:
    """Return learning topic guidance for a missing skill."""
    norm = normalize_skill(skill)
    recommendations = {
        "react": "Learn Component Lifecycle, Hooks (useState, useEffect, useContext), and State Management (Redux/Zustand).",
        "node.js": "Practice Event Loop, Async/Await patterns, Express middleware, and RESTful API architecture.",
        "python": "Master Object-Oriented Python, Collections, List Comprehensions, and Virtual Environments.",
        "docker": "Understand Containerization, Dockerfile creation, Multi-stage builds, and Docker Compose networking.",
        "kubernetes": "Study Pods, Deployments, Services, ConfigMaps, and cluster orchestration concepts.",
        "mongodb": "Learn Document Modeling, Aggregation Pipelines, Indexing strategies, and Mongoose ORM.",
        "postgresql": "Practice SQL Joins, Indexing (B-Tree/GIN), ACID Transactions, and Schema Normalization.",
        "scikit-learn": "Focus on Supervised/Unsupervised Algorithms, Cross-Validation, TF-IDF, and Hyperparameter Tuning.",
        "tensorflow": "Study Neural Network architectures, Tensor operations, Loss functions, and Transfer Learning.",
        "pytorch": "Learn Tensor autograd, Custom PyTorch Modules, DataLoader pipelines, and GPU training.",
        "aws": "Explore core services: EC2, S3, Lambda, API Gateway, IAM policies, and VPC fundamentals.",
        "data structures & algorithms": "Practice Arrays, Linked Lists, Binary Trees, Graph traversals (BFS/DFS), and Dynamic Programming.",
        "system design": "Study Scalability, Caching (Redis), Load Balancing, Message Queues (Kafka/RabbitMQ), and Database Sharding."
    }
    return recommendations.get(norm, f"Explore foundational tutorials and build a hands-on project demonstrating practical proficiency in {skill.title()}.")
