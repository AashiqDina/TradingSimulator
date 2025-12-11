import { FocusTrap } from 'focus-trap-react';
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { Today } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

export default function StocksTable(props: any){

  // should look like this: [{Stock Symbol, Avg, []}]
  const [IndexExpanded, setIndexExpanded] = useState<number | null>(null)
  const [Portfolio, setPortfolio] = useState<any | null>([])
  const [LastUpdatedDictionary, setLastUpdatedDictionary] = useState<Map<string, Date> | null>(null)
  const [overviewBanner, setOverviewBanner] = useState<{GreatestProfit: {Company: string, Logo: string, Value: number} | null, GreatestLoss: {Company: string, Logo: string, Value: number} | null, LifeTimeGrowth: number | null}>({GreatestProfit: null, GreatestLoss: null, LifeTimeGrowth: null})
  const FilteredSearch = props.FilteredSearch
  const setFilteredSearch = props.setFilteredSearch
  const navigate = useNavigate();

  useEffect(() => {
    let OriginaList = props.portfolio.stocks
    let map = new Map()

    console.log("This Test: ")

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
          name: OriginaList[i].name,
          logo: OriginaList[i].logo,
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
      profitPercent: (Stock.currentWorth / Stock.totalCost - 1) * 100
    }));

    QuickStat(Portfolio)
    setPortfolio(Portfolio)
    setFilteredSearch(Portfolio)
  }, [props.portfolio.stocks, props.StockNameArray, props.StockLogoArray])

  useEffect(() => {
    const getLastUpdated = async () => {
      let LastUpdatedDictionary = await axios.get(`http://localhost:3000/api/stocks/GetAllStockLastUpdated`)
      const map = new Map<string, Date>(
      Object.entries(LastUpdatedDictionary.data.data).map(([key, value]) => [key, new Date(value as string)]));
      setLastUpdatedDictionary(map);
    }
    getLastUpdated()
  }, [Portfolio])


  function QuickStat(Portfolio: any){

    if(Portfolio.length > 0){
      let GreatestProfit = {Company: Portfolio[0].name, Logo: Portfolio[0].logo, Value: Portfolio[0].profitPercent}
      let GreatestLoss = {Company: Portfolio[0].name, Logo: Portfolio[0].logo, Value: Portfolio[0].profitPercent}
      let TotalCost = Portfolio[0].totalCost
      let TotalValue = Portfolio[0].currentWorth


      for(let i = 1; i<Portfolio.length; i++){
        let Value = Portfolio[i].profitPercent
        TotalCost += Portfolio[i].totalCost
        TotalValue += Portfolio[i].currentWorth

        if(Value > GreatestProfit.Value){
          GreatestProfit = {Company: Portfolio[i].name, Logo: Portfolio[i].logo, Value: Value}
        }
        if(Value < GreatestLoss.Value){
          GreatestLoss = {Company: Portfolio[i].name, Logo: Portfolio[i].logo, Value: Value}
        }

      }

      setOverviewBanner({GreatestProfit: GreatestProfit, GreatestLoss: GreatestLoss, LifeTimeGrowth: (TotalValue/TotalCost-1)*100})
    }
    else{
      setOverviewBanner({GreatestProfit: {Company: "None", Logo: "None", Value: 0}, GreatestLoss: {Company: "None", Logo: "None", Value: 0}, LifeTimeGrowth: 0})
    }
  }

  function inputFilter(input: string){
    if(input == ""){
      setFilteredSearch(Portfolio)
      QuickStat(Portfolio)
    }
    else{
      let FilteredResult = Portfolio.filter((stockAvg: { name: string; symbol: string;}) => {
        return ((stockAvg.name?.toUpperCase().includes(input) || stockAvg.symbol?.includes(input)))
      })
      setFilteredSearch(FilteredResult)
      QuickStat(FilteredResult)
    }
  }

    return (
        <section className="PortfolioHoldings">
          <article className="genericFlexRow" style={{marginBottom: "4rem"}}>
            <div style={{width: "25%", margin: 0}} className="LineOne"></div>
            <h2 className="PageTitleHoldings">Holdings</h2>
            <div style={{width: "25%", margin: 0}} className="LineOne"></div>
          </article>

          
          <article className="Filter">
            <input  aria-label="Enter a stock name or symbol to fiter your stocks" type="text" onChange={(e) => inputFilter(e.target.value.toUpperCase())} placeholder="Enter stock symbol/name (e.g, AAPL, Apple)"/>
            <select aria-label="Sort your stocks" name="" id="" onChange={(e) => props.setFilteredOption(e.target.value)}>
              <option value="">Sort by</option>
              <option value="Oldest">Oldest</option>
              <option value="Newest">Newest</option>
              <option value="ProfitAsc">Profit (Asc)</option>
              <option value="ProfitDesc">Profit (Desc)</option>
              <option value="ValueAsc">Value (Asc)</option>
              <option value="ValueDesc">Value (Desc)</option>
            </select>
            {/* <button onClick={props.FilterSearch}>Submit</button> */}
          </article>

          { overviewBanner.GreatestProfit?.Company != "None" && <article className='QuickPerformance'>
            {/* <div className='QuickPerformanceCarouselContainer'>
              <div className='QuickPerformance'>
                <div className='set'>
<div>Best Performer: <div><img src={overviewBanner.GreatestProfit?.Logo ? overviewBanner.GreatestProfit?.Logo : ""} alt="Greatest Profit Logo" /> {overviewBanner.GreatestProfit?.Company}</div> <p style={overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? "+" : ""}{overviewBanner.GreatestProfit?.Value != null ? overviewBanner.GreatestProfit?.Value.toFixed(2) : undefined}%</p></div>
                  <div>Worst Performer: <div><img src={overviewBanner.GreatestLoss?.Logo ? overviewBanner.GreatestLoss?.Logo : ""} alt="Greatest Loss Logo" /> {overviewBanner.GreatestLoss?.Company}</div> <p style={overviewBanner.GreatestLoss?.Value && overviewBanner.GreatestLoss?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.GreatestLoss?.Value != null ? overviewBanner.GreatestLoss?.Value.toFixed(2) : undefined}%</p></div>
                  <div>Lifetime Growth: {(overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? "+" : "")}<p style={overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.LifeTimeGrowth != null ? overviewBanner.LifeTimeGrowth.toFixed(2) : ""}%</p></div>
                </div>
                <div className='set'>
                  <div>Best Performer: <div><img src={overviewBanner.GreatestProfit?.Logo ? overviewBanner.GreatestProfit?.Logo : ""} alt="Greatest Profit Logo" /> {overviewBanner.GreatestProfit?.Company}</div> <p style={overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? "+" : ""}{overviewBanner.GreatestProfit?.Value != null ? overviewBanner.GreatestProfit?.Value.toFixed(2) : undefined}%</p></div>
                  <div>Worst Performer: <div><img src={overviewBanner.GreatestLoss?.Logo ? overviewBanner.GreatestLoss?.Logo : ""} alt="Greatest Loss Logo" /> {overviewBanner.GreatestLoss?.Company}</div> <p style={overviewBanner.GreatestLoss?.Value && overviewBanner.GreatestLoss?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.GreatestLoss?.Value != null ? overviewBanner.GreatestLoss?.Value.toFixed(2) : undefined}%</p></div>
                  <div>Lifetime Growth: {(overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? "+" : "")}<p style={overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21);"}}>{overviewBanner.LifeTimeGrowth != null ? overviewBanner.LifeTimeGrowth.toFixed(2) : ""}%</p></div>
                </div>
              </div>
            </div> */}

              <div className='BestPerformerCard'>
              <div>
                <h3>Best Performer</h3>
              </div>
              <div className='CardStock'>
                <img src={overviewBanner.GreatestProfit?.Logo ? overviewBanner.GreatestProfit?.Logo : ""} alt="Logo" /> 
                <h4>{overviewBanner.GreatestProfit?.Company}</h4>
              </div>
              <p style={overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21)"}}>
                {overviewBanner.GreatestProfit?.Value && overviewBanner.GreatestProfit?.Value > 0 ? "▲ +" : "▼ "}
                {overviewBanner.GreatestProfit?.Value != null ? overviewBanner.GreatestProfit?.Value.toFixed(2) : undefined}%
              </p>
            </div>

            <div className='WorstPerformerCard'>
              <div>
                <h3>Worst Performer</h3>
              </div>
              <div className='CardStock'>
                <img src={overviewBanner.GreatestLoss?.Logo ? overviewBanner.GreatestLoss?.Logo : ""} alt="Logo" /> 
                <h4>{overviewBanner.GreatestLoss?.Company}</h4>
              </div>
              <p style={overviewBanner.GreatestLoss?.Value != null && overviewBanner.GreatestLoss?.Value > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21)"}}>
                {overviewBanner.GreatestLoss?.Value && overviewBanner.GreatestLoss?.Value > 0 ? "▲ +" : "▼ "}
                {overviewBanner.GreatestLoss?.Value != null ? overviewBanner.GreatestLoss?.Value.toFixed(2) : undefined}%
              </p>  
            </div>

            {/* <div className='LifeTimeGrowth'>
              <div>
                <h3>LifeTime Growth</h3>
              </div>
              <div>
                {(overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? "+" : "")}
                <p style={overviewBanner.LifeTimeGrowth != null && overviewBanner.LifeTimeGrowth > 0 ? {color: "#45a049"} : {color: "rgb(187, 21, 21)"}}>
                  {overviewBanner.LifeTimeGrowth != null ? overviewBanner.LifeTimeGrowth.toFixed(2) : ""}%
                </p>
              </div>
            </div> */}
          </article>}


          <article className="StocksTable">
            <table className="Table" style={{transition: "all 0.6s ease-in-out"}}>
              <thead>
                <tr>
                  <th className="thLogo"></th>
                  <th className="thCompanies">Companies</th>
                  <th className="thBoughtPrice">Bought Price</th>
                  <th className="thCurrentValue">Current Value</th>
                  <th className="thProfit" style={IndexExpanded != null ? {paddingRight: 0} : undefined}>Profit/Loss</th>
                  {IndexExpanded != null ? <th style={{padding: 0}}></th> : ""}
                  {/* <th style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th> */}

                </tr>
              </thead>
                <tbody style={{transition: "all 0.6s ease-in-out"}}>
                  {FilteredSearch.map((stockAvg: any, index: number) => (
                    <React.Fragment key={index}>                    
                    <tr onClick={() => IndexExpanded == index ? setIndexExpanded(null) : setIndexExpanded(index)} style={{cursor: "pointer",transition: "all 0.6s ease-in-out"}}>
                      <td className="tdLogo"><button aria-label='Visit Stock Details Page' onClick={ () => {navigate(`/stock/${encodeURIComponent(String(stockAvg.symbol ?? ''))}`)}} className='tdLogoButton'><img className="StockLogos" src={stockAvg.logo} alt="Stock Logo" /></button></td>
                      <td className="tdCompanies"><div><div><button aria-label='Expand Stock to see individual stocks bought'><h3>{stockAvg.name}</h3><span>Quantity: {Math.round(stockAvg.totalShares*100)/100}</span></button></div></div></td>
                      <td className="tdBoughtPrice"><div>£{stockAvg.totalCost.toFixed(2)}<span>Average: £{stockAvg.avgBuyPrice.toFixed(2)}</span></div></td>
                      <td className="tdCurrentValue"><div>£{stockAvg.currentWorth.toFixed(2)}<span className={"LastUpdatedStockTableValue"}>Last Updated: {LastUpdatedDictionary?.get(stockAvg.symbol)
                          ? LastUpdatedDictionary.get(stockAvg.symbol)!.toLocaleString(undefined, {
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
                      <td className="tdProfit"><div><div>£{(stockAvg.currentWorth - stockAvg.totalCost).toFixed(2)}<span style={{color: (((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stockAvg.currentWorth/stockAvg.totalCost)*100)-100) > 0) ? "+" : null}{(((stockAvg.currentWorth/stockAvg.totalCost)*100)-100).toFixed(1)}%</span></div></div></td>
                      {IndexExpanded != null ? <td style={{padding: 0}}></td> : ""}
                    </tr>
                    {IndexExpanded == index && stockAvg.transactions.map((stock: any, i: number) => (
                      <tr key={i}>
                        {/* <td><img className="StockLogos" style={{padding: "0rem 0rem 0rem 0.5rem"}} src={stockAvg.logo} alt="Stock Logo" /></td> */}
                        <td className="tdLogoMore">
                          <div style={{height: "10px", width: "10px", transform: "rotate(-90deg)", marginLeft: "20px", scale: "0.85"}}>
                            <div className={`ArrowOne`} ></div>
                            <div className={`ArrowTwo`} ></div>
                          </div>
                        </td>
                        <td className="tdCompanies" ><div><div><p style={{fontWeight: 400}}>{stockAvg.name}</p><span>Quantity: {stock.quantity}</span></div></div></td>
                        <td className="tdBoughtPrice"><div><div><p style={{fontWeight: 400}}>£{(stock.purchasePrice* stock.quantity).toFixed(2)}</p><span>Each: {stock.purchasePrice.toFixed(2)}</span></div></div></td>
                        <td className="tdCurrentValue">£{(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                        <td className="tdProfit"><div><div>£{((stock.currentPrice - stock.purchasePrice)*stock.quantity).toFixed(2)}<span style={{color: (((((stock.currentPrice/stock.purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((stock.currentPrice/stock.purchasePrice)*100)-100) > 0) ? "+" : null}{(((stock.currentPrice/stock.purchasePrice)*100)-100).toFixed(1)}%</span></div></div></td>
                        {!props.otherUser && <td className="DeleteButton">
                          <button aria-label='DeleteStock' className="CrossContainer" onClick={() => {
                            props.handleDelete(index, stock, stockAvg.name, stockAvg.logo)
                          }}>
                            <div className="Cross1"></div>
                            <div className="Cross2"></div>
                          </button>
                        </td>}

                      </tr>
                    ))}
                    </React.Fragment>
                  ))}

                </tbody>

            </table>
          </article>
          {props.ModalVisible && (
            <FocusTrap>
            <div className="Modal">
              <div className="ModalContent">
                <h2>Are you sure you want to delete?</h2>
                <div>
                  <table className="Table" style={{transition: "all 0.6s ease-in-out", scale: 0.8}}>
                  <thead>
                    <tr>
                      <th className="thLogo"></th>
                      <th className="thCompanies">Companies</th>
                      <th className="thBoughtPrice">Bought Price</th>
                      <th className="thCurrentValue">Current Value</th>
                      <th className="thProfit" style={IndexExpanded != null ? {paddingRight: 0} : undefined}>Profit/Loss</th>
                      {IndexExpanded != null ? <th style={{padding: 0}}></th> : ""}

                    </tr>
                  </thead>
                  <tbody>
                    <td className="tdLogoMore">
                        <img className="StockLogos"  src={props.ToDelete.logo} alt="" style={{width: "60px", padding: "none", margin: "none"}}/>
                      </td>
                      <td className="tdCompanies" ><div><div><p style={{fontWeight: 400}}>{props.ToDelete.name}</p><span>Quantity: {props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).quantity}</span></div></div></td>
                      <td className="tdBoughtPrice">£{(props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).purchasePrice * props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).quantity).toFixed(2)}</td>
                      <td className="tdCurrentValue">£{(props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).quantity * props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).currentPrice).toFixed(2)}</td>
                      <td className="tdProfit"><div><div>£{((props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).currentPrice - props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).purchasePrice)*props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).quantity).toFixed(2)}<span style={{color: (((((props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).currentPrice/props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).currentPrice/props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).purchasePrice)*100)-100) > 0) ? "+" : null}{(((props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).currentPrice/props.portfolio.stocks.find((s: any) => s.id === props.ToDelete.stock).purchasePrice)*100)-100).toFixed(1)}%</span></div></div></td>

                  </tbody>
                </table>
              </div>

                <div className="ModalFooter">
                  <button aria-label='Cancel?' className="" onClick={() => {
                    props.setModalVisibility(false);
                    props.setToDelete({stock: null, name: null, logo: null});
                  }}>Cancel</button>
                  <button aria-label='Delete Stock?' className="" onClick={props.handleTrueDelete}>Delete</button>
                </div>
              </div>
            </div>
            </FocusTrap>
          )}
        </section>
    )
}