import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="text-sm text-gray-500 mb-6 flex flex-wrap items-center gap-1">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-gray-300">›</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-gray-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
