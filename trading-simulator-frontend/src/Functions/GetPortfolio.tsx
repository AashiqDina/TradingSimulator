import axios from "axios";

export default async function getPortfolio(props: any){
    const user = props.user
    let portfolio = null 
    let StockLogoArray: any[] = []
    let StockNameArray: any[] = []
    let CurrentBestStocks = null
    
        async function fetchPortfolio() {
            if (!user?.id) {
                console.error("User ID is not available for fetching portfolio");
                return;
              }
          
              try {
                const response = await axios.get(
                  `http://localhost:3000/api/portfolio/${user?.id}`
                );
                console.log("Fetched portfolio data:", response.data); 
          
          
                if (response.data) {
                    portfolio = response.data
          
                  const stocks = response.data.stocks.map((stock: any) => ({
                    symbol: stock.symbol
                  }));
          
                  if(StockLogoArray.length == 0){
                    for (const {symbol} of stocks){
                      try{
                        const response2 = await axios.get<{ symbol: string; image: string }>(`http://localhost:3000/api/stocks/StockImage/${symbol}`);
                        StockLogoArray.push(response2.data.image);
                        const response3 = await axios.get<string>(`http://localhost:3000/api/stocks/GetStockName/${symbol}`);
                        StockNameArray.push(response3.data);
          
                      }
                      catch (error){
                        handleAxiosError(error)
                      }
                      CurrentBestStocks = response
                    };
                  }
          
                } else {
                  console.error("No portfolio data found");
                }
              } catch (error) {
                handleAxiosError(error);
              }
            };

    const handleAxiosError = (error: unknown) => {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosErrorType;
          const message = axiosError.response ? axiosError.response.data : axiosError.message;
          console.error("Error:", message);
        } else {
          console.error("Unknown error:", error);
        }
      };

      interface AxiosErrorType {
        response?: { data: string; status: number; statusText: string };
        message: string;
      }

      await fetchPortfolio()

      return {
        portfolio: portfolio,
        StockLogoArray: StockLogoArray,
        StockNameArray: StockNameArray,
        CurrentBestStocks: CurrentBestStocks
      }
}