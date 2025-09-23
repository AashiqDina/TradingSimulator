import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Confetti from 'react-confetti'
import { FocusTrap } from 'focus-trap-react';
import QuickStats from './PorfolioSections/QuickStats';

interface StockInfoResponse {
  lastUpdated: string | null;
  lowPrice: number | null;
  highPrice: number | null;
  fiftyTwoWeekRange: string | null;
  closePrice: number | null;
  percentChange: number | null;
}

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
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [stockLogo, setStockLogo] = useState<string>('');
  const [stockName, setStockName] = useState<string>('');
  const [stockQuickData, setStockQuickData] = useState<StockInfoResponse | null>(null)
  const [stockFound, setFound] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [showConfetti, setShowConfetti] = useState(false);

  const searchStock = async () => {
    try {
      setError('');
      setFound(true)
      const response = await axios.get<{ symbol: string; price: number }>(`http://localhost:3000/api/stocks/${stockSymbol}`);
      setStockPrice(response.data.price);
    } catch (err) {
      setError('Stock Price not found');
      setFound(false);
      setStockPrice(null);
    }
    try{
      const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${stockSymbol}`);
      setStockLogo(response2.data.image);
    } catch (err){
      setError(error + ' | Stock Logo not found |');
    }
    try{
      const response3 = await axios.get<string>(`http://localhost:3000/api/stocks/GetStockName/${stockSymbol}`);
      setStockName(response3.data);
    } catch (err){
      setError(error + ' | Stock Name not found');
      setFound(false);
    }
    try{
      const response4 = await axios.get<StockInfoResponse>(`http://localhost:3000/api/stocks/GetStockInfo/${stockSymbol}`);
      setStockQuickData(response4.data);
      console.log("Quick Data: ", response4.data)
    } catch (err) {
      setError(error + ' | Stock Data not found');
      setFound(false);
    }
    console.log(error)
  };

  const handleBuyStock = async () => {
    if (stockPrice === null) {
      alert('Stock price not available.');
      return;
    }

    if (quantity <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }

    const stockPurchaseRequest = {
      symbol: stockSymbol,
      quantity: quantity,
    };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/portfolio/${user?.id}/stocks`,
        stockPurchaseRequest
      );
      alert('Stock purchased successfully');
      setShowConfetti(true)
      setTimeout(() => {setShowConfetti(false)}, 100000)
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error purchasing stock:', error);
      alert('Error purchasing stock');
    }
  };

  useEffect(() => {
    if (stockQuickData) {
      console.log('Updated Stock Data:', stockQuickData);
    }
  }, [stockQuickData]);

  return (
    <>
      {showConfetti && 
      <Confetti
        numberOfPieces={(quantity * 20) > 1000 ? 999 : (quantity * 20)}
        recycle={false}
      />}
      <section className='StockSearch'>
        <section className='SearchSection'>
          <input 
            aria-label="Enter stock symbol (e.g, AAPL)"
            type="text" 
            placeholder="Enter stock symbol (e.g, AAPL)" 
            className='StockSearchInput'
            value={stockSymbol} 
            onChange={(e) => setStockSymbol(e.target.value.toUpperCase())} 
            />
          <button className='StockSearchButton' onClick={searchStock}>Search</button>
        </section>
        {(stockFound && (stockPrice !== null) &&
          <section className='CompleteSearchResult'>
            <article className='SearchResult'>
              <div className='StockHeader'>
                <img className='StockLogo' src={stockLogo} alt={`${stockName} Logo`} />
                <h3>{stockName}</h3>
                <span>{stockSymbol}</span>
              </div>
              <div className='StockBody'>
                <div className='StockBodyLeft'>
                  <div>
                    <h4>£{stockPrice.toFixed(2)}</h4>
                    <div>
                      <p style={stockQuickData?.percentChange && stockQuickData?.percentChange > 0 ? {color: "#45a049"} : {color: "#bb1515"}}>{stockQuickData?.percentChange && stockQuickData?.percentChange > 0 ? "+" : "-"}£{stockQuickData?.percentChange ? Math.abs((stockPrice-(stockPrice/((stockQuickData?.percentChange+100)/100)))).toFixed(2) : ""}</p>
                      <p style={stockQuickData?.percentChange && stockQuickData?.percentChange > 0 ? {color: "#45a049"} : {color: "#bb1515"}}>{stockQuickData?.percentChange && stockQuickData?.percentChange > 0 ? "+" : ""}{stockQuickData?.percentChange ? stockQuickData.percentChange.toFixed(2) : ""}%</p>
                    </div>
                    <p>Last Updated: {stockQuickData?.lastUpdated ? new Date(stockQuickData?.lastUpdated).toLocaleString("en-GB", {
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
                          <span style={stockQuickData?.lowPrice && stockQuickData?.highPrice ? {left: `${((stockPrice-stockQuickData.lowPrice)/(stockQuickData.highPrice-stockQuickData.lowPrice))*100}%`} : {}}>
                          </span>
                          </div>
                          {/* </div>stockQuickData?.lowPrice && stockQuickData?.highPrice ? {left: `${Math.floor(stockPrice-stockQuickData?.lowPrice)/(stockQuickData?.highPrice-stockQuickData?.lowPrice)*100}%}`}: {}}></span></div> */}
                      </div>
                    </div>
                    <div className='lhTitles'>
                      <p>£{stockQuickData?.lowPrice}</p>
                      <p>£{stockQuickData?.highPrice}</p>
                    </div>
                  </div>
                  <p>data</p>
                  <p>data</p>
                  <p>data</p>

                </div>
              </div>
              <div className='StockFooter'>
                <button aria-label="View Stock Details" onClick={() => navigate(`/stock/${stockSymbol}`)}>View</button>
                <button aria-label='Buy Stock' onClick={() => setIsModalOpen(true)}>Buy</button>
              </div>

{/* 
                {stockPrice !== null && (
                  <>
                    <h3 className='StockPriceText2'><img className='StockLogo' src={stockLogo} alt={`${stockName},  Logo"`} /> {stockName} </h3>
                    <span className='StockPrice'> £{stockPrice.toFixed(2)}</span>
                  </>
                )}
                {error && <p  role="alert" aria-live="assertive" style={{ color: 'red' }}>{error}</p>}
                {(stockPrice !== null) && !user && (
                  <p className='LoginStockPriceText'>Log in to access additional information <br /> and purchase this stock.</p>
                )}
                {(stockPrice !== null) && user && (
                  <div className="BuyViewButtonsContainer">
                    <div className='BuyViewButtons'>
                      <button aria-label='Buy Stock' className="BuyButton" onClick={() => setIsModalOpen(true)}>Buy</button>
                      <button aria-label="View Stock Details" className="ViewButton" onClick={() => navigate(`/stock/${stockSymbol}`)}>View</button>
                    </div>
                  </div>
                )}
              </article>
              <article className='SearchResult2'>
                <div className='SR2Head'>
                  <h3>{stockName} </h3>
                  <span className='Symb'>{stockSymbol}</span>
                </div>
                  <p>Last Updated: <span style={{color: "#45a049"}}>{stockQuickData?.lastUpdated 
                    ? new Date(stockQuickData.lastUpdated).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'N/A'} </span></p>
                  <p>24h-Hour range: <span style={{color: "#45a049"}}>£{stockQuickData?.lowPrice ?? 'N/A'} - £{stockQuickData?.highPrice ?? 'N/A'} ({stockQuickData?.percentChange?.toFixed(2) ?? 'N/A'}%)</span></p>
                  <p>52-Week range:  <span style={{color: "#45a049"}}> {stockQuickData?.fiftyTwoWeekRange 
                      ? stockQuickData?.fiftyTwoWeekRange
                          .split(' - ')
                          .map((price, index) => `£${price}`)
                          .join(' - ')
                      : 'N/A'} </span></p>
                  <p>Last Close: <span style={{color: "#45a049"}}> £{stockQuickData?.closePrice ?? 'N/A'}</span></p> */}
             
              </article>
            </section>
        )}
        {(stockFound != null && !stockFound && 
          <>
            <div className='StockNotFound'>
                <h2>Stock Not Found</h2>
            </div>
          </>
        )}

       </section>
      {user ? (
        <>
      
          {isModalOpen && (
            <FocusTrap>
              <div className="ToBuyModal" aria-labelledby="BuyStockTile" role='dialog' aria-modal="true">
                <div className="ModalContent">
                  <header>
                    <h2 id='BuyStockTitle'>Buy {stockName}</h2>
                  </header>
                  <div className="ModalBody">
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
                  </div>
                  <footer className="ModalFooter">
                      <button className="CancelButton" onClick={() => setIsModalOpen(false)}>Cancel</button>
                      <button className="ConfirmButton" onClick={handleBuyStock}>Confirm Purchase</button>
                  </footer>
                </div>
              </div>
            </FocusTrap>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
