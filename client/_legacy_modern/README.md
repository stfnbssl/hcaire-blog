# Backup grafica "modern" (pre-restyle classic)

Copia dei file frontend prima dell'adozione della grafica editoriale (serif Cormorant Garamond, palette neutral) presa da `C:/my/wizzi/stfnbssl/hcaire-web`.

## Come tornare alla grafica precedente

Dalla root del repo:

```powershell
cp client/_legacy_modern/src/components/Header.tsx     client/src/components/Header.tsx
cp client/_legacy_modern/src/components/Navigation.tsx client/src/components/Navigation.tsx
cp client/_legacy_modern/src/components/Footer.tsx     client/src/components/Footer.tsx
cp client/_legacy_modern/src/pages/Home.tsx            client/src/pages/Home.tsx
cp client/_legacy_modern/src/styles/tailwind.css       client/src/styles/tailwind.css
cp client/_legacy_modern/tailwind.config.js            client/tailwind.config.js
cp client/_legacy_modern/index.html                    client/index.html
```

Il logo SVG aggiunto (`client/src/assets/logo.svg`) può essere rimosso a piacere — non è usato dal layout vecchio.

Cartella creata il 2026-05-07.
