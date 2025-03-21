public class StockApiInfo
{
    public string Symbol { get; set; }
    public string Name { get; set; }
    public string Exchange { get; set; }
    public string MicCode { get; set; }
    public string Currency { get; set; }
    public string Datetime { get; set; }
    public long Timestamp { get; set; } 

    public decimal Open { get; set; }
    public decimal High { get; set; }
    public decimal Low { get; set; }
    public decimal Close { get; set; }
    public long Volume { get; set; }

    public decimal PreviousClose { get; set; }
    public decimal Change { get; set; }
    public decimal PercentChange { get; set; }
    public long AverageVolume { get; set; }

    public decimal Rolling1DChange { get; set; }
    public decimal Rolling7DChange { get; set; }
    public decimal RollingPeriodChange { get; set; }

    public bool IsMarketOpen { get; set; }
    public FiftyTwoWeek FiftyTwoWeek { get; set; }

    public decimal ExtendedChange { get; set; }
    public decimal ExtendedPercentChange { get; set; }
    public decimal ExtendedPrice { get; set; }
    public long ExtendedTimestamp { get; set; } 
}

public class FiftyTwoWeek
{
    public decimal Low { get; set; }
    public decimal High { get; set; }
    public decimal LowChange { get; set; }
    public decimal HighChange { get; set; }
    public decimal LowChangePercent { get; set; }
    public decimal HighChangePercent { get; set; }
    public string Range { get; set; }
}
