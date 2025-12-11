import {
  Chart as ChartJS,
  LineElement,
  LineController,
  PointElement,
  LinearScale,
  TimeScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useRef, useState } from "react"
import "./StockDetailsOverview.css"
import GetStockHistory from "../Functions/GetStockHistory"
import formatNumber from "../Functions/FormatNumber";

ChartJS.register(LineElement, LineController, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

type StockDataPoint = {
  datetime: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export default function StockDetailsOverview(props: any){

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS | null>(null);
    const [range, setRange] = useState<string>("All")
    const [fullHistory, setFullHistory] = useState<any | null>(null)
    const [history, setHistory] = useState<any | null>(null)
    const [graphDate, setGraphDate] = useState<string>("Hover to see value")
    const [CloseValue, setCloseValue] = useState<string | null>(null)
    const [volume, setVolume] = useState<string | null>()
    const [OpenValue, setOpenValue] = useState<string | null>(null)
    const [HighLowRange, setHighLowRange] = useState<string | null>(null)


    useEffect(() => {
        var StockHistory = async () => {
            let GottenHistory = await GetStockHistory({symbol: props.symbol, setDisplayError: props.setDisplayError})
            console.log("Stock's History ", GottenHistory)
            if(GottenHistory){
                let Reverse = GottenHistory.reverse()
                setHistory(Reverse)
                setFullHistory(Reverse)
            }
        }
        StockHistory()
    }, [])

    useEffect(() => {
        if(history != null){
            filterStockHistory()
        }
    }, [range])

    useEffect(() => {
        if (!canvasRef.current || !history) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new ChartJS(ctx, {
            type: "line",
            data: {
                labels: history.map((entry: StockDataPoint) => entry.datetime),
                datasets: [
                    {
                        label: "Close",
                        data: history.map((entry: StockDataPoint) => ({
                            x: entry.datetime,
                            y: entry.close,
                            full: entry,
                        })),
                        borderColor: "#45a049ff",
                        backgroundColor: "#45a049ff",
                        fill: false,
                        pointRadius: 0,
                    },
                    // {
                    //     label: "Open",
                    //     data: history.map((entry: StockDataPoint) => ({
                    //         x: entry.datetime,
                    //         y: entry.open,
                    //         full: entry,
                    //     })),
                    //     borderColor: "#458ba0ff",
                    //     backgroundColor: "#458ba0ff",
                    //     fill: false,
                    //     pointRadius: 0,
                    //     hidden: true,
                    // },
                    {
                        label: "Volume",
                        data: history.map((entry: StockDataPoint) => ({
                            x: entry.datetime,
                            y: entry.volume,
                            full: entry,
                        })),
                        borderColor: "#3e914440",
                        backgroundColor: "#3e914440",
                        fill: true,
                        pointRadius: 0,
                        hidden: true,
                    },
                    //{
                    //     label: "Low",
                    //     data: history.map((entry: StockDataPoint) => ({
                    //         x: entry.datetime,
                    //         y: entry.low,
                    //         full: entry,
                    //     })),
                    //     borderColor: "#a09a45ff",
                    //     backgroundColor: "#a09a45ff",
                    //     fill: false,
                    //     pointRadius: 0,
                    //     hidden: true,
                    // },
                    //{
                    //     label: "High",
                    //     data: history.map((entry: StockDataPoint) => ({
                    //         x: entry.datetime,
                    //         y: entry.high,
                    //         full: entry,
                    //     })),
                    //     borderColor: "#6345a0ff",
                    //     backgroundColor: "#6345a0ff",
                    //     fill: false,
                    //     pointRadius: 0,
                    //     hidden: true,
                    // },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    // legend: {
                    //     display: false
                    // },
                    tooltip: {
                        mode: "index",
                        enabled: false,
                        external: (context) => {
                            const tooltip = context.tooltip;
                            if (!tooltip || !tooltip.dataPoints || tooltip.dataPoints.length === 0) return;
                                
                                const dataPoint = tooltip.dataPoints[0];
                                const raw = dataPoint.raw as { x: string; y: number; full: StockDataPoint };
                                let xValue = "";

                                tooltip.dataPoints.forEach((dataPoint) => {
                                    xValue = dataPoint.label as string;
                                    let xValueDate = new Date(xValue);
                                    let formated = xValueDate.toISOString().split("T")[0];
                                    xValue = String(formated)


                                });
                                setCloseValue(`£${raw.full.close.toFixed(2)}`)
                                setOpenValue(`£${raw.full.open.toFixed(2)}`)
                                setGraphDate(xValue);
                                setVolume(formatNumber(raw.full.volume))
                                setHighLowRange(`£${raw.full.low.toFixed(2)}-£${raw.full.high.toFixed(2)}`)
                            },
                        },
                    },
                interaction: { mode: "index", intersect: false },
                scales: {
                    x: { display: false },
                    y: { display: false },
                },
            },
        });

        return () => chartRef.current?.destroy();

    }, [history]);

    function filterStockHistory(){
        const currentDate = new Date();

        switch(range){
            case("All"):
                setHistory(fullHistory)
                break;
            case("ThreeYears"):
                const ThreeYearAgo = new Date(currentDate);
                ThreeYearAgo.setFullYear(currentDate.getFullYear() - 3);
                let filteredThreeYearAgo = fullHistory.filter((d: StockDataPoint) => new Date(d.datetime) >= ThreeYearAgo)
                console.log(filteredThreeYearAgo)
                setHistory(filteredThreeYearAgo)
                break;
            case("Year"):
                const YearAgo = new Date(currentDate);
                YearAgo.setFullYear(currentDate.getFullYear() - 1);
                let filteredYearAgo = fullHistory.filter((d: StockDataPoint) => new Date(d.datetime) >= YearAgo)
                console.log(filteredYearAgo)
                setHistory(filteredYearAgo)
                break;
            case("ThreeMonths"):
                const ThreeMonthAgo = new Date(currentDate);
                ThreeMonthAgo.setMonth(currentDate.getMonth() - 3);
                let filteredThreeMonth = fullHistory.filter((d: StockDataPoint) => new Date(d.datetime) >= ThreeMonthAgo)
                console.log(filteredThreeMonth)
                setHistory(filteredThreeMonth)
                break;
            case("Month"):
                const MonthAgo = new Date(currentDate);
                MonthAgo.setMonth(currentDate.getMonth() - 1);
                let filteredMonth = fullHistory.filter((d: StockDataPoint) => new Date(d.datetime) >= MonthAgo)
                console.log(filteredMonth)
                setHistory(filteredMonth)
                break;
            case("Week"):
                const weekAgo = new Date(currentDate);
                weekAgo.setDate(currentDate.getDate() - 7);
                let filteredWeek = fullHistory.filter((d: StockDataPoint) => new Date(d.datetime) >= weekAgo)
                console.log(filteredWeek)
                setHistory(filteredWeek)
                break;
            default:
                setHistory(fullHistory)
                break;
        }
    }

    return (
        <>
            <article  aria-live="polite" aria-label={`Stock graph for ${props.StockName}`} className='StocksGraph'>
                {/* <h2>{props.StockName} Graph</h2> */}
                <div className="StockGraphValues">
                    <div>
                        {graphDate != "Hover to see value" ? <h3>Date</h3> : undefined}
                        <h2>{graphDate}</h2>
                    </div>
                    {OpenValue && <div>
                        <h3>Open</h3>
                        <h2>{OpenValue}</h2>
                    </div>}
                    {CloseValue && <div>
                        <h3>Close</h3>
                        <h2>{CloseValue}</h2>
                    </div>}
                    {volume && <div>
                        <h3>Volume</h3>
                        <h2>{volume}</h2>
                    </div>}
                    {HighLowRange && <div>
                        <h3>Range</h3>
                        <h2>{HighLowRange}</h2>
                    </div>}
                </div>
                <div className="StockIndivdualGraph">
                    <canvas ref={canvasRef} tabIndex={0} role="img" aria-label="A line chart showing the stock's performance over time"></canvas>
                </div>
                <div className="StockGraphButtonCollection">
                    <button aria-label="filter to the last week" className="w" onClick={() => {setRange("Week")}} style={range == "Week" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Week</button>
                    <button aria-label="filter to the last month" className="m" onClick={() => {setRange("Month")}} style={range == "Month" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Month</button>
                    <button aria-label="filter to the last three months" className="threem" onClick={() => {setRange("ThreeMonths")}} style={range == "ThreeMonths" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>3-Months</button>
                    <button aria-label="filter to the last year" className="y" onClick={() => {setRange("Year")}} style={range == "Year" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>Year</button>
                    <button aria-label="filter to the last three years" className="threey" onClick={() => {setRange("ThreeYears")}} style={range == "ThreeYears" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>3-Years</button>
                    <button aria-label="filter to all time" className="a" onClick={() => {setRange("All")}} style={range == "All" ? {backgroundColor: "rgb(76, 175, 80)"} : undefined}>All Time</button>
                </div>
            </article>
        </>
    )
}