import axios, { AxiosError } from "axios";
import handleAxiosError from "./handleAxiosError";

export default async function getStockNews(props: any) {

    try{
      const result = await axios.get(`http://localhost:3000/api/stocks/GetStockNews/${props.symbol}`)
      return result.data.news
    }
    catch(error){
      handleAxiosError(error)
    }
    return null
}
