namespace TradingSimulator_Backend.Services
{
    using Newtonsoft.Json;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;
    using System;
    using TradingSimulator_Backend.Models;

    public class StockService : IStockService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey = "Nope";
        
        // Cache for storing stock prices
        private static Dictionary<string, (decimal? Price, DateTime Timestamp)> _stockCache = new Dictionary<string, (decimal? Price, DateTime Timestamp)>();
        private static Dictionary<string, (string? Logo, string? Name)> _stockImageCache = new Dictionary<string, (string? Logo, string? Name)>();
        private static Dictionary<string, StockApiInfo?> _stockApiInfoCache = new Dictionary<string, StockApiInfo?>();


        
        public StockService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Method to fetch the stock price for a single symbol
        public async Task<decimal?> GetStockPriceAsync(string symbol)
        {
            // Check if the stock price is already cached and still valid (within 10 minutes)
            if (_stockCache.ContainsKey(symbol) && DateTime.Now - _stockCache[symbol].Timestamp < TimeSpan.FromMinutes(480))
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
                    stockPrices[symbol] = _stockCache[symbol].Price; 
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

    public async Task<string?> GetStockImage(string symbol)
    {
        if (_stockImageCache.ContainsKey(symbol)){
            Console.WriteLine($"Before: {_stockImageCache[symbol].Logo}");
            return _stockImageCache[symbol].Logo;
        }

        var (StockImage, StockName) = await FetchLogoAndNameFromApi(symbol);
        
        if (StockImage == null){
            Console.WriteLine($"No image found for {symbol}.");
        }
        Console.WriteLine($"After: {StockImage}");

        if (StockImage != null){
            _stockImageCache[symbol] = (StockImage, StockName);
        }
        Console.WriteLine($"Cache after update: {_stockImageCache.ContainsKey(symbol)}");

        return StockImage;
    }

    public async Task<string?> ConvertSymbolToName(string symbol)
    {
        if(_stockApiInfoCache.ContainsKey(symbol)){
            return _stockApiInfoCache[symbol].Name;
        }

        var result = await FetchStockInfoFromApi(symbol);

        if(result == null){
            Console.WriteLine("Unable to find name, returning symbol");
            return symbol;
        }

        _stockApiInfoCache[symbol] = result;

        return result.Name;
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

        private async Task<(string, string)> FetchLogoAndNameFromApi(string symbol)
        {
            var url = $"https://api.twelvedata.com/logo?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error: {response.StatusCode}");
                return (null, null);
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw API Response: {json}");

            try
            {
                var stockData = JsonConvert.DeserializeObject<StockResponseNameLogo>(json);

                if (stockData?.Meta?.name == null)
                {
                    return (stockData?.url, "Unknown Company");
                }

                return (stockData.url, stockData.Meta.name);
            }
            catch (JsonException ex)
            {
                Console.WriteLine($"Error deserializing response for symbol {symbol}: {ex.Message}");
                return (null, null);
            }
        }

        private async Task<StockApiInfo> FetchStockInfoFromApi(string symbol){
            var url = $"https://api.twelvedata.com/quote?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if(!response.IsSuccessStatusCode){
                Console.WriteLine($"Error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            
            try{
                var stockInfo = JsonConvert.DeserializeObject<StockApiInfo>(json);

                return stockInfo;
            }
            catch{
                return null;
            }
        }

    }
}
