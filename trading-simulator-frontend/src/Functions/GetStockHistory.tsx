import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function GetStockHistory(props: any){
    try{
        const result = await axios.get(`http://localhost:3000/api/stocks/GetStocksFullHistory/${props.symbol}`)
        console.log(result)

        if(result.data.data.hasError){
            handleTwelveDataError({
                response: result.data.data,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            console.log(result.data.data.values)
            return result.data.data.values;
        }

    }
    catch(error){
        props.setDisplayError({
            display: true, 
            title: "Couldn't reach the backend", 
            bodyText: "Looks like our servers took a coffee break. Try again in a moment!", 
            warning: false, 
            buttonText: "Retry"})
        return null;
    }
}