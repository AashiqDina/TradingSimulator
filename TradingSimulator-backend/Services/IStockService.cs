using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IStockService
{
    Task<decimal?> GetStockPriceAsync(string symbol);
    Task<Dictionary<string, decimal?>> GetMultipleStockPricesAsync(List<string> symbols);
    Task<string?> GetStockImage(string symbol);
    Task<string?> ConvertSymbolToName(string symbol);
    Task<(DateTime? LastUpdated, decimal? LowPrice, decimal? HighPrice, string? FiftyTwoWeekRange, decimal? ClosePrice, decimal? PercentChange)> GetQuickData(string symbol);
}
