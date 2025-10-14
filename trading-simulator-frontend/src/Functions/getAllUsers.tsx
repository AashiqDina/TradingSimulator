import axios from "axios";

export default async function getAllUsers(props: any){
    try{
        const result = await axios.get(`http://localhost:3000/api/User/List`)
        console.log("UserList: ", result)

        if(result){
            return result.data
        }
        else{
            props.setDisplayError({
            display: true, 
            title: "An Unexpected Error", 
            bodyText: "The User list couldnt be found.", 
            warning: false, 
            buttonText: "Ok"})
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