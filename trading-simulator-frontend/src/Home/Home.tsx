import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Functions/AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Confetti from 'react-confetti'
import { FocusTrap } from 'focus-trap-react';
import getStockApiInfo from '../Functions/getStockApiInfo';
import { StockApiInfo, Suggestion} from '../Interfaces/interfaces';
import getStockLastUpdated from '../Functions/getStockLastUpdated';
import formatNumber from '../Functions/FormatNumber';
import buyStock from '../Functions/buyStock';
import Error from '../Error/Error';
import getStockPrice from '../Functions/getStockPrice';
import getStockImage from '../Functions/getStockImage';
import getStockName from '../Functions/getStockName';

type StockInfo = {
  symbol: string;
  logo: string;
};

type StockMap = Record<string, StockInfo>;

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  let ProfitColour: string = '#45a049';
  let ProfitLossTitle: string = 'Profit';
  let ValueColour: string = '#45a049';

  if (user && user.profitLoss < 0) {
    ProfitColour = '#bb1515';
    ProfitLossTitle = 'Loss';
  }

  if (user && user.currentValue > user.investedAmount) {
    ValueColour = '#bb1515';
  }

  // State for stock search
  const [stockSymbol, setStockSymbol] = useState<string>('');
  const [stockSymbol2, setStockSymbolTwo] = useState<string>('');
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [stockLogo, setStockLogo] = useState<string>('');
  const [stockName, setStockName] = useState<string>('');
  const [BasicStockData, setStockBasicData] = useState<StockApiInfo | null>(null);
  const [stockFound, setFound] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("0");
  const [cost, setCost] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>();
  const [stockList, setStockList] = useState<any | null>();
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [displaySuggestions, setDisplaySuggestions] = useState<boolean>(false)
  const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
      const getMap = async () => {
        const map = await axios.get(`http://localhost:3000/api/stocks/GetStockList`)
        console.log(map.data)
        setStockList(map.data)
      };
  
      getMap();
    }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDisplaySuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchStock = async (symbol: string) => {
    let symb = ""
    console.log(symbol)

    if(symbol == ""){
      symb = stockSymbol
    }
    else{
      console.log(symbol)
      symb = symbol
    }

    setStockSymbolTwo(symb)
    setDisplaySuggestions(false)

    try {
      setError('');
      setFound(true)
      const response = await getStockPrice({symbol: symb, setDisplayError: setDisplayError})
      setStockPrice(response);
    } catch (err) {
      setError('| Stock Price not found |');
      setFound(false);
      setStockPrice(null);
    }
    try{
      const response2 = await getStockImage({symbol: symb, setDisplayError: setDisplayError})
      setStockLogo(response2);
    } catch (err){
      setError(error + ' | Stock Logo not found |');
    }
    try{
      const response3 = await getStockName({symbol: symb, setDisplayError: setDisplayError});
      setStockName(response3);
    } catch (err){
      setError(error + ' | Stock Name not found');
      setFound(false);
    }
    try{
      if(stockSymbol){
        const response4 = await getStockApiInfo({symbol: symb, setDisplayError: setDisplayError});
        console.log(response4);
        setStockBasicData(response4);
      }
    }
    catch{
      setError(error + ' | Stock Info not found');
      setFound(false);
    }
    try{
      if(stockSymbol){
        const response5 = await getStockLastUpdated(symb)
        console.log(response5);
        setLastUpdated(response5);
      }
    }
    catch{
      setError(error + ' | Last Updated not found');
      setFound(false);
    }
    console.log(error)
  };

  const handleBuyStock = async () => {
    await buyStock({stockPrice: stockPrice, stockSymbol: stockSymbol2, quantity: quantity, setShowConfetti: setShowConfetti, setIsModalOpen: setIsModalOpen, user: user, setDisplayError: setDisplayError})
  };

  const handleSuggestions = (symbol: string) => {
    if(symbol == ""){
      setSuggestions([])
    }
    
    console.log(stockList)
    if(stockList){
    const matches = (Object.entries(stockList) as [string, { symbol: string; logo: string }][])
            .filter(([name]) => name.toLowerCase().startsWith(symbol.toLowerCase()))
            .slice(0, 5)
            .map(([name, stock]) => ({
              name,
              symbol: stock.symbol,
              logo: stock.logo,
            }));

    setSuggestions(matches);
    console.log("Suggestions ",matches)
   }
  }

  return (
    <>
      {showConfetti && 
      <Confetti
        numberOfPieces={(Number(quantity) * 20) > 1000 ? 999 : (Number(quantity) * 20)}
        recycle={false}
      />}
      <section className='SearchAndResult'>
        <section ref={wrapperRef} className='StockSearch'>
          <section className='SearchSection'>
            <input 
              aria-label="Search by stock name or symbol (e.g. AAPL or Apple)"
              type="text" 
              placeholder="Search by stock name or symbol (e.g. AAPL or Apple)" 
              className='StockSearchInput'
              value={stockSymbol} 
              onChange={(e) => {
                setStockSymbol(e.target.value.toUpperCase())
                handleSuggestions(e.target.value.toLowerCase())
              }} 
              onFocus={() => setDisplaySuggestions(true)}

              onKeyDown={(e) => {
                if(e.key === "Enter"){
                  searchStock(stockSymbol)
                }
              }}
              />
            <button className='StockSearchButton' onClick={() => {searchStock("")}}>Search</button>
          </section>
          {displaySuggestions && suggestions.length != 0 && stockSymbol.length > 0 && <section className='SearchSuggestions'>
             {suggestions.map((suggestion, index) => {
              return (
                <button key={index} onClick={() => {searchStock(suggestion.symbol)}} style={(suggestions.length == 1) ? {margin: "0.5rem 0.5rem 0.5rem 0.5rem"} : (index == suggestions.length-1) ? {margin: "0rem 0.5rem 0.5rem 0.5rem"} : (index == 0) ? {margin: "0.5rem 0.5rem 0rem 0.5rem"} : {}}>
                  <img src={suggestion.logo} alt={`${suggestion.name[0].toUpperCase()}`} />
                  <h4>{suggestion.name}</h4>
                </button>
            )
            })}
          </section>}
        </section>
        {(stockFound && (stockPrice !== null) &&
          <section className='CompleteSearchResult'>
            <article className='SearchResult'>
              <div className='StockHeader'>
                <img className='StockLogo' src={stockLogo} alt={`stock logo`} />
                <h3>{stockName}</h3>
                <span>{stockSymbol2}</span>
              </div>
              <div className='StockBody'>
                <div className='StockBodyLeft'>
                  <div>
                    <h4>£{stockPrice.toFixed(2)}</h4>
                    <div>
                      <p style={BasicStockData?.percentChange && BasicStockData?.percentChange > 0 ? {color: "#45a049"} : {color: "#bb1515"}}>{BasicStockData?.percentChange && BasicStockData?.percentChange > 0 ? "+" : "-"}£{BasicStockData?.percentChange ? Math.abs((stockPrice-(stockPrice/((BasicStockData?.percentChange+100)/100)))).toFixed(2) : ""}</p>
                      <p style={BasicStockData?.percentChange && BasicStockData?.percentChange > 0 ? {color: "#45a049"} : {color: "#bb1515"}}>{BasicStockData?.percentChange && BasicStockData?.percentChange > 0 ? "+" : ""}{BasicStockData?.percentChange ? BasicStockData.percentChange.toFixed(2) : ""}%</p>
                    </div>
                    <p className='lastUpdated'>Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}</p>
                </div>
                </div>
                <div className='StockBodyRight'>
                  <div className='StockDailyRange' style={{width: "100%"}}>
                    <h4 style={{textAlign: 'left', padding: "0 0 0 10%" }}>Daily Range</h4>
                    <div style={{width: "100%"}}>
                      <div className='LineOne' style={{width: "80%"}}>
                        <div className='StockDailyAveragePoint'>
                          <span style={BasicStockData?.low && BasicStockData?.high ? {left: `${((stockPrice-BasicStockData.low)/(BasicStockData.high-BasicStockData.low))*100}%`} : {}}>
                          </span>
                          </div>
                      </div>
                    </div>
                    <div className='lhTitles'>
                      <p>£{BasicStockData?.low?.toFixed(2)}</p>
                      <p>£{BasicStockData?.high?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className='StockDailyRange' style={{width: "100%"}}>
                    <h4 style={{textAlign: 'left', padding: "0 0 0 10%", marginTop: "0.4rem" }}>52-Week Range</h4>
                    <div style={{width: "100%"}}>
                      <div className='LineOne' style={{width: "80%"}}>
                        <div className='StockDailyAveragePoint'>
                          <span style={BasicStockData?.fiftyTwoWeek.range ? {left: `${((stockPrice-Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0]))/(Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[2])-Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0])))*100}%`} : {}}>
                          </span>
                          </div>
                      </div>
                    </div>
                    <div className='lhTitles'>
                      <p>£{Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0]).toFixed(2)}</p>
                      <p>£{Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[2]).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className='genericFlexRow'>
                    <h4 className='VolumeGFR'>Volume: <span style={{fontWeight: 400}}>{formatNumber(Number(BasicStockData?.volume))}</span></h4>
                    <h4 className='VolumeGFR'>Average Volume: <span style={{fontWeight: 400}}>{formatNumber(Number(BasicStockData?.averageVolume))}</span></h4>
                  </div>
                </div>
              </div>
              <div className='StockFooter'>
                <button aria-label="View Stock Details" onClick={() => navigate(`/stock/${encodeURIComponent(String(stockSymbol2 ?? ''))}`)}>View</button>
                <button aria-label='Buy Stock' onClick={() => setIsModalOpen(true)}>Buy</button>
              </div>
              </article>
            </section>
        )}
        {(stockFound != null && !stockFound && 
          <>
            <div className='StockNotFound'>
                <h2>Stock Symbols found matching {stockSymbol}</h2>
            </div>
          </>
        )}
        {(stockFound == null) && <article>
          <h2>Trending Stocks</h2>
        </article>

        }

       </section>
      {user ? (
        <>
          {isModalOpen && !displayError.display && (
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                <div className="ToBuyContent">
                  <header>
                    <div className='BuyStockTitle'>
                      <img className='StockLogo' style={{margin: "0 -0.5rem 0 0", width: "2.5rem", height: "2.5rem"}} src={stockLogo} alt="Stock Logo" />
                      <h2>Buy {stockName} stocks</h2>
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
                  {/* <div className="ToBuyBody">
                    <main>
                      <label htmlFor="quantity">Quantity:</label>
                      <input 
                        aria-label="Enter the quantity here."
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="QuantityInput"
                        min="1"
                      />
                      <p>
                        Total Cost: £{stockPrice !== null ? (stockPrice * quantity).toFixed(2) : 'N/A'}
                      </p>
                    </main>
                  </div> */}
                  <footer className="ToBuyFooter">
                      <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button onClick={handleBuyStock}>Confirm Purchase</button>
                  </footer>
                </div>
              </div>
            </FocusTrap>
          )}
        </>
      ) : (
        <></>
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

export default Home;
