import { Response } from 'express';
import { getAuth } from '@clerk/express';
import { createClerkClient } from '@clerk/backend';
import UserSubscription, { type SubscriptionPlan } from '../models/UserSubscription';
import type { ClerkRequest } from '../middleware/clerkAuth';

// GET /api/subscriptions/status
export const getStatus = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    const sub = await UserSubscription.findOne({ clerkUserId: userId });
    res.json({
      status:          sub?.status          ?? 'none',
      plan:            sub?.plan            ?? 'none',
      currentPeriodEnd: sub?.currentPeriodEnd ?? null,
    });
  } catch {
    res.status(500).json({ error: 'Errore recupero subscription' });
  }
};

// Plan → Lemon Squeezy variant ID
function planToVariantId(plan: string): string | null {
  const map: Record<string, string | undefined> = {
    abbonato:     process.env.LEMONSQUEEZY_VARIANT_ABBONATO,
    bartleby:     process.env.LEMONSQUEEZY_VARIANT_BARTLEBY,
    bartleby_plus: process.env.LEMONSQUEEZY_VARIANT_BARTLEBY_PLUS,
  };
  return map[plan] ?? null;
}

// POST /api/subscriptions/checkout   body: { plan: 'abbonato' | 'bartleby' | 'bartleby_plus' }
export const createCheckout = async (req: ClerkRequest, res: Response): Promise<void> => {
  const storeId  = process.env.LEMONSQUEEZY_STORE_ID!;
  const apiKey   = process.env.LEMONSQUEEZY_API_KEY!;
  const { userId } = getAuth(req);

  const requestedPlan = (req.body?.plan as string) ?? 'abbonato';
  const variantId     = planToVariantId(requestedPlan);

  if (!variantId) {
    res.status(400).json({ error: `Piano non riconosciuto: ${requestedPlan}` });
    return;
  }

  // Recupera email e nome dell'utente da Clerk per pre-compilare il checkout
  let userEmail: string | undefined;
  let userName: string | undefined;
  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser   = await clerkClient.users.getUser(userId!);
    userEmail = clerkUser.emailAddresses.find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;
    const firstName = clerkUser.firstName ?? '';
    const lastName  = clerkUser.lastName  ?? '';
    userName = [firstName, lastName].filter(Boolean).join(' ') || undefined;
  } catch (err) {
    console.warn('[Checkout] Impossibile recuperare dati utente da Clerk:', err);
  }

  try {
    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          product_options: {
            redirect_url: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}/pricing?checkout=success`,
          },
          checkout_data: {
            email:  userEmail,
            name:   userName,
            custom: { clerk_user_id: userId },
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
      console.error(`[Checkout] LS error ${lsRes.status} — plan=${requestedPlan} variantId=${variantId}:`, JSON.stringify(err));
      res.status(502).json({ error: 'Errore creazione checkout' });
      return;
    }

    const data = await lsRes.json() as Record<string, unknown>;
    const checkoutAttrs = (data?.['data'] as Record<string, unknown>)?.['attributes'] as Record<string, unknown> | undefined;
    const url = checkoutAttrs?.['url'] as string | undefined;
    res.json({ checkoutUrl: url });
  } catch (err) {
    console.error('[Checkout] Error:', err);
    res.status(500).json({ error: 'Errore interno checkout' });
  }
};

// POST /api/subscriptions/portal
export const getPortalUrl = async (req: ClerkRequest, res: Response): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    const sub = await UserSubscription.findOne({ clerkUserId: userId });
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

    const data      = await lsRes.json() as Record<string, unknown>;
    const attrs     = ((data?.['data'] as Record<string, unknown>)?.['attributes'] as Record<string, unknown> | undefined);
    const urls      = attrs?.['urls'] as Record<string, unknown> | undefined;
    const portalUrl = urls?.['customer_portal'] as string | undefined;
    res.json({ portalUrl });
  } catch (err) {
    console.error('[Portal] Error:', err);
    res.status(500).json({ error: 'Errore interno portale' });
  }
};
