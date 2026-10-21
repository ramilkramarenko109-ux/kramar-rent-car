export const siteOrigin = '';

export function getSiteOrigin() {
  if (!siteOrigin) return '';
  const parsed = new URL(siteOrigin);
  if (!['http:', 'https:'].includes(parsed.protocol)
    || parsed.pathname !== '/'
    || parsed.search
    || parsed.hash
    || parsed.username
    || parsed.password) {
    throw new Error('siteOrigin must be an approved HTTP or HTTPS origin without a path or credentials.');
  }
  return parsed.origin;
}
