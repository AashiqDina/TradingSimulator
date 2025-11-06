import axios, { AxiosError } from "axios";
import handleAxiosError from "./handleAxiosError";

export default async function getHistory(props: any) {
    const user = props.id;
    const Timeframe = props.FilterHistory
    try{
      const result = await axios.get(`http://localhost:3000/api/portfolio/stocks/getHistory/${user}?range=${Timeframe}`)
      return result
    }
    catch(error){
      handleAxiosError(error)
    }
    return null
}
