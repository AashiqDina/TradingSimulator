import axios from "axios";
import { StockApiInfo, CompanyProfile } from "../interfaces";

export default async function getStockApiInfo(symbol: string){
    const response3 = await axios.get<{quoteData: StockApiInfo}>(`http://localhost:3000/api/stocks/GetStockQuoteInfo/${symbol}`);
    return response3.data.quoteData
}