import os
import aiohttp
import asyncio
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('FMP_API_KEY', 'demo')
BASE_URL = 'https://financialmodelingprep.com/api/v3'

async def fetch_company_fundamentals(symbols):
    if API_KEY == 'demo':
        return generate_mock_fundamentals_data(symbols)
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_single_company(session, symbol) for symbol in symbols]
        results = await asyncio.gather(*tasks)
    
    return {symbol: data for symbol, data in zip(symbols, results)}

async def fetch_single_company(session, symbol):
    profile_url = f"{BASE_URL}/profile/{symbol}?apikey={API_KEY}"
    ratios_url = f"{BASE_URL}/ratios/{symbol}?limit=1&apikey={API_KEY}"
    growth_url = f"{BASE_URL}/financial-growth/{symbol}?limit=4&apikey={API_KEY}"
    
    async with session.get(profile_url) as profile_response, \
               session.get(ratios_url) as ratios_response, \
               session.get(growth_url) as growth_response:
        profile_data = await profile_response.json()
        ratios_data = await ratios_response.json()
        growth_data = await growth_response.json()
    
    profile = profile_data[0] if profile_data else {}
    ratios = ratios_data[0] if ratios_data else {}
    growth = growth_data if growth_data else []
    
    return {
        'companyName': profile.get('companyName', symbol),
        'sector': profile.get('sector', 'Unknown'),
        'industry': profile.get('industry', 'Unknown'),
        'marketCap': profile.get('mktCap', 0),
        'peRatio': profile.get('pe', 0),
        'dividend': profile.get('lastDiv', 0),
        'beta': profile.get('beta', 1),
        'priceToBook': ratios.get('priceToBookRatio', 0),
        'priceToSales': ratios.get('priceToSalesRatio', 0),
        'debtToEquity': ratios.get('debtToEquity', 0),
        'epsGrowth': calculate_growth(growth, 'epsgrowth'),
        'revenueGrowth': calculate_growth(growth, 'revenuegrowth'),
        'netIncomeGrowth': calculate_growth(growth, 'netIncomegrowth')
    }

def calculate_growth(growth_data, field):
    values = [item.get(field, 0) for item in growth_data if item.get(field) is not None]
    return sum(values) / len(values) if values else 0

def generate_mock_fundamentals_data(symbols):
    import random

    result = {}
    
    for symbol in symbols:
        result[symbol] = {
            'companyName': f"{symbol} Inc.",
            'sector': random.choice(['Technology', 'Healthcare', 'Finance', 'Consumer Goods']),
            'industry': 'Various',
            'marketCap': random.uniform(1e9, 1e12),
            'peRatio': random.uniform(10, 50),
            'dividend': random.uniform(0, 5),
            'beta': random.uniform(0.5, 2),
            'priceToBook': random.uniform(1, 10),
            'priceToSales': random.uniform(1, 20),
            'debtToEquity': random.uniform(0, 2),
            'epsGrowth': random.uniform(-0.1, 0.3),
            'revenueGrowth': random.uniform(-0.05, 0.2),
            'netIncomeGrowth': random.uniform(-0.1, 0.25)
        }
    
    return result

