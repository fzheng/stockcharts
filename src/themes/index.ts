import type { DeepPartial, ChartOptions, CandlestickSeriesOptions } from 'lightweight-charts';
import { ColorType } from 'lightweight-charts';

export type ThemeId = 'tradingview' | 'bloomberg' | 'light';

export interface AppTheme {
  id: ThemeId;
  name: string;
  description: string;
  chart: DeepPartial<ChartOptions>;
  candle: DeepPartial<CandlestickSeriesOptions>;
  volumeUp: string;
  volumeDown: string;
  ui: {
    bg: string;
    surface: string;
    surfaceAlt: string;
    border: string;
    borderActive: string;
    text: string;
    textMuted: string;
    textDim: string;
    accent: string;
    accentHover: string;
    positive: string;
    negative: string;
    badgeBg: string;
    badgeText: string;
    inputBg: string;
    inputBorder: string;
    inputText: string;
    buttonBg: string;
    buttonText: string;
    buttonHoverBg: string;
  };
}

export const themes: Record<ThemeId, AppTheme> = {
  tradingview: {
    id: 'tradingview',
    name: 'TradingView',
    description: 'Dark theme inspired by TradingView',
    chart: {
      layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#B2B5BE',
      },
      grid: {
        vertLines: { color: '#1E222D' },
        horzLines: { color: '#1E222D' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#758696', width: 1, style: 3, labelBackgroundColor: '#2A2E39' },
        horzLine: { color: '#758696', width: 1, style: 3, labelBackgroundColor: '#2A2E39' },
      },
      timeScale: {
        borderColor: '#2A2E39',
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: '#2A2E39',
      },
    },
    candle: {
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderDownColor: '#EF5350',
      borderUpColor: '#26A69A',
      wickDownColor: '#EF5350',
      wickUpColor: '#26A69A',
    },
    volumeUp: 'rgba(38, 166, 154, 0.3)',
    volumeDown: 'rgba(239, 83, 80, 0.3)',
    ui: {
      bg: '#0C0E15',
      surface: '#131722',
      surfaceAlt: '#1E222D',
      border: '#2A2E39',
      borderActive: '#2962FF',
      text: '#D1D4DC',
      textMuted: '#B2B5BE',
      textDim: '#787B86',
      accent: '#2962FF',
      accentHover: '#1E53E5',
      positive: '#26A69A',
      negative: '#EF5350',
      badgeBg: '#1E222D',
      badgeText: '#B2B5BE',
      inputBg: '#1E222D',
      inputBorder: '#2A2E39',
      inputText: '#D1D4DC',
      buttonBg: '#2962FF',
      buttonText: '#FFFFFF',
      buttonHoverBg: '#1E53E5',
    },
  },

  bloomberg: {
    id: 'bloomberg',
    name: 'Bloomberg',
    description: 'Classic Bloomberg Terminal look',
    chart: {
      layout: {
        background: { type: ColorType.Solid, color: '#000000' },
        textColor: '#FF8C00',
      },
      grid: {
        vertLines: { color: '#1A1A2E' },
        horzLines: { color: '#1A1A2E' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#FF8C00', width: 1, style: 2, labelBackgroundColor: '#1A1A2E' },
        horzLine: { color: '#FF8C00', width: 1, style: 2, labelBackgroundColor: '#1A1A2E' },
      },
      timeScale: {
        borderColor: '#333366',
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: '#333366',
      },
    },
    candle: {
      upColor: '#00FF00',
      downColor: '#FF3333',
      borderDownColor: '#FF3333',
      borderUpColor: '#00FF00',
      wickDownColor: '#FF3333',
      wickUpColor: '#00FF00',
    },
    volumeUp: 'rgba(0, 255, 0, 0.2)',
    volumeDown: 'rgba(255, 51, 51, 0.2)',
    ui: {
      bg: '#000000',
      surface: '#0A0A1A',
      surfaceAlt: '#1A1A2E',
      border: '#333366',
      borderActive: '#FF8C00',
      text: '#FF8C00',
      textMuted: '#CC7000',
      textDim: '#996600',
      accent: '#FF8C00',
      accentHover: '#FFA040',
      positive: '#00FF00',
      negative: '#FF3333',
      badgeBg: '#1A1A2E',
      badgeText: '#FF8C00',
      inputBg: '#0A0A1A',
      inputBorder: '#333366',
      inputText: '#FF8C00',
      buttonBg: '#FF8C00',
      buttonText: '#000000',
      buttonHoverBg: '#FFA040',
    },
  },

  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme',
    chart: {
      layout: {
        background: { type: ColorType.Solid, color: '#FFFFFF' },
        textColor: '#6B7280',
      },
      grid: {
        vertLines: { color: '#F3F4F6' },
        horzLines: { color: '#F3F4F6' },
      },
      crosshair: {
        mode: 0,
        vertLine: { color: '#9CA3AF', width: 1, style: 3, labelBackgroundColor: '#F9FAFB' },
        horzLine: { color: '#9CA3AF', width: 1, style: 3, labelBackgroundColor: '#F9FAFB' },
      },
      timeScale: {
        borderColor: '#E5E7EB',
        timeVisible: false,
      },
      rightPriceScale: {
        borderColor: '#E5E7EB',
      },
    },
    candle: {
      upColor: '#16A34A',
      downColor: '#DC2626',
      borderDownColor: '#DC2626',
      borderUpColor: '#16A34A',
      wickDownColor: '#DC2626',
      wickUpColor: '#16A34A',
    },
    volumeUp: 'rgba(22, 163, 74, 0.2)',
    volumeDown: 'rgba(220, 38, 38, 0.2)',
    ui: {
      bg: '#F9FAFB',
      surface: '#FFFFFF',
      surfaceAlt: '#F3F4F6',
      border: '#E5E7EB',
      borderActive: '#3B82F6',
      text: '#111827',
      textMuted: '#6B7280',
      textDim: '#9CA3AF',
      accent: '#3B82F6',
      accentHover: '#2563EB',
      positive: '#16A34A',
      negative: '#DC2626',
      badgeBg: '#F3F4F6',
      badgeText: '#374151',
      inputBg: '#FFFFFF',
      inputBorder: '#D1D5DB',
      inputText: '#111827',
      buttonBg: '#3B82F6',
      buttonText: '#FFFFFF',
      buttonHoverBg: '#2563EB',
    },
  },
};

export const themeIds = Object.keys(themes) as ThemeId[];
