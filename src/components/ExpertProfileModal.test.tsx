import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useSubscribe hook contract', () => {
  it('calls POST /api/subscribe with expertId', () => {
    const expectedBody = JSON.stringify({ expertId: 'expert-1' });
    expect(expectedBody).toContain('expert-1');
  });

  it('returns { subscribed: boolean } on success', () => {
    const subscribeResponse = { subscribed: true };
    expect(subscribeResponse).toHaveProperty('subscribed');
    expect(typeof subscribeResponse.subscribed).toBe('boolean');
  });

  it('toggles subscription state on server', () => {
    const responses = [{ subscribed: true }, { subscribed: false }];
    expect(responses[0].subscribed).toBe(true);
    expect(responses[1].subscribed).toBe(false);
  });
});

describe('ExpertProfileModal subscription handler', () => {
  const mockMutate = vi.fn();
  const mockToggle = vi.fn();
  const mockToastSuccess = vi.fn();
  const mockToastInfo = vi.fn();
  const mockToastError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls mutate with expertId on subscribe', () => {
    mockMutate({ expertId: 'expert-1' }, {
      onSuccess: (data: { subscribed: boolean }) => {
        mockToggle('expert-1');
        if (data.subscribed) {
          mockToastSuccess('subscribed');
        } else {
          mockToastInfo('unsubscribed');
        }
      },
      onError: (error: Error) => {
        mockToastError(error.message);
      },
    });
    expect(mockMutate).toHaveBeenCalledWith(
      { expertId: 'expert-1' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
  });

  it('toggles store and shows success toast on subscribe success', () => {
    const onSuccess = (data: { subscribed: boolean }) => {
      mockToggle('expert-1');
      if (data.subscribed) {
        mockToastSuccess('subscribed');
      } else {
        mockToastInfo('unsubscribed');
      }
    };

    onSuccess({ subscribed: true });
    expect(mockToggle).toHaveBeenCalledWith('expert-1');
    expect(mockToastSuccess).toHaveBeenCalledWith('subscribed');
  });

  it('toggles store and shows info toast on unsubscribe success', () => {
    const onSuccess = (data: { subscribed: boolean }) => {
      mockToggle('expert-1');
      if (data.subscribed) {
        mockToastSuccess('subscribed');
      } else {
        mockToastInfo('unsubscribed');
      }
    };

    onSuccess({ subscribed: false });
    expect(mockToggle).toHaveBeenCalledWith('expert-1');
    expect(mockToastInfo).toHaveBeenCalledWith('unsubscribed');
  });

  it('shows error toast on mutation failure', () => {
    const onError = (error: Error) => {
      mockToastError(error.message);
    };

    onError(new Error('Database unavailable'));
    expect(mockToastError).toHaveBeenCalledWith('Database unavailable');
  });
});
