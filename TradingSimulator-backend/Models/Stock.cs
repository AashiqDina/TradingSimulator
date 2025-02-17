public class Stock
{
    public int Id { get; set; }
    public string Symbol { get; set; } = string.Empty;
    public decimal PurchasePrice { get; set; }
    public int Quantity { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal TotalValue => CurrentPrice * Quantity;

    public decimal ProfitLoss => (CurrentPrice - PurchasePrice) * Quantity;
}
