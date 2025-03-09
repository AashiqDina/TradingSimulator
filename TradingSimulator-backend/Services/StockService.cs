namespace TradingSimulator_Backend.Services
{
    using Newtonsoft.Json;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;
    using System;

    public class StockService : IStockService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "nope";
        
        // Cache for storing stock prices
        private static Dictionary<string, (decimal? Price, DateTime Timestamp)> _stockCache = new Dictionary<string, (decimal?, DateTime)>();
        
        public StockService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Method to fetch the stock price for a single symbol
        public async Task<decimal?> GetStockPriceAsync(string symbol)
        {
            // Check if the stock price is already cached and still valid (within 10 minutes)
            if (_stockCache.ContainsKey(symbol) && DateTime.Now - _stockCache[symbol].Timestamp < TimeSpan.FromMinutes(1))
            {
                return _stockCache[symbol].Price; // Return the cached price if valid
            }

            // Fetch the price from the external API if not cached or cache expired
            var price = await FetchStockPriceFromApi(symbol);

            // Cache the price with the current timestamp
            _stockCache[symbol] = (price, DateTime.Now);

            return price;
        }

        // Method to get stock prices for multiple symbols
        public async Task<Dictionary<string, decimal?>> GetMultipleStockPricesAsync(List<string> symbols)
        {
            var stockPrices = new Dictionary<string, decimal?>();

            // For each symbol, check the cache first and then fetch from API if necessary
            foreach (var symbol in symbols)
            {
                if (_stockCache.ContainsKey(symbol) && DateTime.Now - _stockCache[symbol].Timestamp < TimeSpan.FromMinutes(480))
                {
                    stockPrices[symbol] = _stockCache[symbol].Price; // Use cached value
                }
                else
                {
                    var price = await FetchStockPriceFromApi(symbol);
                    stockPrices[symbol] = price;

                    // Cache the price and timestamp
                    _stockCache[symbol] = (price, DateTime.Now);
                }
            }

            return stockPrices;
        }

        // Helper method to fetch a stock price from the API
        private async Task<decimal?> FetchStockPriceFromApi(string symbol)
        {
            var url = $"https://api.twelvedata.com/price?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw API Response: {json}");

            try
            {
                var stockData = JsonConvert.DeserializeObject<StockResponse>(json);
                return stockData?.Price;
            }
            catch (JsonException)
            {
                return null;
            }
        }
    }

    public class StockResponse
    {
        [JsonProperty("price")]
        public decimal? Price { get; set; }
    }
}
