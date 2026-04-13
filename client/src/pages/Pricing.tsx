import { useAuth, SignInButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { createCheckout, getPortalUrl } from '../services/subscriptionService';
import { useSubscription } from '../hooks/useSubscription';

export default function Pricing() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isActive = subscription?.status === 'active' || subscription?.status === 'on_trial';

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const { checkoutUrl } = await createCheckout(token);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
      setLoading(false);
    }
  }

  async function handlePortal() {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const { portalUrl } = await getPortalUrl(token);
      window.open(portalUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Abbonamento</h1>
      <p className="text-gray-500 text-center mb-12">Accedi a tutti i contenuti premium</p>

      <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Piano Pro</h2>
            <p className="text-gray-500 text-sm mt-1">Accesso completo a tutti gli articoli</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-gray-900">€9</span>
            <span className="text-gray-500 text-sm">/mese</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8 text-sm text-gray-600">
          {[
            'Tutti gli articoli pubblicati',
            'Aggiornamenti settimanali',
            'Cancellazione in qualsiasi momento',
          ].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {!isLoaded || subLoading ? (
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ) : !isSignedIn ? (
          <SignInButton mode="modal">
            <button className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Accedi per abbonarti
            </button>
          </SignInButton>
        ) : isActive ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-green-600 font-medium">
                {subscription?.status === 'on_trial' ? 'Periodo di prova attivo' : 'Abbonamento attivo'}
              </span>
              {subscription?.currentPeriodEnd && (
                <span className="text-gray-400 text-sm">
                  · rinnovo {new Date(subscription.currentPeriodEnd).toLocaleDateString('it-IT')}
                </span>
              )}
            </div>
            <button
              onClick={handlePortal}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {loading ? 'Caricamento...' : 'Gestisci abbonamento'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Caricamento...' : 'Inizia ora'}
          </button>
        )}
      </div>
    </div>
  );
}
