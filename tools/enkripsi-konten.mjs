// Mengenkripsi file HTML aplikasi menjadi site/konten.enc (AES-256-GCM).
// Pemakaian: node tools/enkripsi-konten.mjs <aplikasi.html> <kunci-utama.txt> [firebase-config.json]
// Bila firebase-config.json diberikan, tampilan "pengguna online" (tools/online.html) ikut disisipkan.
// Kunci utama TIDAK boleh disimpan di repository ini.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as c } from 'node:crypto';
const [, , masukan, fileKunci, fileFirebase] = process.argv;
if (!masukan || !fileKunci) { console.error('Pemakaian: node tools/enkripsi-konten.mjs <aplikasi.html> <kunci-utama.txt> [firebase-config.json]'); process.exit(1); }
const kunci = Buffer.from(readFileSync(fileKunci, 'utf8').trim(), 'base64');
if (kunci.length !== 32) { console.error('Kunci utama harus 32 byte (base64).'); process.exit(1); }
let html = readFileSync(masukan, 'utf8');
if (fileFirebase) {
  const cfg = JSON.parse(readFileSync(fileFirebase, 'utf8'));
  const sisip = readFileSync(new URL('./online.html', import.meta.url), 'utf8').replace('__FIREBASE_CONFIG__', () => JSON.stringify(cfg));
  const i = html.lastIndexOf('</body>');
  html = i >= 0 ? html.slice(0, i) + sisip + html.slice(i) : html + sisip;
}
const k = await c.subtle.importKey('raw', kunci, 'AES-GCM', false, ['encrypt']);
const iv = c.getRandomValues(new Uint8Array(12));
const isi = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, k, Buffer.from(html, 'utf8')));
writeFileSync(new URL('../docs/konten.enc', import.meta.url), Buffer.concat([iv, isi]));
console.log('site/konten.enc diperbarui dari', masukan, fileFirebase ? '(dengan tampilan online)' : '');
