using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TradingSimulator_Backend.Data;
using TradingSimulator_Backend.Models;
using Newtonsoft.Json;
using System.Linq;
using System.Threading.Tasks;
using TradingSimulator_Backend.Services;


[Route("api/portfolio")]
[ApiController]
public class PortfolioController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IStockService _stockService; // Use IStockService instead of StockService directly

    public PortfolioController(AppDbContext context, IStockService stockService)
    {
        _context = context;
        _stockService = stockService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetPortfolio(int userId)
    {
        var portfolio = await _context.Portfolios
                                      .Include(p => p.User)
                                      .Include(p => p.Stocks)
                                      .FirstOrDefaultAsync(p => p.UserId == userId);

        if (portfolio == null)
        {
            return NotFound("Portfolio not found.");
        }

        return Ok(portfolio);
    }

    [HttpGet("{userId}/stocks")]
    public async Task<IActionResult> GetStocksInPortfolio(int userId)
    {
        var portfolio = await _context.Portfolios
                                    .Include(p => p.Stocks)
                                    .FirstOrDefaultAsync(p => p.UserId == userId);

        if (portfolio == null)
        {
            return NotFound("Portfolio not found.");
        }

        return Ok(portfolio.Stocks); // Return the stocks
    }

    [HttpPost]
    public async Task<IActionResult> CreatePortfolio([FromBody] Portfolio portfolio)
    {
        // Check if the user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == portfolio.UserId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        // If the user exists, associate the portfolio with the user
        _context.Portfolios.Add(portfolio);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPortfolio), new { userId = portfolio.UserId }, portfolio);
    }

    // Buy Stock (Updated)
    [HttpPost("{userId}/stocks")]
    public async Task<IActionResult> BuyStock(int userId, [FromBody] StockPurchaseRequest request)
    {
        var portfolio = await _context.Portfolios
                                  .Include(p => p.Stocks)
                                  .FirstOrDefaultAsync(p => p.UserId == userId);

        if (portfolio == null)
        {
            return NotFound("Portfolio not found.");
        }

        var stockPrice = await _stockService.GetStockPriceAsync(request.Symbol);

        if (stockPrice == null)
        {
            return BadRequest("Stock not found.");
        }

        var stock = new Stock
        {
            Symbol = request.Symbol,
            PurchasePrice = stockPrice.Value,  /
            Quantity = request.Quantity,
            CurrentPrice = stockPrice.Value 
        };

        portfolio.Stocks.Add(stock);  // Add the stock to the portfolio
        await _context.SaveChangesAsync();  // Save changes to the database

        return Ok(new { Message = "Stock purchased successfully", Stock = stock });
    }

    // Change this
// public class StockPriceUpdaterService : BackgroundService

[HttpPut("{userId}/stocks/update")]
public async Task<IActionResult> UpdateStocksInPortfolio(int userId)
{
    // Fetch the user's portfolio
    var portfolio = await _context.Portfolios
                                  .Include(p => p.Stocks) // Include the stocks in the portfolio
                                  .FirstOrDefaultAsync(p => p.UserId == userId);

    if (portfolio == null)
    {
        return NotFound("Portfolio not found.");
    }

    // Collect all stock symbols from the portfolio
    var stockSymbols = portfolio.Stocks.Select(s => s.Symbol).ToList();

    // Fetch stock prices for all symbols in a single API call using GetMultipleStockPricesAsync
    var stockPrices = await _stockService.GetMultipleStockPricesAsync(stockSymbols);

    // Loop through each stock and update its price
    foreach (var stock in portfolio.Stocks)
    {
        if (stockPrices.ContainsKey(stock.Symbol))
        {
            var stockPrice = stockPrices[stock.Symbol];
            if (stockPrice.HasValue)
            {
                stock.CurrentPrice = stockPrice.Value; // Update the stock price
            }
        }
    }

    // Save the updated portfolio with new prices
    await _context.SaveChangesAsync();

    return Ok(portfolio); // Return the updated portfolio
}






    // Remove Stock from Portfolio (Updated)
    [HttpDelete("{userId}/stocks/{stockId}")]
    public async Task<IActionResult> RemoveStockFromPortfolio(int userId, int stockId)
    {
        var portfolio = await _context.Portfolios
                                      .Include(p => p.Stocks)
                                      .FirstOrDefaultAsync(p => p.UserId == userId);

        if (portfolio == null)
        {
            return NotFound("Portfolio not found.");
        }

        var stock = portfolio.Stocks.FirstOrDefault(s => s.Id == stockId);
        if (stock == null)
        {
            return NotFound("Stock not found in portfolio.");
        }

        portfolio.Stocks.Remove(stock);
        await _context.SaveChangesAsync();

        return Ok(portfolio);
    }
}
