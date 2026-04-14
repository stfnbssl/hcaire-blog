import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import UserSubscription from '../models/UserSubscription';

const router = Router();

// Lemon Squeezy webhook — usa express.raw() a livello di route,
// registrata PRIMA di express.json() in index.ts
router.post(
  '/lemonsqueezy',
  (req, res, next) => {
    // Forza raw body su questa route specifica
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      (req as Request & { rawBody: string }).rawBody = data;
      next();
    });
  },
  async (req: Request & { rawBody?: string }, res: Response): Promise<void> => {
    const secret    = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    const signature = req.headers['x-signature'] as string | undefined;

    if (!secret || !signature || !req.rawBody) {
      res.status(400).json({ error: 'Missing signature or body' });
      return;
    }

    // Verifica firma HMAC-SHA256
    const digest = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
    if (digest !== signature) {
      res.status(403).json({ error: 'Invalid signature' });
      return;
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(req.rawBody);
    } catch {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }

    const eventName = (payload['meta'] ? (payload['meta'] as Record<string, unknown>)['event_name'] : undefined) as string | undefined;
    const meta      = payload['meta']  as Record<string, unknown> | undefined;
    const dataObj   = payload['data']  as Record<string, unknown> | undefined;
    const attrs     = dataObj?.['attributes'] as Record<string, unknown> | undefined;
    const customData = meta?.['custom_data'] as Record<string, unknown> | undefined;
    const clerkUserId = customData?.['clerk_user_id'] as string | undefined;

    console.log(`[Webhook] Lemon Squeezy event: ${eventName}, clerkUserId: ${clerkUserId}`);

    // Map variant ID → plan tier
    function variantToPlan(variantId: string): import('../models/UserSubscription').SubscriptionPlan {
      if (variantId === process.env.LEMONSQUEEZY_VARIANT_ABBONATO)     return 'abbonato';
      if (variantId === process.env.LEMONSQUEEZY_VARIANT_BARTLEBY)     return 'bartleby';
      if (variantId === process.env.LEMONSQUEEZY_VARIANT_BARTLEBY_PLUS) return 'bartleby_plus';
      return 'none';
    }

    const handledEvents = [
      'subscription_created', 'subscription_updated',
      'subscription_cancelled', 'subscription_expired',
      'subscription_payment_success',
    ];

    if (eventName && handledEvents.includes(eventName) && clerkUserId) {
      try {
        const lsVariantId = String(attrs?.['variant_id'] ?? '');
        const newStatus   = (attrs?.['status'] as string) ?? 'none';
        const isActive    = ['active', 'on_trial'].includes(newStatus);
        const plan        = isActive ? variantToPlan(lsVariantId) : 'none';

        await UserSubscription.findOneAndUpdate(
          { clerkUserId },
          {
            $set: {
              lsSubscriptionId: (dataObj?.['id'] as string) ?? '',
              lsCustomerId:     String(attrs?.['customer_id'] ?? ''),
              lsVariantId,
              plan,
              status:           newStatus,
              currentPeriodEnd: attrs?.['renews_at']
                ? new Date(attrs['renews_at'] as string)
                : null,
            },
          },
          { upsert: true, new: true }
        );
        console.log(`[Webhook] UserSubscription aggiornata per ${clerkUserId}: status=${newStatus}, plan=${plan}`);
      } catch (err) {
        console.error('[Webhook] Errore aggiornamento UserSubscription:', err);
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
