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
import getTrendingStocks from '../Functions/getTrendingStocks';
import Loading from '../Loading/Loading';
import getMarketNews from '../Functions/getMarketNews';

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
  const [stockList, setStockList] = useState<Record<string, {symbol: string, logo: string}> | null>();
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [displaySuggestions, setDisplaySuggestions] = useState<boolean>(false)
  const [displayError, setDisplayError] = useState<{display: boolean, warning: boolean, title: string, bodyText: string, buttonText: string}>({display: false, title: "", bodyText: "", warning: false, buttonText: ""});
  const [trendingStocksList, setTrendingStocksList] = useState<string[]>([])
  const [marketNews, setMarketNews] = useState<any[] | null>(null)
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
    const getMap = async () => {
      const result = await getMarketNews({setDisplayError: setDisplayError})
      console.log(result)
      setMarketNews(result)
    };
  
    getMap();
  }, []);

  useEffect(() => {
    const getTrendingList = async () => {
      const trendingStocks =  await getTrendingStocks({setDisplayError: setDisplayError});
      console.log(trendingStocks)
      setTrendingStocksList(trendingStocks);
    }
    getTrendingList();
  },[]);

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

    // get stockPrice
    // if no error continue
    // otherwise display cant find the stock


    if(symbol == ""){
      navigate(`/stock/${encodeURIComponent(String(stockSymbol ?? ''))}`)
    }
    else{
      navigate(`/stock/${encodeURIComponent(String(symbol ?? ''))}`)
    }

  };

  function getNameImage(theSymbol: string){
    if(stockList == null){
      return null
    }
    for(const [name, {symbol, logo}] of Object.entries(stockList)){
      if(theSymbol == symbol){
        return {name, logo}
      }
    } 
    return null
  }

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
        {/* {(
          <>
            <div className='StockNotFound'>
                <h2>Stock Symbols found matching {stockSymbol}</h2>
            </div>
          </>
        )} */}
      </section>
      <section className='MotherBody'>
      <section className='CompleteTrendingBody'>
        {(trendingStocksList.length != 0) && <article className='TrendingStocksSectionTitle'>
          <h2>Trending Stocks</h2>
        </article>}
        {(trendingStocksList.length != 0) && <article className='TrendingStocksSection'>
          <div className='TrendingStocksCarouselContainer'>
            <div className='TrendingStocksCarouselTrack'>
              {
                trendingStocksList.map((stock, index) => {
                  const data = getNameImage(stock)
                  return (
                    <div className='TrendingStockDiv' key={stock} onClick={() => {searchStock(stock);}}>
                      <img src={data?.logo} alt={data?.name} />
                      <h2>{data?.name}</h2>
                    </div>
                  )
                })
              }
              {
                trendingStocksList.map((stock, index) => {
                  const data = getNameImage(stock)
                  return (
                    <div className='TrendingStockDiv' key={stock + index} onClick={() => searchStock(stock)}>
                      <img src={data?.logo} alt={data?.name} />
                      <h2>{data?.name}</h2>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </article>}

        {(trendingStocksList.length == 0) && <article className='TrendingStocksSection'>
          <Loading/>
        </article>}
      </section>
      </section>
      <section className='NewsTitleSection'>
          <section className='HomeNewsSectionTitle'>
            <article>
              <h2>Today's News</h2>
            </article>
          </section>
      </section>
      <section className='MotherBody2'>
          <article className='HomeNewsSection'>
            {
              (marketNews != null) ? 
                [marketNews[0], marketNews[1], marketNews[2]].map((news) => {
                  return (
                    <a href={news.url} className='CompleteMarketNews'>
                      <div className='marketNewsImage'>
                        <img src={news.image} alt="" />
                      </div>
                      <div className='marketNewsContainer'>
                        <div className='marketNewsHeader'>
                          <h3>{news.headline}</h3>
                        </div>
                        <div className='marketNewsBody'>
                          <p>{news.summary}</p>
                        </div>
                        <div className='marketNewsFooter'>
                          <p>Source: <span>{news.source}</span></p>
                          <p>{new Date(news.datetime * 1000).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}</p>
                        </div>
                      </div>
                    </a>
                  )
                })
                : undefined
            }
          </article>
      </section>
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
