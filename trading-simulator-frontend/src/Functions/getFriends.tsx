import axios from "axios";
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function getFriends(props: any){
 try{
        const result = await axios.get(`http://localhost:3000/api/User/Get-Friends/${props.userId}`)
        console.log("Friends List: ",result)

        if(result.data.hasError){
            handleTwelveDataError({
                response: result.data,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            return result.data.data;
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