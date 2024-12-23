import { useEffect, useRef, useState } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
          "symbol": "BINANCE:${symbol}USDT",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_top_toolbar": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_widget"
        }`;

      if (container.current) {
        container.current.appendChild(script);
      }

      script.onerror = () => {
        setError('Failed to load TradingView widget');
      };
      
      script.onload = () => {
        setIsLoading(false);
      };
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (isLoading) return <div>Loading chart...</div>;
  
  return <div id="tradingview_widget" ref={container} className="h-[600px]" />;
}

export default TradingViewWidget; 