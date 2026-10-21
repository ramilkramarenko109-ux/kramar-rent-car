import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cars } from '../src/carCatalog.js';
import { getSiteOrigin } from '../src/siteConfig.js';

const approvedOrigin = getSiteOrigin();
if (!approvedOrigin) {
  throw new Error('Set the approved absolute site origin in src/siteConfig.js before generating sitemap.xml.');
}

const baseUrl = new URL(approvedOrigin);

const routes = [
  '/',
  '/fleet',
  '/about',
  '/faq',
  '/contacts',
  '/long-term-rental',
  ...cars.map(car => `/cars/${car.slug}`),
];
const entries = routes
  .map(route => `  <url><loc>${new URL(route, baseUrl).href}</loc></url>`)
  .join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;

await writeFile(resolve('public/sitemap.xml'), sitemap);
await writeFile(resolve('public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', baseUrl).href}\n`);
console.log(`Generated sitemap.xml for ${routes.length} routes using ${baseUrl.origin}`);
