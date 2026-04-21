import { Link } from 'react-router-dom';

interface Props {
  parentTo: string;
  parentLabel: string;
}

export default function StubNotice({ parentTo, parentLabel }: Props) {
  return (
    <div className="is-stub rounded-lg border border-dashed border-gray-200 p-8 text-center text-gray-500">
      <p className="mb-4">Contenuto in elaborazione. Torna a trovarci.</p>
      <Link to={parentTo} className="text-sm text-primary-600 hover:underline">
        ← {parentLabel}
      </Link>
    </div>
  );
}
