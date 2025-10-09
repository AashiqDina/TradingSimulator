import { useEffect, useState } from 'react';
import getStockApiInfo from '../Functions/getStockApiInfo';
import formatNumber from '../Functions/FormatNumber';
import axios from 'axios';
import getStockInfoLastUpdated from '../Functions/getStockInfoLastUpdated';

export default function StockDetails(props: any){
    const [LastUpdated, setLastUpdated] = useState<string | null>(null)
    const BasicStockData = props.BasicStockData

    useEffect(() => {
      const getStockData = async() => {
        try{
          let data = await getStockApiInfo(props.symbol)
          console.log(data)
          props.setStockBasicData(data)
        }
        catch(error){
          alert(error)
        }
        try{
          if(props.symbol){
            const response5 = await getStockInfoLastUpdated(props.symbol)
            setLastUpdated(response5);
            console.log(response5);
          }
        }
        catch(error){
          alert(error)
        }
      }
      getStockData()
    }, [])



    return (
      <>
        <section className='StockData'>
          <article className={BasicStockData?.isMarketOpen ? "OpenMarketArticle" : "CloseMarketArticle"}>
            {BasicStockData?.isMarketOpen ? 
              <img src="/Sun.svg" alt="Market Open" /> : 
              <img src="/Moon.svg" alt="Market Close" />}
              <h2>{BasicStockData?.isMarketOpen ? "Market Open" : "Market Closed"}</h2>
          </article>
          <article>
            <p className='lastUpdated'> Last Updated: {LastUpdated ? new Date(LastUpdated).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
            : "N/A"}</p>
          </article>
          <article className='StockDataMain'>
            <div className='StockDataMainLeft'>
              <div className='StockDailyRange' style={{width: "100%"}}>
                <h4 style={{textAlign: 'left', padding: "0 0 0 10%" }}>Daily Range</h4>
                  <div style={{width: "100%"}}>
                    <div className='LineOne' style={{width: "80%"}}>
                      <div className='StockDailyAveragePoint'>
                        <span style={BasicStockData?.low && BasicStockData?.high ? {left: `${((props.stockPrice-BasicStockData.low)/(BasicStockData.high-BasicStockData.low))*100}%`} : {}}>
                        </span>
                        </div>
                    </div>
                  </div>
                  <div className='lhTitles'>
                    <p>£{BasicStockData?.low?.toFixed(2)}</p>
                    <p>£{BasicStockData?.high?.toFixed(2)}</p>
                  </div>
              </div>
              <div className='StockDailyRange' style={{width: "100%"}}>
                <h4 style={{textAlign: 'left', padding: "0 0 0 10%", marginTop: "0.4rem" }}>52-Week Range</h4>
                <div style={{width: "100%"}}>
                  <div className='LineOne' style={{width: "80%"}}>
                    <div className='StockDailyAveragePoint'>
                      <span style={BasicStockData?.fiftyTwoWeek.range ? {left: `${((props.stockPrice-Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0]))/(Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[2])-Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0])))*100}%`} : {}}>
                      </span>
                      </div>
                  </div>
                </div>
                <div className='lhTitles'>
                  <p>£{Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[0]).toFixed(2)}</p>
                  <p>£{Number(BasicStockData?.fiftyTwoWeek.range?.split(" ")[2]).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className='StockDataMainRight'>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem"}}>

                <h4>Volume:</h4>
                <div className='VolumeContainer'>
                  <div className='VolumeFill' style={{width: (BasicStockData?.volume/BasicStockData?.averageVolume) > 1 ? "100%" : `${((BasicStockData?.volume/BasicStockData?.averageVolume)*100)}%`, backgroundColor: (BasicStockData?.volume/BasicStockData?.averageVolume) < 0.5 ? "#ffffffff" : (BasicStockData?.volume/BasicStockData?.averageVolume) >= 1 ? "#45a049" : "#486c4aff" }}>
                  </div>
                </div>
                <h4 className='VolumeGFR'><span style={{fontWeight: 400}}>{formatNumber(Number(BasicStockData?.volume))}</span></h4>
                /
                <h4 className='VolumeGFR'><span style={{fontWeight: 400}}>{formatNumber(Number(BasicStockData?.averageVolume))}</span></h4>
              </div>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem", justifyContent: "flex-start"}}>
                <h4>Open:</h4>
                <span>£{BasicStockData?.open}</span>
              </div>
              <div className='genericFlexRow' style={{margin: "0 1rem 0 1rem", justifyContent: "flex-start"}}>
                <div className='ClosePrevClose'>
                  <h4>Close:</h4>
                  <span>£{BasicStockData?.close}</span>
                </div>
                <div className='ClosePrevClose'>
                  <h4>Previous Close:</h4>
                  <span>£{BasicStockData?.previousClose}</span>
                </div>
                <div className='ClosePrevClose' style={{gap: "0.4rem", color: BasicStockData?.change > 0 ? "#45a049" : "rgb(187, 21, 21)"}}>
                  <span className='ClosePrevClosePerc'>{BasicStockData?.percentChange > 0 ? "+" : undefined}{BasicStockData ? (BasicStockData?.percentChange).toFixed(2) : undefined}%</span>
                </div>

              </div>
            </div>
          </article>
        </section>
      </>






    )
}