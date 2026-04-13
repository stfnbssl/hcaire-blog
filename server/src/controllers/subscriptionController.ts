import { Response } from 'express';
import UserSubscription from '../models/UserSubscription';
import type { ClerkRequest } from '../middleware/clerkAuth';

// GET /api/subscriptions/status
export const getStatus = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const sub = await UserSubscription.findOne({ clerkUserId: req.clerkUserId });
    res.json({ status: sub?.status ?? 'none', currentPeriodEnd: sub?.currentPeriodEnd ?? null });
  } catch {
    res.status(500).json({ error: 'Errore recupero subscription' });
  }
};

// POST /api/subscriptions/checkout
export const createCheckout = async (req: ClerkRequest, res: Response): Promise<void> => {
  const storeId   = process.env.LEMONSQUEEZY_STORE_ID!;
  const variantId = process.env.LEMONSQUEEZY_VARIANT_ID!;
  const apiKey    = process.env.LEMONSQUEEZY_API_KEY!;

  try {
    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            custom: { clerk_user_id: req.clerkUserId },
          },
        },
        relationships: {
          store:   { data: { type: 'stores',   id: storeId   } },
          variant: { data: { type: 'variants', id: variantId } },
        },
      },
    };

    const lsRes = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/vnd.api+json',
        'Accept':        'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });

    if (!lsRes.ok) {
      const err = await lsRes.json();
      console.error('[Checkout] Lemon Squeezy error:', err);
      res.status(502).json({ error: 'Errore creazione checkout' });
      return;
    }

    const data = await lsRes.json() as Record<string, unknown>;
    const checkoutUrl = (data?.['data'] as Record<string, unknown>)?.['attributes'] as Record<string, unknown> | undefined;
    const url = (checkoutUrl?.['url']) as string | undefined;
    res.json({ checkoutUrl: url });
  } catch (err) {
    console.error('[Checkout] Error:', err);
    res.status(500).json({ error: 'Errore interno checkout' });
  }
};

// POST /api/subscriptions/portal
export const getPortalUrl = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const sub = await UserSubscription.findOne({ clerkUserId: req.clerkUserId });
    if (!sub?.lsCustomerId) {
      res.status(404).json({ error: 'Nessuna subscription trovata' });
      return;
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY!;
    const lsRes  = await fetch(`https://api.lemonsqueezy.com/v1/customers/${sub.lsCustomerId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept':        'application/vnd.api+json',
      },
    });

    if (!lsRes.ok) {
      res.status(502).json({ error: 'Errore recupero portale cliente' });
      return;
    }

    const data       = await lsRes.json() as Record<string, unknown>;
    const attrs      = ((data?.['data'] as Record<string, unknown>)?.['attributes'] as Record<string, unknown> | undefined);
    const urls       = attrs?.['urls'] as Record<string, unknown> | undefined;
    const portalUrl  = urls?.['customer_portal'] as string | undefined;
    res.json({ portalUrl });
  } catch (err) {
    console.error('[Portal] Error:', err);
    res.status(500).json({ error: 'Errore interno portale' });
  }
};
