import { useAuth, SignInButton } from '@clerk/clerk-react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createCheckout, getPortalUrl, syncSubscription, type SubscriptionPlan } from '../services/subscriptionService';
import { useSubscription } from '../hooks/useSubscription';

interface Plan {
  id:       SubscriptionPlan | 'free';
  name:     string;
  price:    string;
  period:   string;
  tagline:  string;
  features: string[];
  badge?:   string;
}

const PLANS: Plan[] = [
  {
    id:      'free',
    name:    'Gratuito',
    price:   '€0',
    period:  '/mese',
    tagline: 'Accesso agli articoli pubblici',
    features: [
      'Tutti gli articoli gratuiti',
      'Nessuna carta di credito richiesta',
    ],
  },
  {
    id:      'abbonato',
    name:    'Abbonato',
    price:   '€5',
    period:  '/mese',
    tagline: 'Accesso a tutti i contenuti premium',
    features: [
      'Tutti gli articoli con accesso Plus',
      'Aggiornamenti settimanali',
      'Cancellazione in qualsiasi momento',
    ],
  },
  {
    id:      'bartleby',
    name:    'Bartleby',
    price:   '€12',
    period:  '/mese',
    tagline: 'Abbonato + generazione privata di articoli',
    features: [
      'Tutto di Abbonato',
      'Generazione privata di articoli con AI',
      'Archivio articoli personale',
    ],
    badge: 'Presto disponibile',
  },
  {
    id:      'bartleby_plus',
    name:    'Bartleby Plus',
    price:   '€24',
    period:  '/mese',
    tagline: 'Bartleby con consumo token esteso',
    features: [
      'Tutto di Bartleby',
      'Maggior consumo di token consentito',
      'Priorità nelle richieste',
    ],
    badge: 'Presto disponibile',
  },
];

export default function Pricing() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { subscription, loading: subLoading, isActive, refresh } = useSubscription();
  const [loading, setLoading]       = useState<SubscriptionPlan | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isCheckoutReturn = searchParams.get('checkout') === 'success';
  const [verifying, setVerifying]   = useState(isCheckoutReturn);
  const pollRef                     = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dopo ritorno da LS: sync immediato dalla LS API, poi poll ogni 2s (max 20 tentativi)
  useEffect(() => {
    if (!isCheckoutReturn || !isSignedIn) return;

    let attempts = 0;
    const MAX    = 20;

    // Sync immediato: interroga LS API per email e aggiorna il DB
    // Non dipende dal webhook, garantisce aggiornamento anche se il webhook è in ritardo
    (async () => {
      try {
        const token = await getToken();
        if (token) await syncSubscription(token);
        await refresh();
      } catch { /* ignora — il poll continua comunque */ }
    })();

    pollRef.current = setInterval(async () => {
      attempts++;
      await refresh();
      if (attempts >= MAX) {
        clearInterval(pollRef.current!);
        setVerifying(false);
        setSearchParams({}, { replace: true });
      }
    }, 2000);

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckoutReturn, isSignedIn]);

  // Quando l'abbonamento diventa attivo, smetti di verificare
  useEffect(() => {
    if (verifying && isActive) {
      if (pollRef.current) clearInterval(pollRef.current);
      setVerifying(false);
      setSearchParams({}, { replace: true });
    }
  }, [verifying, isActive, setSearchParams]);

  async function handleCheckout(plan: SubscriptionPlan) {
    setLoading(plan);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const { checkoutUrl } = await createCheckout(token, plan);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
      setLoading(null);
    }
  }

  async function handlePortal() {
    setLoading('none');
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const { portalUrl } = await getPortalUrl(token);
      window.open(portalUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setLoading(null);
    }
  }

  const currentPlan = subscription?.plan ?? 'none';

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Piani e prezzi</h1>
      <p className="text-gray-500 text-center mb-12">Scegli il livello di accesso più adatto a te</p>

      {verifying && (
        <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0" />
          Verifica del pagamento in corso… potrebbe richiedere qualche secondo.
        </div>
      )}

      {isCheckoutReturn && !verifying && isActive && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center">
          Abbonamento attivato con successo!
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm text-center mb-6">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {PLANS.map((plan) => {
          const isFree    = plan.id === 'free';
          const isCurrent = isFree ? !isActive : (isActive && currentPlan === plan.id);
          const isWip     = plan.badge === 'Presto disponibile';

          return (
            <div
              key={plan.id}
              className={`border rounded-2xl p-8 shadow-sm flex flex-col ${
                isCurrent ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'
              }`}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
                  {plan.badge && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      {plan.badge}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                      Piano attivo
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{plan.tagline}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-gray-600 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {!isLoaded || subLoading ? (
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              ) : isFree && isCurrent ? (
                <div className="w-full py-2.5 text-center text-sm text-gray-500 border border-gray-200 rounded-lg">
                  Piano corrente
                </div>
              ) : isFree ? (
                <div className="w-full py-2.5 text-center text-sm text-gray-400 border border-gray-100 rounded-lg">
                  Accesso gratuito attivo
                </div>
              ) : !isSignedIn ? (
                <SignInButton mode="modal">
                  <button
                    disabled={isWip}
                    className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isWip ? 'Presto disponibile' : 'Accedi per abbonarti'}
                  </button>
                </SignInButton>
              ) : isCurrent ? (
                <button
                  onClick={handlePortal}
                  disabled={loading !== null}
                  className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loading === 'none' ? 'Caricamento...' : 'Gestisci abbonamento'}
                </button>
              ) : (
                <button
                  onClick={() => handleCheckout(plan.id as SubscriptionPlan)}
                  disabled={loading !== null || isWip}
                  className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading === plan.id
                    ? 'Caricamento...'
                    : isWip
                    ? 'Presto disponibile'
                    : isActive
                    ? 'Cambia piano'
                    : 'Inizia ora'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isActive && subscription?.currentPeriodEnd && (
        <p className="text-center text-gray-400 text-sm mt-8">
          Rinnovo il {new Date(subscription.currentPeriodEnd).toLocaleDateString('it-IT')}
        </p>
      )}
    </div>
  );
}
