
//uses ExchangeRate-API to fetch currency conversion rates
const fetchCurrencyRates = async () => {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
  const data = await response.json();
  return data.conversion_rates;
}

export { fetchCurrencyRates };
