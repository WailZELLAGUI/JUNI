// Packs the built game into one HTML fragment for a quick shareable preview.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';

const dir = 'dist-preview/assets/';
const files = readdirSync(dir);
const read = (ext) => files.filter((f) => f.endsWith(ext)).map((f) => readFileSync(dir + f, 'utf8')).join('\n');
const js = read('.js').replaceAll('</script', '<\\/script');
const html = `<title>JUNI</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Caveat:wght@600&family=Nunito:wght@500;700&display=swap">
<style>${read('.css')}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;
mkdirSync('preview', { recursive: true });
writeFileSync('preview/juni.html', html);
console.log('preview/juni.html', (html.length / 1024).toFixed(0) + ' KB');
