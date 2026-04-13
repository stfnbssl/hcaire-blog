import { apiRequest } from './apiClient';

export interface SubscriptionStatus {
  status: 'active' | 'on_trial' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'none';
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(clerkToken: string): Promise<SubscriptionStatus> {
  return apiRequest<SubscriptionStatus>('/subscriptions/status', { clerkToken });
}

export async function createCheckout(clerkToken: string): Promise<{ checkoutUrl: string }> {
  return apiRequest<{ checkoutUrl: string }>('/subscriptions/checkout', {
    method: 'POST',
    clerkToken,
  });
}

export async function getPortalUrl(clerkToken: string): Promise<{ portalUrl: string }> {
  return apiRequest<{ portalUrl: string }>('/subscriptions/portal', {
    method: 'POST',
    clerkToken,
  });
}
