import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client. Sensible defaults for a content + itinerary app:
 * cache server data for a minute, retry network blips once.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
