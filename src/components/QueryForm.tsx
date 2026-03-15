import { useState, type FormEvent } from 'react';
import { useTheme } from '../themes/ThemeContext';

interface QueryFormProps {
  onSubmit: (symbol: string) => void;
  isLoading: boolean;
}

const QUICK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META'];

export function QueryForm({ onSubmit, isLoading }: QueryFormProps) {
  const [symbol, setSymbol] = useState('');
  const { theme } = useTheme();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Symbol (e.g. AAPL)"
          maxLength={5}
          className="flex-1 rounded-md px-3 py-2 text-sm font-mono font-medium uppercase tracking-widest transition-colors focus:outline-none focus:ring-2"
          style={{
            backgroundColor: theme.ui.inputBg,
            border: `1px solid ${theme.ui.inputBorder}`,
            color: theme.ui.inputText,
            // @ts-expect-error CSS custom properties
            '--tw-ring-color': theme.ui.accent + '40',
          }}
        />
        <button
          type="submit"
          disabled={!symbol.trim() || isLoading}
          className="rounded-md px-5 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            backgroundColor: theme.ui.buttonBg,
            color: theme.ui.buttonText,
          }}
          onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = theme.ui.buttonHoverBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = theme.ui.buttonBg; }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading
            </span>
          ) : 'Search'}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_SYMBOLS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSymbol(s);
              onSubmit(s);
            }}
            className="rounded px-2.5 py-1 text-[11px] font-mono font-medium tracking-wider transition-colors"
            style={{
              backgroundColor: theme.ui.badgeBg,
              color: theme.ui.badgeText,
              border: `1px solid ${theme.ui.border}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.ui.borderActive;
              e.currentTarget.style.color = theme.ui.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.ui.border;
              e.currentTarget.style.color = theme.ui.badgeText;
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
