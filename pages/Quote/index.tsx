import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface QuoteViewProps {
  setFinalize: (value: boolean) => void;
  price: any;
  setQuote: (quote: any) => void;
  quote: any;
  tradeDirection: string;
}

export default function QuoteView({
  setFinalize,
  price,
  setQuote,
  quote,
  tradeDirection,
}: QuoteViewProps) {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQuote = async () => {
      if (!address || !price) return;
      
      setError(null);
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams({
          ...price,
          takerAddress: address
        });
        
        const response = await fetch(`/api/quote?${queryParams}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setQuote(data);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setError('Failed to fetch quote. Please try again.');
        setQuote(null);
      } finally {
        setLoading(false);
      }
    };

    getQuote();
  }, [address, price, setQuote]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Quote Summary</h2>
        {loading ? (
          <div className="text-center py-4">
            <p>Loading quote...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 py-2">{error}</div>
        ) : quote ? (
          <div className="space-y-2">
            <p>Price: {quote.price}</p>
            <p>Gas Estimate: {quote.estimatedGas}</p>
            <p>Price Impact: {quote.estimatedPriceImpact}%</p>
          </div>
        ) : (
          <p>No quote available</p>
        )}
      </div>
      <button
        onClick={() => setFinalize(false)}
        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
      >
        Back
      </button>
    </div>
  );
}
