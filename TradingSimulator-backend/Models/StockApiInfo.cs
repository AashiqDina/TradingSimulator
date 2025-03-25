    using Newtonsoft.Json;

public class StockApiInfo
{
    public string Symbol { get; set; }
    public string Name { get; set; }
    public string Exchange { get; set; }
    [JsonProperty("mic_code")]
    public string MicCode { get; set; }
    public string Currency { get; set; }
    public string Datetime { get; set; }
    public long Timestamp { get; set; } 

    public decimal Open { get; set; }
    public decimal High { get; set; }
    public decimal Low { get; set; }
    public decimal Close { get; set; }
    public long Volume { get; set; }
    [JsonProperty("previous_close")]
    public decimal PreviousClose { get; set; }
    public decimal Change { get; set; }
    [JsonProperty("percent_change")]
    public decimal PercentChange { get; set; }
    [JsonProperty("average_volume")]
    public long AverageVolume { get; set; }

    public decimal Rolling1DChange { get; set; }
    public decimal Rolling7DChange { get; set; }
    public decimal RollingPeriodChange { get; set; }

    public bool IsMarketOpen { get; set; }
    [JsonProperty("fifty_two_week")]
    public FiftyTwoWeek FiftyTwoWeek { get; set; }

    public decimal ExtendedChange { get; set; }
    public decimal ExtendedPercentChange { get; set; }
    public decimal ExtendedPrice { get; set; }
    public long ExtendedTimestamp { get; set; } 
}
public class FiftyTwoWeek
{
    [JsonProperty("low")]
    public decimal Low { get; set; }

    [JsonProperty("high")]
    public decimal High { get; set; }

    [JsonProperty("low_change")]
    public decimal LowChange { get; set; }

    [JsonProperty("high_change")]
    public decimal HighChange { get; set; }

    [JsonProperty("low_change_percent")]
    public decimal LowChangePercent { get; set; }

    [JsonProperty("high_change_percent")]
    public decimal HighChangePercent { get; set; }

    [JsonProperty("range")]
    public string Range { get; set; }
}