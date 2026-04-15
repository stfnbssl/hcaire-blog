import { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { updateSiteConfig, type SiteStatus } from '../services/siteConfigService';

const MODE_INFO: Record<SiteStatus, { label: string; color: string; description: string }> = {
  test: {
    label:       'Test',
    color:       'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Tutti gli articoli sono visibili a tutti. Nessuna opzione di pagamento mostrata.',
  },
  production: {
    label:       'Produzione',
    color:       'bg-green-100 text-green-800 border-green-300',
    description: 'Comportamento normale: paywall attivo, opzioni di abbonamento visibili.',
  },
};

export default function AdminSiteConfig() {
  const { getToken }                = useAuth();
  const { siteStatus, refresh }     = useSiteConfig();
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  async function handleToggle() {
    const next: SiteStatus = siteStatus === 'test' ? 'production' : 'test';
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = await getToken();
      if (!token) throw new Error('Token non disponibile');
      await updateSiteConfig(token, next);
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore');
    } finally {
      setSaving(false);
    }
  }

  const info    = MODE_INFO[siteStatus];
  const nextInfo = MODE_INFO[siteStatus === 'test' ? 'production' : 'test'];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Stato del sito</h1>
      <p className="text-gray-500 text-sm mb-8">
        Controlla la modalità operativa di HCAIRE. La modifica è immediata.
      </p>

      {/* Stato corrente */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Modalità corrente</p>
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${info.color}`}>
            {info.label}
          </span>
        </div>
        <p className="text-sm text-gray-600">{info.description}</p>
      </div>

      {/* Effetti per modalità */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 text-sm text-gray-600 space-y-2">
        <p className="font-semibold text-gray-900 mb-3 text-sm">Riepilogo modalità</p>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase">
              <th className="text-left pb-2 font-medium">Funzionalità</th>
              <th className="text-center pb-2 font-medium">Test</th>
              <th className="text-center pb-2 font-medium">Produzione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              ['Articoli Plus visibili a tutti',  '✓', '—'],
              ['Paywall articoli Plus',            '—', '✓'],
              ['Pulsante "Abbonati" in navbar',    '—', '✓'],
              ['Opzioni di pagamento in /pricing', '—', '✓'],
              ['Badge "Per abbonati" in home',     '✓', '✓'],
              ['Banner "Per abbonati" articolo',   '✓ (disattivato)', '✓ (attivo)'],
            ].map(([feat, test, prod]) => (
              <tr key={feat} className="text-xs">
                <td className="py-1.5 text-gray-600">{feat}</td>
                <td className="py-1.5 text-center text-gray-500">{test}</td>
                <td className="py-1.5 text-center text-gray-500">{prod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Azione */}
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {success && (
        <p className="text-sm text-green-600 mb-4">
          Modalità aggiornata a <strong>{MODE_INFO[siteStatus].label}</strong>.
        </p>
      )}

      <button
        onClick={handleToggle}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {saving
          ? 'Salvataggio…'
          : `Passa a modalità ${nextInfo.label}`}
      </button>
    </div>
  );
}
