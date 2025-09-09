export default function CurrentBestStocks(props: any){
    return (
        <>
            
        {props.CurrentBestStocks && props.CurrentBestStocks.length > 0 ? <h2 className="ProftibleTitle">Most Profitable Stock</h2> : null}
          {props.CurrentBestStocks && props.CurrentBestStocks.length > 0 ? <div className="MostProfitableTable">
            <section>
              <table className="BestTable">
                  <thead>
                    <tr>
                      <th className="BestTableHeader" style={{padding: "0.5rem 0.8rem 0.5rem 0.5rem"}}></th>
                      <th  className="BestTableHeader" style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                      <th  className="BestTableHeader" style={{paddingRight: "1rem"}}>Quantity</th>
                      <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Bought Price</th>
                      <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Current Price</th>
                      <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Total Value</th>
                      <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}} >Profit/Loss</th>
                      <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>%</th>
                      <th  className="BestTableHeader" style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td><img className="StockLogos" src={props.CurrentBestStocks[0].logo} alt="Stock Logo" /></td>
                      <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">{props.CurrentBestStocks[0].name}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}>{props.CurrentBestStocks[0].quantity}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}> {(props.CurrentBestStocks[0].purchasePrice * props.CurrentBestStocks[0].quantity).toFixed(2)}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{props.CurrentBestStocks[0].currentPrice.toFixed(2)}</td>
                      <td style={{padding: "1rem 0rem 1rem 0rem"}}>£{(props.CurrentBestStocks[0].quantity * props.CurrentBestStocks[0].currentPrice).toFixed(2)}</td>
                      <td style={{padding: "1rem 0rem 1rem 1rem"}}>£{(props.CurrentBestStocks[0].profitLoss).toFixed(2)} </td>
                      <td style={{padding: "1rem 1rem 1rem 0.3rem"}}><span style={{color: (((((props.CurrentBestStocks[0].currentPrice/props.CurrentBestStocks[0].purchasePrice)*100)-100) >= 0) ? "#45a049" : "#bb1515")}}>{((((props.CurrentBestStocks[0].currentPrice/props.CurrentBestStocks[0].purchasePrice)*100)-100) > 0) ? "+" : null}{(((props.CurrentBestStocks[0].currentPrice/props.CurrentBestStocks[0].purchasePrice)*100)-100).toFixed(1)}%</span></td>
                    </tr>
                  </tbody>
              </table>
            </section>
          </div> : 
        <>
        <h2 className="ProftibleTitle">Most Profitable Stock</h2>
          <div className="MostProfitableTable">
          <table className="BestTable">
              <thead>
                <tr>
                  <th className="BestTableHeader" style={{padding: "0.5rem 0.8rem 0.5rem 0.5rem"}}></th>
                  <th  className="BestTableHeader" style={{padding: "1rem 1rem 1rem 0rem"}}>Companies</th>
                  <th  className="BestTableHeader" style={{paddingRight: "1rem"}}>Quantity</th>
                  <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Bought Price</th>
                  <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Current Price</th>
                  <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>Total Value</th>
                  <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}} >Profit/Loss</th>
                  <th  className="BestTableHeader" style={{paddingLeft: "1rem", paddingRight: "1rem"}}>%</th>
                  <th  className="BestTableHeader" style={{padding: "0.5rem 0.8rem 0.5rem 0rem"}}></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><img className="StockLogos" alt="Stock Logo" /></td>
                  <td style={{padding: "1rem 1rem 1rem 0rem"}} className="StockNameLogo">Unknown</td>
                  <td style={{padding: "1rem 0rem 1rem 0rem"}}>Data could not be loaded.</td>
                  <td style={{padding: "1rem 0rem 1rem 0rem"}}>Data could not be loaded.</td>
                  <td style={{padding: "1rem 0rem 1rem 0rem"}}>Data could not be loaded.</td>
                  <td style={{padding: "1rem 0rem 1rem 1rem"}}>Data could not be loaded.</td>
                  <td style={{padding: "1rem 1rem 1rem 0.3rem"}}>Data could not be loaded.</td>
                </tr>
              </tbody>
          </table>
        </div>
        </>}

        </>
    )
}