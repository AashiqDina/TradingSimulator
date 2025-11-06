import axios from "axios";
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function DeclineFriendRequest(props: any){
    try{
        const result = await axios.post(`http://localhost:3000/api/User/Decline-Request/${props.userId}/${props.friendId}`)
        console.log("Decline Request: ", result)

        if(result.data.hasError){
            handleTwelveDataError({
                response: result.data,
                setDisplayError: props.setDisplayError
            });
            return null;
        }
        else{
            return result.data;
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