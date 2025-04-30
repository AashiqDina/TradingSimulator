export default function StockData(props: any){
    const BasicStockData = props.BasicStockData
    return (
        <article className='StockDataDisplayed'>
        <div className="RowOne">
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
      </article>
    )
}