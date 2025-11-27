import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './StockDetail.css';
import { StockApiInfo, CompanyProfile } from "../Interfaces/interfaces";
import { useAuth } from "../Functions/AuthContext";
import { StocksAI } from '../StocksAI/StocksAI';
import AiLoading from '../Loading/AiLoading';
import getStockApiInfo from '../Functions/getStockApiInfo';
import CompanyInformation from '../StockDetailsSections/StockDetailsCompanyInformation'
import StockDetails from '../StockDetailsSections/StockDetailsStockData'
import StockDetailsOwnedStocks from '../StockDetailsSections/StockDetailsOwnedStocks';
import StockDetailsNews from '../StockDetailsSections/StockDetailsNews';
import buyStock from '../Functions/buyStock';
import { FocusTrap } from 'focus-trap-react';
import Confetti from 'react-confetti';
import AiChat from '../StockDetailsSections/AiChat';
import StockDetailsOverview from '../StockDetailsSections/StockDetailsOverview';
import getStockImage from '../Functions/getStockImage';
import Error from '../Error/Error';
import getStockName from '../Functions/getStockName';
import getStockPrice from '../Functions/getStockPrice';

interface AxiosErrorType {
    response?: { data: string; status: number; statusText: string };
    message: string;
  }

const StockDetail: React.FC = () => {
    const { user } = useAuth();
    const { symbol } = useParams();
    const stockSymbol = decodeURIComponent(symbol ?? '');
    const [StockName, setStockName] = useState("Unknown")
    const [stockLogo, setStockLogo] = useState<string>('');
    const [BasicStockData, setStockBasicData] = useState<StockApiInfo | null>(null);
    const [StockCompanyDetails, setCompanyDetails] = useState<CompanyProfile | null | undefined>(undefined);
    const [DisplayedData, setDisplayedData] = useState<any | null>("Overview")
    const [UserPrompts, setUserPrompts] = useState<string[]>([])
    //(["Hi","Can you tell me about this stock?","ok how about this?","so blah blahblahblah"])
    const [AiResponses, setAiResponses] = useState<string[]>([])
    //(["Hi","Sure blah blah blah blah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blahblah blah blah","blah blah blahblah blah blahblah blah blah", "bla"])
    const [AIAssistantSearchInput,setSearchInput] = useState<string>("")
    const [stockPrice, setStockPrice] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<string>("0");
    const [cost, setCost] = useState<string | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
    


    useEffect(() => {
        GetData()
    }, [])

    const GetData = async() => {
        try{
            const response = await getStockName({symbol: stockSymbol, setDisplayError: setDisplayError});
            setStockName(response);
            const response3 = await getStockPrice({symbol: stockSymbol, setDisplayError: setDisplayError});
            setStockPrice(response3)
            const response2 = await getStockImage({symbol: stockSymbol, setDisplayError: setDisplayError})
            setStockLogo(response2);
        }
        catch(error){
            handleAxiosError(error);
        }

    }

    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosErrorType;
          const message = axiosError.response ? axiosError.response.data : axiosError.message;
          console.error("Error:", message);
        } else {
          console.error("Unknown error:", error);
        }
      };

    const handleBuyStock = async () => {
        await buyStock({stockPrice: stockPrice, stockSymbol: stockSymbol, quantity: quantity, setShowConfetti: setShowConfetti, setIsModalOpen: setIsModalOpen, user: user})
    };

    const HandleAiResponse = async() => {
      try{
        if(AIAssistantSearchInput == ""){
          // Todo handle blank submit
          return
        }
        if(UserPrompts[0] == ""){
          setUserPrompts([AIAssistantSearchInput])
        }
        else{
          setUserPrompts(prevValues => [
            ...prevValues,
            AIAssistantSearchInput
          ])
        }


        const AllStockData = [BasicStockData, StockCompanyDetails]
        const AiResponse = await StocksAI(AIAssistantSearchInput, AllStockData)
        console.log(AiResponse)
        if(AiResponses[0] == ""){
          AiResponse != null ? setAiResponses([AiResponse]) : setAiResponses(["Failed to communicate with the AI API."])
        }
        else{
          AiResponse != null ? setAiResponses(prevValues => [
            ...prevValues,
            AiResponse
          ]) : setAiResponses(prevValues => [
            ...prevValues,
            "Failed to communicate with the AI API."
          ])
        }
        setSearchInput("")
      }
      catch{
      }
    }

      function SwitchSection(Section: string){
        switch(Section){
          case "Overview":
            setDisplayedData("Overview")
            break
          case "CompanyInformation":
            setDisplayedData("CompanyInformation")
            break
          case "StockData":
            setDisplayedData("StockData")
            break
          case "OwnedStocks":
            setDisplayedData("OwnedStocks")
            break
          case "News":
            setDisplayedData("News")
            break
          case "AIAssistant":
            setDisplayedData("AIAssistant")
            break
          default:
            setDisplayedData("Overview")
            break
        }
      }

  return (
    <>
      {showConfetti && 
        <Confetti
        numberOfPieces={(Number(quantity) * 20) > 1000 ? 999 : (Number(quantity) * 20)}
        recycle={false}
      />}
        <header className='TitleBox'>
          <section>
            <img className='TitleLogo' src={stockLogo} alt={`Stock Logo for ${StockName}`} />
              <article className='StockDetailsPrice'>
                <div className='MiniNameSymbolSection'>
                  <h1 className='StockDetailsTitle'>{StockName}</h1>
                  <span className='StockSymbol'>{stockSymbol}</span>
                </div>
                {/* <div className='TitleLogo'></div> */}
                <h2>£{stockPrice?.toFixed(2)}</h2>
              </article>
          </section>
          <section className='CompleteSelector'>
            <section className='SectionSection'>
              <article className='Selector'>
                <button className='BuyStockButton' aria-label='Buy Stock' onClick={() => setIsModalOpen(true)}>Buy Stock</button>
                <button aria-pressed={DisplayedData === "Overview"} aria-label="View overview" onClick={() => SwitchSection("Overview")} className={"Overview" + (DisplayedData == "Overview" ? "Selected" : "")}>Overview</button>
                <button aria-pressed={DisplayedData === "CompanyInformation"} aria-label="View company information" onClick={() => SwitchSection("CompanyInformation")} className={"CompanyInformation" + (DisplayedData == "CompanyInformation" ? "Selected" : "")}>About</button>
                <button aria-pressed={DisplayedData === "StockData"} aria-label="View stock data" onClick={() => SwitchSection("StockData")} className={"StockData" + (DisplayedData == "StockData" ? "Selected" : "")}>Stock Data</button>
                <button aria-pressed={DisplayedData === "OwnedStocks"} aria-label="View owned stocks" onClick={() => SwitchSection("OwnedStocks")} className={"OwnedStocks" + (DisplayedData == "OwnedStocks" ? "Selected" : "")}>Owned Stocks</button>
                <button aria-pressed={DisplayedData === "News"} aria-label="View stock related news" onClick={() => SwitchSection("News")} className={"News" + (DisplayedData == "News" ? "Selected" : "")}>News</button>
                <button aria-pressed={DisplayedData === "AIAssistant"} aria-label="View AI assistant" onClick={() => SwitchSection("AIAssistant")} className={"AIAssistant" + (DisplayedData == "AIAssistant" ? "Selected" : "")}>AI Assistant</button>
              </article>
            </section>
          </section>
        </header>

        <section className='MainBody'>
            <div className='StockDetails'>
              {
                (DisplayedData == "Overview") && <StockDetailsOverview StockName={StockName} symbol={stockSymbol} setDisplayError={setDisplayError}/>
              }
              {
                  (DisplayedData == "CompanyInformation") && <CompanyInformation StockCompanyDetails={StockCompanyDetails} setCompanyDetails={setCompanyDetails} DisplayedData={DisplayedData} symbol={stockSymbol} setDisplayError={setDisplayError}/>
              }
              {
                  (DisplayedData == "StockData") && <StockDetails symbol={stockSymbol} setStockBasicData={setStockBasicData} BasicStockData={BasicStockData} stockPrice={stockPrice} setDisplayError={setDisplayError}/>

              }      
              {
                  (DisplayedData == "OwnedStocks") && <StockDetailsOwnedStocks user={user} symbol={stockSymbol}/>
              } 
              {
                  (DisplayedData == "News") && <StockDetailsNews symbol={stockSymbol} setDisplayError={setDisplayError}/>
              } 
              {
                  (DisplayedData == "AIAssistant") && <AiChat setSearchInput={setSearchInput} HandleAiResponse={HandleAiResponse} AIAssistantSearchInput={AIAssistantSearchInput} AiResponses={AiResponses} UserPrompts={UserPrompts}/>
              }         
            </div>
        </section>
        {isModalOpen && (
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                <div className="ToBuyContent">
                  <header>
                    <div className='BuyStockTitle'>
                      <h2>Buy</h2>
                      <img className='StockLogo' style={{margin: "0 -0.5rem 0 0", width: "2.5rem"}} src={stockLogo} alt="Stock Logo" />
                      <h2>{StockName}</h2>
                    </div>
                  </header>
                  <div className='toBuyBody'>
                    <label htmlFor="quantity">Quantity:</label>
                    <input                         
                        aria-label="Enter the quantity here."
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {setQuantity(e.target.value); setCost((String(Number(e.target.value)*(stockPrice || 0))))}}
                        className="QuantityInput"
                        onBlur={() => {
                          if (quantity === "" || Number(quantity) < 1) {
                            setQuantity("0")
                          }
                          if (cost) setCost(Number(cost).toFixed(2));
                          if (quantity) setQuantity(Number(quantity).toFixed(2));
                        }}/>
                    <label htmlFor="cost">Total Cost:</label>
                    <input                         
                        aria-label="Price"
                        id="cost"
                        type="number"
                        value={(cost || String(Number(quantity)*(stockPrice || 0)))}
                        onChange={(e) => {
                          let q = (Number(e.target.value)/(stockPrice || 0))
                          setQuantity(String(q)); 
                          setCost(String(Number(q)*(stockPrice || 0)))}}
                        className="QuantityInput"
                        onBlur={() => {
                          if (cost) setCost(Number(cost).toFixed(2));
                          if (quantity) setQuantity(Number(quantity).toFixed(2));
                        }}
                        /> 
                  </div>
                  <footer className="ToBuyFooter">
                      <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button onClick={handleBuyStock}>Confirm Purchase</button>
                  </footer>
                </div>
              </div>
            </FocusTrap>
          )}    

        {displayError.display && 
        <FocusTrap>
          <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
            <Error setDisplayError={setDisplayError} warning={displayError.warning} title={displayError.title} bodyText={displayError.bodyText} buttonText={displayError.buttonText}/>
          </div>
        </FocusTrap>}
    </>
  );
};

export default StockDetail;
