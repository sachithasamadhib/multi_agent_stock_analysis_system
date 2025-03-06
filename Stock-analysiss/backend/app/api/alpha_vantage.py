import os
import aiohttp
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')
BASE_URL = 'https://www.alphavantage.co/query'

async def fetch_stock_prices(symbols):
    if API_KEY == 'demo':
        return generate_mock_price_data(symbols)
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_single_stock(session, symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks)
    
    return {symbol: data for symbol, data in zip(symbols, results)}

async def fetch_single_stock(session, symbol):
    url = f"{BASE_URL}?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={API_KEY}"
    async with session.get(url) as response:
        data = await response.json()
        time_series = data.get('Time Series (Daily)', {})
        return [
            {
                'date': date,
                'open': float(values['1. open']),
                'high': float(values['2. high']),
                'low': float(values['3. low']),
                'close': float(values['4. close']),
                'volume': int(values['5. volume'])
            }
            for date, values in time_series.items()
        ]

def generate_mock_price_data(symbols):
    import random
    from datetime import datetime, timedelta

    result = {}
    
    for symbol in symbols:
        base_price = random.uniform(50, 500)
        daily_data = []
        
        for i in range(30):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            change = random.uniform(-0.03, 0.03)
            price = base_price * (1 + change)
            
            daily_data.append({
                'date': date,
                'open': price * (1 - random.uniform(0, 0.01)),
                'high': price * (1 + random.uniform(0, 0.01)),
                'low': price * (1 - random.uniform(0, 0.01)),
                'close': price,
                'volume': int(random.uniform(100000, 1000000))
            })
            
            base_price = price
        
        result[symbol] = daily_data
    
    return result

