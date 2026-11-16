// Membuat alat "Kelola Kode Akses" (berisi kunci utama) untuk pemilik. JANGAN di-commit hasilnya.
// Pemakaian: node tools/buat-alat-kelola.mjs <kunci-utama.txt> <kode-akses.txt> <keluaran.html>
import { readFileSync, writeFileSync } from 'node:fs';
const [, , fk, fkode, out] = process.argv;
const t = readFileSync(new URL('./kelola-kode-template.html', import.meta.url), 'utf8')
  .replace('__KUNCI_UTAMA__', readFileSync(fk, 'utf8').trim())
  .replace('__KODE_SEKARANG__', readFileSync(fkode, 'utf8').trim())
  .replace('__REPO__', 'febriankusumaa/simulasi-cakim');
writeFileSync(out, t); console.log('Alat kelola dibuat:', out);
