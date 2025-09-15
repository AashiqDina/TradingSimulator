import axios, { AxiosError } from "axios";
import handleAxiosError from "./handleAxiosError";

export default async function getHistory(props: any) {
    const user = props.user;
    try{
      const result = await axios.get(`http://localhost:3000/api/portfolio/stocks/getHistory/${user.id}`)
      console.log("History Recieved: ", result)
      return result
    }
    catch(error){
      handleAxiosError(error)
    }
    return null
}
