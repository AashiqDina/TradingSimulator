using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TradingSimulator_Backend.Models;


public interface INewsService
{
    Task<ApiResponse<List<CompanyNews?>>> getCompanyNews(string symbol);
    DateTime getCompanyNewsLastUpdated(string symbol);
}
