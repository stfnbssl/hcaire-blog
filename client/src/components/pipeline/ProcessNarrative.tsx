import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => <h1 className="text-xl font-bold text-slate-900 mt-0 mb-4">{children}</h1>,
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-200">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="text-sm font-semibold text-slate-800 mt-5 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-sm text-slate-700 leading-relaxed mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1.5 text-sm text-slate-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1.5 text-sm text-slate-700">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-slate-600">{children}</em>,
  code: ({ children }) => (
    <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4">{children}</blockquote>
  ),
  hr: () => <hr className="border-slate-200 my-6" />,
  a: ({ href, children }) => (
    <a href={href} className="text-primary-600 hover:text-primary-700 underline">{children}</a>
  ),
};

export default function ProcessNarrative({ markdown }: { markdown: string }) {
  const principi = useMemo(() => {
    const out: string[] = [];
    const re = /\*\*Principio consolidato\*\*\s*:\s*["“]?([^"”\n\r]+?)["”]?\s*(?:\n|$)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(markdown)) !== null) {
      out.push(m[1].trim());
    }
    return out;
  }, [markdown]);

  return (
    <div className="space-y-8">
      {principi.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Principi consolidati</p>
          {principi.map((p, i) => (
            <blockquote
              key={i}
              className="border-l-4 border-amber-500 bg-amber-50/60 px-5 py-3 text-sm text-slate-800 leading-relaxed italic"
            >
              "{p}"
            </blockquote>
          ))}
        </div>
      )}

      <div>
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
