import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from 'lightweight-charts';
import type { OHLCVData } from '../types/stock';
import { useTheme } from '../themes/ThemeContext';

interface StockChartProps {
  data: OHLCVData[];
  symbol: string;
}

type RangeKey = '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

const RANGE_DAYS: Record<RangeKey, number | null> = {
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  '5Y': 1825,
  ALL: null,
};

interface CrosshairData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}

function formatNumber(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

function formatPercent(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return sign + n.toFixed(2) + '%';
}

function filterByRange(data: OHLCVData[], range: RangeKey): OHLCVData[] {
  const days = RANGE_DAYS[range];
  if (days === null) return data;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split('T')[0];
  return data.filter((d) => d.date >= cutoffStr);
}

export function StockChart({ data, symbol }: StockChartProps) {
  const { theme } = useTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [crosshair, setCrosshair] = useState<CrosshairData | null>(null);
  const [range, setRange] = useState<RangeKey>('1Y');

  const visibleData = useMemo(() => filterByRange(data, range), [data, range]);

  const lastBar = visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;
  const firstBar = visibleData.length > 0 ? visibleData[0] : null;

  const displayData = crosshair || (lastBar ? {
    open: lastBar.open, high: lastBar.high, low: lastBar.low,
    close: lastBar.close, volume: lastBar.volume, time: lastBar.date,
  } : null);

  const priceChange = displayData && firstBar
    ? ((displayData.close - firstBar.close) / firstBar.close) * 100 : 0;
  const dayChange = displayData
    ? ((displayData.close - displayData.open) / displayData.open) * 100 : 0;

  const handleCrosshairMove = useCallback((param: { time?: Time; seriesData?: Map<ISeriesApi<'Candlestick'>, CandlestickData> }) => {
    if (!param.time || !param.seriesData || !candleSeriesRef.current) {
      setCrosshair(null);
      return;
    }
    const candleData = param.seriesData.get(candleSeriesRef.current) as CandlestickData | undefined;
    if (!candleData) { setCrosshair(null); return; }
    const matchingData = visibleData.find(d => d.date === param.time);
    setCrosshair({
      open: candleData.open, high: candleData.high, low: candleData.low,
      close: candleData.close, volume: matchingData?.volume ?? 0, time: param.time as string,
    });
  }, [visibleData]);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current || visibleData.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Dynamic height: fill available viewport minus header/search/legend
    const wrapperTop = wrapperRef.current.getBoundingClientRect().top;
    const chartHeight = Math.max(400, window.innerHeight - wrapperTop - 16);

    // Subtract header + legend height (approx 90px) from chart container
    const headerHeight = containerRef.current.offsetTop;
    const canvasHeight = chartHeight - headerHeight;

    const chart = createChart(containerRef.current, {
      ...theme.chart,
      width: containerRef.current.clientWidth,
      height: Math.max(300, canvasHeight),
      handleScroll: { mouseWheel: true, pressedMouseMove: true, horzTouchDrag: true, vertTouchDrag: true },
      handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries(theme.candle);
    candleSeriesRef.current = candleSeries;

    candleSeries.setData(visibleData.map((d) => ({
      time: d.date as string, open: d.open, high: d.high, low: d.low, close: d.close,
    })));

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' as const },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    volumeSeries.setData(visibleData.map((d) => ({
      time: d.date as string, value: d.volume,
      color: d.close >= d.open ? theme.volumeUp : theme.volumeDown,
    })));

    chart.timeScale().fitContent();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chart.subscribeCrosshairMove(handleCrosshairMove as any);

    // Resize both width and height dynamically
    const resizeObserver = new ResizeObserver(() => {
      if (!wrapperRef.current || !containerRef.current) return;
      const newTop = wrapperRef.current.getBoundingClientRect().top;
      const newHeight = Math.max(300, window.innerHeight - newTop - 16 - containerRef.current.offsetTop);
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: newHeight,
      });
    });
    resizeObserver.observe(wrapperRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, [visibleData, symbol, theme, handleCrosshairMove]);

  return (
    <div ref={wrapperRef} className="overflow-hidden rounded-lg" style={{
      backgroundColor: theme.ui.surface,
      border: `1px solid ${theme.ui.border}`,
    }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${theme.ui.border}` }}>
        <div className="flex items-center gap-4">
          <span className="text-lg font-bold tracking-wide" style={{ color: theme.ui.text }}>{symbol}</span>
          {displayData && (
            <>
              <span className="text-xl font-semibold tabular-nums" style={{ color: theme.ui.text }}>
                {formatNumber(displayData.close)}
              </span>
              <span className="text-sm font-medium tabular-nums"
                style={{ color: dayChange >= 0 ? theme.ui.positive : theme.ui.negative }}>
                {formatPercent(dayChange)}
              </span>
            </>
          )}
        </div>
        {/* Range selector */}
        <div className="flex items-center gap-1">
          {(Object.keys(RANGE_DAYS) as RangeKey[]).map((key) => (
            <button key={key} onClick={() => setRange(key)}
              className="rounded px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all"
              style={{
                backgroundColor: range === key ? theme.ui.accent : 'transparent',
                color: range === key ? theme.ui.buttonText : theme.ui.textDim,
              }}
              onMouseEnter={(e) => { if (range !== key) e.currentTarget.style.color = theme.ui.text; }}
              onMouseLeave={(e) => { if (range !== key) e.currentTarget.style.color = theme.ui.textDim; }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* OHLCV Legend */}
      {displayData && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 text-xs font-medium tabular-nums"
          style={{ borderBottom: `1px solid ${theme.ui.border}` }}>
          <LegendItem label="O" value={formatNumber(displayData.open)} theme={theme} />
          <LegendItem label="H" value={formatNumber(displayData.high)} theme={theme} />
          <LegendItem label="L" value={formatNumber(displayData.low)} theme={theme} />
          <LegendItem label="C" value={formatNumber(displayData.close)} theme={theme} change={dayChange} />
          <LegendItem label="Vol" value={formatVolume(displayData.volume)} theme={theme} />
          {firstBar && (
            <span style={{ color: priceChange >= 0 ? theme.ui.positive : theme.ui.negative }}>
              Period: {formatPercent(priceChange)}
            </span>
          )}
          <span style={{ color: theme.ui.textDim }}>
            {visibleData.length} bars
          </span>
        </div>
      )}

      {/* Chart — fills remaining height */}
      <div ref={containerRef} className="w-full" />
    </div>
  );
}

function LegendItem({ label, value, theme, change }: {
  label: string; value: string;
  theme: { ui: { textDim: string; text: string; positive: string; negative: string } };
  change?: number;
}) {
  const valueColor = change !== undefined
    ? (change >= 0 ? theme.ui.positive : theme.ui.negative) : theme.ui.text;
  return (
    <span>
      <span style={{ color: theme.ui.textDim }}>{label} </span>
      <span style={{ color: valueColor }}>{value}</span>
    </span>
  );
}
