declare global {
  interface Window {
    TradingView: any;
  }
}

import { useState, useEffect } from "react";
import PriceView from "./Price";
import QuoteView from "./Quote";
import type { PriceResponse } from "./api/types";
import { useAccount } from "wagmi";
import TradingViewWidget from '../components/TradingViewWidget';

export default function Home() {
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [sellToken, setSellToken] = useState({ symbol: 'ETH' });
  const [finalize, setFinalize] = useState(false);
  const [price, setPrice] = useState<PriceResponse | undefined>();
  const [quote, setQuote] = useState();
  const { address } = useAccount();
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      setIsChartLoading(false);
      new window.TradingView.widget({
        width: '100%',
        height: 500,
        symbol: 'MATIC/USD', // or whatever trading pair you want
        interval: 'D',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#f1f3f6',
        enable_publishing: false,
        allow_symbol_change: true,
        container_id: 'tradingview_chart'
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          {/* Trading View Chart */}
          <div className="w-full md:w-2/3">
            {isChartLoading ? (
              <div className="h-[500px] flex items-center justify-center bg-gray-800">
                <p className="text-gray-400">Loading chart...</p>
              </div>
            ) : (
              <div id="tradingview_chart" />
            )}
          </div>
          
          {/* Swap Interface */}
          <div className="w-full md:w-1/3">
            {!finalize ? (
              <PriceView
                setFinalize={setFinalize}
                setPrice={setPrice}
                tradeDirection={tradeDirection}
                setTradeDirection={setTradeDirection}
                setSellToken={setSellToken}
              />
            ) : (
              <QuoteView
                setFinalize={setFinalize}
                price={price}
                setQuote={setQuote}
                quote={quote}
                tradeDirection={tradeDirection}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
