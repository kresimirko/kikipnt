<p align="right">
    <a href="./README.md">English</a> | hrvatski
</p>

<p align="center">
    <img src="./logo_std.svg">
    <br><br>
    predani projekt za finale <a href="https://digitalnadalmacija.hr/edit"><b>EDIT Code School</b></a> naprednog JavaScript tečaja (2022./2023.) <a href="https://digitalnadalmacija.hr">Digitalne Dalmacije</a>
</p>

---

:pushpin: **kikipnt** (eng. izgovor "kiki point") **je web aplikacija za traženje mjesta na svijetu**. Pokrenuta [OpenStreetMapom](https://www.openstreetmap.org/).

![kikipnt screenshot](./screenshots/latest.png)

Inspiriran [ovime](https://github.com/ful1e5/Bibata_Cursor#what-does-bibata-mean), odlučio sam uzeti "kiki" iz "kikiriki" i dodati "pnt", skraćenu verziju engleske riječi "point" (točka). Tako sam dobio ime **kikipnt**.

Same datoteke projekta su u [kikipnt](./kikipnt/) mapi.

**Note:** Za obojane komentare u izvornom kodu, preporučujem "[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)" Visual Studio Code proširenje.

## :keyboard: Buildanje i pokretanje

(Radna mapa treba biti [kikipnt](./kikipnt/).)

`src/app` mapa mora sadržavati datoteku `__firebaseConfig.json` koja sadrži vaše vjerodajnice Firebase projekta.

Ovog je formata:

```json
{
    "apiKey": "...",
    "authDomain": "...",
    "projectId": "...",
    "storageBucket": "...",
    "messagingSenderId": "...",
    "appId": "..."
}
```

:warning: **Upozorenje:** Firebase funkcionalnosti aplikacije nisu sigurne. Koristite privatno.

`npm install` - instalirajte sve potrebne packageve (pogledajte [dependency graph](https://github.com/kresimirko/kikipnt/network/dependencies) za listu)

`npm run dev` - buildaj i pokreni "development" verziju

`npm run prod` - buildaj i pokreni "production" verziju

### Ručno

#### "Development"

`npx parcel --no-hmr`

#### "Production"

`npx parcel build --no-source-maps --public-url ./`

## :page_with_curl: Resursi repozitorija

[:page_facing_up: Changelog](./CHANGELOG.md)

[:memo: Todo](./TODO.md)

[:framed_picture: Screenshotovi](./screenshots/)

## :hammer_and_wrench: Atribucije

### Dependencyjevi

Pogledajte [dependency graph](https://github.com/kresimirko/kikipnt/network/dependencies).

### Resursi aplikacije

[Ubuntu font](https://fonts.google.com/specimen/Ubuntu/)

[Gantari font](https://fonts.google.com/specimen/Gantari)

[Material Symbols](https://fonts.google.com/icons/)

[SVG spinners](https://github.com/n3r4zzurr0/svg-spinners/)

### Alati

[Visual Studio Code](https://code.visualstudio.com/)

[Inkscape](https://inkscape.org/)

### Ostali resursi

Odgovori sa [Stack Overflowa](https://stackoverflow.com/) (potrebne atribucije su u izvornom kodu kao komentari)

[MDN Web Docs](https://developer.mozilla.org/en-US/)

## Licence

MIT i BSD 2-Clause

Pogledajte [LICENSE datoteku](./LICENSE.txt) za više detalja.

---

<p align="center">
    Napravio <a href="https://kresimirko.github.io">Luka Krešimir Mihovilović</a> sa &#x1F499;
</p>
