# Simulasi latihan ujian (versi web)

Isi aplikasi disimpan terenkripsi (`docs/konten.enc`, AES-256-GCM). Halaman `docs/index.html` meminta kode akses,
lalu membuka isi aplikasi di browser. Tanpa kode yang benar, isi aplikasi tidak dapat dibaca.

## Mengelola kode akses

Pemilik memakai alat "Kelola Kode Akses" (file HTML pribadi, tidak disimpan di repository ini):
tulis daftar kode, klik tombol, lalu unggah `kunci.json` hasilnya ke folder `docs/`.
`kunci.json` hanya berisi kunci yang dibungkus per kode; kodenya sendiri tidak tersimpan.

## Memperbarui isi aplikasi

```
node tools/enkripsi-konten.mjs <aplikasi.html> <kunci-utama.txt> [firebase-config.json]
git add docs/konten.enc && git commit -m "Perbarui isi" && git push
```
Web dipasang dengan GitHub Pages dari folder `docs/` di branch `main`.

## Catatan keamanan

Ini situs statis: kode akses adalah penghalang yang wajar, bukan pengaman tingkat tinggi. Siapa pun yang sudah
membuka aplikasi bisa menyimpan isinya. Kunci utama tidak pernah disimpan di repository ini.
