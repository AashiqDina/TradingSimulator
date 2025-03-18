using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TradingSimulator_Backend.Data; // Ensure your Data context is imported
using TradingSimulator_Backend.Services; // Add the correct namespace for IStockService

namespace TradingSimulator_Backend.Controllers
{
    [Route("api/stocks")]
    [ApiController]
    public class StockController : ControllerBase
    {
        private readonly IStockService _stockService; // Use IStockService instead of StockService directly
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
