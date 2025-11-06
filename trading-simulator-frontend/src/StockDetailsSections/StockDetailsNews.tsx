import { useEffect, useState } from "react"
import getStockNews from "../Functions/getStockNews"
import "./StockDetailsNews.css"
import Loading from "../Loading/Loading"

export default function StockDetailsNews(props: any){

  const [NewsArray, setNewsArray] = useState<any | null>(null)
  const [amountNewsDisplay, setAmountNewsDisplay] = useState<number>(5)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getNews = async () => {
      let response = await getStockNews({symbol: props.symbol, setDisplayError: props.setDisplayError});
      setNewsArray(response)
      setLoading(false)
      console.log(response);
    }
    getNews()
  }, [])

  return(
    <>
    {!loading && <section>
      <article className="ArticleCollection">
        {NewsArray?.slice(0, amountNewsDisplay).map((article: any, index: number) => {
            return(
              <a key={index} className="NewsArticle" href={article.url}>
                <img src={article.image} alt="" />
                <div>
                  <h2>{article.headline}</h2>
                  <p>{article.summary}</p>
                  <div>
                    <p className="Source">Source: {article.source}</p>
                    <p className="Date">{new Date(article.datetime * 1000).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}</p>
                  </div>
                </div>
              </a>
            )
        })
        }
      </article>

      <article className="MoreNewsArticles">
        {amountNewsDisplay < NewsArray?.length ?
        <button className="SeeMoreNews" onClick={() => {setAmountNewsDisplay(amountNewsDisplay+5)}}>
          View More
        </button> : 
        <h2>No more Articles.</h2>
        }
      </article>
    </section>}

    { loading && <Loading/>}
    </>
  )
}