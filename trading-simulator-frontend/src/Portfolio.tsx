import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import { useAuth } from "./AuthContext";

// Define error type to handle different types of errors (AxiosError)
interface AxiosErrorType {
  response?: { data: string; status: number; statusText: string };
  message: string;
}

const Portfolio = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null); // Set state for portfolio data

  const UpdateAllStocksInPortfolio = async () => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }
  
    try {
      // Send the request with no body to trigger the update of all stocks
      const response = await axios.put(
        `http://192.168.1.111:5048/api/portfolio/${user?.id}/stocks/update`
      );
  
      console.log("Stocks updated:", response.data);
    } catch (error) {
      handleAxiosError(error); // Use the error handler for better logging
    }
  };
  
  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    if (!user?.id) {
      console.error("User ID is not available for fetching portfolio");
      return;
    }

    try {
      const response = await axios.get(
        `http://192.168.1.111:5048/api/portfolio/${user?.id}`
      );
      console.log("Fetched portfolio data:", response.data); // Log the portfolio data here

      if (response.data) {
        setPortfolio(response.data); // Set portfolio data
      } else {
        console.error("No portfolio data found");
      }
    } catch (error) {
      handleAxiosError(error); // Use the error handler for better logging
    }
  };

  // Helper function for improved error handling
  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosErrorType;
      const message = axiosError.response ? axiosError.response.data : axiosError.message;
      console.error("Error:", message);
    } else {
      console.error("Unknown error:", error);
    }
  };

  // Portfolio data checks
  let ProfitColour = "#45a049";
  let ProfitLossTitle = "Profit";
  let ValueColour = "#45a049";

  if (portfolio) {
    if (portfolio.profitLoss < 0) {
      ProfitColour = "#bb1515";
      ProfitLossTitle = "Loss";
    }

    if (portfolio.currentValue < portfolio.totalInvested) {
      ValueColour = "#bb1515";
    }
  }

  useEffect(() => {
    if (user?.id) {
      const updateAndFetch = async () => {
        await UpdateAllStocksInPortfolio(); // Wait for update to finish
        await fetchPortfolioData(); // Then fetch portfolio data
      };

      updateAndFetch();
    }
  }, [user]); // Re-run when user changes

  return (
    <>
      {portfolio ? (
        <>
          <div className="QuickStats">
            <div className="Box1">
              <h2>Invested</h2>
              <div className="Values">
                <p>£{portfolio.totalInvested}</p>
              </div>
            </div>
            <div className="Box2" style={{ backgroundColor: ValueColour }}>
              <h2>Current Value</h2>
              <div className="Values">
                <p>£{portfolio.currentValue}</p>
              </div>
            </div>
            <div className="Box3" style={{ backgroundColor: ProfitColour }}>
              <h2>{ProfitLossTitle}</h2>
              <div className="Values">
                <p>£{portfolio.profitLoss}</p>
              </div>
            </div>
          </div>

          {/* Stocks Table */}
          <div className="StocksTable">
            <h2>Stocks in Portfolio</h2>
            <table className="Table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Bought Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th className="PLTitle">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock: any) => (
                  <tr key={stock.symbol}>
                    <td>{stock.symbol}</td>
                    <td>{stock.quantity}</td>
                    <td>{(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                    <td>£{stock.currentPrice.toFixed(2)}</td>
                    <td>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td>£{(stock.profitLoss).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Loading portfolio...</p>
      )}
    </>
  );
};

export default Portfolio;
