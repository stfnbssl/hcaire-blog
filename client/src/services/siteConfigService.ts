import { apiRequest } from './apiClient';

export type SiteStatus = 'test' | 'production';

export interface SiteConfig {
  status: SiteStatus;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return apiRequest<SiteConfig>('/site-config');
}

export async function updateSiteConfig(token: string, status: SiteStatus): Promise<SiteConfig> {
  return apiRequest<SiteConfig>('/site-config', {
    method: 'PUT',
    token,
    body: JSON.stringify({ status }),
  });
}
