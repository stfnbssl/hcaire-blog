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

// Variant ID → plan tier (usato sia nel webhook che nel sync)
export function variantToPlan(variantId: string): SubscriptionPlan {
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_ABBONATO)      return 'abbonato';
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_BARTLEBY)      return 'bartleby';
  if (variantId === process.env.LEMONSQUEEZY_VARIANT_BARTLEBY_PLUS) return 'bartleby_plus';
  return 'none';
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

// POST /api/subscriptions/sync
// Interroga direttamente la LS API per email dell'utente e aggiorna il DB.
// Usato come fallback quando il webhook non è arrivato in tempo.
export const syncSubscription = async (req: ClerkRequest, res: Response): Promise<void> => {
  const { userId } = getAuth(req);
  const storeId    = process.env.LEMONSQUEEZY_STORE_ID!;
  const apiKey     = process.env.LEMONSQUEEZY_API_KEY!;

  try {
    // Recupera email utente da Clerk
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser   = await clerkClient.users.getUser(userId!);
    const email = clerkUser.emailAddresses
      .find(e => e.id === clerkUser.primaryEmailAddressId)?.emailAddress;

    if (!email) {
      res.status(400).json({ error: 'Email utente non trovata' });
      return;
    }

    // Cerca subscriptions per email nella LS API
    const lsRes = await fetch(
      `https://api.lemonsqueezy.com/v1/subscriptions?filter[store_id]=${storeId}&filter[user_email]=${encodeURIComponent(email)}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept':        'application/vnd.api+json',
        },
      }
    );

    if (!lsRes.ok) {
      const err = await lsRes.json();
      console.error('[Sync] LS API error:', JSON.stringify(err));
      res.status(502).json({ error: 'Errore ricerca subscription su LS' });
      return;
    }

    const lsData = await lsRes.json() as Record<string, unknown>;
    const subs   = (lsData['data'] as unknown[]) ?? [];

    if (subs.length === 0) {
      // Nessuna subscription su LS — restituisce stato corrente dal DB
      const sub = await UserSubscription.findOne({ clerkUserId: userId });
      res.json({
        status:           sub?.status           ?? 'none',
        plan:             sub?.plan             ?? 'none',
        currentPeriodEnd: sub?.currentPeriodEnd ?? null,
      });
      return;
    }

    // Prende la subscription attiva, o la prima disponibile
    const activeSub = (subs as Record<string, unknown>[]).find(s => {
      const st = ((s['attributes'] as Record<string, unknown>)['status']) as string;
      return ['active', 'on_trial'].includes(st);
    }) ?? subs[0] as Record<string, unknown>;

    const attrs       = activeSub['attributes'] as Record<string, unknown>;
    const lsVariantId = String(attrs['variant_id'] ?? '');
    const newStatus   = (attrs['status'] as string) ?? 'none';
    const isActive    = ['active', 'on_trial'].includes(newStatus);
    const plan        = isActive ? variantToPlan(lsVariantId) : 'none';

    await UserSubscription.findOneAndUpdate(
      { clerkUserId: userId },
      {
        $set: {
          lsSubscriptionId: (activeSub['id'] as string) ?? '',
          lsCustomerId:     String(attrs['customer_id'] ?? ''),
          lsVariantId,
          plan,
          status:           newStatus,
          currentPeriodEnd: attrs['renews_at']
            ? new Date(attrs['renews_at'] as string)
            : null,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`[Sync] Subscription sincronizzata per ${userId}: status=${newStatus}, plan=${plan}`);
    res.json({ status: newStatus, plan, currentPeriodEnd: attrs['renews_at'] ?? null });
  } catch (err) {
    console.error('[Sync] Error:', err);
    res.status(500).json({ error: 'Errore sincronizzazione subscription' });
  }
};
