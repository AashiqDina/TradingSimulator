import { useEffect, useState } from "react";
import createApi from "realtime-newsapi";

interface Article {
  title: string;
  description?: string;
  url: string;
}


const api = createApi({
  socketOptions: {
    transports: ["websocket"],
    withCredentials: false        
  }
});

export default function StockDetailsNews(props: any) {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    const handler = (articles: Article[]) => {
      const filtered = articles.filter(a =>
        a.title.includes(props.Symbol) ||
        (a.description ?? "").includes(props.Symbol)
      );
      setNews(filtered);
    };

    api.on("articles", handler);
    return () => {
      api.off("articles", handler);
    };
  }, [props.Symbol]);  // dependency on props.Symbol

  return (
    <>
      {news.length > 0 ? (
        news.map(a => (
          <a
            key={a.url}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 p-3 border rounded hover:bg-gray-50"
          >
            <h3 className="text-lg font-semibold">{a.title}</h3>
            {a.description && (
              <p className="text-sm text-gray-700">{a.description}</p>
            )}
          </a>
        ))
      ) : (
        <h3 className="text-center text-gray-500">
          No articles found for “{props.Symbol}”
        </h3>
      )}
    </>
  );
}