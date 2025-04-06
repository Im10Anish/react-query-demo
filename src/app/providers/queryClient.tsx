"use client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
import OfflineIndicator from "@/app/components/OfflineIndicator";

declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}

const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

const queryErrorHandler = (error: unknown) => {
  if (error instanceof Error) {
    console.error("Query Error:", error.message);
  } else {
    console.error("Query Error:", error);
  }
};

export default function QueryProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
            mutationKey: ["global-mutation"],
          },
        },
        queryCache: new QueryCache({
          onError: queryErrorHandler,
        }),
        mutationCache: new MutationCache({
          onError: queryErrorHandler,
        }),
      })
  );

  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    window.toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <OfflineIndicator />
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
