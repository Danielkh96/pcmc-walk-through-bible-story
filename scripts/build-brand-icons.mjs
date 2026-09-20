import sharp from 'sharp';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Export the approved artwork without redrawing or cropping its composition.
const root = resolve(import.meta.dirname, '..');
const source = process.argv[2] || resolve(root, 'public/brand/app-icon-comic-v1.png');
await mkdir(resolve(root, 'public/brand'), { recursive: true });
const master = await sharp(source).resize(1024, 1024, { fit: 'contain' }).removeAlpha().png().toBuffer();
await writeFile(resolve(root, 'public/brand/app-icon-comic-v1.png'), master);
for (const [name, size] of [['pcmc-logo.png',512], ['pwa-icon-192.png',192], ['pwa-icon-512.png',512], ['apple-touch-icon.png',180], ['favicon-16.png',16], ['favicon-32.png',32], ['favicon-48.png',48]]) {
  await sharp(master).resize(size, size).png().toFile(resolve(root, 'public', name));
}
// Keep the complete illustration within the maskable icon's central safe circle.
const inset = await sharp(master).resize(352,352).png().toBuffer();
await sharp({create:{width:512,height:512,channels:3,background:'#17362c'}})
  .composite([{input:inset,left:80,top:80}]).png().toFile(resolve(root,'public/pwa-icon-maskable-512.png'));
const pngs = await Promise.all([16,32,48].map(size => readFile(resolve(root, `public/favicon-${size}.png`))));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(1,2); header.writeUInt16LE(pngs.length,4);
let offset = header.length;
pngs.forEach((png,i) => {
  const p=6+i*16; const size=[16,32,48][i];
  header[p]=size; header[p+1]=size;
  header.writeUInt16LE(1,p+4); header.writeUInt16LE(32,p+6);
  header.writeUInt32LE(png.length,p+8); header.writeUInt32LE(offset,p+12);
  offset+=png.length;
});
await writeFile(resolve(root,'public/favicon.ico'),Buffer.concat([header,...pngs]));
const png = await readFile(resolve(root,'public/pwa-icon-192.png'));
await writeFile(resolve(root,'public/favicon.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192"><image width="192" height="192" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`);
console.log('Exported approved App artwork, PWA, maskable, Apple, PNG, ICO and SVG icons.');
