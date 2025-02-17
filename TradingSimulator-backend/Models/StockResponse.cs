using System.Text.Json.Serialization;
using Newtonsoft.Json;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;


public class StockResponse
{
    [JsonProperty("price")]
    public decimal? Price { get; set; }
}
