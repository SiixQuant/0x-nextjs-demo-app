import { useState } from 'react';
import { POLYGON_TOKENS } from '@/lib/constants';
import type { Token } from '@/lib/types';

interface PriceViewProps {
  setFinalize: (value: boolean) => void;
  setPrice: (price: any) => void;
  tradeDirection: string;
  setTradeDirection: (direction: string) => void;
  setSellToken: (token: Token) => void;
}

export default function PriceView({
  setFinalize,
  setPrice,
  tradeDirection,
  setTradeDirection,
  setSellToken,
}: PriceViewProps) {
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(POLYGON_TOKENS[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/price?sellToken=${selectedToken.address}&buyToken=USDT&sellAmount=${amount}`);
      const data = await response.json();
      setPrice(data);
      setSellToken(selectedToken);
      setFinalize(true);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            className="w-full p-2 bg-gray-700 rounded"
            value={selectedToken.symbol}
            onChange={(e) => {
              const token = POLYGON_TOKENS.find(t => t.symbol === e.target.value);
              if (token) setSelectedToken(token);
            }}
          >
            {POLYGON_TOKENS.map((token: Token) => (
              <option key={token.address} value={token.symbol}>
                {token.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <input
            type="number"
            className="w-full p-2 bg-gray-700 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Get Price
        </button>
      </form>
    </div>
  );
}
