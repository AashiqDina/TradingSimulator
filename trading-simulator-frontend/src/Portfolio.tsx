import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Portfolio.css";
import Loading from './Loading';
import { useAuth } from "./AuthContext";
import CurrentBestStockTable from './PorfolioSections/CurrentBestStockTable'
import QuickStats from "./PorfolioSections/QuickStats";
import StocksTable from "./PorfolioSections/StocksTable";
import getPortfolio from "./Functions/GetPortfolio";
import handleAxiosError from "./Functions/handleAxiosError";
import updateAllStocksInPortfolio from "./Functions/UpdateStocksInPortfolio";

// Learnt how important it is to make my application modular from the beginning
// and will be keeping this im mind while working on the ewst of this project
const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [StockLogoArray, setSLA] = useState<any[]>([]);
  const [StockNameArray, setSNA] = useState<any[]>([]);
  const [ToDeleteLogo, setToDeleteLogo] = useState<string | null>(null);
  const [ToDeleteName, setToDeleteName] = useState<string | null>(null);
  const [ToDeleteStock, setToDeleteStock] = useState<number | null>(null);
  const [ToDelete, setToDelete] = useState<{stock: number | null, name: string | null, logo: string | null}>({stock: null, name: null, logo: null});
  const [ModalVisible, setModalVisibility] = useState(false);
  const [ToReload, setToReload] = useState(false);
  const [FilteredOption, setFilteredOption] = useState("");
  const [CurrentBestStocks, setCurrentBestStocks] = useState<any>(null)
  const [JumpTo, setJumpTo] = useState("Top");
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

  useEffect(() => {
    if ((user?.id && !Fetched.current)) {
      Fetched.current = true;
      const updateAndFetch = async () => {
        await updateAllStocksInPortfolio({ user });
        const result = await getPortfolio({ user });
        setPortfolio(result.portfolio);
        setCurrentBestStocks(result.CurrentBestStocks);
        setSLA(result.StockLogoArray);
        setSNA(result.StockNameArray);
      };

      updateAndFetch();
    }
  }, [user]);

  useEffect(() => {
    if (Fetched.current && portfolio && StockLogoArray.length > 0 && StockNameArray.length > 0) {
      let combined = portfolio.stocks.map((stock: any, index: number) => {
        const logo = StockLogoArray[index] || 'defaultLogo.png';
        const name = StockNameArray[index] || 'Unknown';
  
        return {
          stock: stock,
          logo: logo,
          name: name
        };
      });
  
      combined.sort((a: { stock: { profitLoss: number; }; }, b: { stock: { profitLoss: number; }; }) => b.stock.profitLoss - a.stock.profitLoss);
      
      console.log("Final Recieved", combined)
      setCurrentBestStocks(combined);
    }
  }, [portfolio, StockLogoArray, StockNameArray]);

  useEffect(() => {
    if(ToDelete.name == null && ToReload && ToDelete.logo == null){
      const FetchPortfolioData = async () => {
        setToReload(false)
        const result = await getPortfolio({ user });
        setPortfolio(result.portfolio);
        setCurrentBestStocks(result.CurrentBestStocks);
        setSLA(result.StockLogoArray);
        setSNA(result.StockNameArray);
      }
      FetchPortfolioData();
    }
  }, [ToDelete, ToReload])

  useEffect(() => {
    if (FilteredOption !== "") {
      let combined = portfolio.stocks.map((stock: any, index: number) => ({
        stock: stock,
        logo: StockLogoArray[index],
        name: StockNameArray[index]
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
      const sortedLogos = combined.map((item: { logo: any; }) => item.logo);
      const sortedNames = combined.map((item: { name: any; }) => item.name);
  
      setPortfolio((prevPortfolio: any) => ({
        ...prevPortfolio,
        stocks: sortedStocks
      }));
      setSLA(sortedLogos);
      setSNA(sortedNames);
    }
  }, [FilteredOption]);
  
  //-------------------------------------------------------------------------------
  // HTML SECTION BELOW
  //-------------------------------------------------------------------------------
  return (
    <>
      {portfolio ? (
        <>
          <h2 className="PageTitle">{user != null ? user.username + "'s" : "My"} Portfolio</h2>
          <div className="LineOne"></div>

          <QuickStats portfolio={portfolio}/>

          <CurrentBestStockTable CurrentBestStocks={CurrentBestStocks}/>

          <a href={JumpTo} onClick={() => setJumpTo(JumpTo == "#ToJump" ? "#Top" : "#ToJump")}><button className="ViewMore">          
            <div className={`ArrowOne ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div>
            <div className={`ArrowTwo ${JumpTo == "#ToJump" ? "Top" : ""}`} ></div></button>
          </a>

          <div id="Space"></div>
          <div id="ToJump"></div>

          <StocksTable 
            setFilteredOption={setFilteredOption} 
            portfolio={portfolio} 
            StockLogoArray={StockLogoArray} 
            StockNameArray={StockNameArray} 
            ModalVisible={ModalVisible} 
            handleDelete={handleDelete} 
            setModalVisibility={setModalVisibility} 
            setToDelete={setToDelete}
            ToDelete={ToDelete}
            handleTrueDelete={handleTrueDelete}/>
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
