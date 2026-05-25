import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Test</Badge>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders with children', () => {
    render(<Badge data-testid="badge">Hello World</Badge>);
    expect(screen.getByTestId('badge')).toHaveTextContent('Hello World');
  });
});
