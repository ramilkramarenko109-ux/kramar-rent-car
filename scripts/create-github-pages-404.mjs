import { copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const indexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url));
const notFoundPath = fileURLToPath(new URL('../dist/404.html', import.meta.url));

await copyFile(indexPath, notFoundPath);
