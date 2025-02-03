namespace TradingSimulatorAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Password { get; set; }
        public int InvestedAmount { get; set;}
        public int CurrentValue { get; set; }
        public int ProfitLoss { get; set; }

    }
}
