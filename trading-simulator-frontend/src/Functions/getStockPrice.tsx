import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getStockPrice(props: any){
    try{
        const result = await axios.get(`http://localhost:3000/api/stocks/${props.symbol}`)
        console.log(result)

        if(result.data.response.hasError){
            handleTwelveDataError({
                response: result.data.response,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            return result.data.response.data;
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