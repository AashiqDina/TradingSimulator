import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { green } from '@mui/material/colors';

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
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const searchStock = async () => {
    try {
      setError('');
      const response = await axios.get<{ symbol: string; price: number }>(`http://localhost:3000/api/stocks/${stockSymbol}`);
      setStockPrice(response.data.price);
      const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${stockSymbol}`);
      setStockLogo(response2.data.image);
      const response3 = await axios.get<string>(`http://localhost:3000/api/stocks/GetStockName/${stockSymbol}`);
      setStockName(response3.data);
      const response4 = await axios.get<StockInfoResponse>(`http://localhost:3000/api/stocks/GetStockInfo/${stockSymbol}`);
      setStockQuickData(response4.data);

    } catch (err) {
      setError('Stock not found');
      setStockPrice(null);
    }
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
      <div className='StockSearch'>
        <input 
          type="text" 
          placeholder="Enter stock symbol (e.g, AAPL)" 
          className='StockSearchInput'
          value={stockSymbol} 
          onChange={(e) => setStockSymbol(e.target.value.toUpperCase())} 
          />
        <button className='StockSearchButton' onClick={searchStock}>Search</button>
        {((stockPrice !== null) &&
          <div className='CompleteSearchResult'>
            <div className='SearchResult'>
                {stockPrice !== null && (
                  <>
                    <h3 className='StockPriceText2'><img className='StockLogo' src={stockLogo} alt="Stock Logo" /> {stockName} </h3>
                    <span className='StockPrice'> £{stockPrice.toFixed(2)}</span>
                  </>
                )}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {(stockPrice !== null) && !user && (
                  <p className='LoginStockPriceText'>Log in to access additional information <br /> and purchase this stock.</p>
                )}
                {(stockPrice !== null) && user && (
                  <div className="BuyViewButtonsContainer">
                    <div className='BuyViewButtons'>
                      <button className="BuyButton" onClick={() => setIsModalOpen(true)}>Buy</button>
                      <button className="ViewButton" onClick={() => navigate(`/stock/${stockSymbol}`)}>View</button>
                    </div>
                  </div>
                )}
              </div>
              <div className='SearchResult2'>
                <h3>{stockName} <span className='Symb'>{stockSymbol}</span></h3>
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
                  <p>Last Close: <span style={{color: "#45a049"}}> £{stockQuickData?.closePrice ?? 'N/A'}</span></p>
              </div>
            </div>
        )}
       </div>
      {user ? (
        <>
      
          {isModalOpen && (
            <div className="Modal">
              <div className="ModalContent">
                <h2>Buy {stockSymbol.toUpperCase()}</h2>
                <div className="ModalBody">
                  <label htmlFor="quantity">Quantity:</label>
                  <input 
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
                </div>
                <div className="ModalFooter">
                  <button className="CancelButton" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button className="ConfirmButton" onClick={handleBuyStock}>Confirm Purchase</button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Home;
