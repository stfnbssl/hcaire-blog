import { apiRequest } from './apiClient';

export interface SubscriptionStatus {
  status: 'active' | 'on_trial' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'none';
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
  return apiRequest<SubscriptionStatus>('/subscriptions/status', { token });
}

export async function createCheckout(token: string): Promise<{ checkoutUrl: string }> {
  return apiRequest<{ checkoutUrl: string }>('/subscriptions/checkout', {
    method: 'POST',
    token,
  });
}

export async function getPortalUrl(token: string): Promise<{ portalUrl: string }> {
  return apiRequest<{ portalUrl: string }>('/subscriptions/portal', {
    method: 'POST',
    token,
  });
}
