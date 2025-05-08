import { useCallback, useEffect, useState } from "react";
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

type GetPortfolioResult = {
    portfolio: Portfolio | null;
    StockLogoArray: string[];
    StockNameArray: string[];
  };


export default function StockDetailsOwnedStocks(props: any){
    const [Portfolio, setPortfolio] = useState<any>(null);
    const [FilteredPortfolio, setFilteredPortfolio] = useState<Portfolio | null>(null);

    const [CurrentValue, setCurrentValue] = useState(0);
    const [ProfitLoss, setProfitLoss] = useState(0);
    const [TotalInvested, setTotalInvested] = useState(0);

    const user = props.user

    console.log(FilteredPortfolio)


    const GetData = useCallback( async() => {
        const result : GetPortfolioResult = await getPortfolio({ user });
        let FilteredStocks: Stock[] = []
    
        let currentValue = 0;
        let profitLoss = 0;
        let totalInvested = 0;

        console.log(result)
        if(result.portfolio && result.portfolio.stocks){
          setPortfolio(result.portfolio)
      
          if(result.StockLogoArray && result.StockNameArray){
              for(let i = 0; i<(result.portfolio.stocks.length); i++){
                if(result.portfolio.stocks[i].symbol == props.symbol){
                  console.log(i)
                  FilteredStocks.push(result.portfolio.stocks[i]);
                  currentValue += result.portfolio.stocks[i].totalValue;
                  profitLoss += result.portfolio.stocks[i].profitLoss;
                  totalInvested += result.portfolio.stocks[i].purchasePrice * result.portfolio.stocks[i].quantity;
                  }
              }

              setCurrentValue(currentValue);
              setProfitLoss(profitLoss);
              setTotalInvested(totalInvested);
              console.log(FilteredStocks)
              setFilteredPortfolio({currentValue: currentValue, id: result.portfolio.id, profitLoss: profitLoss, stocks: FilteredStocks, totalInvested: totalInvested, user: result.portfolio.user, userId: result.portfolio.userId})
          }
      }
    }, [user, props.symbol])

    useEffect(() => {
      GetData();
    },[GetData])

    return(
        <>
        <div className="OwnedStocksTable">
            <table className="Table">
              <thead>
                <tr>
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