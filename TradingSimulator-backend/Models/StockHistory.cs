public class StockHistory
{
    public int Id { get; set; }
    public int StockId { get; set; }
    public DateTime Timestamp { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal TotalValue => Price * Quantity;

    public Stock Stock { get; set; }
}