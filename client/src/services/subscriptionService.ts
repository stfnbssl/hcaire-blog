import { apiRequest } from './apiClient';

export type SubscriptionPlan = 'none' | 'abbonato' | 'bartleby' | 'bartleby_plus';

export interface SubscriptionStatus {
  status: 'active' | 'on_trial' | 'paused' | 'cancelled' | 'expired' | 'past_due' | 'none';
  plan:   SubscriptionPlan;
  currentPeriodEnd: string | null;
}

export async function getSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
  return apiRequest<SubscriptionStatus>('/subscriptions/status', { token });
}

export async function createCheckout(token: string, plan: SubscriptionPlan): Promise<{ checkoutUrl: string }> {
  return apiRequest<{ checkoutUrl: string }>('/subscriptions/checkout', {
    method: 'POST',
    token,
    body: JSON.stringify({ plan }),
  });
}

export async function getPortalUrl(token: string): Promise<{ portalUrl: string }> {
  return apiRequest<{ portalUrl: string }>('/subscriptions/portal', {
    method: 'POST',
    token,
  });
}

export async function syncSubscription(token: string): Promise<SubscriptionStatus> {
  return apiRequest<SubscriptionStatus>('/subscriptions/sync', {
    method: 'POST',
    token,
  });
}
