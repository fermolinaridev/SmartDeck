import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * Imagem do card com botão opcional de troca.
 * Variantes:
 *  - "thumb"  → 64×64 (usado na lista de cards)
 *  - "banner" → ocupa width total, altura ajustável (usado no estudo)
 */
export function CardImage({ card, onReimage, variant = 'thumb', height = 160 }) {
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (!card.image || hidden) {
    return variant === 'banner' ? null : (
      <div className="shrink-0 w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
    );
  }

  async function swap(e) {
    e.stopPropagation();
    if (!onReimage || loading) return;
    setLoading(true);
    try {
      await onReimage(card.id);
    } finally {
      setLoading(false);
    }
  }

  if (variant === 'banner') {
    return (
      <div
        className="w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative"
        style={{ height }}
      >
        <img
          src={card.image}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={() => setHidden(true)}
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
        {onReimage && (
          <button
            type="button"
            onClick={swap}
            disabled={loading}
            title="Trocar imagem"
            aria-label="Trocar imagem"
            className="absolute top-2 right-2 w-8 h-8 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>
    );
  }

  // thumb (lista)
  return (
    <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative group">
      <img
        src={card.image}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
        onError={() => setHidden(true)}
      />
      {onReimage && (
        <button
          type="button"
          onClick={swap}
          disabled={loading}
          title="Trocar imagem"
          aria-label="Trocar imagem"
          className="absolute inset-0 grid place-items-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition disabled:opacity-100"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      )}
    </div>
  );
}
