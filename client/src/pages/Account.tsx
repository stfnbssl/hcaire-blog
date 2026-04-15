import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useUser, UserButton } from '@clerk/clerk-react';
import { useSubscription } from '../hooks/useSubscription';
import { useSiteConfig } from '../context/SiteConfigContext';
import { getPortalUrl, changePlan, type SubscriptionPlan } from '../services/subscriptionService';

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

interface PlanOption {
  id:       SubscriptionPlan;
  label:    string;
  price:    string;
  tagline:  string;
  comingSoon?: boolean;
}

const PLAN_OPTIONS: PlanOption[] = [
  { id: 'abbonato',      label: 'Abbonato',   price: '€5/mese',  tagline: 'Accesso a tutti i contenuti premium' },
  { id: 'bartleby',      label: 'Bartleby',   price: '€12/mese', tagline: 'Abbonato + generazione privata di articoli', comingSoon: true },
  { id: 'bartleby_plus', label: 'Bartleby+',  price: '€24/mese', tagline: 'Bartleby con consumo token esteso',          comingSoon: true },
];

export default function Account() {
  const { getToken }   = useAuth();
  const { user }       = useUser();
  const { subscription, isActive, loading: subLoading, refresh } = useSubscription();
  const { isTestMode } = useSiteConfig();

  const [portalLoading, setPortalLoading]   = useState(false);
  const [changingPlan, setChangingPlan]     = useState<SubscriptionPlan | null>(null);
  const [confirmPlan, setConfirmPlan]       = useState<PlanOption | null>(null);
  const [error, setError]                   = useState<string | null>(null);
  const [successMsg, setSuccessMsg]         = useState<string | null>(null);

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

  async function handleChangePlan(plan: SubscriptionPlan) {
    setChangingPlan(plan);
    setError(null);
    setSuccessMsg(null);
    setConfirmPlan(null);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await changePlan(token, plan);
      await refresh();
      setSuccessMsg(`Piano aggiornato a ${PLAN_LABEL[plan]}.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore cambio piano');
    } finally {
      setChangingPlan(null);
    }
  }

  const plan      = subscription?.plan ?? 'none';
  const status    = subscription?.status ?? 'none';
  const planLabel = plan !== 'none' ? PLAN_LABEL[plan] ?? plan : null;
  const isTrial   = status === 'on_trial';

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

      {/* Abbonamento — nascosto in modalità test */}
      {!isTestMode && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Abbonamento</h2>

          {subLoading ? (
            <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-48" />
          ) : isActive && planLabel ? (
            <div className="space-y-5">
              {/* Piano corrente */}
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">{planLabel}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isTrial ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
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

              {/* Feedback */}
              {error    && <p className="text-sm text-red-600">{error}</p>}
              {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

              {/* Azioni principali */}
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {portalLoading ? 'Caricamento…' : 'Gestisci abbonamento'}
              </button>
              <p className="text-xs text-gray-400">
                Modifica metodo di pagamento o cancella dal portale LemonSqueezy.
              </p>

              {/* Cambia piano */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Cambia piano</p>
                <div className="grid gap-3">
                  {PLAN_OPTIONS.map((opt) => {
                    const isCurrent = opt.id === plan;
                    const isLoading = changingPlan === opt.id;
                    const isPending = confirmPlan?.id === opt.id;

                    return (
                      <div
                        key={opt.id}
                        className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                          isCurrent
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                            {opt.comingSoon && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                                Presto disponibile
                              </span>
                            )}
                            {isCurrent && (
                              <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full">
                                Piano attuale
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{opt.price} · {opt.tagline}</p>
                        </div>

                        {!isCurrent && (
                          isPending ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600">Confermi?</span>
                              <button
                                onClick={() => handleChangePlan(opt.id)}
                                disabled={!!changingPlan}
                                className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-md hover:bg-gray-700 disabled:opacity-50"
                              >
                                {isLoading ? '…' : 'Sì'}
                              </button>
                              <button
                                onClick={() => setConfirmPlan(null)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-1"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => !opt.comingSoon && setConfirmPlan(opt)}
                              disabled={opt.comingSoon || !!changingPlan}
                              className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              Cambia
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
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
      )}
    </div>
  );
}
