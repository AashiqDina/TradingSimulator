export default function StockData(props: any){
    const BasicStockData = props.BasicStockData
    return (
        <article className='StockDataDisplayed'>
        <div className="RowOne">
          <div className='ColumnOne'>
            <h3>Last 52 Weeks:</h3>
            <div className='FiftyWeek'>
              <p>High: {BasicStockData?.fiftyTwoWeek.high.toFixed(2)}</p>
              <p>High Change: {BasicStockData?.fiftyTwoWeek.highChange.toFixed(2)}  <span style={BasicStockData?.fiftyTwoWeek.highChangePercent != null && BasicStockData?.fiftyTwoWeek.highChangePercent > 0 ? {color: "#3e9143"} : {color: "red"}}> {BasicStockData?.fiftyTwoWeek.highChangePercent.toFixed(2)}%</span></p>
              <p>Low: {BasicStockData?.fiftyTwoWeek.low.toFixed(2)}</p>
              <p>Low Change: {BasicStockData?.fiftyTwoWeek.lowChange.toFixed(2)}  <span style={BasicStockData?.fiftyTwoWeek.lowChangePercent != null && BasicStockData?.fiftyTwoWeek.lowChangePercent > 0 ? {color: "#3e9143"} : {color: "red"}}> {BasicStockData?.fiftyTwoWeek.lowChangePercent.toFixed(2)}%</span></p>
            </div>
          </div>
          <div className='ColumnTwo'>
            <h3>Last 24 Hours:</h3>
            <div className="ColumnTwoContainer">
              <div className="ColumnTwo1">
                <p>Open: {BasicStockData?.open}</p>
                <p>Close: {BasicStockData?.close}</p>
                <p>High: {BasicStockData?.high}</p>
                <p>Low: {BasicStockData?.low}</p>
              </div>
              <div className="ColumnTwo2">
                <p>Previous Close: {BasicStockData?.open}</p>
                <p>Change: {BasicStockData?.open} <span style={BasicStockData?.percentChange != null && BasicStockData?.percentChange > 0 ? {color: "#3e9143"} : {color: "red"}}> {BasicStockData?.percentChange.toFixed(2)}%</span></p>
              </div>
            </div>
          </div>
          <div className="ColumnOne">
            <h3>Volume Data:</h3>
            <div>
              <p>Volume: {BasicStockData?.volume}</p>
              <p>Average Volume: {BasicStockData?.averageVolume}</p>
            </div>
          </div>
          <div className="ColumnOne">
            <h3>Rolling Changes:</h3>
            <div>
              <p>Rolling 1 Day Change: {BasicStockData?.rolling1DChange}</p>
              <p>Rolling 7 Day Change: {BasicStockData?.rolling7DChange}</p>
              <p>Rolling Period Change: {BasicStockData?.rollingPeriodChange}</p>
            </div>
          </div>
          <div className="ColumnOne">
            <h3>Extended Hours:</h3>
            <div>
              <p>Extended Price: {BasicStockData?.extendedPrice}</p>
              <p>Extended Change: {BasicStockData?.extendedChange}</p>
              <p>ExtendedPercentChange: {BasicStockData?.extendedPercentChange}</p>
              <p>ExtendedTimeStamp: {BasicStockData?.extendedTimestamp}</p>
            </div>
          </div>
        </div>
      </article>
    )
}