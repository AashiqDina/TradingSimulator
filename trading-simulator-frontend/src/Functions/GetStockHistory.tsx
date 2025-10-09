import axios from "axios";
import { useState } from "react";

export default async function GetStockHistory(symbol: string){

    try{
        let result = await axios.get(`http://localhost:3000/api/stocks/GetStocksFullHistory/${symbol}`)
        return result.data.history.values
    }
    catch(error){
        return null
    }
}