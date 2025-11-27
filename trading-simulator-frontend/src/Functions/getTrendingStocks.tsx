import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getTrendingStocks(props: any){
    try{
        const result = await axios.get(`http://localhost:3000/api/stocks/GetTrendingStocks`)

        if(result.status == 200){
            return result.data.trendingStocks
        }
        else{
            return null;
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