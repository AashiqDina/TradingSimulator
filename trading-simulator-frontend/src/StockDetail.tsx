import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";
import './StockDetail.css';
import { StockApiInfo, CompanyProfile } from "./interfaces";
import { useAuth } from "./AuthContext";
import { StocksAI } from './StocksAI';
import AiLoading from './AiLoading';


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
    const [UserPrompts, setUserPrompts] = useState<string[]>([""])
    const [AiResponses, setAiResponses] = useState<string[]>([""])
    const [AIAssistantSearchInput,setSearchInput] = useState<string>("")

    console.log(BasicStockData)
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
          AiResponse != null ? setAiResponses([AiResponse]) : setAiResponses(["Could no get AI Data"])
        }
        else{
          AiResponse != null ? setAiResponses(prevValues => [
            ...prevValues,
            AiResponse
          ]) : setAiResponses(prevValues => [
            ...prevValues,
            "Could not get AI Data"
          ])
        }
        setSearchInput("")
      }
      catch{
      }
    }

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

      const container = document.getElementById('Chat');
      if (container) {
        container.scrollTop = 0;
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
                            <td className='StockDetailsTableData'>Mic Code: {StockCompanyDetails?.micCode != null ? StockCompanyDetails?.micCode : "Unavailable"}</td>
                            <td className='StockDetailsTableData'>Type: {StockCompanyDetails?.type != null ? StockCompanyDetails?.type : "Unavailable"}</td>
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
                            <td className='StockDetailsTableData'> Website: <a href={StockCompanyDetails?.website}>{StockCompanyDetails?.website != null ? StockCompanyDetails?.website : "Unavailable"}</a></td>
                            <td className='StockDetailsTableData'> Phone: {StockCompanyDetails?.phone != null ? StockCompanyDetails?.phone : "Unavailable"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              }
              {
                  (DisplayedData == "StockData") && 
                  <div className='StockDataDisplayed'>
                    <div className='ColumnOne'>
                      <div className='FiftyWeek'>
                        <h3>Last 52 Weeks:</h3>
                        <p>High: {BasicStockData?.fiftyTwoWeek.high.toFixed(2)}</p>
                        <p>High Change: {BasicStockData?.fiftyTwoWeek.highChange.toFixed(2)}  <span style={BasicStockData?.fiftyTwoWeek.highChangePercent != null && BasicStockData?.fiftyTwoWeek.highChangePercent > 0 ? {color: "#3e9143"} : {color: "red"}}> {BasicStockData?.fiftyTwoWeek.highChangePercent.toFixed(2)}%</span></p>
                        <p>Low: {BasicStockData?.fiftyTwoWeek.low.toFixed(2)}</p>
                        <p>Low Change: {BasicStockData?.fiftyTwoWeek.lowChange.toFixed(2)}  <span style={BasicStockData?.fiftyTwoWeek.lowChangePercent != null && BasicStockData?.fiftyTwoWeek.lowChangePercent > 0 ? {color: "#3e9143"} : {color: "red"}}> {BasicStockData?.fiftyTwoWeek.lowChangePercent.toFixed(2)}%</span></p>


                      </div>
                    </div>
                    <div className='ColumnTwo'>
                      <h3>Column 2</h3>
                    </div>
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
                  <div className='ChatDisplayed'>
                    <div id='Chat' className='Chat'>
                      { UserPrompts.map((UserPrompts, index) => (
                        <>
                          {UserPrompts != "" && <div className='UserMessageDisplayed'>
                            <h2>{UserPrompts}</h2>
                          </div>}
                          <div className='AiMessageDisplayed'>
                            {AiResponses[0] != "" && <h2>{AiResponses[index] || <AiLoading/>}</h2>}
                          </div>
                        </>
                      ))
                      }
                    </div>
                    <div className='ChatQueryBar'>
                      <input value={AIAssistantSearchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" />
                      <button onClick={() => HandleAiResponse()}>Submit</button>
                    </div>
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

