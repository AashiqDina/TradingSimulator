import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Functions/AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { FocusTrap } from 'focus-trap-react';
import Error from '../Error/Error';
import getStockPrice from '../Functions/getStockPrice';
import getTrendingStocks from '../Functions/getTrendingStocks';
import Loading from '../Loading/Loading';
import getMarketNews from '../Functions/getMarketNews';
import SponsoredAd from '../Ads/SponsoredAd';
import AiLoading from "../Loading/AiLoading"

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
  const [marketNewsIndex, setMarketNewsIndex] = useState<{index: number, direction: string}>({index: 0, direction: "left"})
  const [WinWidth, setWinWidth] = useState(window.innerWidth);
  const [isLoading, setIsLoading] = useState(true)
  const MarketNewsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
      const getMap = async () => {
        const map = await axios.get(`http://localhost:3000/api/stocks/GetStockList`)
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
      setTrendingStocksList(trendingStocks);
      setIsLoading(false)
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

  useEffect(() => {
    MarketNewsRef.current.forEach((el) => {
    if(!el){
      return
    };
    if(marketNewsIndex.direction == "left"){
      el.classList.remove("newsAnimateLeft");
      void el.offsetWidth;
      el.classList.add("newsAnimateLeft");
    }
    else{
      el.classList.remove("newsAnimateRight");
      void el.offsetWidth;
      el.classList.add("newsAnimateRight");
    }
  });
  }, [marketNewsIndex])

  useEffect(() => {
    const handleResize = () => setWinWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchStock = async (symbol: string) => {

    var stockPrice = undefined

    if(symbol == ""){
      stockPrice = await getStockPrice({symbol: stockSymbol, setDisplayError: setDisplayError})
    }
    else{
      stockPrice = await getStockPrice({symbol: symbol, setDisplayError: setDisplayError})
    }

    if(stockPrice != null){
      if(symbol == ""){
        navigate(`/stock/${encodeURIComponent(String(stockSymbol ?? ''))}`)
      }
      else{
        navigate(`/stock/${encodeURIComponent(String(symbol ?? ''))}`)
      }
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
    
    if(stockList){
    const matches = (Object.entries(stockList) as [string, { symbol: string; logo: string }][])
            .filter(([name, data]) => {
              return(
                name.toLowerCase().startsWith(symbol.toLowerCase()) || data.symbol.toLowerCase().startsWith(symbol)
              )
            })
            .slice(0, 5)
            .map(([name, stock]) => ({
              name,
              symbol: stock.symbol,
              logo: stock.logo,
            }));

    setSuggestions(matches);
   }
  }

  function newsLeft(){
    marketNewsIndex.index == 0 ? setMarketNewsIndex({index: 97, direction: "left"}) : setMarketNewsIndex({index: marketNewsIndex.index-3, direction: "left"})

  }

  function newsRight(){
    marketNewsIndex.index >= 97 ? setMarketNewsIndex({index: 0, direction: "right"}) : setMarketNewsIndex({index: marketNewsIndex.index+3, direction: "right"})
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
            <button aria-label={`Search for ${stockSymbol}`} className='StockSearchButton' onClick={() => {searchStock("")}}>Search</button>
          </section>
          {displaySuggestions && suggestions && suggestions.length !== 0 && stockSymbol.length > 0 && <section className='SearchSuggestions'>
             {suggestions.map((suggestion, index) => 
                suggestion.symbol ? (
                <button key={suggestion.symbol} onClick={() => {searchStock(suggestion.symbol)}} style={(suggestions.length == 1) ? {margin: "0.5rem 0.5rem 0.5rem 0.5rem"} : (index == suggestions.length-1) ? {margin: "0rem 0.5rem 0.5rem 0.5rem"} : (index == 0) ? {margin: "0.5rem 0.5rem 0rem 0.5rem"} : {}}>
                  <img src={suggestion.logo} alt="" />
                  <h4>{suggestion.name}<span className='suggestionSymbol'>{suggestion.symbol}</span></h4>
                </button>) : (<AiLoading/>)
                )}
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
        {(trendingStocksList && trendingStocksList.length > 0) && <article className='TrendingStocksSectionTitle'>
          <h2>Trending Stocks</h2>
        </article>}
        {(trendingStocksList && trendingStocksList.length > 0) ? <article className='TrendingStocksSection'>
          <div className='TrendingStocksCarouselContainer'>
            <div className='TrendingStocksCarouselTrack'>
              {
                trendingStocksList.map((stock, index) => {
                  const data = getNameImage(stock)
                  if(!(trendingStocksList.length > 0 && stockList)){
                    return (
                      <button className='TrendingStockDiv' key={stock}>
                        { WinWidth > 600 ? <Loading scale={0.2} marginBottom={-0.3}/> : <Loading scale={0.1} marginBottom={-0.4}/>}
                      </button>
                    )
                  }
                  if(!data){
                    return (
                      <button className='TrendingStockDiv' key={stock}>
                        <img src={process.env.PUBLIC_URL + "/Error.svg"} alt="ERROR SYMBOL" />
                        <h2>Error - No Stock Found</h2>
                      </button>
                    )
                  }
                  return (
                    <button className='TrendingStockDiv' key={stock} onClick={() => {searchStock(stock);}}>
                      <img src={data?.logo} alt="" />
                      <h2>{data?.name}</h2>
                    </button>
                   )
                })
              }
              {
                trendingStocksList.map((stock, index) => {
                  const data = getNameImage(stock)
                  if(!(trendingStocksList.length > 0 && stockList)){
                    return (
                      <button className='TrendingStockDiv' key={stock} onClick={() => {searchStock(stock);}}>
                        { WinWidth > 600 ? <Loading scale={0.2} marginBottom={-0.3}/> : <Loading scale={0.1} marginBottom={-0.4}/>}
                      </button>
                    )
                  }
                  if(!data){
                    return (
                      <button className='TrendingStockDiv' key={stock} onClick={() => {searchStock(stock);}}>
                        <img src={process.env.PUBLIC_URL + "/Error.svg"} alt="ERROR SYMBOL" />
                        <h2>Error - No Stock Found</h2>
                      </button>
                    )
                  }
                  return (
                    <button className='TrendingStockDiv' key={stock} onClick={() => {searchStock(stock);}}>
                      <img src={data?.logo} alt="" />
                      <h2>{data?.name}</h2>
                    </button>
                   )
                })
              }
            </div>
          </div>
        </article> :
        isLoading ? <article className='TrendingStocksSection'>
          <Loading/>
        </article> :
        <h3 className='NoNewsFoundHeading'>No Stocks Current Trending</h3>        
        }
      </section>
      </section>
      <>
      <section className='NewsTitleSection'>
          <section className='HomeNewsSectionTitle'>
            <article>
              <h2>Today's News</h2>
              <div className='newsArrowContainer'>
                <button className='newsArrowTriangleContainer' onClick={() => {newsLeft()}}>
                  <div className='newsLeftArrow'></div>
                </button>
                <button className='newsArrowTriangleContainer' onClick={() => {newsRight()}}>
                  <div className='newsRightArrow'></div>
                </button>
              </div>
            </article>
          </section>
      </section>
      <section className='MotherBody2'>
          <article className='HomeNewsSection' style={((marketNews == null && trendingStocksList.length != 0) || (marketNews?.length == 0)) ? {justifyContent: 'center'} : undefined}>
            {false && <SponsoredAd></SponsoredAd>} {/* Doesnt work unless I have a domain, didnt know about that until after all of this*/}
            {
              (marketNews == null && trendingStocksList.length != 0) ?
                <Loading top={8} height={46} marginBottom={-1}/>
              :
              (marketNews && marketNews.length == 0) ? <h3 className='NoNewsFoundHeading'>No News Found</h3> :
              (marketNews != null) ? 
                marketNews.slice(marketNewsIndex.index, marketNewsIndex.index + 3).map((news, index) => {
                  console.log(news)
                  return (
                    <a href={news.url || "brokenURL"} aria-label={`Read news: ${news.headline || "brokenHeadline"}`} className='CompleteMarketNews' key={news.url || index} style={{animationDelay: `${index * 0.1}s`}} ref={(el) => {if (el) MarketNewsRef.current[index] = el;}}>
                      <div className='marketNewsImage'>
                        {WinWidth > 600 && <img src={news.image || "brokenSource"} alt={news.source + " image" || "brokenSource"} />}
                      </div>
                      <div className={WinWidth > 600 ? 'marketNewsContainer' : 'marketNewsContainerMobile'}>
                        <div className={WinWidth > 600 ? 'marketNewsHeader' : 'marketNewsHeaderMobile'}>
                          {WinWidth < 600 && <img className='newsImageInHeader' src={news.image || "brokenSource"} alt={news.source + " image"} />}
                          <h3>{news.headline || "brokenHeadline"}</h3>
                        </div>
                        <div className='marketNewsBody'>
                          <p>{news.summary || "brokenSummary"}</p>
                        </div>
                        <div className='marketNewsFooter'>
                          <p>Source: <span>{news.source || "brokenSource"}</span></p>
                          <p>{new Date(news.datetime * 1000 || "0000000").toLocaleString("en-GB", {
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
      </>
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


