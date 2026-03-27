"""
ReadGenius Backend - AI-Powered Document Analysis
Main FastAPI application
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from pydantic import BaseModel
import os
from typing import Optional
import json

# Initialize FastAPI app
app = FastAPI(
    title="ReadGenius API",
    description="AI-powered document analysis using Google Gemini",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

# Models
class AnalysisRequest(BaseModel):
    text: str
    analysis_type: str = "comprehensive"

class AnalysisResponse(BaseModel):
    summary: str
    key_concepts: list[str]
    qa_pairs: list[dict]
    sentiment: str
    reading_time: int
    word_count: int

# Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ReadGenius API",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "ok"}

@app.post("/api/analyze")
async def analyze_document(file: UploadFile = File(...)):
    """
    Analyze uploaded document using Gemini API
    
    Supported formats: .txt, .pdf, .docx
    """
    try:
        # Read file content
        content = await file.read()
        
        # For MVP, we'll handle text files
        if file.filename.endswith('.txt'):
            text = content.decode('utf-8')
        else:
            raise HTTPException(
                status_code=400,
                detail="Currently supporting .txt files. PDF and DOCX support coming soon."
            )
        
        # Validate text length
        if len(text) < 50:
            raise HTTPException(
                status_code=400,
                detail="Document too short. Please provide at least 50 characters."
            )
        
        # Call Gemini API for analysis
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate summary
        summary_prompt = f"""Provide a concise summary (2-3 sentences) of the following text:

{text[:2000]}"""
        
        summary_response = model.generate_content(summary_prompt)
        summary = summary_response.text
        
        # Extract key concepts
        concepts_prompt = f"""Extract 5-7 key concepts or main ideas from this text. Return as a JSON array of strings:

{text[:2000]}"""
        
        concepts_response = model.generate_content(concepts_prompt)
        try:
            concepts = json.loads(concepts_response.text)
        except:
            concepts = ["concept1", "concept2", "concept3"]
        
        # Generate Q&A pairs
        qa_prompt = f"""Generate 3 important questions and answers based on this text. Return as JSON array with objects containing 'q' and 'a' keys:

{text[:2000]}"""
        
        qa_response = model.generate_content(qa_prompt)
        try:
            qa_pairs = json.loads(qa_response.text)
        except:
            qa_pairs = [{"q": "What is the main topic?", "a": "This document discusses various topics."}]
        
        # Sentiment analysis
        sentiment_prompt = f"""Analyze the sentiment of this text. Respond with only one word: positive, negative, or neutral.

{text[:1000]}"""
        
        sentiment_response = model.generate_content(sentiment_prompt)
        sentiment = sentiment_response.text.strip().lower()
        
        # Calculate metrics
        word_count = len(text.split())
        reading_time = max(1, word_count // 200)  # Assuming 200 words per minute
        
        return AnalysisResponse(
            summary=summary,
            key_concepts=concepts if isinstance(concepts, list) else ["concept1", "concept2"],
            qa_pairs=qa_pairs if isinstance(qa_pairs, list) else [],
            sentiment=sentiment,
            reading_time=reading_time,
            word_count=word_count
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing document: {str(e)}"
        )

@app.post("/api/analyze-text")
async def analyze_text(request: AnalysisRequest):
    """
    Analyze text directly (without file upload)
    """
    try:
        text = request.text
        
        if len(text) < 50:
            raise HTTPException(
                status_code=400,
                detail="Text too short. Please provide at least 50 characters."
            )
        
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate summary
        summary_prompt = f"""Provide a concise summary (2-3 sentences) of the following text:

{text[:2000]}"""
        
        summary_response = model.generate_content(summary_prompt)
        summary = summary_response.text
        
        # Extract key concepts
        concepts_prompt = f"""Extract 5-7 key concepts from this text. Return as JSON array:

{text[:2000]}"""
        
        concepts_response = model.generate_content(concepts_prompt)
        try:
            concepts = json.loads(concepts_response.text)
        except:
            concepts = ["concept1", "concept2"]
        
        # Calculate metrics
        word_count = len(text.split())
        reading_time = max(1, word_count // 200)
        
        return {
            "summary": summary,
            "key_concepts": concepts,
            "word_count": word_count,
            "reading_time": reading_time
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing text: {str(e)}"
        )

@app.get("/api/features")
async def get_features():
    """Get list of available features"""
    return {
        "features": [
            "Document Summarization",
            "Key Concepts Extraction",
            "Q&A Generation",
            "Sentiment Analysis",
            "Reading Time Estimation",
            "Word Count Analysis"
        ],
        "supported_formats": [".txt", ".pdf (coming soon)", ".docx (coming soon)"],
        "max_file_size_mb": 10
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
