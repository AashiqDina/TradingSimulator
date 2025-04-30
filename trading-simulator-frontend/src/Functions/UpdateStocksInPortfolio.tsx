import axios from "axios";
import handleAxiosError from "./handleAxiosError";

export default function updateAllStocksInPortfolio(props: any){
    let user = props.user
    const UpdateAllStocksInPortfolio = async () => {
        if (!user?.id) {
          console.error("User ID is not available");
          return;
        }
      
        try {
          const response = await axios.put(
            `http://localhost:3000/api/portfolio/${user?.id}/stocks/update`
          );
      
          console.log("Stocks updated:", response.data);
        } catch (error) {
          handleAxiosError(error);
        }
      };

    UpdateAllStocksInPortfolio()
}