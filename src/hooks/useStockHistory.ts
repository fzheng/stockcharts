import { useQuery } from '@tanstack/react-query';
import { fetchStockHistory } from '../api/stockApi';

export function useStockHistory(symbol: string) {
  return useQuery({
    queryKey: ['stockHistory', symbol],
    queryFn: () => fetchStockHistory(symbol),
    enabled: symbol.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
