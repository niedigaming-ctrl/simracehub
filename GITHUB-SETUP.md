# So bringst du SimRaceHub auf GitHub Pages (10 Minuten)

Dieses Repo enthält bereits:
- die fertige Webseite (`SimRacing Affiliate.html` + JSX-Dateien)
- den Crawler (`crawl-products.mjs` + `sources.json`)
- einen **GitHub Action Workflow** (`.github/workflows/crawl-and-deploy.yml`),
  der den Crawler 2× täglich laufen lässt und die Seite automatisch deployt

## Schritt 1: Lokal entpacken & Git initialisieren

```bash
cd ~/Downloads/Simracing            # wo du das ZIP entpackt hast
git init
git add .
git commit -m "Initial SimRaceHub"
```

## Schritt 2: Auf GitHub neues Repo anlegen

1. Geh auf https://github.com/new
2. Repo-Name z.B. `simracehub` — **Public** (Pages ist nur public gratis)
3. **Nicht** mit README/License initialisieren — wir haben schon eins
4. „Create repository"

## Schritt 3: Lokales Repo hochladen

GitHub zeigt dir nach dem Anlegen genau die Befehle. Sie lauten:

```bash
git remote add origin https://github.com/DEIN-USER/simracehub.git
git branch -M main
git push -u origin main
```

## Schritt 4: GitHub Pages einschalten

1. Im Repo: **Settings → Pages**
2. **Source**: „**GitHub Actions**" wählen (NICHT „Deploy from a branch"!)
3. Speichern

## Schritt 5: Workflow läuft automatisch

- Nach Push: Geh auf **Actions**-Tab → du siehst „Crawl prices & deploy" laufen
- Dauer: ~2 Minuten (Crawler braucht ~30 s für 14 Quellen, Rest ist Deploy)
- Ergebnis: Deine Seite ist online unter
  `https://DEIN-USER.github.io/simracehub/SimRacing%20Affiliate.html`

> 💡 Falls die URL hässlich aussieht: Benenne `SimRacing Affiliate.html` in
> `index.html` um, dann läuft sie direkt unter
> `https://DEIN-USER.github.io/simracehub/`

## Schritt 6: Crawler läuft automatisch weiter

Der Cron-Job `0 4,16 * * *` lässt den Crawler 2× am Tag (04:00 + 16:00 UTC)
laufen. Wenn sich Preise oder Bilder ändern, wird `products-live.json`
automatisch zurück ins Repo committet und die Seite neu deployt.

Manuell auslösen geht auch: **Actions → „Crawl prices & deploy" → „Run workflow"**.

## Schritt 7: Affiliate-Links pflegen

Trag deine Affiliate-Links in `products.js` ein (Feld `url` jedes Shops),
oder die globalen Tags ganz unten in der Datei:

```js
window.AFFILIATE_TAGS = {
  "amazon.de":      "?tag=DEIN-21",
  "fanatec.com":    "?utm_source=DEIN_ID",
  "mozaracing.com": "?ref=DEIN_REF",
};
```

Push die Änderungen → Site updated automatisch.

## Was geht nicht über GitHub Actions?

- **Amazon.de Crawling.** Amazon blockt User-Agents — auch von GitHub. Für
  Amazon brauchst du die offizielle Product Advertising API (PA-API 5.0),
  Voraussetzung: aktiver Partnerprogramm-Account.
- **Sehr aggressive Cloudflare-Blocks** auf manchen Shops. Falls einer
  fehlschlägt: einfach in `sources.json` rauskommentieren. Andere bleiben
  davon unberührt (dank `continue-on-error: true`).

## Eigene Domain?

Wenn du z.B. `simracehub.de` hast: Datei `CNAME` mit dem Domain-Namen ins
Repo legen, in den Einstellungen deiner Domain ein CNAME auf
`DEIN-USER.github.io` setzen, fertig. Details:
https://docs.github.com/de/pages/configuring-a-custom-domain-for-your-github-pages-site
