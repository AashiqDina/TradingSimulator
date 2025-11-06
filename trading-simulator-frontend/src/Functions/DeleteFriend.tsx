import axios from "axios";
import handleTwelveDataError from "../Error/handleTwelveDataError";

export default async function DeleteFriend(props: any){
 try{
        const result = await axios.delete(`http://localhost:3000/api/User/Delete-Friend/${props.userId}/${props.friendId}`)
        console.log("Delete Friend: ", result)

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