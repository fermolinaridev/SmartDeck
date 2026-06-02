const KEY = 'sd:user';

export function loadUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function initialFor(name) {
  if (!name) return 'S';
  return name.trim().charAt(0).toUpperCase();
}
