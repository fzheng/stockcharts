import { useStockHistory } from '../hooks/useStockHistory';
import { StockChart } from './StockChart';
import { useTheme } from '../themes/ThemeContext';

interface ChartPanelProps {
  symbol: string;
}

export function ChartPanel({ symbol }: ChartPanelProps) {
  const { data, isLoading, isError, error } = useStockHistory(symbol);
  const { theme } = useTheme();

  if (!symbol) {
    return (
      <div
        className="flex h-80 items-center justify-center rounded-lg"
        style={{
          border: `2px dashed ${theme.ui.border}`,
          backgroundColor: theme.ui.surface,
        }}
      >
        <div className="text-center">
          <p className="text-base font-medium" style={{ color: theme.ui.textDim }}>
            Search for a stock symbol to view its chart
          </p>
          <p className="mt-1 text-sm" style={{ color: theme.ui.textDim }}>
            or click one of the quick symbols above
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex h-80 items-center justify-center rounded-lg"
        style={{
          backgroundColor: theme.ui.surface,
          border: `1px solid ${theme.ui.border}`,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-8 w-8 animate-spin rounded-full border-[3px] border-t-transparent"
            style={{ borderColor: theme.ui.accent, borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-medium" style={{ color: theme.ui.textMuted }}>
            Loading {symbol}...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex h-80 items-center justify-center rounded-lg"
        style={{
          backgroundColor: theme.ui.surface,
          border: `1px solid ${theme.ui.negative}40`,
        }}
      >
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: theme.ui.negative }}>
            {error instanceof Error ? error.message : 'Failed to load data'}
          </p>
          <p className="mt-1 text-xs" style={{ color: theme.ui.textDim }}>
            Check the symbol and try again
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="flex h-80 items-center justify-center rounded-lg"
        style={{
          backgroundColor: theme.ui.surface,
          border: `1px solid ${theme.ui.border}`,
        }}
      >
        <p className="text-sm" style={{ color: theme.ui.textMuted }}>
          No data available for {symbol}
        </p>
      </div>
    );
  }

  return <StockChart data={data} symbol={symbol} />;
}
