# AI-Citation-Verifier

# Problem Statement

Generative AI models are widely used for research, learning, and decision-making.  
However, these systems often generate **confident but factually incorrect information**, including **fake citations, non-existent references, and misleading links** that appear legitimate but cannot be verified.

This lack of reliability makes it difficult for users to trust AI-generated content and can lead to:
- Misinformation
- Academic and research errors
- Legal and ethical risks

There is a strong need for a system that can **detect, flag, and explain unreliable AI-generated claims and citations** in a transparent and user-friendly manner.

---

# Project Name

**TruthLens**

---

## Project Overview

**TruthLens** is a web-based application that analyzes AI-generated text to detect hallucinations, misleading claims, and unreliable citations.

Instead of acting as a black-box verifier, TruthLens focuses on **sentence-level explainability**, allowing users to understand *why* certain content is considered trustworthy or risky.

### Key Features
- Sentence-level claim analysis
- Detection of misleading or unverifiable citations
- Trust score with animated confidence bar
- Contextual explanation of score (low / medium / high)
- Apple-style scroll storytelling UI
- Transparent and explainable output

TruthLens is designed for students, researchers, journalists, educators, and anyone relying on AI-generated content.

---

## Setup and Installation Instructions

### Prerequisites
- Python 3.8 or above
- pip
- A modern web browser
- Git

---

### Backend Setup

1. Navigate to the project directory:
   ```bash
   cd citation
2. Create and activate a virtual Enivironment
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
3. Install Dependenies
   ```bash
   pip install -r requirements.txt

4.	Start the backend server:
   ```bash
   python main.py
   ```

---

### Frontend Setup

1.	Navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Open index.html using:
	•	VS Code Live Server (recommended), or
	•	Any local static server, or
	•	Directly in a browser

---

### Usage Instructions

	1.	Open the TruthLens web interface.
	2.	Paste AI-generated text into the input box.
	3.	Click “Verify with TruthLens”.
	4.	TruthLens will:
		•	Analyze each sentence individually
		•	Detect misleading or unsupported claims
		•	Compute a trust score
		•	Display a confidence bar
		•	Explain why the score is low, medium, or high
		•	Highlight risky sentences clearly

---

### Score Interpretation

	•	🟢 High Confidence – Claims are well-supported or low-risk
	•	🟡 Medium Confidence – Some claims lack strong evidence
	•	🔴 Low Confidence – Misleading or unverifiable citations detected
---

### Screenshots

<img width="1399" height="748" alt="Screenshot 2026-01-04 at 1 54 06 PM" src="https://github.com/user-attachments/assets/4cd0db0e-16bb-457e-a2f4-58298b2bd016" />
<img width="1446" height="770" alt="Screenshot 2026-01-04 at 1 54 30 PM" src="https://github.com/user-attachments/assets/6943c888-49e2-468e-b26b-e199d03c129c" />
<img width="1459" height="784" alt="Screenshot 2026-01-04 at 1 54 46 PM" src="https://github.com/user-attachments/assets/10e2e171-70cd-481d-b299-6a2f4268dc4e" />
<img width="1469" height="723" alt="Screenshot 2026-01-04 at 1 56 07 PM" src="https://github.com/user-attachments/assets/08b2392c-1d42-461c-8276-cd29213b4125" />
<img width="1457" height="734" alt="Screenshot 2026-01-04 at 1 55 30 PM" src="https://github.com/user-attachments/assets/c9736324-21b5-465a-8aed-73b18f73cb6d" />
<img width="1428" height="734" alt="Screenshot 2026-01-04 at 1 57 56 PM" src="https://github.com/user-attachments/assets/3b04ace2-881c-41b7-98e4-df75c493438e" />
