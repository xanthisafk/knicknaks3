import React from 'react';

/**
 * ToolLink component for internal linking to tools.
 */
export const ToolLink: React.FC<{ slug: string; name?: string }> = ({ slug, name }) => {
  return (
    <a 
      href={`/tools/${slug}`} 
      className="inline-flex items-center gap-1 font-semibold text-[--color-primary-500] hover:underline"
    >
      {name || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      <span className="text-xs">↗</span>
    </a>
  );
};

/**
 * Screenshot component with caption.
 */
export const Screenshot: React.FC<{ src: string; alt: string; caption?: string }> = ({ src, alt, caption }) => {
  return (
    <figure className="my-12 group">
      <div className="relative p-2 rounded-[--radius-lg] border-2 border-[--border-default] bg-[--surface-elevated] shadow-md transition-shadow group-hover:shadow-xl overflow-hidden">
        <div className="doodle-border absolute inset-0 opacity-20 pointer-events-none"></div>
        <img 
          src={src} 
          alt={alt} 
          className="h-auto w-full rounded-[--radius-md] relative z-10" 
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm font-medium italic text-[--text-secondary] flex items-center justify-center gap-2">
          <span className="text-[--color-primary-500]">✎</span> {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Callout component for highlighting information.
 */
export const Callout: React.FC<{ type?: 'info' | 'warning' | 'tip'; children: React.ReactNode }> = ({ type = 'info', children }) => {
  const styles = {
    info: "bg-amber-50/50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-100",
    warning: "bg-red-50/50 border-red-200 text-red-900 dark:bg-red-950/20 dark:border-red-800 dark:text-red-100",
    tip: "bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-100"
  };

  const icons = {
    info: '💡',
    warning: '⚠️',
    tip: '✨'
  };

  return (
    <div className={`my-8 rounded-[--radius-lg] border-2 p-6 relative overflow-hidden ${styles[type]}`}>
      <div className="absolute top-0 right-0 p-2 opacity-10 text-4xl select-none">{icons[type]}</div>
      <div className="flex gap-4 relative z-10">
        <span className="text-2xl flex-shrink-0" role="img" aria-label={type}>
          {icons[type]}
        </span>
        <div className="prose-sm leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * ComparisonTable component for feature comparisons.
 */
export const ComparisonTable: React.FC<{ headers: string[]; rows: (string | boolean)[][] }> = ({ headers, rows }) => {
  return (
    <div className="my-10 overflow-hidden rounded-[--radius-xl] border-2 border-[--border-default] shadow-sm bg-[--surface-bg] relative">
      <div className="doodle-border absolute inset-0 opacity-10 pointer-events-none"></div>
      <div className="overflow-x-auto relative z-10">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-[--surface-secondary] border-b-2 border-[--border-default]">
              {headers.map((header, i) => (
                <th key={i} className="px-6 py-4 font-bold uppercase tracking-widest text-xs text-[--text-primary]">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[--border-default]">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[--surface-elevated] transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-[--text-secondary] font-medium">
                    {typeof cell === 'boolean' ? (cell ? '✅' : '❌') : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default { ToolLink, Screenshot, Callout, ComparisonTable };
