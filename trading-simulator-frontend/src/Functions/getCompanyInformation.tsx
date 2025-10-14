import axios from "axios"
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getCompanyInformation(props: any){
    try{
        console.log(props.symbol)
        const result = await axios.get(`http://localhost:3000/api/stocks/GetCompanyDetails/${props.symbol}`)
        console.log(result)

        if(result.data.hasError){
            handleTwelveDataError({
                response: result.data.profile,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            return result.data.profile.data;
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