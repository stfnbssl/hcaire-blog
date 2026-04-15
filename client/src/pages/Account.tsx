import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { useSubscription } from '../hooks/useSubscription';
import { getPortalUrl } from '../services/subscriptionService';

const PLAN_LABEL: Record<string, string> = {
  abbonato:      'Abbonato',
  bartleby:      'Bartleby',
  bartleby_plus: 'Bartleby+',
};

const STATUS_LABEL: Record<string, string> = {
  active:    'Attivo',
  on_trial:  'In prova',
  paused:    'In pausa',
  cancelled: 'Cancellato',
  expired:   'Scaduto',
  past_due:  'Pagamento in sospeso',
  none:      '—',
};

export default function Account() {
  const { getToken } = useAuth();
  const { user }     = useUser();
  const { subscription, isActive, loading: subLoading } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  async function handlePortal() {
    setPortalLoading(true);
    setError(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      const { portalUrl } = await getPortalUrl(token);
      window.open(portalUrl, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setPortalLoading(false);
    }
  }

  const plan       = subscription?.plan ?? 'none';
  const status     = subscription?.status ?? 'none';
  const planLabel  = plan !== 'none' ? PLAN_LABEL[plan] ?? plan : null;
  const isTrial    = status === 'on_trial';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Il mio account</h1>

      {/* Profilo */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Profilo</h2>
        <div className="flex items-center gap-4">
          <UserButton />
          <div>
            <p className="font-medium text-gray-900">
              {user?.fullName ?? user?.firstName ?? '—'}
            </p>
            <p className="text-sm text-gray-500">
              {user?.primaryEmailAddress?.emailAddress ?? '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Abbonamento */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Abbonamento</h2>

        {subLoading ? (
          <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-48" />
        ) : isActive && planLabel ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">{planLabel}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                isTrial
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {isTrial ? 'In prova' : 'Attivo'}
              </span>
            </div>

            {subscription?.currentPeriodEnd && (
              <p className="text-sm text-gray-500">
                {status === 'cancelled' ? 'Accesso fino al' : 'Rinnovo il'}{' '}
                <span className="font-medium text-gray-700">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString('it-IT')}
                </span>
              </p>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="mt-2 inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {portalLoading ? 'Caricamento…' : 'Gestisci abbonamento'}
            </button>
            <p className="text-xs text-gray-400">
              Puoi modificare o cancellare il tuo abbonamento dal portale LemonSqueezy.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600 text-sm">
              Non hai un abbonamento attivo.{' '}
              {status !== 'none' && STATUS_LABEL[status] !== '—' && (
                <span className="text-gray-500">Stato precedente: {STATUS_LABEL[status]}.</span>
              )}
            </p>
            <Link
              to="/pricing"
              className="inline-block bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Vedi i piani
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
