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
  const [prevPortfolio, setPrevPortfolio] = useState<any>(null);
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
  const [CurrentBestStocks, setCurrentBestStocks] = useState<any>(null)
  const [JumpTo, setJumpTo] = useState("Top");
  const Fetched = useRef(false)

  function handleDelete(index: number, stock: any){
    setToDelete(index);
    console.log("THIS HERE: " + stock)
    setToDeleteStock(stock.id);
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
      FilterSearch()
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
      
      setCurrentBestStocks(combined);
    }
  }, [portfolio, StockLogoArray, StockNameArray]);

  useEffect(() => {
    if(ToDelete == null && ToReload){
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
  

  function FilterSearch(){
    if(FilterSearchInput == "" && FilteredOption == ""){
      if(Filtered){
        setPortfolio(prevPortfolio);
        setSLA(prevStockLogoArray);
        setSNA(prevStockNameArray);
        setFiltered(false);
        setSorted(false)
        return
      }
      return
    }
    
    let SetOriginalPortfolio = portfolio;
    let SetOriginalStockLogoArray = StockLogoArray;
    let SetOriginalStockNameArray = StockNameArray;
    
    if(!Filtered){
      setPrevPortfolio(SetOriginalPortfolio);
      setPrevSLA(SetOriginalStockLogoArray);
      setPrevSNA(SetOriginalStockNameArray);
    }
      setFiltered(true)

      let FilteredPortfolio = null;
      let FilteredStocks = [];
      let NewSLA = []
      let NewSNA = []
      
      let CurrentValue = 0
      let ProfitLoss = 0
      let TotalInvested = 0

      let OrgPortfolio = Filtered ? prevPortfolio : portfolio;
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

        setPortfolio(FurtherFilteredPorfolio);
        setSLA(FurtherFilteredSLA);
        setSNA(FurtherFilteredSNA);
        setSorted(true)
  }

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
            FilterSearchInput={FilterSearchInput}
            setFilterSearchInput={setFilterSearchInput}
            setFilteredOption={setFilteredOption} 
            FilterSearch={FilterSearch} portfolio={portfolio} 
            ToDelete={ToDelete} 
            StockLogoArray={StockLogoArray} 
            StockNameArray={StockNameArray} 
            ModalVisible={ModalVisible} 
            handleDelete={handleDelete} 
            setModalVisibility={setModalVisibility} 
            setToDelete={setToDelete} 
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
