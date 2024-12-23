import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createConfig, WagmiProvider } from "wagmi";
import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultConfig,
} from "connectkit";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet } from 'viem/chains'
import { http } from 'viem'

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
    appName: "0x Next.js Demo App",
    appDescription: "A Next.js demo app for 0x Swap API and ConnectKit",
    chains: [mainnet],
    transports: {
      [mainnet.id]: http()
    }
  })
);

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <ConnectKitButton />
          {mounted && <Component {...pageProps} />}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
