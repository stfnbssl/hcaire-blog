type Service = {
  name: string;
  description: string;
  url: string;
  category: 'Auth' | 'Database' | 'Pagamenti' | 'Hosting' | 'Messaggistica' | 'Codice';
  notes?: string;
};

const SERVICES: Service[] = [
  {
    name: 'Clerk',
    description: 'Autenticazione utenti e gestione ruoli (admin).',
    url: 'https://dashboard.clerk.com/',
    category: 'Auth',
  },
  {
    name: 'MongoDB Atlas',
    description: 'Database principale (cluster0, hcaire_db).',
    url: 'https://cloud.mongodb.com/v2/69d8b11ab157897a2cf8fa69#/explorer/69d8b18a88a612568eca0122/hcaire_db/',
    category: 'Database',
    notes: 'Cluster: cluster0.y3qtgdm.mongodb.net',
  },
  {
    name: 'Redis Cloud',
    description: 'Pub/sub e cache su GCP eu-west3.',
    url: 'https://app.redislabs.com/#/databases/14196889/subscription/3214393/view-bdb/configuration/',
    category: 'Database',
    notes: 'redis-11976.crce275.eu-west3-1.gcp.cloud.redislabs.com',
  },
  {
    name: 'Lemon Squeezy',
    description: 'Pagamenti, abbonamenti e webhooks.',
    url: 'https://app.lemonsqueezy.com/',
    category: 'Pagamenti',
  },
  {
    name: 'Railway',
    description: 'Hosting backend Express (server).',
    url: 'https://railway.com/project/27931e20-bfee-487f-afca-f92b97bb11ae/service/9909fa7b-d7cb-4bf9-bfe1-676c1bf5a653?environmentId=16ea35df-e0aa-4c41-9bcd-e4709d78ca29',
    category: 'Hosting',
  },
  {
    name: 'Cloudflare',
    description: 'Hosting frontend (Vite + Cloudflare plugin) e DNS.',
    url: 'https://dash.cloudflare.com/c179a1d686340938c2cd1a37652cabfd/hcaire.com/',
    category: 'Hosting',
  },
  {
    name: 'Telegram (BotFather)',
    description: 'Bot di notifiche tramite telegraf.',
    url: 'https://t.me/BotFather',
    category: 'Messaggistica',
    notes: 'Token e chat ID configurati in server/.env',
  },
  {
    name: 'GitHub',
    description: 'Repository sorgente del monorepo.',
    url: 'https://github.com/stfnbssl/hcaire-blog',
    category: 'Codice',
  },
];

const CATEGORY_ORDER: Service['category'][] = [
  'Auth', 'Database', 'Pagamenti', 'Hosting', 'Messaggistica', 'Codice',
];

export default function AdminServices() {
  const grouped = CATEGORY_ORDER
    .map((cat) => ({ cat, items: SERVICES.filter((s) => s.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Servizi esterni</h1>
      <p className="text-gray-500 text-sm mb-8">
        Link diretti alle dashboard dei servizi cloud usati dal sito.
      </p>

      <div className="space-y-8">
        {grouped.map(({ cat, items }) => (
          <section key={cat}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              {cat}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {items.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary-300 transition"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span className="font-semibold text-gray-900">{s.name}</span>
                    <span className="text-primary-600 text-sm shrink-0">↗</span>
                  </div>
                  <p className="text-sm text-gray-600">{s.description}</p>
                  {s.notes && (
                    <p className="text-xs text-gray-400 mt-2 font-mono break-all">{s.notes}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
