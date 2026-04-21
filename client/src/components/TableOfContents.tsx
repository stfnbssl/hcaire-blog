import { useEffect, useState } from 'react';

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

interface Props {
  contentSelector?: string;
}

export default function TableOfContents({ contentSelector = '.prose-content' }: Props) {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const container = document.querySelector(contentSelector);
    if (!container) return;
    const headings = Array.from(container.querySelectorAll('h2, h3')) as HTMLElement[];
    const toc: TocEntry[] = headings.map((h, i) => {
      if (!h.id) h.id = `heading-${i}`;
      return { id: h.id, text: h.textContent ?? '', level: parseInt(h.tagName[1]) };
    });
    setEntries(toc);
  }, [contentSelector]);

  useEffect(() => {
    if (!entries.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );
    entries.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  if (!entries.length) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">In questa pagina</p>
        <nav className="space-y-1">
          {entries.map((entry) => (
            <a
              key={entry.id}
              href={`#${entry.id}`}
              className={`block text-sm transition-colors leading-snug py-0.5 ${
                entry.level === 3 ? 'pl-4' : 'pl-0'
              } ${
                activeId === entry.id
                  ? 'text-primary-600 font-medium'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {entry.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
