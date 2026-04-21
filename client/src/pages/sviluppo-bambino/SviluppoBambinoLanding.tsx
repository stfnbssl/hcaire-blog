import { useEffect, useState } from 'react';
import SviluppoBambinoNav from '../../components/SviluppoBambinoNav';

const GROUP_STYLES: Record<string, {
  headerBg: string;
  borderAccent: string;
  taglineColor: string;
}> = {
  A: { headerBg: 'bg-slate-800',   borderAccent: 'border-l-blue-400',    taglineColor: 'text-blue-900'   },
  B: { headerBg: 'bg-emerald-800', borderAccent: 'border-l-emerald-400', taglineColor: 'text-emerald-900' },
  C: { headerBg: 'bg-amber-800',   borderAccent: 'border-l-amber-400',   taglineColor: 'text-amber-900'  },
};

interface Theme {
  code: string;
  title: string;
  tagline: string;
  body: string;
}

interface Group {
  id: string;
  title: string;
  themes: Theme[];
}

export default function SviluppoBambinoLanding() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/sviluppo-bambino-temi.json')
      .then((r) => r.json())
      .then((data) => setGroups(data.groups))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SviluppoBambinoNav />

      {/* Hero */}
      <div className="bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Sviluppo<br />
            <span className="text-slate-400">Bambino</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 max-w-2xl leading-relaxed">
            Un modello strutturale per leggere lo sviluppo umano 0–12 anni, condivisibile tra professioni diverse.
          </p>
        </div>
      </div>

      {/* Groups */}
      {loading ? (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      ) : (
        groups.map((group) => {
          const styles = GROUP_STYLES[group.id] ?? GROUP_STYLES['A'];
          return (
            <div key={group.id} id={`group-${group.id}`}>
              {/* Group header */}
              <div className={`${styles.headerBg} text-white`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                  <h2 className="text-2xl sm:text-3xl font-bold">{group.title}</h2>
                </div>
              </div>

              {/* Theme blocks */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {group.themes.map((theme, i) => (
                  <div
                    key={theme.code}
                    className={`border-l-4 ${styles.borderAccent} pl-8 sm:pl-12 py-12 ${
                      i < group.themes.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 underline decoration-dotted decoration-2 underline-offset-6 mb-5 leading-snug">
                      {theme.title}
                    </h3>
                    <p className={`text-lg sm:text-xl italic font-medium ${styles.taglineColor} mb-5 leading-relaxed`}>
                      &ldquo;{theme.tagline}&rdquo;
                    </p>
                    <p className="text-gray-600 leading-relaxed text-base max-w-2xl">
                      {theme.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      <div className="h-24" />
    </div>
  );
}
