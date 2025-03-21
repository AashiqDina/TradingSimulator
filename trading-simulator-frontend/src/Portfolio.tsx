import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import { useAuth } from "./AuthContext";
import { red } from "@mui/material/colors";
import { Padding } from "@mui/icons-material";

interface AxiosErrorType {
  response?: { data: string; status: number; statusText: string };
  message: string;
}

const Portfolio = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [StockLogoArray, setSLA] = useState<any[]>([]);
  const [StockNameArray, setSNA] = useState<any[]>([]);
  const Fetched = useRef(false)

  const UpdateAllStocksInPortfolio = async () => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }
  
    try {
      // Send the request with no body to trigger the update of all stocks
      const response = await axios.put(
        `http://localhost:3000/api/portfolio/${user?.id}/stocks/update`
      );
  
      console.log("Stocks updated:", response.data);
    } catch (error) {
      handleAxiosError(error); // Use the error handler for better logging
    }
  };
  
  // Fetch portfolio data
  const fetchPortfolioData = async () => {
    setSLA([])  
    if (!user?.id) {
      console.error("User ID is not available for fetching portfolio");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/portfolio/${user?.id}`
      );
      console.log("Fetched portfolio data:", response.data); 


      if (response.data) {
        setPortfolio(response.data);
        console.log(response.data);

        const stocks = response.data.stocks.map((stock: any) => ({
          symbol: stock.symbol
        }));

        let i = 0;
        if(StockLogoArray.length == 0){
          for (const {symbol} of stocks){
            try{
              console.log(i)
              const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${symbol}`);
              console.log(response2.data.image)
              setSLA(preSLA => {
                return [...preSLA, response2.data.image]
              });
              const response3 = await axios.get<string>(`http://localhost:3000/api/stocks/GetStockName/${symbol}`);
              setSNA(prevSNA => {
                return [...prevSNA, response3.data]
              })

            }
            catch (error){
              handleAxiosError(error)
            }
          };
        }

      } else {
        console.error("No portfolio data found");
      }
    } catch (error) {
      handleAxiosError(error);
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
    if (user?.id && !Fetched.current) {
      Fetched.current = true;
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
                <p>£{portfolio.totalInvested.toFixed(2)}</p>
              </div>
            </div>
            <div className="Box2" style={{ color: ValueColour, boxShadow: `0px 10px 10px ${ProfitColour}`}}>
              <h2>Current Value</h2>
              <div className="Values">
                <p>£{portfolio.currentValue.toFixed(2)}</p>
              </div>
            </div>
            <div className="Box3" style={{ color: ProfitColour, boxShadow: `0px 10px 10px ${ProfitColour}`}}>
              <h2>{ProfitLossTitle}</h2>
              <div className="Values">
                <p>£{portfolio.profitLoss.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="LineOne"></div>
          <h2>Stocks in Portfolio</h2>
          <div className="LineTwo"></div>

          <div className="StocksTable">
            <table className="Table">
              <thead>
                <tr>
                  <th style={{padding: "1rem 0.5rem 1rem 1rem"}}></th>
                  <th style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                  <th>Quantity</th>
                  <th>Bought Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th style={{padding: "1rem 0rem 1rem 1rem"}} className="PLTitle">Profit/Loss</th>
                  <th style={{padding: "1rem 1rem 1rem 0.3rem"}}>%</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock: any, index: number) => (
                  <tr key={index}>
                    <td style={{padding: "1rem 0.5rem 1rem 1rem"}}><img className="StockLogo" src={StockLogoArray[index]} alt="Stock Logo" /></td>
                    <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{StockNameArray[index]}</td>
                    <td>{stock.quantity}</td>
                    <td>{(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                    <td>£{stock.currentPrice.toFixed(2)}</td>
                    <td>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(stock.profitLoss).toFixed(2)} </td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <img src="/Loading.gif" alt="Loading..." />
          <h1>Loading...</h1>
        </>
      )}
    </>
  );
};

export default Portfolio;
