from pydantic import BaseModel
from typing import List, Dict

class StockData(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    score: float
    recommendation: str

class MarketData(BaseModel):
    indices: Dict[str, Dict[str, float]]
    sectors: Dict[str, Dict[str, float]]

class AnalysisResult(BaseModel):
    topStocks: List[StockData]
    marketData: MarketData

