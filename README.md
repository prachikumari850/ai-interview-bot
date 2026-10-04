# AI Interview Bot

AI Interview Bot is an AI powered mock interview platform designed to help candidates practice technical and HR interviews in a realistic environment.

The platform uses the candidate's resume, selected interview preferences, predefined questions, and candidate answers to create a personalized and adaptive interview experience.

## Overview

The system allows a candidate to upload a resume, configure an interview, answer questions using voice, and receive an AI generated performance report.

The interview can adapt based on the candidate's answers. Questions can be selected from a predefined question bank or generated based on the candidate's resume and projects.

The system also analyzes speech and observable camera based metrics to provide additional interview feedback.

## Features

Resume based interview personalization

Resume parsing for skills, education, experience, projects, certifications and achievements

Technical and HR interview modes

Field and role based interview configuration

Difficulty selection

Adaptive difficulty based on candidate performance

Predefined question bank

Resume specific questions

Project specific questions

AI generated follow up questions

Dynamic interview flow

Speech to text

Speech metrics such as speaking duration, response time, speaking rate, pauses and filler words

Camera based observable metrics

Face visibility tracking

Camera attention estimation

Head movement and orientation tracking

Interview timer

Question progress tracking

AI based answer evaluation

Question wise feedback

Technical performance analysis

Communication analysis

Final interview report

Strength identification

Improvement area identification

## Technology Stack

### Frontend

React

Vite

Tailwind CSS

JavaScript

MediaPipe

Browser Media APIs

### Backend

Python

FastAPI

Pydantic

SQLAlchemy

SQLite

PyMuPDF

### Artificial Intelligence

Groq API

Large Language Models

The AI model is used for resume analysis, question generation, answer evaluation, follow up questions and final report generation.

### Development Tools

Git

GitHub

Visual Studio Code

## System Architecture

The application follows a frontend and backend architecture.

```text
Candidate
    |
    v
React Frontend
    |
    v
FastAPI Backend
    |
    +--------------------+
    |                    |
    v                    v
Resume Parser        Interview Engine
    |                    |
    v                    +----------------+
Candidate Profile        |
                         v
                  Question Bank
                         |
                         v
                    Groq AI
                         |
             +-----------+-----------+
             |                       |
             v                       v
       Answer Evaluation      Follow Up Questions
             |
             v
      Speech and Camera Metrics
             |
             v
       Interview Report
             |
             v
        React Frontend
```

## Interview Workflow

The interview process follows these stages.

```text
Resume Upload
     |
     v
Resume Parsing
     |
     v
Candidate Profile Creation
     |
     v
Interview Configuration
     |
     v
Interview Starts
     |
     v
Question Selection
     |
     v
Candidate Answer
     |
     v
Answer Evaluation
     |
     v
Adaptive Difficulty
     |
     v
Follow Up Question
     |
     v
Next Question
     |
     v
Interview Completion
     |
     v
Final Report
```

## Interview Configuration

The candidate can configure the interview using parameters such as:

Field

Experience level

Interview type

Difficulty

Interview duration

Supported interview types include:

Technical

HR

Technical and HR

Supported difficulty modes include:

Easy

Medium

Hard

Adaptive

## Resume Processing

The resume is processed by the backend to create a structured candidate profile.

The profile can contain:

Name

Education

Skills

Technologies

Experience

Projects

Certifications

Achievements

This profile is used to personalize the interview.

For example, if a candidate mentions a YOLO based computer vision project, the system can generate questions related to YOLO, computer vision, model selection, dataset preparation and project implementation.

## Question System

The project uses a hybrid question generation system.

The predefined question bank provides structure and control over the interview.

The candidate resume provides personalization.

The candidate answer provides context for follow up questions.

The Groq powered AI provides language understanding and question generation.

The interview engine controls the overall interview flow.

This approach prevents the interview from becoming completely unpredictable while still allowing dynamic questions.

## Adaptive Interview System

In adaptive mode, the interview difficulty can change based on the candidate's performance.

The answer is evaluated using factors such as:

Correctness

Relevance

Depth

The interview engine uses these scores to adjust the difficulty of subsequent technical questions.

Strong performance can increase the difficulty.

Weak performance can decrease the difficulty.

The system can also generate follow up questions when additional clarification or deeper evaluation is useful.

## Speech Analysis

The application can collect speech related metrics during the interview.

These metrics can include:

Response time

Answer duration

