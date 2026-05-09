interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="max-w-4xl">
          {subtitle && (
            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500 font-serif">
              {subtitle}
            </p>
          )}
          <h1 className="mt-4 font-serif font-semibold tracking-tight text-neutral-900 text-5xl md:text-6xl">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}
