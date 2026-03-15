import type { OHLCVData, ApiResponse } from '../types/stock';

export async function fetchStockHistory(symbol: string): Promise<OHLCVData[]> {
  const response = await fetch(`/api/v1/stock/${symbol}/history`);
  const json: ApiResponse<OHLCVData[]> = await response.json();

  if (!response.ok || json.error) {
    throw new Error(json.error || `Failed to fetch data for ${symbol}`);
  }

  return json.data;
}
