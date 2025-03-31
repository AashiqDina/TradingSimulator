import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import { useAuth } from "./AuthContext";

interface AxiosErrorType {
  response?: { data: string; status: number; statusText: string };
  message: string;
}

const Portfolio = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [StockLogoArray, setSLA] = useState<any[]>([]);
  const [StockNameArray, setSNA] = useState<any[]>([]);
  const [ToDelete, setToDelete] = useState<number | null>(null);
  const [ToDeleteStock, setToDeleteStock] = useState<number | null>(null);
  const [ModalVisible, setModalVisibility] = useState(false);
  const [Loading, setLoading] = useState(false);
  const Fetched = useRef(false)

  const UpdateAllStocksInPortfolio = async () => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/portfolio/${user?.id}/stocks/update`
      );
  
      console.log("Stocks updated:", response.data);
    } catch (error) {
      handleAxiosError(error);
    }
  };
  
  const fetchPortfolioData = async () => {
    setLoading(true);
    setSLA([]);
    setSNA([]);
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
              setLoading(false);
              console.log("set false")
            }
            catch (error){
              handleAxiosError(error)
            }
          };
          setLoading(false);
        }

      } else {
        console.error("No portfolio data found");
      }
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleAxiosError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosErrorType;
      const message = axiosError.response ? axiosError.response.data : axiosError.message;
      console.error("Error:", message);
    } else {
      console.error("Unknown error:", error);
    }
  };

  function handleDelete(index: number, stock: number){
    setToDelete(index);
    setToDeleteStock(stock);
    setModalVisibility(true);
  }

  const handleTrueDelete = async () => {
    if(ToDelete == null){
      return
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/portfolio/${user?.id}/stocks/delete/${ToDeleteStock}`)
      console.log("Successfully Deleted: ", response)
      setToDelete(null)
      setToDeleteStock(null)
      setModalVisibility(false)
      fetchPortfolioData()
    } catch (error) {
      handleAxiosError(error)
    }
  }

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
        await UpdateAllStocksInPortfolio();
        await fetchPortfolioData();
      };

      updateAndFetch();
    }
  }, [user]);

  return (
    <>
      {portfolio && !Loading ? (
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
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0.5rem"}}></th>
                  <th style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                  <th style={{paddingRight: "1rem"}}>Quantity</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Bought Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Current Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Total Value</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}} className="PLTitle">Profit/Loss</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>%</th>
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th>

                </tr>
              </thead>
              <tbody>
                {portfolio.stocks.map((stock: any, index: number) => (
                  <tr key={index} style={{opacity: (ToDelete != null) ? ((ToDelete == index ) ? 1 : 0.5) : 1}}>
                    <td><img className="StockLogos" src={StockLogoArray[index]} alt="Stock Logo" /></td>
                    <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{StockNameArray[index]}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>{stock.quantity}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}> {(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{stock.currentPrice.toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(stock.profitLoss).toFixed(2)} </td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}} className="DeleteButton">
                      <div className="CrossContainer" onClick={() => {
                        handleDelete(index, stock.id)
                      }}>
                        <div className="Cross1"></div>
                        <div className="Cross2"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {ModalVisible && (
            <div className="Modal">
              <div className="ModalContent">
                <h2>
                    Delete <img className="DeleteLogo" src={ToDelete !== null ? StockLogoArray[ToDelete] : null} alt="" />{ToDelete !== null ? StockNameArray[ToDelete] : "this stock"} from your portfolio?
                </h2>
                <div className="ModalFooter">
                  <button className="" onClick={() => {
                    setModalVisibility(false);
                    setToDelete(null);
                  }}>Cancel</button>
                  <button className="" onClick={handleTrueDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}
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
