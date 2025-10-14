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
import { useRef, useEffect, useState } from "react";

ChartJS.register(LineElement, LineController, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale);

type InvestedPoint = {
    date: string;
    invested: number;
}

export default function QuickStats(props: any){

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<ChartJS | null>(null);
    const [hoverValue, setHoverValue] = useState<string | null>(null);
    const [valueLineValues, setVLV] = useState<any[] | undefined>(undefined)
    const [investedLineValues, setILV] = useState<any[] | undefined>(undefined)
    var canReset = true

    useEffect(() => {
        setGraphValues()
    }, [props.History, props.FilteredSearch])

useEffect(() => {
    if (!canvasRef.current || !valueLineValues || !investedLineValues) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
        chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(ctx, {
        type: "line",
        data: {
            labels: valueLineValues.map(entry => entry.date),
            datasets: [
                {
                    label: "Invested",
                    data: investedLineValues.map(p => p.invested),
                    borderColor: "#45a049ff",
                    backgroundColor: "#45a049ff",
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: "Portfolio Value",
                    data: valueLineValues.map(entry => entry.value),
                    borderColor: "green",
                    borderWidth: 2,
                    pointRadius: 0,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    mode: "index",
                    intersect: false,
                    enabled: false,
                    external: (context) => {
                        const tooltip = context.tooltip;
                        if (!tooltip || !tooltip.dataPoints || tooltip.dataPoints.length === 0) return;

                        let investedValue = 0;
                        let portfolioValue = 0;
                        let xValue = "";

                        tooltip.dataPoints.forEach((dataPoint) => {
                            if (dataPoint.dataset.label === "Invested") investedValue = dataPoint.parsed.y;
                            if (dataPoint.dataset.label === "Portfolio Value") portfolioValue = dataPoint.parsed.y;
                            xValue = dataPoint.label as string;
                        });

                        props.setPortfolioValue(portfolioValue.toFixed(2));
                        props.setProfit((portfolioValue - investedValue).toFixed(2));
                        props.setInvested(investedValue.toFixed(2));
                        setHoverValue(xValue);
                    },
                },
            },
            interaction: { mode: "index", intersect: false },
            scales: { x: { display: false }, y: { display: false } },
        },
    });

    return () => chartRef.current?.destroy();

}, [valueLineValues, investedLineValues, props.FilteredSearch]);

    

    let History = props.History?.data || []

    const setGraphValues = () => {
        var ILV: any[] | undefined = undefined
        var VLV: any[] | undefined = undefined


        const investedByDate: Record<string, number> = {};
        const allTransactions = props.FilteredSearch.flatMap((stock: { transactions: any; }) => stock.transactions);

        History.forEach((stockHistory: any) => {
            var stock = undefined;

            if(allTransactions.length > 0){
                stock = allTransactions.find((s: any) => s.id == stockHistory.stockId);
            }
            else{
                stock = props.portfolio.stocks.find((s: any) => s.id == stockHistory.stockId);
            }


            if (!stock || stockHistory.history.length === 0){
                return;
            }

            const firstDate = stockHistory.history[0].timestamp.split("T")[0];

            investedByDate[firstDate] = (investedByDate[firstDate] || 0) + (stock.purchasePrice * stock.quantity);
        });

        ILV = Object.entries(investedByDate).map(([date, invested]) => ({ date, invested })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let value = 0
        ILV = ILV.map((entry) => {
            value += entry.invested
            return {...entry, invested: value}
        })
        setILV(ILV)

        const valueByDate: Record<string, number> = {};


        if(allTransactions.length > 0){
            const totalProfit = allTransactions.reduce((sum: any, stock: { profitLoss: any; }) => sum + stock.profitLoss, 0);
            const totalValue = allTransactions.reduce((sum: any, stock: { totalValue: any; }) => sum + stock.totalValue, 0);
            const totalPurchase = allTransactions.reduce(
            (sum: number, stock: { purchasePrice: number; quantity: number; }) => sum + stock.purchasePrice * stock.quantity,
            0
            );

            props.setPortfolioValue(totalValue.toFixed(2))
            props.setInvested(totalPurchase.toFixed(2))
            props.setProfit(totalProfit.toFixed(2))

            console.log("allt: ", allTransactions)
            const filteredH = History.filter((hItem: { symbol: any; }) =>
                allTransactions.some((tItem: { symbol: any; }) => tItem.symbol === hItem.symbol)
                );
            filteredH.forEach((stockHistory: any) => {
                stockHistory.history.forEach((Entry: any) => {
                    valueByDate[Entry.timestamp.split("T")[0]] = (valueByDate[Entry.timestamp.split("T")[0]] || 0) + (Entry.price * Entry.quantity)
                })
            })
        }
        else{
            History.forEach((stockHistory: any) => {
                stockHistory.history.forEach((Entry: any) => {
                    valueByDate[Entry.timestamp.split("T")[0]] = (valueByDate[Entry.timestamp.split("T")[0]] || 0) + (Entry.price * Entry.quantity)
                })
            })
        }

        VLV = Object.entries(valueByDate).map(([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const extendedILV = [...ILV];
        const lastInvested = ILV.length > 0 ? ILV[ILV.length - 1].invested : 0;

        let currentInvested = lastInvested;

        VLV.forEach((entry) => {
            const exists = extendedILV.find(e => e.date === entry.date);
            if (!exists) {
                extendedILV.push({
                    date: entry.date,
                    invested: currentInvested,
                });
            } else {
                currentInvested = exists.invested;
            }
        });

        extendedILV.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setILV(extendedILV);
        setVLV(VLV);
        console.log("Array of Values Amounts", VLV);
    }

    // let ProfitColour = "#45a049";
    // let ProfitLossTitle = "Profit";
    // let ValueColour = "#45a049";
  
    // if (props.portfolio) {
    //   if (props.portfolio.profitLoss < 0) {
    //     ProfitColour = "#bb1515";
    //     ProfitLossTitle = "Loss";
    //   }
  
    //   if (props.portfolio.currentValue < props.portfolio.totalInvested) {
    //     ValueColour = "#bb1515";
    //   }
    // }
    
    return (
        <>
            <section className="StocksAverageGraph">
                <h2>{hoverValue ? `${hoverValue.toLocaleString()}` : "Hover to see value"}</h2>
                <canvas ref={canvasRef}></canvas>
            </section>
            <section className="FilterGraph">
                <article>
                    <button style={props.FilterHistory == "week" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => props.setFilterHistory("week")}>Week</button>
                    <button style={props.FilterHistory == "month" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => props.setFilterHistory("month")}>Month</button>
                    <button style={props.FilterHistory == "year" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => props.setFilterHistory("year")}>Year</button>
                    <button style={props.FilterHistory == "all" ? {backgroundColor: "#4CAF50"} : {}} onClick={() => props.setFilterHistory("all")}>All</button>
                </article>
            </section>





            {/* <section className="QuickStats">
                <article className="Box1">
                <h2>Invested</h2>
                <div className="Values">
                    <p>£{props.portfolio.totalInvested.toFixed(2)}</p>
                </div>
                </article>
                <article className="Box2" style={{ color: ValueColour, boxShadow: `0px 10px 10px ${ValueColour}`}}>
                <h2>Current Value</h2>
                <div className="Values">
                    <p>£{props.portfolio.currentValue.toFixed(2)}</p>
                </div>
                </article>
                <article className="Box3" style={{ color: ProfitColour, boxShadow: `0px 10px 10px ${ProfitColour}`}}>
                <h2>{ProfitLossTitle}</h2>
                <div className="Values">
                    <p>£{props.portfolio.profitLoss.toFixed(2)}</p>
                </div>
                </article>
            </section> */}
        </>
    )
}