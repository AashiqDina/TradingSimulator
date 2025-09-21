import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import Loading from './Loading';
import { useAuth } from "./AuthContext";
import QuickStats from "./PorfolioSections/QuickStats";
import StocksTable from "./PorfolioSections/StocksTable";
import getPortfolio from "./Functions/GetPortfolio";
import handleAxiosError from "./Functions/handleAxiosError";
import updateAllStocksInPortfolio from "./Functions/UpdateStocksInPortfolio";
import getHistory from "./Functions/getHistory";

// Learnt how important it is to make my application modular from the beginning
// and will be keeping this im mind while working on the ewst of this project
const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [ToDelete, setToDelete] = useState<{stock: number | null, name: string | null, logo: string | null}>({stock: null, name: null, logo: null});
  const [ModalVisible, setModalVisibility] = useState(false);
  const [ToReload, setToReload] = useState(false);
  const [FilteredOption, setFilteredOption] = useState("");
  const [JumpTo, setJumpTo] = useState("Top");
  const [FilterHistory, setFilterHistory] = useState("all")
  const [StockHistory, setStockHistory] = useState<any | null>(null)
  const [Invested, setInvested] = useState<number | null>(null)
  const [PorfolioValue, setPorfolioValue] = useState<number | null>(null)
  const [Profit, setProfit] = useState<number | null>(null)

  const Fetched = useRef(false)

  function handleDelete(index: number, stock: any, name: string, logo: string){
    setToDelete({stock: stock.id, name: name, logo: logo})
    console.log("Deleting Stock: " + stock)
    setModalVisibility(true);
  }

  const handleTrueDelete = async () => {
    if(ToDelete.name == null || ToDelete.logo == null){
      return
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/portfolio/${user?.id}/stocks/delete/${ToDelete.stock}`)
      console.log("Successfully Deleted: ", response)
      setToReload(true)
      setToDelete({stock: null, name: null, logo: null})
      setModalVisibility(false)
    } catch (error) {
      handleAxiosError(error)
    }
  }

  useEffect(() => { // Fetch the data
    if ((user?.id && !Fetched.current)) {
      Fetched.current = true;
      const updateAndFetch = async () => {
        await updateAllStocksInPortfolio({ user });
        const result = await getPortfolio({ user });
        setPortfolio(result);
        console.log("Portfolio Result: ", result)
        setInvested(result.totalInvested.toFixed(2))
        setPorfolioValue(result.currentValue.toFixed(2))
        setProfit(result.profitLoss.toFixed(2))
      };

      updateAndFetch();
    }
  }, [user]);
  
  useEffect(() => { // Fetch the History
    if (user?.id) {
      const updateAndFetch = async () => {
        const History = await getHistory({ user, FilterHistory });
        setStockHistory(History)
      };

      updateAndFetch();
    }
  }, [user, FilterHistory]);

  useEffect(() => { // Reset after delete
    if(ToDelete.name == null && ToReload && ToDelete.logo == null){
      const FetchPortfolioData = async () => {
        setToReload(false)
        const result = await getPortfolio({ user });
        setPortfolio(result.portfolio);
      }
      FetchPortfolioData();
    }
  }, [ToDelete, ToReload])

  useEffect(() => { // Filter for Portfolio Table
    if (FilteredOption !== "") {
      let combined = portfolio.stocks.map((stock: any, index: number) => ({
        stock: stock,
      }));

      if (FilteredOption === "Oldest") {
        combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => a.stock.id - b.stock.id);
      } else if (FilteredOption === "Newest") {
        combined.sort((a: { stock: { id: number; }; }, b: { stock: { id: number; }; }) => b.stock.id - a.stock.id);
      } else if (FilteredOption === "ProfitAsc") {
        combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => a.stock.profitLoss - b.stock.profitLoss);
      } else if (FilteredOption === "ProfitDesc") {
        combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => b.stock.profitLoss - a.stock.profitLoss);
      } else if (FilteredOption === "ValueAsc") {
        combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => a.stock.totalValue - b.stock.totalValue);
      } else if (FilteredOption === "ValueDesc") {
        combined.sort((a: { stock: { totalValue: number; }; }, b: { stock: { totalValue: number; }; }) => b.stock.totalValue - a.stock.totalValue);
      }
  
      const sortedStocks = combined.map((item: { stock: any; }) => item.stock);
  
      setPortfolio((prevPortfolio: any) => ({
        ...prevPortfolio,
        stocks: sortedStocks
      }));
    }
  }, [FilteredOption]);
  
  //-------------------------------------------------------------------------------
  // HTML SECTION BELOW
  //-------------------------------------------------------------------------------
  return (
    <>
      {portfolio ? (
        <>
          <section className="PortfolioPageHeader">
            <article className="PortfolioPageTitle">
              
              <h2 className="PageTitle">{user != null ? user.username + "'s" : "My"} Portfolio</h2>
              <div className="LineOne"></div>
            </article>
            <article className="PortfolioSummary">
              <div>
                <h4>Invested</h4>
                <h5>£{Invested}</h5>
              </div>
              <div className="PortfolioSummaryCenter">
                <h3>Portfolio Value</h3>
                <h4>£{PorfolioValue}</h4>
              </div>
              <div>
                <h4>Profit</h4>
                <h5>{Profit != null && Profit >= 0 ? "+" : "-"}£{Profit != null ? Math.abs(Profit) : ""}
                </h5>
                <div>
                  <span style={Profit != null && Profit >= 0 ? {color: '#45a049'} : {color: '#bb1515'}}>
                    ({Profit != null && Profit >= 0 ? "+" : ""}{(PorfolioValue != null && Invested != null) ? ((PorfolioValue/Invested)*100-100).toFixed(2) : ""}{(PorfolioValue != null && Invested != null) ? "%" : ""})
                  </span>
                </div>
              </div>
            </article>
          </section>

          <QuickStats 
            portfolio={portfolio} 
            History={StockHistory} 
            FilterHistory={FilterHistory} 
            setFilterHistory={setFilterHistory}
            setPortfolioValue={setPorfolioValue}
            setProfit={setProfit}
            setInvested={setInvested}/>

          {/* <CurrentBestStockTable CurrentBestStocks={CurrentBestStocks}/> */}

          <a href={JumpTo} onClick={() => setJumpTo(JumpTo == "#ToJump" ? "#Top" : "#ToJump")}><button className="ViewMore">          
            <div className={`ArrowOne ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div>
            <div className={`ArrowTwo ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div></button>
          </a>

          <div id="Space"></div>
          <div id="ToJump"></div>

          <StocksTable 
            setFilteredOption={setFilteredOption} 
            portfolio={portfolio} 
            ModalVisible={ModalVisible} 
            handleDelete={handleDelete} 
            setModalVisibility={setModalVisibility} 
            setToDelete={setToDelete}
            ToDelete={ToDelete}
            handleTrueDelete={handleTrueDelete}/>

          <div id="Space"></div>

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
