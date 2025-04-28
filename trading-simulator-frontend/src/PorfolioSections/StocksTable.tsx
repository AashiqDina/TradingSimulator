export default function StocksTable(props: any){
    return (
        <>
        <section className="Filter">
            <input type="text" onChange={(e) => props.setFilterSearchInput(e.target.value)} placeholder="Enter stock symbol (e.g, AAPL)"/>
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
              </tbody>
            </table>
          </div>
          {props.ModalVisible && (
            <div className="Modal">
              <div className="ModalContent">
                <h2>
                    Delete <img className="DeleteLogo" src={props.ToDelete !== null ? props.StockLogoArray[props.ToDelete] : null} alt="" />{props.ToDelete !== null ? props.StockNameArray[props.ToDelete] : "this stock"} from your portfolio?
                </h2>
                <div className="ModalFooter">
                  <button className="" onClick={() => {
                    props.setModalVisibility(false);
                    props.setToDelete(null);
                  }}>Cancel</button>
                  <button className="" onClick={props.handleTrueDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}
        </>
    )
}