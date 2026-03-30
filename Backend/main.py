from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import re
app = FastAPI(
    title="TruthLens API",
    description="AI Hallucination & Citation Verification Engine"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class InputText(BaseModel):
    text: str

FACT_KEYWORDS = [
    "according to", "study", "research", "data",
    "report", "statistics", "evidence", "published"
]

CITATION_REGEX = r"(\(.*?et al\., \d{4}\)|\[\d+\]|doi:\S+)"
URL_REGEX = r"(https?://[^\s]+)"
AUTHOR_YEAR_REGEX = r"\b[A-Z][a-zA-Z]+ et al\., \d{4}\b"


def looks_factual(sentence: str) -> bool:
    return any(k in sentence.lower() for k in FACT_KEYWORDS)

def extract_keywords(text: str):
    return set(re.findall(r"[a-zA-Z]{4,}", text.lower()))

def citation_supports_sentence(sentence: str, citation: str) -> bool:
    s_words = extract_keywords(sentence)
    c_words = extract_keywords(citation)
    return len(s_words & c_words) >= 2

def find_citations(text: str):
    return re.findall(CITATION_REGEX, text)

def classify_citation(citation: str) -> str:
    if citation.lower().startswith("doi:"):
        return "verified"

    if citation.startswith("[") and citation.endswith("]"):
        return "fake-citation"

    if re.match(AUTHOR_YEAR_REGEX, citation):
        return "fake-citation"

    return "high-risk"

def split_sentences(text: str):
    urls = re.findall(URL_REGEX, text)
    placeholder_map = {}

    for i, url in enumerate(urls):
        placeholder = f"__URL{i}__"
        placeholder_map[placeholder] = url
        text = text.replace(url, placeholder)

    raw_sentences = re.split(r"[.!?]", text)
    sentences = []

    for s in raw_sentences:
        s = s.strip()
        if not s:
            continue

        for placeholder, url in placeholder_map.items():
            s = s.replace(placeholder, url)

        sentences.append(s)

    return sentences

@app.post("/verify")
def verify_text(data: InputText):
    text = data.text.strip()

    sentences = split_sentences(text)
    citations = find_citations(text)

    citation_labels = [classify_citation(c) for c in citations]
    fake_citations = citation_labels.count("fake-citation")

    results = []
    risky_claims = 0
    misleading_citations = 0

    for sentence in sentences:
        supporting = any(
            citation_supports_sentence(sentence, c) for c in citations
        )

        if looks_factual(sentence):
            if supporting:
                label = "verified"
                reason = "Claim supported by matching citation"

            elif citations:
                label = "misleading-citation"
                reason = "Citation present but does not support claim"
                misleading_citations += 1
                risky_claims += 1

            else:
                label = "high-risk"
                reason = "Factual claim without evidence"
                risky_claims += 1
        else:
            label = "verified"
            reason = "Non-factual or opinion statement"

        results.append({
            "text": sentence,
            "label": label,
            "reason": reason
        })

    trust_score = 100
    trust_score -= risky_claims * 20
    trust_score -= misleading_citations * 45
    trust_score -= fake_citations * 60
    trust_score = max(0, min(100, trust_score))

    return {
        "project": "TruthLens",
        "trust_score": trust_score,
        "summary": {
            "total_sentences": len(sentences),
            "risky_claims": risky_claims,
            "misleading_citations": misleading_citations,
            "citations_found": len(citations),
            "fake_citations": fake_citations
        },
        "sentences": results
    }
