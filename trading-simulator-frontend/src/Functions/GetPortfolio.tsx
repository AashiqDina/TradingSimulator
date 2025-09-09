import axios, { AxiosError } from "axios";

export default async function getPortfolio(props: any) {
  const user = props.user;
  if (!user?.id) {
    console.error("User ID is not available for fetching portfolio");
    return null;
  }

  try {
    const response = await axios.get(`http://localhost:3000/api/portfolio/${user.id}`);
    const portfolioData = response.data;

    if (!portfolioData) {
      console.error("No portfolio data found");
      return null;
    }

    const stocks = await Promise.all(
      portfolioData.stocks.map(async (stock: any) => {
        try {
          const imageRes = await axios.get<{ symbol: string; image: string }>(
            `http://localhost:3000/api/stocks/StockImage/${stock.symbol}`
          );
          const nameRes = await axios.get<string>(
            `http://localhost:3000/api/stocks/GetStockName/${stock.symbol}`
          );

          return {
            ...stock,
            logo: imageRes.data.image || "defaultLogo.png",
            name: nameRes.data || "Unknown",
          };
        } catch (error) {
          console.error("Error fetching stock info:", error);
          return { ...stock, logo: "defaultLogo.png", name: "Unknown" };
        }
      })
    );

    return {
      ...portfolioData,
      stocks,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return null;
  }
}
