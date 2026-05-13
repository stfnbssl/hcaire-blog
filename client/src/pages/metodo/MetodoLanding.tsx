import { useEffect, useState } from 'react';
import MetodoNav from '../../components/MetodoNav';

const GROUP_STYLES: Record<string, {
  headerBg: string;
  borderAccent: string;
  taglineColor: string;
}> = {
  A: { headerBg: 'bg-indigo-900',  borderAccent: 'border-l-indigo-400', taglineColor: 'text-indigo-900' },
  B: { headerBg: 'bg-teal-800',    borderAccent: 'border-l-teal-400',   taglineColor: 'text-teal-900'   },
  C: { headerBg: 'bg-violet-800',  borderAccent: 'border-l-violet-400', taglineColor: 'text-violet-900' },
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

export default function MetodoLanding() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/metodo-temi.json')
      .then((r) => r.json())
      .then((data) => setGroups(data.groups))
      .catch(() => setGroups([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <MetodoNav />

      {/* Hero */}
      <div className="bg-indigo-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-none tracking-tight">
            Il <span className="text-indigo-300">Metodo</span>
          </h1>
          <p className="text-xl sm:text-2xl text-indigo-100 max-w-2xl leading-relaxed">
            Come funziona e perché questo metodo.
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
              <div className={`${styles.headerBg} text-white`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                  <h2 className="text-2xl sm:text-3xl font-bold">{group.title}</h2>
                </div>
              </div>

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
