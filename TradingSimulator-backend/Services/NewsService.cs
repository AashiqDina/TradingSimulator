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
    using System.Collections.Concurrent;

    public class NewsService : INewsService{
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;
        private readonly string _apiKey = "";

        private static ConcurrentDictionary<string, (List<CompanyNews?> CompNews, DateTime Timestamp)> _CompanyNewsCache = new ConcurrentDictionary<string, (List<CompanyNews?> CompNews, DateTime Timestamp)>();

        public NewsService(HttpClient httpClient, AppDbContext appDbContext)
        {
            _httpClient = httpClient;
            _context = appDbContext;
        }

        public DateTime getCompanyNewsLastUpdated(string symbol){
            return _CompanyNewsCache[symbol].Timestamp;
        }

        public async Task<List<CompanyNews?>> getCompanyNews(string symbol){
            if(_CompanyNewsCache.ContainsKey(symbol) && (DateTime.Now - _CompanyNewsCache[symbol].Timestamp < TimeSpan.FromMinutes(720))){
                var cachedData = _CompanyNewsCache[symbol].CompNews;
                Console.WriteLine("Company Cache", cachedData);
                return cachedData;
            }

            var result = await FetchCompanyNews(symbol);

            if(result == null){
                Console.WriteLine("Unable to find Company News");
            }
            else{
                _CompanyNewsCache[symbol] = (result, DateTime.Now);
            }
            
            return result;
        }

        private async Task<List<CompanyNews?>> FetchCompanyNews(string symbol){
            var from = DateTime.UtcNow.AddDays(-30).ToString("yyyy-MM-dd");
            var to = DateTime.UtcNow.ToString("yyyy-MM-dd");

            var url = $"https://finnhub.io/api/v1/company-news?symbol={symbol}&from={from}&to={to}&token={_apiKey}";
            var response = await _httpClient.GetAsync(url);

            if(!response.IsSuccessStatusCode){
                Console.WriteLine($"Error: {response.StatusCode}");
                return null;
            }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Raw Company Profile API Response: {json}");

            try{
                var CompanyNews = JsonConvert.DeserializeObject<List<CompanyNews>>(json);
                return CompanyNews;
            }
            catch{
                return null;
            }

        } 
    }
}
