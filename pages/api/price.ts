// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import qs from "qs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const query = qs.stringify(req.query);
    const response = await fetch(
      `https://polygon.api.0x.org/swap/v1/price?${query}`,
      {
        headers: {
          "0x-api-key": process.env.NEXT_PUBLIC_0X_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Price API error:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
}
