from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.stock_analysis import analyze_stocks

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow the Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Stock Analysis API"}

@app.get("/api/analyze")
async def analyze():
    return await analyze_stocks()

