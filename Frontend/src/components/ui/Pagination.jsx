import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pageCount, onPageChange }) => {
  if (pageCount <= 1) return null;

  const go = (p) => onPageChange(Math.min(Math.max(1, p), pageCount));

  // Compact range with ellipsis when many pages.
  const pages = [];
  const push = (p) => pages.push(p);
  const range = (a, b) => { for (let i = a; i <= b; i++) push(i); };
  if (pageCount <= 7) {
    range(1, pageCount);
  } else {
    push(1);
    if (page > 4) push('…');
    range(Math.max(2, page - 1), Math.min(pageCount - 1, page + 1));
    if (page < pageCount - 3) push('…');
    push(pageCount);
  }

  return (
    <div className="flex items-center justify-between gap-2 py-3 px-1">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Page <span className="font-medium text-slate-700 dark:text-slate-200">{page}</span> of {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 1}
          className="btn-outline px-2 py-1.5"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} className="px-2 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`btn px-3 py-1.5 ${
                p === page
                  ? 'bg-brand-600 text-white shadow-glow'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => go(page + 1)}
          disabled={page === pageCount}
          className="btn-outline px-2 py-1.5"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
