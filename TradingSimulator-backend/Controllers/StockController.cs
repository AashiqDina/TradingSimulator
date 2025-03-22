using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TradingSimulator_Backend.Data; // Ensure your Data context is imported
using TradingSimulator_Backend.Services;

namespace TradingSimulator_Backend.Controllers
{
    [Route("api/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService;
        private readonly AppDbContext _context; // Add context to the controller

        // Inject the context and IStockService
        public StockController(IStockService stockService, AppDbContext context)
        {
            _stockService = stockService;
            _context = context; // Initialize context
        }

        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetStockPrice(string symbol)
        {
            var price = await _stockService.GetStockPriceAsync(symbol);
            if (price == null) return NotFound("Stock not found");

            return Ok(new { Symbol = symbol, Price = price });
        }

        [HttpGet("StockImage/{symbol}")]
        public async Task<IActionResult> GetStockImage(string symbol)
        {
            var img = await _stockService.GetStockImage(symbol);
            if(img == null) return NotFound("Logo not found");
            return Ok(new { Symbol = symbol, Image = img });
        }

        [HttpGet("GetStockName/{symbol}")]
        public async Task<IActionResult> GetStockName(string symbol)
        {
            var name = await _stockService.ConvertSymbolToName(symbol);
            return Ok(name);
        }

        [HttpGet("GetStockInfo/{symbol}")]
        public async Task<IActionResult> GetStockInfo(string symbol)
        {
            var stockData = await _stockService.GetQuickData(symbol);

            if (stockData == (null, null, null, null, null, null))
            {
                Console.WriteLine("Data is unavailable.");
            }

            return Ok(new
            {
                LastUpdated = stockData.LastUpdated,
                LowPrice = stockData.LowPrice,
                HighPrice = stockData.HighPrice,
                FiftyTwoWeekRange = stockData.FiftyTwoWeekRange,
                ClosePrice = stockData.ClosePrice,
                PercentChange = stockData.PercentChange
            });
        }


        [HttpGet("search")]
        public async Task<IActionResult> SearchStocks(string symbol)
        {
            if (string.IsNullOrEmpty(symbol)) 
            {
                return BadRequest("Symbol query is required.");
            }

            // Search for stocks in the database where the symbol contains the search query (case-insensitive)
            var stocks = await _context.Stocks
                                        .Where(s => s.Symbol.Contains(symbol, System.StringComparison.OrdinalIgnoreCase))
                                        .ToListAsync();

            if (stocks.Count == 0)
            {
                return NotFound("No stocks found.");
            }

            return Ok(stocks);
        }
    }
}
