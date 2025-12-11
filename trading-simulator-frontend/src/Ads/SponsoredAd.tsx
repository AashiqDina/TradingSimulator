import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const SponsoredAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div ref={adRef} className="CompleteMarketNews sponsored-ad">
      <span className="sponsored-tag">Sponsored</span>
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-format="fluid"
           data-ad-layout-key="-fb+5w+4e-db+86"
           data-ad-client="ca-pub-3076165916959329"
           data-ad-slot="4474829994">
      </ins>
    </div>
  );
};

export default SponsoredAd;
