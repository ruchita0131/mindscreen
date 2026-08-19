# 🧠 MindScreen: AI-Powered Multimodal Mental Health Screening Platform

> **RVITM Major Project (BCS685)**  
> *An intelligent, multimodal mental health assessment web platform combining clinical questionnaires, transformer-based NLP, and acoustic voice analysis for early depression detection and risk triaging.*

---

## 📌 Executive Summary

**MindScreen** is a cutting-edge, privacy-conscious mental health screening application designed to assist in preliminary depression screening and wellness tracking. By leveraging a **multimodal late-fusion decision architecture**, MindScreen integrates three independent input streams:

1. 📋 **PHQ-9 Clinical Questionnaire** (Standardized medical assessment baseline)
2. 🧠 **MentalBERT Natural Language Processing** (Analysis of user-written thoughts & journal entries)
3. 🎙️ **Acoustic Voice Feature Extraction** (Pitch, MFCCs, and energy biomarkers extracted from voice recordings)

---

## ✨ Key Features

- **Multimodal Risk Prediction Engine**: Fuses clinical scores, text sentiments, and acoustic voice biomarkers to generate a triaged risk classification (`Minimal`, `Mild`, `Moderate`, `Severe`).
- **Explainable AI (SHAP Integration)**: Highlights exact keywords in user journal entries that influenced the AI model's prediction for complete model transparency.
- **Safety First & Crisis Overrides**: Instant detection of high-risk indicators or self-harm signals (PHQ-9 Q9) automatically triggers emergency helpline banners (iCall, NIMHANS).
- **Daily Mood Tracker & CBT Exercises**: Interactive daily mood logging with trend visualization (`Recharts`) and dynamic Cognitive Behavioral Therapy (CBT) activity recommendations based on user emotional state.
- **Assessment History & Longitudinal Tracking**: Complete historical logs allowing users to view risk progression over time with detailed probability distribution breakdowns.
- **Modern Glassmorphism UI**: High-impact, responsive dark-mode user interface designed with fluid micro-animations for a comforting user experience.
- **Seamless No-Login / Demo Mode**: Flexible configuration allowing instant access for academic demonstrations or secured JWT-authenticated user sessions.

---

## 🏗️ System Architecture & Multimodal Fusion

MindScreen uses a **Late Fusion (Decision-Level Fusion)** approach to combine multimodal data points cleanly without breaking if any single modality is omitted:

```
                      ┌────────────────────────────────────────┐
                      │            User Inputs                 │
                      └───────────────────┬────────────────────┘
                                          │
        ┌─────────────────────────────────┼─────────────────────────────────┐
        │                                 │                                 │
        ▼                                 ▼                                 ▼
┌──────────────┐                 ┌─────────────────┐               ┌────────────────┐
│   PHQ-9      │                 │  Journal Text   │               │ Voice Recording│
│ Questionnaire│                 │  (Free-form)    │               │  (.webm/.wav)  │
└───────┬──────┘                 └────────┬────────┘               └───────┬────────┘
        │                                 │                                 │
        ▼                                 ▼                                 ▼
┌──────────────┐                 ┌─────────────────┐               ┌────────────────┐
│ Rule-Based   │                 │ MentalBERT NLP  │               │ Librosa / Audio│
│ Scoring      │                 │ Model Inference │               │ Feature Engine │
└───────┬──────┘                 └────────┬────────┘               └───────┬────────┘
        │ (20% Weight)                    │ (50% Weight)                    │ (30% Weight)
        └────────────────────────┐        │        ┌────────────────────────┘
                                 ▼        ▼        ▼
                      ┌────────────────────────────────────────┐
                      │    Decision-Level Late Fusion Engine   │
                      │  Weighted Average + Crisis Safety Check │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │ Risk Level & SHAP Explanation Payload │
                      └────────────────────────────────────────┘
```

### Fusion Weight Distribution
$$ \text{Final Risk} = (0.50 \times \text{MentalBERT}) + (0.30 \times \text{Voice Acoustics}) + (0.20 \times \text{PHQ-9}) $$

