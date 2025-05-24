import { useQuery } from "@tanstack/react-query";

interface ApiMetrics {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  uptime: number;
}

interface ApiStatus {
  status: string;
  timestamp: string;
  version: string;
  metrics: ApiMetrics;
}

export function useApiStatus() {
  return useQuery<ApiStatus>({
    queryKey: ['/api/health'],
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
  });
}
