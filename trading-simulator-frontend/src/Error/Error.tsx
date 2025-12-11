import "./Error.css";

export default function Error(props: any){
    return (
        <>
            <div className="WarningPopUp">
                <div>
                    <div>
                        <div>
                            {props.warning ?
                                <img src="/Warning.svg" alt="WARNING SYMBOL" /> : <img src="/Error.svg" alt="ERROR SYMBOL" />}
                        </div>
                        <div>
                            <h2>{props.title}</h2>
                            <p>{props.bodyText}</p>
                        </div>
                    </div>
                    <div className="WarningPopUpButton">
                        <div >
                            <button aria-label="Warning Understood Confirmation" onClick={() => {props.setDisplayError({display: false, title: "", bodyText: "", warning: false, buttonText: ""})}}>{props.buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}