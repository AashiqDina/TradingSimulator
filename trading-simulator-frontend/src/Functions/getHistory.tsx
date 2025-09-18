import axios, { AxiosError } from "axios";
import handleAxiosError from "./handleAxiosError";

export default async function getHistory(props: any) {
    const user = props.user;
    const Timeframe = props.FilterHistory
    try{
      const result = await axios.get(`http://localhost:3000/api/portfolio/stocks/getHistory/${user.id}?range=${Timeframe}`)
      return result
    }
    catch(error){
      handleAxiosError(error)
    }
    return null
}
