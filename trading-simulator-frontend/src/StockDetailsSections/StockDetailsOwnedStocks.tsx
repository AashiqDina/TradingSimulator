import { useCallback, useEffect, useState } from "react";
import getPortfolio from "../Functions/GetPortfolio";
import axios from "axios";
import AiLoading from "../Loading/AiLoading";

export default function StockDetailsOwnedStocks(props: any){
    const [Portfolio, setPortfolio] = useState<any | null>(null);
    const [FilteredPortfolio, setFilteredPortfolio] = useState<any | null>(null);
    const [LastUpdatedDictionary, setLastUpdatedDictionary] = useState<Map<string, Date> | null>(null)
    const [Loading, setLoading] = useState<boolean>(true);
    

    const user = props.user

    console.log(FilteredPortfolio)


    const GetData = useCallback( async() => {
        const result = await getPortfolio({ user });
        let FilteredStocks = []
    
        let currentValue = 0;
        let profitLoss = 0;
        let totalInvested = 0;

        console.log(result)
        if(result && result.stocks){
          console.log("In")
          setPortfolio(result)
      
        for(let i = 0; i<(result.stocks.length); i++){
          if(result.stocks[i].symbol == props.symbol){
            console.log(i)
            FilteredStocks.push(result.stocks[i]);
            currentValue += result.stocks[i].totalValue;
            profitLoss += result.stocks[i].profitLoss;
            totalInvested += result.stocks[i].purchasePrice * result.stocks[i].quantity;
            }
          }
          console.log(FilteredStocks)
          setFilteredPortfolio({currentValue: currentValue, id: result.id, profitLoss: profitLoss, stocks: FilteredStocks, totalInvested: totalInvested, user: result.user, userId: result.userId})
          setLoading(false)
        }
    }, [user, props.symbol])

    useEffect(() => {
      GetData();
    },[GetData])

    useEffect(() => {
    const getLastUpdated = async () => {
      let LastUpdatedDictionary = await axios.get(`http://localhost:3000/api/stocks/GetAllStockLastUpdated`)
      const map = new Map<string, Date>(
      Object.entries(LastUpdatedDictionary.data.data).map(([key, value]) => [key, new Date(value as string)]));
      setLastUpdatedDictionary(map);
      }
      getLastUpdated()
    }, [Portfolio])

    return(
      <>
        {FilteredPortfolio != null && FilteredPortfolio.stocks.length != 0 ?
          <div className="StocksTable">
            <table className="Table" style={{transition: "all 0.6s ease-in-out"}}>
              <thead>
                <tr>
                  <th className="thLogo"></th>
                  <th className="thCompanies">Companies</th>
                  <th className="thBoughtPrice">Bought Price</th>
                  <th className="thCurrentValue">Current Value</th>
                  <th className="thProfit">Profit/Loss</th>

                </tr>
               </thead>
               <tbody>
                 {FilteredPortfolio?.stocks.map((stock: any, index: number) => (
                   <tr key={index}>
                     <td className="tdLogo"><img className="StockLogos" src={stock.logo} alt="Stock Logo" /></td>
                     <td className="tdCompanies"><div><div><h3>{stock.name}</h3><span>Quantity: {stock.quantity}</span></div></div></td>
                     <td className="tdBoughtPrice"> £{(stock.purchasePrice*stock.quantity).toFixed(2)}</td>
                      <td className="tdCurrentValue"><div>£{stock.currentPrice.toFixed(2)}<span className={"LastUpdatedStockTableValue"}>Last Updated: {LastUpdatedDictionary?.get(props.symbol)
                          ? LastUpdatedDictionary.get(props.symbol)!.toLocaleString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                              day: 'numeric',
                              month: 'numeric',
                              year: '2-digit',
                            })
                          : "Error"}
                          </span>
                        </div>
                      </td>
                      <td className="tdProfit"><div><div>£{(stock.currentPrice - (stock.purchasePrice * stock.quantity)).toFixed(2)}<span style={{color: (((((stock.currentPrice/(stock.purchasePrice*stock.quantity))*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/(stock.purchasePrice*stock.quantity))*100)-100) > 0) ? "+" : null}{((stock.currentPrice/(stock.purchasePrice*stock.quantity)*100)-100).toFixed(1)}%</span></div></div></td>
                   </tr>
                ))}
              </tbody>
            </table>
          </div> : Loading ? <AiLoading/> :
          <div>
            <h2>You don't own any stocks from this company</h2>
          </div>}
          
        </>
    )
}