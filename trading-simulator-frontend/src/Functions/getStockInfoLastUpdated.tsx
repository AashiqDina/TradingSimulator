import axios from "axios"

export default async function getStockInfoLastUpdated(symbol: string){
    let LastUpdatedDictionary = await axios.get(`http://localhost:3000/api/stocks/GetStockInfoLastUpdated/${symbol}`)
    return LastUpdatedDictionary.data.data
}