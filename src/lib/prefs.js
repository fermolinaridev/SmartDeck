const KEY = 'sd:prefs';

export const DEFAULT_PREFS = {
  length: 'medio',          // curto | medio | longo
  difficulty: 'intermediario', // basico | intermediario | avancado
  pace: 'normal',           // rapido | normal | profundo
  focus: '',                // tema preferido (string livre)
};

export function loadPrefs() {
  try {
    const raw = localStorage.getItem(KEY);
    return { ...DEFAULT_PREFS, ...(raw ? JSON.parse(raw) : {}) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

export function defaultCountFor(prefs) {
  if (prefs?.pace === 'rapido') return 5;
  if (prefs?.pace === 'profundo') return 15;
  return 8;
}
