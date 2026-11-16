# Simulasi latihan ujian (versi web)

Isi aplikasi disimpan terenkripsi (`site/konten.enc`, AES-256-GCM). Halaman `site/index.html` meminta kode akses,
lalu membuka isi aplikasi di browser. Tanpa kode yang benar, isi aplikasi tidak dapat dibaca.

## Mengelola kode akses

Kode akses disimpan sebagai *secret* GitHub bernama `KODE_AKSES` (satu kode per baris, huruf besar/kecil dianggap sama).

1. Buka **Settings → Secrets and variables → Actions** di repository ini.
2. Pada `KODE_AKSES` klik ikon pensil (**Update**), ubah daftar kodenya, lalu **Update secret**.
3. Buka tab **Actions → Pasang ke web → Run workflow → Run workflow**. Setelah sekitar 1 menit kode baru berlaku.

Kode yang dihapus dari daftar tidak bisa lagi dipakai untuk masuk. Jangan ubah atau hapus secret `KUNCI_UTAMA`.

## Memperbarui isi aplikasi

```
node tools/enkripsi-konten.mjs <aplikasi.html> <kunci-utama.txt> [firebase-config.json]
git add site/konten.enc && git commit -m "Perbarui isi" && git push
```
Setiap push ke `main` otomatis memasang ulang web lewat GitHub Actions.

## Catatan keamanan

Ini situs statis: kode akses adalah penghalang yang wajar, bukan pengaman tingkat tinggi. Siapa pun yang sudah
membuka aplikasi bisa menyimpan isinya. Kunci utama tidak pernah disimpan di repository ini.
