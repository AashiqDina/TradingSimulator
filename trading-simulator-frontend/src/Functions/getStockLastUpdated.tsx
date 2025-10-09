import axios from "axios"


export default async function getStockLastUpdated(symbol: string){
    let LastUpdatedDictionary = await axios.get(`http://localhost:3000/api/stocks/GetStockLastUpdated/${symbol}`)
    return LastUpdatedDictionary.data.data
}