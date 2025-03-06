import asyncio
import random
from app.models.stock import AnalysisResult, StockData, MarketData

async def analyze_stocks():
    # Simulating analysis delay
    await asyncio.sleep(2)
    
    # Mock data for demonstration
    top_stocks = [
        StockData(symbol="AAPL", name="Apple Inc.", price=150.25, change=2.5, score=0.85, recommendation="Buy"),
        StockData(symbol="MSFT", name="Microsoft Corporation", price=300.50, change=-1.2, score=0.78, recommendation="Hold"),
        StockData(symbol="GOOGL", name="Alphabet Inc.", price=2800.75, change=1.8, score=0.82, recommendation="Buy"),
        StockData(symbol="AMZN", name="Amazon.com Inc.", price=3400.00, change=0.5, score=0.76, recommendation="Hold"),
        StockData(symbol="TSLA", name="Tesla, Inc.", price=750.80, change=3.2, score=0.88, recommendation="Strong Buy"),
    ]
    
    market_data = MarketData(
        indices={
            "S&P 500": {"value": 4200, "change": 0.5},
            "NASDAQ": {"value": 14000, "change": 0.7},
            "DOW": {"value": 34000, "change": 0.3}
        },
        sectors={
            "Technology": {"performance": 1.2, "weight": 25},
            "Healthcare": {"performance": 0.8, "weight": 15},
            "Finance": {"performance": 0.5, "weight": 20},
            "Consumer": {"performance": 0.3, "weight": 15},
            "Energy": {"performance": -0.2, "weight": 10},
            "Others": {"performance": 0.1, "weight": 15}
        }
    )
    
    return AnalysisResult(topStocks=top_stocks, marketData=market_data)

def analyze_technical_factors(price_data):
    scores = {}
    for symbol, data in price_data.items():
        if len(data) < 5:
            scores[symbol] = 0.5
            continue
        
        recent_prices = [d['close'] for d in data[:5]]
        price_change = (recent_prices[0] - recent_prices[-1]) / recent_prices[-1]
        volume_change = (data[0]['volume'] - data[4]['volume']) / data[4]['volume']
        
        score = 0.5 + (price_change * 5) + (volume_change * 0.2)
        scores[symbol] = max(0, min(1, score))
    
    return scores

def analyze_fundamental_factors(fundamentals_data):
    scores = {}
    for symbol, data in fundamentals_data.items():
        pe_score = 1 / (1 + max(0, data['peRatio'] - 15) / 10)
        growth_score = (data['epsGrowth'] + data['revenueGrowth']) / 2
        debt_score = 1 / (1 + data['debtToEquity'])
        
        score = (pe_score + growth_score + debt_score) / 3
        scores[symbol] = max(0, min(1, score))
    
    return scores

def analyze_sentiment_factors(sentiment_data):
    scores = {}
    for symbol, data in sentiment_data.items():
        total = data['positive'] + data['negative'] + data['neutral']
        if total == 0:
            scores[symbol] = 0.5
            continue
        
        sentiment_score = (data['positive'] - data['negative']) / total
        analyst_score = (data['buy'] - data['sell']) / (data['buy'] + data['hold'] + data['sell'])
        
        score = 0.5 + (sentiment_score * 0.25) + (analyst_score * 0.25)
        scores[symbol] = max(0, min(1, score))
    
    return scores

def assess_risk_factors(price_data):
    scores = {}
    for symbol, data in price_data.items():
        if len(data) < 20:
            scores[symbol] = 0.5
            continue
        
        prices = [d['close'] for d in data[:20]]
        returns = [(prices[i] - prices[i+1]) / prices[i+1] for i in range(len(prices)-1)]
        volatility = (sum(r**2 for r in returns) / len(returns)) ** 0.5
        
        score = 1 - (volatility * 10)
        scores[symbol] = max(0, min(1, score))
    
    return scores

def combine_scores(technical_scores, fundamental_scores, sentiment_scores, risk_scores):
    combined_scores = {}
    for symbol in technical_scores.keys():
        combined_scores[symbol] = (
            technical_scores[symbol] * 0.3 +
            fundamental_scores[symbol] * 0.3 +
            sentiment_scores[symbol] * 0.2 +
            risk_scores[symbol] * 0.2
        )
    return combined_scores

def get_top_stocks(combined_scores, price_data, fundamentals_data, n):
    sorted_symbols = sorted(combined_scores, key=combined_scores.get, reverse=True)[:n]
    
    top_stocks = []
    for symbol in sorted_symbols:
        price = price_data[symbol][0]['close']
        prev_price = price_data[symbol][1]['close']
        change = (price - prev_price) / prev_price * 100
        
        stock = StockData(
            symbol=symbol,
            name=fundamentals_data[symbol]['companyName'],
            price=price,
            change=change,
            score=combined_scores[symbol],
            recommendation="Buy" if combined_scores[symbol] > 0.6 else "Hold"
        )
        top_stocks.append(stock)
    
    return top_stocks

def summarize_market_data(price_data):
    # This is a simplified market data summary
    # In a real application, you would calculate these values from actual market data
    return MarketData(
        indices={
            "S&P 500": {"value": 4200, "change": 0.5},
            "NASDAQ": {"value": 14000, "change": 0.7},
            "DOW": {"value": 34000, "change": 0.3}
        },
        sectors={
            "Technology": {"performance": 1.2, "weight": 25},
            "Healthcare": {"performance": 0.8, "weight": 15},
            "Finance": {"performance": 0.5, "weight": 20},
            "Consumer": {"performance": 0.3, "weight": 15},
            "Energy": {"performance": -0.2, "weight": 10},
            "Others": {"performance": 0.1, "weight": 15}
        }
    )