Speaking time

Speaking rate

Number of pauses

Total pause duration

Filler word count

Speech to text transcript

These metrics are used as observable communication indicators in the final report.

## Camera Analysis

The frontend can use browser based computer vision to collect lightweight observable camera metrics.

These can include:

Face visibility

Estimated camera attention

Head orientation

Head movement

Movement frequency

The system does not need to send raw camera video to the AI model.

Only relevant metrics can be sent to the backend for report generation.

The system should not use these metrics to make unsupported conclusions about emotions, honesty, intelligence, mental state or personality.

## AI Processing

Groq is used as the primary AI service.

The backend can use the AI model for:

Resume profile extraction

Personalized question generation

Project question generation

Answer evaluation

Follow up question generation

Final interview report generation

The Groq API key is stored only on the backend in the environment configuration.

The API key must never be exposed in the React frontend.

## Project Structure

```text
ai-interview-bot
|
+-- frontend
|   |
|   +-- src
|       |
|       +-- components
|       +-- hooks
|       +-- pages
|       +-- services
|       +-- App.jsx
|       +-- main.jsx
|       +-- index.css
|   |
|   +-- package.json
|
+-- backend
|   |
|   +-- app
|       |
|       +-- api
|       +-- interview
|       +-- models
|       +-- schemas
|       +-- services
|       +-- main.py
|   |
|   +-- questions
|       +-- bank.json
|   |
|   +-- requirements.txt
|   +-- .env
|   +-- try_engine.py
|
+-- .gitignore
+-- README.md
```

## Backend Services

The backend is divided into separate responsibilities.

Resume service handles resume extraction and candidate profile creation.

LLM service handles communication with the Groq API.

Interview engine controls interview flow, question selection, adaptive difficulty and follow up questions.

Speech service handles speech related processing.

Vision service handles camera related metrics.

Report service creates the final interview evaluation.

## API Flow

The planned API structure includes endpoints such as:

```text
POST /resume
```

Uploads and processes a candidate resume.

```text
POST /interview/start
```

Starts an interview using the selected configuration and candidate profile.

```text
POST /interview/answer
```

Submits a candidate answer for evaluation.

```text
POST /interview/metrics
```

Sends speech and camera metrics.

```text
GET /interview/report
```

Returns the final interview report.

## Installation

### Frontend

Navigate to the frontend directory.

```powershell
cd frontend
```

Install dependencies.

```powershell
npm install
```

Start the development server.

```powershell
npm run dev
```

### Backend

Navigate to the backend directory.

```powershell
cd backend
```

Create a virtual environment.

```powershell
python -m venv venv
```

Activate the virtual environment.

```powershell
venv\Scripts\activate
```

Install dependencies.

```powershell
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory.

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
```

Start the FastAPI server.

```powershell
uvicorn app.main:app --reload
```

## Environment Variables

The backend requires the following environment variables.

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model
```

Never commit the actual `.env` file to GitHub.

The project `.gitignore` should contain:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
venv/
__pycache__/
```

## Running the Project

Start the backend.

```powershell
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Start the frontend in another terminal.

```powershell
cd frontend
npm run dev
```

Open the frontend development URL shown by Vite in the terminal.

## Development Approach

The project is developed incrementally.

The development process follows these stages:

Frontend setup

Landing page

Interview setup

Interview interface

Report interface

FastAPI backend

Resume parsing

Groq integration

Question bank

Interview engine

Adaptive interview system

Personalized questions

Follow up questions

Speech to text

Speech metrics

Camera metrics

Final report

Frontend and backend integration

Testing and optimization

## Future Improvements

Voice based AI interviewer

More interview domains

More specialized question banks

Advanced resume parsing

Improved speech analysis

Real time interview feedback

Additional programming and coding questions

Company specific interview modes

Interview history

Candidate progress tracking

Authentication

Cloud deployment

Database based interview history

## Security Considerations

API keys must remain on the backend.

Raw camera and microphone recordings should not be stored unless explicitly required.

Only required interview metrics should be transmitted to the backend.

Candidate resumes and interview data should be handled securely.

The application should avoid making unsupported conclusions from facial or voice signals.

## Project Goal

The goal of AI Interview Bot is to provide an accessible and personalized interview practice platform that simulates realistic technical and HR interviews.

The system combines structured interview logic with generative AI so that interviews remain controlled, relevant and personalized while adapting to the candidate's responses.
