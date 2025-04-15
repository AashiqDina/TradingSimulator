import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './StockDetail.css';
import { StockApiInfo, CompanyProfile } from "./interfaces";
import { useAuth } from "./AuthContext";


interface AxiosErrorType {
    response?: { data: string; status: number; statusText: string };
    message: string;
  }

const StockDetail: React.FC = () => {
    const { user } = useAuth();
    const { symbol } = useParams();
    const [StockName, setStockName] = useState("Unknown")
    const [stockLogo, setStockLogo] = useState<string>('');
    const [BasicStockData, setStockBasicData] = useState<StockApiInfo | null>(null);
    const [StockCompanyDetails, setCompanyDetails] = useState<CompanyProfile | null>(null);
    const [DisplayedData, setDisplayedData] = useState<any | null>(null)

    console.log(StockCompanyDetails)

    useEffect(() => {
        GetData()
    }, [])

    const GetData = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/api/stocks/GetStockName/${symbol}`);
            setStockName(response.data);
            const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${symbol}`);
            setStockLogo(response2.data.image);
            const response3 = await axios.get<{quoteData: StockApiInfo}>(`http://localhost:3000/api/stocks/GetStockQuoteInfo/${symbol}`);
            console.log(response3.data.quoteData);
            setStockBasicData(response3.data.quoteData);
            const response4 = await axios.get<{profile: CompanyProfile}>(`http://localhost:3000/api/stocks/GetCompanyDetails/${symbol}`);
            console.log(response4.data.profile)
            setCompanyDetails(response4.data.profile)



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

      function SwitchSection(Section: string){
        switch(Section){
          case "CompanyInformation":
            setDisplayedData("CompanyInformation")
          case "StockOverview":
            setDisplayedData("StockData")
          case "OwnedStocks":
            setDisplayedData("OwnedStocks")
          case "News":
            setDisplayedData("News")
          case "AIAssistant":
            setDisplayedData("AIAssistant")
          default:
            setDisplayedData("CompanyInformation")
        }
      }

  return (
    <>
        <div className='TitleBox'>
            <img className='TitleLogo' src={stockLogo} alt="Stock Logo" />
            <h1 className='Title'>{StockName}</h1>
            <span className='StockSymbol'>{symbol}</span>
        </div>
        <section className='MainBody'>
            <div className='StockDetails'>
              <div className='Selector'>
                <button onClick={() => SwitchSection("CompanyInformation")} className='CompanyInformation'>Overview</button>
                <button onClick={() => SwitchSection("StockData")} className='StockData'>Stock Data</button>
                <button onClick={() => SwitchSection("OwnedStocks")} className='OwnedStocks'>Owned Stocks</button>
                <button onClick={() => SwitchSection("News")} className='News'>News</button>
                <button onClick={() => SwitchSection("AIAssistant")} className='AIAssistant'>AI Assistant</button>
              </div>
              <p>{BasicStockData?.exchange}</p>
            </div>
            <div className='InteractiveGraph'>
              <h2>{StockName} Graph</h2>
            </div>
        </section>
    </>
  );
};

export default StockDetail;
function handleAxiosError(error: any) {
    throw new Error('Function not implemented.');
}

