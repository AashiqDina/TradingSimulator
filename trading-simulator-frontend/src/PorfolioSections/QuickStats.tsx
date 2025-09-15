export default function QuickStats(props: any){

    
    let ProfitColour = "#45a049";
    let ProfitLossTitle = "Profit";
    let ValueColour = "#45a049";
  
    if (props.portfolio) {
      if (props.portfolio.profitLoss < 0) {
        ProfitColour = "#bb1515";
        ProfitLossTitle = "Loss";
      }
  
      if (props.portfolio.currentValue < props.portfolio.totalInvested) {
        ValueColour = "#bb1515";
      }
    }
    return (
        <>
            <section className="QuickStats">
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
            </section>
        </>
    )
}