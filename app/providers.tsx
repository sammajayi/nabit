"use client";

import { type ReactNode } from "react";
import { base } from "wagmi/chains";
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <MiniKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: "auto",
            theme: "mini-app-theme",
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
      >
        {children}
      </MiniKitProvider>
    </QueryClientProvider>
  );
}