> **Hard Safety Rule:** If PHQ-9 Question 9 (self-harm indicator) $> 0$ or total PHQ-9 score $\ge 20$, the system automatically enforces a **Severe Risk** classification regardless of text/audio weightings.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Vanilla CSS Variables, Dark Glassmorphism)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data Fetching**: `@tanstack/react-query`, `axios`

### **Backend**
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11)
- **ASGI Server**: Uvicorn
- **Database**: PostgreSQL (with automatic SQLite fallback for rapid local execution)
- **ORM**: SQLAlchemy + Alembic Migrations
- **Authentication**: OAuth2 with Password Hashing (`passlib`/`bcrypt`) & JWT (`python-jose`)
- **Rate Limiting**: `slowapi`

### **Machine Learning & Signal Processing**
- **NLP Transformer**: `mental/mental-roberta-base` via Hugging Face `transformers` & `torch`
- **Audio Processing**: `pydub` (WebM to WAV conversion via FFmpeg), `librosa` (MFCC, Pitch, RMS extraction)
- **Model Dataset Benchmark**: Trained & validated against DAIC-WOZ clinical audio/text corpora
- **Interpretability**: SHAP (SHapley Additive exPlanations)

---

## 📂 Project Structure

```
major project antigravity/
├── backend/
│   ├── main.py                  # FastAPI Application Entry & Routing
│   ├── config.py                # Environment Configuration & Settings
│   ├── database.py              # SQLAlchemy Database Setup & SQLite Fallback
│   ├── models/                  # Database Schemas (User, Assessment, Mood)
│   ├── routers/                 # API Endpoints (auth, predict, phq, mood, health)
│   ├── services/
│   │   ├── ml_service.py        # MentalBERT Model Inference & SHAP Generator
│   │   ├── audio_service.py     # Librosa Feature Extraction & Audio Analysis
│   │   ├── fusion_service.py    # Multimodal Decision-Level Late Fusion Logic
│   │   ├── phq_service.py       # Clinical PHQ-9 Rule-based Scoring Engine
│   │   └── auth_service.py      # JWT Authentication & Demo-mode Security
│   └── ml_models/               # PyTorch Model Checkpoints (.pt)
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Main Router & Application Provider
│   │   ├── main.tsx             # Entry point
│   │   ├── index.css            # Dark Glassmorphism CSS Design Tokens
│   │   ├── components/          # Reusable UI (Sidebar, Layout, Buttons, Cards)
│   │   ├── pages/               # Pages (Landing, Register, Login, Dashboard, 
│   │   │                        #        Assessment, Results, History, MoodTracker)
│   │   └── api/                 # Axios Client & API Contracts
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml           # Containerized Database & Deployment Setup
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.11 recommended)
- [FFmpeg](https://ffmpeg.org/) (Required for voice WebM-to-WAV conversion)

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy pydantic torch transformers librosa pydub python-jose passlib bcrypt slowapi

# Run the FastAPI server
python main.py
```
> The API will start running at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
> The application will start running at `http://localhost:5173`.

---

## ⚡ API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | API Health Check |
| `POST` | `/api/auth/register` | User Account Registration |
| `POST` | `/api/auth/login` | User Login & JWT Retrieval |
| `POST` | `/api/predict/text` | Text-only MentalBERT Analysis |
| `POST` | `/api/predict/fused` | Multimodal Prediction (PHQ-9 + Text + Audio) |
| `GET` | `/api/phq/history` | Historical Assessment Records |
| `POST` | `/api/mood/log` | Daily Mood Log Entry |

---

## ⚠️ Medical Disclaimer

> **MindScreen is an academic research application created for demonstration purposes.**  
> It is **not** a certified diagnostic tool and does **not** replace professional medical advice, diagnosis, or treatment. If you or someone you know is in distress or experiencing a mental health crisis, please contact emergency services or reach out to a professional mental health provider immediately:
> - **iCall (India)**: +91 9152987821
> - **NIMHANS Helpline**: 080-46110007
> - **Vandrevala Foundation**: 1860-2662-345

---

## 📜 License & Acknowledgments

Developed as part of the **RVITM Major Project (BCS685)**.  
Leverages datasets and pre-trained research models including the **DAIC-WOZ Distress Analysis Interview Corpus** and Hugging Face's `mental/mental-roberta-base`.
