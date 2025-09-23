namespace TradingSimulator_Backend.Services
{
    using Newtonsoft.Json;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Newtonsoft.Json.Linq;
    using System;
    using TradingSimulator_Backend.Models;
    using TradingSimulator_Backend.Data;

    public class StockService : IStockService
    {
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;
        private readonly string _apiKey = "";
        
        private static Dictionary<string, (decimal? Price, DateTime Timestamp)> _stockCache = new Dictionary<string, (decimal? Price, DateTime Timestamp)>();
        private static Dictionary<string, (string? Logo, string? Name)> _stockImageCache = new Dictionary<string, (string? Logo, string? Name)>();
        private static Dictionary<string, StockApiInfo?> _stockApiInfoCache = new Dictionary<string, StockApiInfo?>();
        private static Dictionary<string, CompanyProfile?> _CompanyDetailsCache = new Dictionary<string, CompanyProfile?>();
        private static DateTime? StockInfoDateTime = null;


        
        public StockService(HttpClient httpClient, AppDbContext appDbContext)
        {
            _httpClient = httpClient;
            _context = appDbContext;
        }

        public Dictionary<string, DateTime> GetAllLastUpdated()
        {
            return _stockCache.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Timestamp
            );
        }

        public async Task<decimal?> GetStockPriceAsync(string symbol)
        {
            if (_stockCache.ContainsKey(symbol) && DateTime.Now - _stockCache[symbol].Timestamp < TimeSpan.FromMinutes(480))
            {
                return _stockCache[symbol].Price;
            }

            var price = await FetchStockPriceFromApi(symbol);

            _stockCache[symbol] = (price, DateTime.Now);

            return price;
        }

        public async Task<Dictionary<string, decimal?>> GetMultipleStockPricesAsync(List<string> symbols)
        {
            var stockPrices = new Dictionary<string, decimal?>();

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

            var dbStock = await _context.StockLogoName.FindAsync(symbol);

            if (dbStock != null && !string.IsNullOrWhiteSpace(dbStock.Logo))
            {
                Console.WriteLine($"Found {symbol} name in DB");
                return dbStock.Logo;
            }

            var (StockImage, StockName) = await FetchLogoAndNameFromApi(symbol);
            
            if (StockImage == null || string.IsNullOrWhiteSpace(StockImage)){
                Console.WriteLine($"No image found for {symbol}.");
            }

            if (StockImage != null){
                _stockImageCache[symbol] = (StockImage, StockName);
                dbStock = await _context.StockLogoName.FindAsync(symbol);
                if (dbStock == null)
                    {
                        var stock = new StockLogoName
                        {
                            Symbol = symbol,
                            Name = null,
                            Logo = StockImage
                        };
                        _context.StockLogoName.Add(stock);
                    }
                    else
                    {
                        dbStock.Logo = StockImage;
                    }
                    await _context.SaveChangesAsync();
            }

            return StockImage;
        }

        public async Task<string?> ConvertSymbolToName(string symbol)
        {
            if(_stockApiInfoCache.ContainsKey(symbol)){
                return _stockApiInfoCache[symbol].Name;
            }

            var dbStock = await _context.StockLogoName.FindAsync(symbol);

            if (dbStock != null && !string.IsNullOrWhiteSpace(dbStock.Name))
                {
                    Console.WriteLine($"Found {symbol} name in DB");
                    return dbStock.Name;
                }

            var result = await FetchStockInfoFromApi(symbol);

            if(result == null || string.IsNullOrWhiteSpace(result.Name)){
                Console.WriteLine("Unable to find name, returning symbol");
                return symbol;
            }

            if(result != null){
                Console.WriteLine($"Fetched {symbol} → Name: '{result.Name}'");
                _stockApiInfoCache[symbol] = result;
                dbStock = await _context.StockLogoName.FindAsync(symbol);
                if (dbStock == null)
                    {
                        var stock = new StockLogoName
                        {
                            Symbol = symbol,
                            Name = result.Name,
                            Logo = null
                        };
                        _context.StockLogoName.Add(stock);
                    }
                    else
                    {
                        dbStock.Name = result.Name;
                    }
                    await _context.SaveChangesAsync();
            }

            return result.Name;
        }

        public async Task<(DateTime? LastUpdated, decimal? LowPrice, decimal? HighPrice, string? FiftyTwoWeekRange, decimal? ClosePrice, decimal? PercentChange)> GetQuickData(string symbol)
        {
            if (StockInfoDateTime == null)
            {
                StockInfoDateTime = DateTime.Now;
            }

            if (_stockApiInfoCache.ContainsKey(symbol) && (DateTime.Now - StockInfoDateTime) < TimeSpan.FromMinutes(480))
            {
                var cachedData = _stockApiInfoCache[symbol];
                Console.WriteLine(cachedData.FiftyTwoWeek);
                return (TryParseDateTime(cachedData.Datetime), cachedData.Low, cachedData.High, cachedData.FiftyTwoWeek?.Range, cachedData.Close, cachedData.PercentChange);
            }

            var result = await FetchStockInfoFromApi(symbol);

            if (result == null)
            {
                Console.WriteLine("Unable to find information");
                return (null, null, null, null, null, null);
            }

            _stockApiInfoCache[symbol] = result;
            StockInfoDateTime = DateTime.Now;
            return (TryParseDateTime(result.Datetime), result.Low, result.High, result.FiftyTwoWeek?.Range, result.Close, result.PercentChange);
        }

        public async Task<CompanyProfile> GetStockCompanyProfile(string symbol){
            if(_CompanyDetailsCache.ContainsKey(symbol)){
                var cachedData = _CompanyDetailsCache[symbol];
                Console.WriteLine("Company Cache" , cachedData);
                return cachedData;
            }

            var result = await FetchCompanyProfile(symbol);

            if(result == null){
                Console.WriteLine("Unable to find Company Profile");
            }

            _CompanyDetailsCache[symbol] = result;
            return result;
        }

        public async Task<StockApiInfo?> FetchStockInfo(string symbol){
            if (StockInfoDateTime == null)
            {
                StockInfoDateTime = DateTime.Now;
            }

            if (_stockApiInfoCache.ContainsKey(symbol) && (DateTime.Now - StockInfoDateTime) < TimeSpan.FromMinutes(480))
            {
                var cachedData = _stockApiInfoCache[symbol];
                return cachedData;
            }

            var result = await FetchStockInfoFromApi(symbol);

            if (result == null){
                Console.WriteLine("Unable To Find Info");
                return null;
            }

            _stockApiInfoCache[symbol] = result;
            StockInfoDateTime = DateTime.Now;

            return result;

        }

        private DateTime? TryParseDateTime(string datetime)
        {
            if (DateTime.TryParse(datetime, out var parsedDate))
            {
                return parsedDate;
            }
            return null; 
        }





        private async Task<decimal?> FetchStockPriceFromApi(string symbol)
        {
            var url = $"https://api.twelvedata.com/price?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();

            var data = JObject.Parse(json);

            if (data["status"]?.ToString() == "error")
            {
                Console.WriteLine($"API error for {symbol}: {json}");
                return null;
            }

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
            var encodedSymbol = Uri.EscapeDataString(symbol);
            var url = $"https://api.twelvedata.com/logo?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error: {response.StatusCode}");
                return (null, null);
            }

            var json = await response.Content.ReadAsStringAsync();

            var data = JObject.Parse(json);

            if (data["status"]?.ToString() == "error")
            {
                Console.WriteLine($"API error for {symbol}: {json}");
                return (null, null);
            }

            string logo = data["logo_base"]?.ToString()
                        ?? data["url"]?.ToString()
                        ?? data["logo_quote"]?.ToString();

            string name = data["meta"]?["name"]?.ToString()
                        ?? data["meta"]?["symbol"]?.ToString()
                        ?? "Unknown";

            return (logo, name);
        }

        private async Task<StockApiInfo> FetchStockInfoFromApi(string symbol){
            var url = $"https://api.twelvedata.com/quote?symbol={symbol}&apikey={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if(!response.IsSuccessStatusCode){
                Console.WriteLine($"Error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw API Response: {json}");

            var data = JObject.Parse(json);

            if (data["status"]?.ToString() == "error")
            {
                Console.WriteLine($"API error for {symbol}: {json}");
                return null;
            }

            try{
                var stockInfo = JsonConvert.DeserializeObject<StockApiInfo>(json);

                return stockInfo;
            }
            catch{
                return null;
            }
        }

        private async Task<CompanyProfile> FetchCompanyProfile(string symbol){
            var url = $"https://api.twelvedata.com/profile?symbol={symbol}&apikey={_apiKey}";
            var  response = await _httpClient.GetAsync(url);

            if(!response.IsSuccessStatusCode){
                Console.WriteLine($"Error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw Company Profile API Response: {json}");

            var data = JObject.Parse(json);

            if (data["status"]?.ToString() == "error")
            {
                Console.WriteLine($"API error for {symbol}: {json}");
                return null;
            }

            try{
                var CompanyProfile = JsonConvert.DeserializeObject<CompanyProfile>(json);
                return CompanyProfile;
            }
            catch{
                return null;
            }
            
        }

    }
}
