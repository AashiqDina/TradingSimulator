import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./Home.css";

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
  const [error, setError] = useState<string>('');

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const searchStock = async () => {
    try {
      setError('');
      const response = await axios.get<{ symbol: string; price: number }>(`http://localhost:3000/api/stocks/${stockSymbol}`);
      setStockPrice(response.data.price);
    } catch (err) {
      setError('Stock not found');
      setStockPrice(null);
    }
  };

  const handleBuyStock = async () => {
    // First, check that stockPrice is not null
    if (stockPrice === null) {
      alert('Stock price not available.');
      return; // Exit the function if stockPrice is null
    }

    // Check that the quantity is greater than 0
    if (quantity <= 0) {
      alert('Please enter a valid quantity.');
      return; // Exit if quantity is invalid
    }

    const stockPurchaseRequest = {
      symbol: stockSymbol,
      quantity: quantity,
    };

    try {
      // Ensure you're calling the correct endpoint based on your controller
      const response = await axios.post(
        `http://localhost:3000/api/portfolio/${user?.id}/stocks`,
        stockPurchaseRequest
      );
      alert('Stock purchased successfully');
      setIsModalOpen(false); // Close the modal after purchase
    } catch (error) {
      console.error('Error purchasing stock:', error);
      alert('Error purchasing stock');
    }
  };


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
        <div className='SearchResult'>
            {stockPrice !== null && (
              <>
                <p className='StockPriceText'>Current Price of {stockSymbol.toUpperCase()}:</p>
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
          </div>)}
       </div>
      {user ? (
        <>
      
          {/* Modal for selecting quantity */}
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
