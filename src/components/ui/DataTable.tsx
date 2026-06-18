import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, SlidersHorizontal } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  pageSize?: number;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns, data, searchable = true, searchPlaceholder = 'Rechercher...',
  searchKeys, pageSize = 8, onRowClick, actions, emptyMessage = 'Aucune donnée',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const keys = searchKeys || columns.map((c) => c.key);
    const q = search.toLowerCase();
    return data.filter((item) =>
      keys.some((k) => String(item[k] || '').toLowerCase().includes(q))
    );
  }, [data, search, searchKeys, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey] || '';
      const bVal = b[sortKey] || '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100">
      {/* Toolbar */}
      {searchable && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {paged.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                    >
                      {col.sortable ? (
                        <button
                          className="flex items-center gap-1 hover:text-gray-600 transition-colors"
                          onClick={() => handleSort(col.key)}
                        >
                          {col.label}
                          {sortKey === col.key ? (
                            sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                          ) : (
                            <div className="w-[14px]" />
                          )}
                        </button>
                      ) : (
                        col.label
                      )}
                    </th>
                  ))}
                  {actions && <th className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paged.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    onClick={() => onRowClick?.(item)}
                    className={`${onRowClick ? 'cursor-pointer' : ''} hover:bg-gray-50/50 transition-colors`}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={`px-4 py-3 text-sm text-gray-600 ${col.className || ''}`}>
                        {col.render ? col.render(item) : item[col.key]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-4 py-3 text-right">{actions(item)}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Page {page + 1} sur {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
