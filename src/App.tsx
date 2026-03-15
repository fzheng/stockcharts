import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from './themes/ThemeContext';
import { QueryForm } from './components/QueryForm';
import { ChartPanel } from './components/ChartPanel';
import { ThemeSelector } from './components/ThemeSelector';
import { useStockHistory } from './hooks/useStockHistory';

const queryClient = new QueryClient();

function AppContent() {
  const [symbol, setSymbol] = useState('');
  const { isLoading } = useStockHistory(symbol);
  const { theme } = useTheme();

  return (
    <div className="min-h-screen transition-colors" style={{ backgroundColor: theme.ui.bg }}>
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Top bar */}
        <header
          className="mb-6 flex items-center justify-between rounded-lg px-5 py-4"
          style={{
            backgroundColor: theme.ui.surface,
            border: `1px solid ${theme.ui.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold"
              style={{ backgroundColor: theme.ui.accent, color: theme.ui.buttonText }}
            >
              SC
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wide" style={{ color: theme.ui.text }}>
                StockCharts
              </h1>
              <p className="text-[11px]" style={{ color: theme.ui.textDim }}>
                Real-time market data
              </p>
            </div>
          </div>
          <ThemeSelector />
        </header>

        {/* Search */}
        <div
          className="mb-4 rounded-lg px-5 py-4"
          style={{
            backgroundColor: theme.ui.surface,
            border: `1px solid ${theme.ui.border}`,
          }}
        >
          <QueryForm onSubmit={setSymbol} isLoading={isLoading} />
        </div>

        {/* Chart */}
        <ChartPanel symbol={symbol} />
      </div>
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
