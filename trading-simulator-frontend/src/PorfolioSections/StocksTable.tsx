import { useEffect, useState } from "react";

export default function StocksTable(props: any){

  // should look like this: [{Stock Symbol, Avg, []}]
  const [IndexExpanded, setIndexExpanded] = useState<number | null>(null)
  const [Portfolio, setPortfolio] = useState<any | null>([])
  const [FilteredSearch, setFilteredSearch] = useState<any | null>([])


  useEffect(() => {
    let OriginaList = props.portfolio.stocks
    let map = new Map()


    for (let i = 0; i< OriginaList.length; i++){
      if (map.has(OriginaList[i].symbol)) {
        const Stock = map.get(OriginaList[i].symbol);
        Stock.totalShares += OriginaList[i].quantity;
        Stock.totalCost += OriginaList[i].quantity * OriginaList[i].purchasePrice;
        Stock.currentWorth += OriginaList[i].currentPrice * OriginaList[i].quantity;
        Stock.transactions.push(OriginaList[i]);
      } else {
        map.set(OriginaList[i].symbol, {
          symbol: OriginaList[i].symbol,
          name: props.StockNameArray[i],
          logo: props.StockLogoArray[i],
          totalShares: OriginaList[i].quantity,
          totalCost: OriginaList[i].quantity * OriginaList[i].purchasePrice,
          currentWorth: OriginaList[i].currentPrice * OriginaList[i].quantity,
          transactions: [OriginaList[i]],
        });
      }
    }

    const Portfolio = Array.from(map.values()).map(Stock => ({
      ...Stock,
      avgBuyPrice: Stock.totalCost / Stock.totalShares,
    }));
    setPortfolio(Portfolio)
    setFilteredSearch(Portfolio)
  }, [props.portfolio.stocks, props.StockNameArray, props.StockLogoArray])

  console.log(Portfolio)

  function inputFilter(input: string){
    if(input == ""){
      setFilteredSearch(Portfolio)
    }
    else{
      setFilteredSearch(Portfolio.filter((stockAvg: { name: string; symbol: string;}) => {
        return ((stockAvg.name?.toUpperCase().startsWith(input) || stockAvg.symbol?.startsWith(input)))
      }))
    }
  }






    return (
        <>
        <section className="Filter">
            <input type="text" onChange={(e) => inputFilter(e.target.value.toUpperCase())} placeholder="Enter stock symbol/name (e.g, AAPL, Apple)"/>
            <select name="" id="" onChange={(e) => props.setFilteredOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
              <option value="ProfitAsc">Profit (Asc)</option>
              <option value="ProfitDesc">Profit (Desc)</option>
              <option value="ValueAsc">Value (Asc)</option>
              <option value="ValueDesc">Value (Desc)</option>
            </select>
            <button onClick={props.FilterSearch}>Submit</button>
          </section>

          <div className="StocksTable">
            <table className="Table" style={{transition: "all 0.6s ease-in-out"}}>
              <thead>
                <tr>
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0.5rem"}}></th>
                  <th style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                  <th style={{paddingRight: "1rem"}}>Quantity</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Bought Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Current Price</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}} className="PLTitle">Profit/Loss</th>
                  <th style={{paddingLeft: "1rem", paddingRight: "1rem"}}>%</th>
                  <th style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th>

                </tr>
              </thead>
                <tbody style={{transition: "all 0.6s ease-in-out"}}>
                  {FilteredSearch.map((stockAvg: any, index: number) => (
                    <>                    
                    <tr onClick={() => IndexExpanded == index ? setIndexExpanded(null) : setIndexExpanded(index)} key={index} style={{cursor: "pointer",transition: "all 0.6s ease-in-out"}}>
                      <td><img className="StockLogos" src={stockAvg.logo} alt="Stock Logo" /></td>
                      <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{stockAvg.name}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}>{stockAvg.totalShares}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}> £{stockAvg.totalCost.toFixed(2)}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{stockAvg.currentWorth.toFixed(2)}</td>
                      <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(stockAvg.currentWorth - stockAvg.totalCost).toFixed(2)} </td>
                      <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) > 0) ? "+" : null}{(((stockAvg.currentWorth/stockAvg.totalCost)*100)-100).toFixed(1)}%</span></td>
                    </tr>
                    {IndexExpanded == index && stockAvg.transactions.map((stock: any, i: number) => (
                      <tr key={i}>
                        <td><img className="StockLogos" style={{padding: "0rem 0rem 0rem 0.5rem"}} src={stockAvg.logo} alt="Stock Logo" /></td>
                        <td style={{padding: "1rem 1rem 1rem 3rem"}} className="StockNameLogo">{stockAvg.name}</td>
                        <td style={{padding: "1rem 0rem 1rem 3rem"}}>{stock.quantity}</td>
                        <td style={{padding: "1rem 0rem 1rem 3rem"}}> {(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                        <td style={{padding: "1rem 0rem 1rem 3rem"}}>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                        <td style={{padding: "1rem 0rem 1rem 3rem"}}>£{(stock.profitLoss).toFixed(2)} </td>
                        <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></td>
                        <td style={{padding: "1rem 1rem 1rem 0.3rem"}} className="DeleteButton">
                          <div className="CrossContainer" onClick={() => {
                            props.handleDelete(index, stock, stockAvg.name, stockAvg.logo)
                          }}>
                            <div className="Cross1"></div>
                            <div className="Cross2"></div>
                          </div>
                        </td>

                      </tr>
                    ))}
                    </>
                  ))}

                </tbody>
              {/* <tbody>
                {props.portfolio.stocks.map((stock: any, index: number) => (
                  <tr key={index} style={{opacity: (props.ToDelete != null) ? ((props.ToDelete == index ) ? 1 : 0.5) : 1}}>
                    <td><img className="StockLogos" src={props.StockLogoArray[index]} alt="Stock Logo" /></td>
                    <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{props.StockNameArray[index]}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>{stock.quantity}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}> {(stock.purchasePrice * stock.quantity).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{stock.currentPrice.toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(stock.profitLoss).toFixed(2)} </td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></td>
                    <td style={{padding: "1rem 1rem 1rem 0.3rem"}} className="DeleteButton">
                      <div className="CrossContainer" onClick={() => {
                        props.handleDelete(index, stock)
                      }}>
                        <div className="Cross1"></div>
                        <div className="Cross2"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
          {props.ModalVisible && (
            <div className="Modal">
              <div className="ModalContent">
                <h2>
                    Delete <img className="DeleteLogo" src={props.ToDeleteLogo !== null ? props.ToDeleteLogo : null} alt="" />{props.ToDeleteName !== null ? props.ToDeleteName : "this stock"} from your portfolio?
                </h2>
                <div className="ModalFooter">
                  <button className="" onClick={() => {
                    props.setModalVisibility(false);
                    props.setToDeleteName(null);
                    props.setToDeleteLogo(null);
                  }}>Cancel</button>
                  <button className="" onClick={props.handleTrueDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </>
    )
}