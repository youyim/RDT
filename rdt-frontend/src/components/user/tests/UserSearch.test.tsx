import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UserSearch } from '../UserSearch';

describe('UserSearch', () => {
  it('should call onSearch when typing', () => {
    const onSearch = vi.fn();
    render(<UserSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onSearch).toHaveBeenCalledWith('test');
  });
});
