import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

/**
 * Combobox — modern searchable dropdown.
 *
 * Drop-in replacement for the basic <Select> in forms. Emits a synthetic
 * change event `{ target: { value } }` so existing handlers keep working.
 *
 * Props:
 *   label        ReactNode
 *   value        string | number
 *   onChange     (e) => void                   — receives { target: { value } }
 *   options      Array<{ value, label, hint?, icon?: ReactNode }>
 *   placeholder  string
 *   error        string
 *   searchable   boolean   (default true)
 *   renderLeft   (option) => ReactNode         — optional custom leading visual
 *   disabled     boolean
 */
const Combobox = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  error,
  searchable = true,
  renderLeft,
  disabled = false,
  className = '',
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)) || null,
    [options, value],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        String(o.label).toLowerCase().includes(q) ||
        String(o.hint || '').toLowerCase().includes(q),
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return undefined;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = filtered[activeIdx];
        if (opt) commit(opt);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    // Auto-focus the search field when opening
    setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, filtered, activeIdx]);

  // Keep activeIdx in range when the filter changes
  useEffect(() => {
    setActiveIdx(0);
  }, [query, open]);

  const commit = (opt) => {
    onChange?.({ target: { value: opt.value } });
    setOpen(false);
    setQuery('');
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange?.({ target: { value: '' } });
  };

  const Leading = ({ opt }) => {
    if (!opt) return null;
    if (renderLeft) return renderLeft(opt);
    if (opt.icon) return <span className="text-slate-400">{opt.icon}</span>;
    return null;
  };

  return (
    <div className="w-full" ref={rootRef}>
      {label && (
        <label
          htmlFor={`${id}-trigger`}
          className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          id={`${id}-trigger`}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((v) => !v)}
          className={`group w-full flex items-center gap-2.5 rounded-xl border bg-white dark:bg-slate-900
                      px-3.5 py-2.5 text-left text-sm transition
                      ${error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500'}
                      ${open ? 'ring-2 ring-brand-500/30 border-brand-500' : ''}
                      ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                      ${className}`}
        >
          <Leading opt={selected} />

          <span
            className={`flex-1 truncate ${
              selected
                ? 'text-slate-800 dark:text-slate-100'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {selected ? selected.label : placeholder}
          </span>

          {selected && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={clear}
              className="rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              aria-label="Clear selection"
            >
              <X size={14} />
            </span>
          )}

          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${
              open ? 'rotate-180 text-brand-500' : ''
            }`}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute z-30 mt-2 w-full origin-top rounded-xl border border-slate-200/80 dark:border-slate-700
                       bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
                       shadow-[0_20px_50px_-20px_rgba(15,23,42,0.35)]
                       animate-fade-in overflow-hidden"
          >
            {searchable && (
              <div className="relative border-b border-slate-100 dark:border-slate-800">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent py-2.5 pl-9 pr-3 text-sm text-slate-700 dark:text-slate-200
                             placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}

            <ul className="max-h-64 overflow-y-auto py-1.5">
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center text-xs text-slate-400">
                  No results
                </li>
              ) : (
                filtered.map((opt, i) => {
                  const isActive = i === activeIdx;
                  const isSelected = selected && String(selected.value) === String(opt.value);
                  return (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIdx(i)}
                        onClick={() => commit(opt)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition
                                    ${isActive
                                      ? 'bg-brand-50 dark:bg-brand-500/10 text-slate-900 dark:text-white'
                                      : 'text-slate-700 dark:text-slate-200'}
                                    ${isSelected ? 'font-medium' : ''}`}
                      >
                        <Leading opt={opt} />
                        <span className="flex-1 truncate">
                          {opt.label}
                          {opt.hint && (
                            <span className="ml-2 text-[11px] text-slate-400">{opt.hint}</span>
                          )}
                        </span>
                        {isSelected && (
                          <Check size={15} className="text-brand-500 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

export default Combobox;
