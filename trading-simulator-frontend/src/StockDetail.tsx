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
    const [DisplayedData, setDisplayedData] = useState<any | null>("CompanyInformation")

    console.log(StockCompanyDetails)
    console.log(BasicStockData)

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
            console.log("This One:", response4.data)
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
            setDisplayedData("CompanyInformation")
            break
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
                <button onClick={() => SwitchSection("CompanyInformation")} className={"CompanyInformation" + (DisplayedData == "CompanyInformation" ? "Selected" : "")}>Overview</button>
                <button onClick={() => SwitchSection("StockData")} className={"StockData" + (DisplayedData == "StockData" ? "Selected" : "")}>Stock Data</button>
                <button onClick={() => SwitchSection("OwnedStocks")} className={"OwnedStocks" + (DisplayedData == "OwnedStocks" ? "Selected" : "")}>Owned Stocks</button>
                <button onClick={() => SwitchSection("News")} className={"News" + (DisplayedData == "News" ? "Selected" : "")}>News</button>
                <button onClick={() => SwitchSection("AIAssistant")} className={"AIAssistant" + (DisplayedData == "AIAssistant" ? "Selected" : "")}>AI Assistant</button>
              </div>
              {
                  (DisplayedData == "CompanyInformation") && 
                  <div className='CompanyInfoDisplayed'>
                      <div className='Description'>
                        <h3>Description</h3> 
                        <p>{StockCompanyDetails?.description != null ? StockCompanyDetails?.description : "Limited API Plan doesnt allow me to get the data"}</p>
                    </div>
                    <div>
                    <table>
                        <tbody>
                          <tr>
                            <td className='StockDetailsTableData'>CEO: {StockCompanyDetails?.ceo  != null ? StockCompanyDetails?.ceo : "Unavailable"}</td>
                            <td className='StockDetailsTableData'>Sector: {StockCompanyDetails?.sector != null ? StockCompanyDetails?.sector : "Unavailable"}</td>
                          </tr>
                          <tr>
                            <td className='StockDetailsTableData'>Exchange: {StockCompanyDetails?.exchange != null ? StockCompanyDetails?.exchange : "Unavailable"}</td>
                            <td className='StockDetailsTableData'>Industry: {StockCompanyDetails?.industry != null ? StockCompanyDetails?.industry : "Unavailable"}</td>
                          </tr>
                          <tr>
                            <td className='StockDetailsTableData'>Exchange: {StockCompanyDetails?.exchange != null ? StockCompanyDetails?.exchange : "Unavailable"}</td>
                            <td className='StockDetailsTableData'>Industry: {StockCompanyDetails?.industry != null ? StockCompanyDetails?.industry : "Unavailable"}</td>
                          </tr>
                          <tr>
                            <td className='StockDetailsTableData'>Employees: {StockCompanyDetails?.employees != null ? StockCompanyDetails?.employees : "Unavailable"}</td>
                            <td className='StockDetailsAddress'><p>Address: </p>
                            {StockCompanyDetails?.address != null ? 
                                <> <br />
                                  {StockCompanyDetails?.address} <br />
                                  {StockCompanyDetails?.address2} {StockCompanyDetails?.address2 == null ? <br /> : ""} 
                                  {StockCompanyDetails?.city} <br /> 
                                  {StockCompanyDetails?.zip + " " + StockCompanyDetails?.state} <br /> 
                                  {StockCompanyDetails?.country}

                                </>
                              : "Unavailable"}
                            </td>
                          </tr>
                          <tr>
                            <td className='StockDetailsTableData'> Website: <a href={StockCompanyDetails?.website}></a>{StockCompanyDetails?.website != null ? StockCompanyDetails?.sector : "Unavailable"}</td>
                            <td className='StockDetailsTableData'> Phone: {StockCompanyDetails?.phone != null ? StockCompanyDetails?.phone : "Unavailable"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              }
              {
                // Already have Data Ready
                  (DisplayedData == "StockData") && 
                  <div>
                    <p>{StockCompanyDetails != null ? JSON.stringify(StockCompanyDetails) : "Could not "}</p>
                  </div>
              }      
              {
                // Need to do
                  (DisplayedData == "OwnedStocks") && 
                  <div>
                  </div>
              } 
              {
                // Try AlphaVantage API
                  (DisplayedData == "News") && 
                  <div>
                  </div>
              } 
              {
                // Try the same one used in another project
                  (DisplayedData == "AIAssistant") && 
                  <div>
                  </div>
              }         
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

