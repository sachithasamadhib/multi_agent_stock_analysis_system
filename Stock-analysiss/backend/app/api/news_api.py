import os
import aiohttp
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('NEWS_API_KEY', 'demo')
BASE_URL = 'https://newsapi.org/v2'

async def fetch_news_sentiment(symbols):
    if API_KEY == 'demo':
        return generate_mock_sentiment_data(symbols)
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_single_symbol_news(session, symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks)
    
    return {symbol: data for symbol, data in zip(symbols, results)}

async def fetch_single_symbol_news(session, symbol):
    url = f"{BASE_URL}/everything?q={symbol}+stock&sortBy=publishedAt&language=en&apiKey={API_KEY}"
    async with session.get(url) as response:
        data = await response.json()
        articles = data.get('articles', [])
        
        positive, negative, neutral = analyze_sentiment(articles)
        
        return {
            'articles': len(articles),
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'buy': 5 + int(10 * positive / (positive + negative + 1)),
            'hold': 3 + int(5 * neutral / (len(articles) + 1)),
            'sell': int(5 * negative / (positive + negative + 1))
        }

def analyze_sentiment(articles):
    positive_keywords = ['up', 'rise', 'gain', 'growth', 'profit', 'positive', 'buy', 'bullish']
    negative_keywords = ['down', 'fall', 'drop', 'loss', 'negative', 'sell', 'bearish']
    
    positive, negative, neutral = 0, 0, 0
    
    for article in articles:
        content = (article.get('title', '') + ' ' + article.get('description', '')).lower()
        pos_count = sum(1 for keyword in positive_keywords if keyword in content)
        neg_count = sum(1 for keyword in negative_keywords if keyword in content)
        
        if pos_count > neg_count:
            positive += 1
        elif neg_count > pos_count:
            negative += 1
        else:
            neutral += 1
    
    return positive, negative, neutral

def generate_mock_sentiment_data(symbols):
    import random

    result = {}
    
    for symbol in symbols:
        total_articles = random.randint(10, 50)
        positive = random.randint(0, total_articles)
        negative = random.randint(0, total_articles - positive)
        neutral = total_articles - positive - negative
        
        result[symbol] = {
            'articles': total_articles,
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'buy': 5 + int(10 * positive / total_articles),
            'hold': 3 + int(5 * neutral / total_articles),
            'sell': int(5 * negative / total_articles)
        }
    
    return result

