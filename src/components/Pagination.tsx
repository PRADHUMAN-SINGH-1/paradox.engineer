import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    // Avoid double hash if already present
    const baseWithoutHash = baseUrl.split('#')[0];
    const separator = baseWithoutHash.includes('?') ? '&' : '?';
    return `${baseWithoutHash}${separator}page=${page}#curated-deals`;
  };

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-between border-t border-slate-200 dark:border-zinc-800/80 px-2 sm:px-0 mt-8 pt-4 font-mono text-xs">
      <div className="-mt-px flex w-0 flex-1">
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center pt-2 pr-1 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-white transition"
          >
            ← prev
          </Link>
        ) : (
          <span className="inline-flex items-center pt-2 pr-1 text-slate-300 dark:text-zinc-600 cursor-not-allowed">
            ← prev
          </span>
        )}
      </div>

      <div className="hidden md:-mt-px md:flex gap-1">
        {startPage > 1 && (
          <>
            <Link href={getPageUrl(1)} className="px-3 pt-2 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-white transition">
              1
            </Link>
            {startPage > 2 && (
              <span className="px-2 pt-2 text-slate-400 dark:text-zinc-600">...</span>
            )}
          </>
        )}
        
        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-3 py-1.5 rounded transition ${
              page === currentPage
                ? 'bg-blue-600 text-white font-bold border border-blue-600 dark:bg-zinc-800 dark:text-white dark:border-zinc-700'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
            }`}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 pt-2 text-slate-400 dark:text-zinc-600">...</span>
            )}
            <Link href={getPageUrl(totalPages)} className="px-3 pt-2 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-white transition">
              {totalPages}
            </Link>
          </>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center pt-2 pl-1 text-slate-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-white transition"
          >
            next →
          </Link>
        ) : (
          <span className="inline-flex items-center pt-2 pl-1 text-slate-300 dark:text-zinc-600 cursor-not-allowed">
            next →
          </span>
        )}
      </div>
    </nav>
  );
}
