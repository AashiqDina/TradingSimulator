import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import Loading from './Loading';
import { useAuth } from "./AuthContext";

interface AxiosErrorType {
  response?: { data: string; status: number; statusText: string };
  message: string;
}

const Portfolio = () => {
  const { user, logout } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [prevProtfolio, setPrevPortfolio] = useState<any>(null);
  const [StockLogoArray, setSLA] = useState<any[]>([]);
  const [prevStockLogoArray, setPrevSLA] = useState<any[]>([]);
  const [StockNameArray, setSNA] = useState<any[]>([]);
  const [prevStockNameArray, setPrevSNA] = useState<any[]>([]);
  const [ToDelete, setToDelete] = useState<number | null>(null);
  const [ToDeleteStock, setToDeleteStock] = useState<number | null>(null);
  const [ModalVisible, setModalVisibility] = useState(false);
  const [ToReload, setToReload] = useState(false);
  const [FilterSearchInput, setFilterSearchInput] = useState("");
  const [FilteredOption, setFilteredOption] = useState("");
  const [Filtered, setFiltered] = useState(false);
  const [sorted, setSorted] = useState(false);


  const Fetched = useRef(false)

  console.log(portfolio)
  console.log(StockLogoArray)
  console.log(StockNameArray)

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

        const stocks = response.data.stocks.map((stock: any) => ({
          symbol: stock.symbol
        }));

        if(StockLogoArray.length == 0){
          for (const {symbol} of stocks){
            try{
              const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${symbol}`);
              console.log(response2.data.image)
              setSLA(preSLA => {
                return [...preSLA, response2.data.image]
              });
              const response3 = await axios.get<string>(`http://localhost:3000/api/stocks/GetStockName/${symbol}`);
              console.log(response3.data)
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
      setToReload(true)
      setModalVisibility(false)
      setToDeleteStock(null)
      setToDelete(null)
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
    if ((user?.id && !Fetched.current)) {
      Fetched.current = true;
      const updateAndFetch = async () => {
        await UpdateAllStocksInPortfolio();
        await fetchPortfolioData();
      };

      updateAndFetch();
    }
  }, [user]);

  useEffect(() => {
    if(ToDelete == null && ToReload){
      const FetchPortfolioData = async () => {
        setToReload(false)
        await fetchPortfolioData();
      }
      FetchPortfolioData();
    }
  }, [ToDelete])

  function FilterSearch(){
    if(FilterSearchInput == "" && FilteredOption == ""){
      if(Filtered){
        setPortfolio(prevProtfolio);
        setSLA(prevStockLogoArray);
        setSNA(prevStockNameArray);
        setFiltered(false);
        setSorted(false)
        return
      }
      return
    }
    
    if(!Filtered){
      setPrevPortfolio(portfolio);
      setPrevSLA(StockLogoArray);
      setPrevSNA(StockNameArray);
    }
      setFiltered(true)

      let FilteredPortfolio = null;
      let FilteredStocks = [];
      let NewSLA = []
      let NewSNA = []
      
      let CurrentValue = 0
      let ProfitLoss = 0
      let TotalInvested = 0

      let OrgPortfolio = Filtered ? prevProtfolio : portfolio;
      let OrgSLA = Filtered ? prevStockLogoArray : StockLogoArray;
      let OrgSNA = Filtered ? prevStockNameArray : StockNameArray;

      if(sorted && FilterSearchInput != ""){
        OrgPortfolio = portfolio;
        OrgSLA = StockLogoArray;
        OrgSNA = StockNameArray;
      }

      if(FilterSearchInput != ""){
        for(let i = 0; i<(OrgPortfolio.stocks.length); i++){
          if(OrgPortfolio.stocks[i].symbol == FilterSearchInput.toUpperCase()){
            FilteredStocks.push(OrgPortfolio.stocks[i]);
            NewSLA.push(OrgSLA[i]);
            NewSNA.push(OrgSNA[i]);
            
            CurrentValue += OrgPortfolio.stocks[i].totalValue;
            ProfitLoss += OrgPortfolio.stocks[i].profitLoss;
            TotalInvested += OrgPortfolio.stocks[i].purchasePrice * OrgPortfolio.stocks[i].quantity;
          }
        }
        FilteredPortfolio = {currentValue: CurrentValue, id: OrgPortfolio.id, profitLoss: ProfitLoss, stocks: FilteredStocks, totalInvested: TotalInvested, user: OrgPortfolio.user, userId: OrgPortfolio.userId}
      }
      else {
        FilteredPortfolio = OrgPortfolio;
        NewSLA = OrgSLA;
        NewSNA = OrgSNA;
      }
      
      let FurtherFilteredPorfolio = FilteredPortfolio;
      let FurtherFilteredSLA = NewSLA;
      let FurtherFilteredSNA = NewSNA;

      if(FilteredPortfolio == null){
        FurtherFilteredPorfolio = portfolio
      }
      if(NewSLA.length == 0){
        FurtherFilteredSLA = StockLogoArray
      }
      if(NewSNA.length == 0){
        FurtherFilteredSNA = StockNameArray
      }



      if(FilteredOption != ""){
        let combined = FurtherFilteredPorfolio.stocks.map((stock: any, index: number) => ({
          stock: stock,
          logo: FurtherFilteredSLA[index],
          name: FurtherFilteredSNA[index]
        }));

        if(FilteredOption == "Oldest"){
          if (FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => a.stock.id - b.stock.id);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        if(FilteredOption == "Newest"){
          if (FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => b.stock.id - a.stock.id);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        if(FilteredOption == "ProfitAsc"){
          if(FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => a.stock.profitLoss - b.stock.profitLoss);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        if(FilteredOption == "ProfitDesc"){
          if(FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => b.stock.profitLoss - a.stock.profitLoss);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        if(FilteredOption == "ValueAsc"){
          if(FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => a.stock.totalValue - b.stock.totalValue);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        if(FilteredOption == "ValueDesc"){
          if(FurtherFilteredPorfolio != null){
            combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => b.stock.totalValue - a.stock.totalValue);

            let sortedStocks = combined.map((item: { stock: any; }) => item.stock);
            let sortedLogos = combined.map((item: { logo: any; }) => item.logo);
            let sortedNames = combined.map((item: { name: any; }) => item.name);

            FurtherFilteredPorfolio.stocks = sortedStocks;
            FurtherFilteredSLA = sortedLogos;
            FurtherFilteredSNA = sortedNames;
          }
        }
        setSorted(true)
      }

      setPortfolio(FurtherFilteredPorfolio);
      setSLA(FurtherFilteredSLA);
      setSNA(FurtherFilteredSNA);
    
  }

  //-------------------------------------------------------------------------------
  // HTML SECTION BELOW
  //-------------------------------------------------------------------------------
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
            <div className="Box2" style={{ color: ValueColour, boxShadow: `0px 10px 10px ${ValueColour}`}}>
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

          <section className="Filter">
            <input type="text" onChange={(e) => setFilterSearchInput(e.target.value)} placeholder="Enter stock symbol (e.g, AAPL)"/>
            <select name="" id="" onChange={(e) => setFilteredOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
              <option value="ProfitAsc">Profit (Asc)</option>
              <option value="ProfitDesc">Profit (Desc)</option>
              <option value="ValueAsc">Value (Asc)</option>
              <option value="ValueDesc">Value (Desc)</option>
            </select>
            <button onClick={FilterSearch}>Submit</button>
          </section>

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
          <Loading/>
        </>
      )}
    </>
  );
};

export default Portfolio;
