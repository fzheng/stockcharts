import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../themes/ThemeContext';
import { QueryForm } from '../components/QueryForm';

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('QueryForm', () => {
  it('renders input and submit button', () => {
    renderWithTheme(<QueryForm onSubmit={() => {}} isLoading={false} />);

    expect(screen.getByPlaceholderText(/symbol/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /search/i })).toBeDefined();
  });

  it('calls onSubmit with uppercased symbol', () => {
    const onSubmit = vi.fn();
    renderWithTheme(<QueryForm onSubmit={onSubmit} isLoading={false} />);

    const input = screen.getByPlaceholderText(/symbol/i);
    fireEvent.change(input, { target: { value: 'aapl' } });
    fireEvent.submit(input.closest('form')!);

    expect(onSubmit).toHaveBeenCalledWith('AAPL');
  });

  it('disables button when input is empty', () => {
    renderWithTheme(<QueryForm onSubmit={() => {}} isLoading={false} />);

    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    renderWithTheme(<QueryForm onSubmit={() => {}} isLoading={true} />);

    expect(screen.getByText(/loading/i)).toBeDefined();
  });

  it('renders quick symbol buttons', () => {
    const onSubmit = vi.fn();
    renderWithTheme(<QueryForm onSubmit={onSubmit} isLoading={false} />);

    const aaplButton = screen.getByRole('button', { name: 'AAPL' });
    fireEvent.click(aaplButton);

    expect(onSubmit).toHaveBeenCalledWith('AAPL');
  });
});
