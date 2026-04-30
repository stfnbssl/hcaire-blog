import React, { useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Components } from 'react-markdown';

export interface RilevanzaEntry {
  label: string;
  rilevanza: string;
}

export type RilevanzaMap = Record<string, RilevanzaEntry>;

interface MarkdownRendererProps {
  content: string;
  rilevanzaMap?: RilevanzaMap;
}

// ── components that don't depend on props (stable reference) ──────────────────

const baseComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
  ),
  a: ({ href, children, id, node, ...rest }) => {
    const isInternal = !href || href.startsWith('#');
    const isFootnote =
      (typeof id === 'string' && id.includes('fnref')) ||
      (typeof href === 'string' && (href.includes('#user-content-fn') || href.includes('#fn')));

    if (isFootnote) {
      return (
        <a
          href={href}
          id={id}
          className="text-primary-600 hover:text-primary-700 no-underline"
          aria-describedby={(rest as Record<string, unknown>)['aria-describedby'] as string | undefined}
          aria-label={(rest as Record<string, unknown>)['aria-label'] as string | undefined}
        >
          {children}
        </a>
      );
    }

    return (
      <a
        href={href}
        id={id}
        className="text-primary-600 hover:text-primary-700 underline"
        {...(!isInternal && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    );
  },
  sup: ({ children }) => <sup>{children}</sup>,
  pre: ({ children }) => (
    <pre className="bg-gray-50 border border-gray-200 rounded-lg overflow-x-auto mb-4 p-4 text-gray-800">
      {children}
    </pre>
  ),
  code: ({ children, className }) => {
    const isBlock = !!className;
    return isBlock ? (
      <code className="text-gray-800 text-sm font-mono whitespace-pre">{children}</code>
    ) : (
      <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-600 my-4">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>
  ),
  ol: ({ children, ...props }) => {
    const isFootnoteList = (props as Record<string, unknown>)['data-footnotes'] !== undefined;
    if (isFootnoteList) {
      return <ol className="mt-8 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">{children}</ol>;
    }
    return <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>;
  },
  section: ({ children, ...props }) => {
    const isFootnotes = (props as Record<string, unknown>)['data-footnotes'] !== undefined;
    if (isFootnotes) {
      return <section className="mt-8">{children}</section>;
    }
    return <section>{children}</section>;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 bg-gray-50 text-left text-sm font-semibold text-gray-700">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 text-sm text-gray-600 border-t border-gray-100">
      {children}
    </td>
  ),
};

// ── rilevanza floating card ───────────────────────────────────────────────────

function RilevanzaPanel({
  entry,
  onClose,
}: {
  entry: RilevanzaEntry;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50
                 w-full md:w-[420px] max-h-[58vh]
                 bg-white md:rounded-xl shadow-2xl border border-gray-200
                 flex flex-col overflow-hidden"
    >
      {/* header */}
      <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 shrink-0 bg-gray-50 md:rounded-t-xl">
        <div className="min-w-0 pr-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            Rilevanza per il progetto
          </p>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {entry.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors text-base leading-none"
          aria-label="Chiudi"
        >
          ×
        </button>
      </div>

      {/* body */}
      <div className="overflow-y-auto px-5 py-4">
        <p className="text-sm text-gray-600 leading-relaxed">{entry.rilevanza}</p>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function MarkdownRenderer({ content, rilevanzaMap }: MarkdownRendererProps) {
  const [activeEntry, setActiveEntry] = useState<RilevanzaEntry | null>(null);
  // Ref so the img click handler always reads the latest active entry
  // without needing to be recreated on every state change.
  const activeEntryRef = useRef<RilevanzaEntry | null>(null);
  activeEntryRef.current = activeEntry;

  const components = useMemo<Components>(() => {
    if (!rilevanzaMap) return baseComponents;

    return {
      ...baseComponents,
      img: ({ src, alt, title, ...rest }) => {
        const id = src?.split('/').pop()?.replace(/\.[^.]+$/, '') ?? '';
        const entry = rilevanzaMap[id];

        const resolvedTitle = entry
          ? `${entry.label} — clicca per la rilevanza nel progetto`
          : title;

        return (
          <img
            src={src}
            alt={alt}
            title={resolvedTitle}
            {...rest}
            style={{
              ...(rest.style as React.CSSProperties),
              cursor: entry ? 'pointer' : undefined,
            }}
            onClick={() => {
              if (!entry) return;
              const current = activeEntryRef.current;
              setActiveEntry(current?.label === entry.label ? null : entry);
            }}
          />
        );
      },
    };
  }, [rilevanzaMap]);

  return (
    <div className="mt-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>

      {activeEntry && (
        <RilevanzaPanel
          entry={activeEntry}
          onClose={() => setActiveEntry(null)}
        />
      )}
    </div>
  );
}
