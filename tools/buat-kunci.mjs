// Dijalankan oleh GitHub Actions. Membuat site/kunci.json dari secret:
//   KODE_AKSES  : daftar kode akses, satu kode per baris (huruf besar/kecil dianggap sama)
//   KUNCI_UTAMA : kunci utama (base64, 32 byte) yang dipakai mengenkripsi konten.enc
// File kunci.json hanya berisi kunci utama yang dibungkus per kode; kodenya sendiri tidak tersimpan.
import { writeFileSync } from 'node:fs';
import { webcrypto as c } from 'node:crypto';
const ITER = 250000;
const kode = [...new Set((process.env.KODE_AKSES || '').split(/[\r\n,;]+/).map(s => s.trim().toUpperCase()).filter(Boolean))];
const utama = Buffer.from((process.env.KUNCI_UTAMA || '').trim(), 'base64');
if (!kode.length) { console.error('Secret KODE_AKSES kosong. Isi minimal satu kode.'); process.exit(1); }
if (utama.length !== 32) { console.error('Secret KUNCI_UTAMA tidak valid.'); process.exit(1); }
const salt = c.getRandomValues(new Uint8Array(16));
const b64 = u => Buffer.from(u).toString('base64');
const daftar = [];
for (const k of kode) {
  const bahan = await c.subtle.importKey('raw', new TextEncoder().encode(k), 'PBKDF2', false, ['deriveKey']);
  const kk = await c.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, bahan, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const iv = c.getRandomValues(new Uint8Array(12));
  daftar.push({ iv: b64(iv), c: b64(new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, kk, utama))) });
}
daftar.sort(() => Math.random() - 0.5);
writeFileSync(new URL('../site/kunci.json', import.meta.url), JSON.stringify({ versi: process.env.GITHUB_SHA || String(Date.now()), salt: b64(salt), iter: ITER, daftar }));
console.log(`kunci.json dibuat untuk ${kode.length} kode akses.`);
