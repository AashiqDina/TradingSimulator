import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Define stock data structure
interface StockDataPoint {
  datetime: string;
  close: number;
}

// Cache for API responses to avoid unnecessary API calls
const stockCache: Record<string, StockDataPoint[]> = {};

const StockDetails = () => {
  const { stockSymbol } = useParams<{ stockSymbol: string }>(); // Get symbol from URL
  const [timeframe, setTimeframe] = useState("1day"); // Default to daily view
  const [data, setData] = useState<StockDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API request function (fetches only if not in cache)
  const fetchStockData = async (symbol: string, interval: string) => {
    const cacheKey = `${symbol}-${interval}`;

    if (stockCache[cacheKey]) {
      setData(stockCache[cacheKey]); // Use cached data
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=YOUR_API_KEY`
      );

      if (response.data.values) {
        const formattedData = response.data.values.map((entry: any) => ({
          datetime: entry.datetime,
          close: parseFloat(entry.close),
        }));

        stockCache[cacheKey] = formattedData; // Store in cache
        setData(formattedData);
      } else {
        setError("No data available.");
      }
    } catch (err) {
      setError("Failed to fetch stock data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when stock symbol or timeframe changes
  useEffect(() => {
    if (stockSymbol) {
      fetchStockData(stockSymbol, timeframe);
    }
  }, [stockSymbol, timeframe]);

  return (
    <div className="stock-details">
      <h2>{stockSymbol} Stock History</h2>

      {/* Timeframe selection */}
      <div className="timeframe-buttons">
        {["1day", "1week", "1month", "1year", "max"].map((interval) => (
          <button key={interval} onClick={() => setTimeframe(interval)} className={timeframe === interval ? "active" : ""}>
            {interval.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Display chart or loading/error message */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.reverse()} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="datetime" hide={timeframe !== "1day"} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockDetails;
