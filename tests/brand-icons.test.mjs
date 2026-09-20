import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
const read = p => readFile(new URL('../'+p, import.meta.url));
test('approved brand exports have the required PNG dimensions', async () => {
  for(const [name,size] of [['pcmc-logo.png',512],['pwa-icon-192.png',192],['pwa-icon-512.png',512],['pwa-icon-maskable-512.png',512],['apple-touch-icon.png',180],['favicon-16.png',16],['favicon-32.png',32],['favicon-48.png',48]]) {
    const b=await read('public/'+name);
    assert.equal(b.subarray(1,4).toString(),'PNG',name);
    assert.equal(b.readUInt32BE(16),size,name);
    assert.equal(b.readUInt32BE(20),size,name);
  }
});
test('manifest separates full-bleed and safe-area icons, all cached with the current version', async () => {
  const manifest=JSON.parse(await read('public/manifest.webmanifest'));
  const sw=(await read('public/sw.js')).toString();
  assert.equal(manifest.start_url,'/');
  assert.deepEqual(manifest.icons.map(i=>i.purpose),['any','any','maskable']);
  for(const icon of manifest.icons){
    assert.ok(icon.src.endsWith('?v=26'));
    assert.ok(sw.includes(icon.src));
    await read('public'+icon.src.split('?')[0]);
  }
  assert.match(sw,/v26-comic-brand-icons/);
  const layout=(await read('app/layout.tsx')).toString();
  for(const name of ['favicon.ico','favicon-32.png','favicon-16.png','apple-touch-icon.png'])assert.ok(layout.includes('/'+name+'?v=26'));
});
test('ICO contains valid 16, 32 and 48px images and SVG no longer uses starter art', async () => {
 const ico=await read('public/favicon.ico');
 assert.equal(ico.readUInt16LE(2),1); assert.equal(ico.readUInt16LE(4),3);
 for(let i=0;i<3;i++){
   const p=6+i*16; assert.equal(ico[p],[16,32,48][i]);
   const offset=ico.readUInt32LE(p+12), length=ico.readUInt32LE(p+8);
   assert.ok(offset+length<=ico.length);
   assert.equal(ico.subarray(offset+1,offset+4).toString(),'PNG');
 }
 assert.match((await read('public/favicon.svg')).toString(),/data:image\/png;base64,/);
});
