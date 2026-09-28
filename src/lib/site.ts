export const SITE_URL = 'https://www.paradox.engineer';
export const SITE_NAME = 'Paradox';

export function absoluteUrl(path = ''): string {
  if (!path) return SITE_URL;
  return path.startsWith('http') ? path : SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
