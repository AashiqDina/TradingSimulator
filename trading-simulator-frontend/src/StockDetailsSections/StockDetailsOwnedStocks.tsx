import { useEffect, useState } from "react";
import getPortfolio from "../Functions/GetPortfolio";

type Stock = {
    symbol: string;
    quantity: number;
    purchasePrice: number;
    currentPrice: number;
    totalValue: number;
    profitLoss: number;
  };
  
type Portfolio = {
    id: string;
    userId: string;
    user: any;
    stocks: Stock[];
    currentValue: number;
    profitLoss: number;
    totalInvested: number;
  };


export default function StockDetailsOwnedStocks(props: any){
    const [Portfolio, setPortfolio] = useState<any>(null);
    const [StockLogoArray, setSLA] = useState<any[]>([]);
    const [StockNameArray, setSNA] = useState<any[]>([]);
    const [FilteredPortfolio, setFilteredPortfolio] = useState<Portfolio | null>(null);

    const user = props.user
    
    let FilteredStocks: Stock[] = []
    let FilteredSLA: any[] = []
    let FilteredSNA: any[] = []
    let CurrentValue = 0
    let ProfitLoss = 0
    let TotalInvested = 0

    const GetData = async() => {
        const result = await getPortfolio({ user });
        setPortfolio(result.portfolio)
        setSLA(result.StockLogoArray)
        setSNA(result.StockNameArray)
    
        if(result.portfolio && result.StockLogoArray && result.StockNameArray){
            for(let i = 0; i<(Portfolio.stocks.length); i++){
                if(Portfolio.stocks[i].symbol == props.symbol){
                FilteredStocks.push(Portfolio.stocks[i]);
                FilteredSLA.push(StockLogoArray[i]);
                FilteredSNA.push(StockNameArray[i]);
                
                CurrentValue += Portfolio.stocks[i].totalValue;
                ProfitLoss += Portfolio.stocks[i].profitLoss;
                TotalInvested += Portfolio.stocks[i].purchasePrice * Portfolio.stocks[i].quantity;
                }
            }
            setFilteredPortfolio({currentValue: CurrentValue, id: Portfolio.id, profitLoss: ProfitLoss, stocks: FilteredStocks, totalInvested: TotalInvested, user: Portfolio.user, userId: Portfolio.userId})
        }
    }

    useEffect(() => {
      GetData();
    },[])

    return(
        <>
        <div className="StocksTable">
            <table className="Table">
              <thead>
                <tr>
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0.5rem"}}></th>
                  <th style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                  <th style={{paddingRight: "1rem"}}>Quantity</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Bought Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Current Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Total Value</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}} className="PLTitle">Profit/Loss</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>%</th>
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th>

                </tr>
              </thead>
              <tbody>
                {FilteredPortfolio?.stocks.map((stock: any, index: number) => (
                  <tr key={index}>
                    <td><img className="StockLogos" src={FilteredSLA[index]} alt="Stock Logo" /></td>
                    <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{FilteredSNA[index]}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>{stock.quantity}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}> {(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{stock.currentPrice.toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(stock.profitLoss).toFixed(2)} </td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
    )
}