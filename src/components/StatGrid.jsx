export function StatGrid({ stats }) {
  const items = [
    { label: 'Total', value: stats.total, tone: 'slate' },
    { label: 'Para revisar', value: stats.due, tone: 'brand' },
    { label: 'Já vistos', value: stats.seen, tone: 'slate' },
    { label: 'Dominados', value: stats.mastered, tone: 'emerald' },
  ];
  const tones = {
    slate: 'text-slate-800 dark:text-slate-100',
    brand: 'text-brand-600 dark:text-brand-300',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.label} className="card p-4">
          <div className="text-[10px] uppercase tracking-widest text-slate-400">
            {it.label}
          </div>
          <div className={`mt-1 text-3xl font-extrabold ${tones[it.tone]}`}>
            {it.value}
          </div>
        </div>
      ))}
    </div>
  );
}
