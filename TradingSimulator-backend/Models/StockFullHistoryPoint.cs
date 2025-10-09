using TradingSimulator_Backend.Models; 

public class StockFullHistoryPoint
{
    public DateTime Datetime { get; set; }
    public decimal Open { get; set; }
    public decimal High { get; set; }
    public decimal Low { get; set; }
    public decimal Close { get; set; }
    public long Volume { get; set; }
}