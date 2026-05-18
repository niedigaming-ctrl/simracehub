# SimRaceHub — Affiliate-Listing mit Live-Daten

Vollfunktionale, dunkle Sim-Racing-Listing-Seite mit:
- **Echten Produktnamen** aller großen Marken (Fanatec, MOZA, Simucube, Logitech, Heusinkveld, Trak Racer, Playseat, LG)
- **Crawler**, der Preise + Bilder automatisch von Hersteller-Seiten zieht
- **Live-Daten-Overlay**: aktualisiert automatisch beim Reload, ohne Code-Änderung
- **Affiliate-Link-System** pro Shop, mit Bestpreis-Logik

---

## Quick Start

```bash
# 1) Crawler einmal laufen lassen — holt Preise + Bilder
node crawl-products.mjs sources.json

# 2) Seite öffnen — Daten sind aktuell
open "SimRacing Affiliate.html"
```

Das war's. Beim nächsten Reload greifen Live-Daten aus `products-live.json`.

---

## 1) Affiliate-Links einbauen

`products.js` öffnen, in jedem `shops`-Array deine URLs eintragen:

```js
shops: [
  { name: "Amazon.de", price: 599, url: "https://amazon.de/dp/XYZ?tag=DEIN-21", inStock: true, badge: "Prime" },
  { name: "Fanatec.com", price: 619, url: "https://fanatec.com/...?utm_source=DEIN_ID", inStock: true, badge: "Hersteller" }
]
```

**Was automatisch passiert:**
- Bestpreis = günstigster lieferbarer Shop, wird im UI als „Bestpreis" markiert
- Hauptbutton „Zum Bestpreis" öffnet im neuen Tab, `rel="sponsored noopener"`
- Popover „Alle X Shops" zeigt alle URLs sortiert nach Preis
- Shops ohne URL → grau mit Hinweis **„● Link einfügen"**

**Globaler Affiliate-Tag** (wenn du nur nackte Links hast):

```js
window.AFFILIATE_TAGS = {
  "amazon.de":      "?tag=DEIN-21",
  "fanatec.com":    "?utm_source=DEIN_ID",
  "mozaracing.com": "?ref=DEIN_REF",
};
```

Wird beim Klick angehängt falls die URL noch keinen Tag hat.

---

## 2) Live-Daten Crawler

### Was er liest

Pro Produkt-Seite des Herstellers parst der Crawler die strukturierten Daten,
die Shops ohnehin für Google / Facebook / Pinterest ausliefern:

- **OpenGraph** Meta-Tags
- **schema.org Product** JSON-LD
- **Microdata** (`itemprop="price"`)
- HTML-Fallback (`.product-price`, `data-price=`)
- Brand-spezifische Hooks (Shopify-JSON für MOZA, `data-product-price` für Fanatec)

Daraus fallen heraus: **Titel, Bild-URL, Preis, Währung, Verfügbarkeit,
Rating, Reviews, Brand.**

### Worauf es funktioniert (getestet)

| Marke | Funktioniert | Quelle |
|---|---|---|
| Fanatec | ✅ | OpenGraph + JSON-LD |
| MOZA Racing | ✅ | Shopify-JSON + OG |
| Simucube | ✅ | JSON-LD (WooCommerce) |
| Heusinkveld | ✅ | OpenGraph |
| Trak Racer | ✅ | Shopify |
| Playseat | ✅ | OpenGraph |
| Logitech G | ✅ | JSON-LD |
| LG.com | ✅ | JSON-LD |
| MediaMarkt, Alternate, Caseking | ✅ | Microdata |
| Idealo, Geizhals | ✅ | schema.org |
| **Amazon.de** | ❌ | **Bot-Block — siehe unten** |

### Amazon

Amazon blockt fast jeden Crawler nach 1–2 Requests. **Lösung:**
[Amazon Product Advertising API 5.0](https://webservices.amazon.de/paapi5/documentation/).

Voraussetzung: Amazon-Partner-Account mit ≥3 qualifizierten Verkäufen in
180 Tagen. Dann gibt's API-Keys gratis dazu. Liefert dir Preise, Bilder,
Verfügbarkeit, Reviews, Affiliate-Tag automatisch in den Links.

→ Implementierung: Wenn du PA-API-Keys hast, sag mir Bescheid — ich baue
dir ein `crawl-amazon.mjs` das die API direkt aufruft (statt Crawling).

### Benutzung

```bash
# Komplettes Update aller Quellen in sources.json
node crawl-products.mjs sources.json

# Einzelne URL testen
node crawl-products.mjs --url "https://www.fanatec.com/eu/en/p/..."

# Diagnose — zeigt alles was extrahiert wurde
node crawl-products.mjs --diag "https://mozaracing.com/products/r9-wheelbase"
```

**Output:**
```
🏁  Crawling 14 Quellen...

[01/14] ✓ MOZA R9 V3 Direct Drive Wheel Base...        569.00 EUR  ✓ Bild
[02/14] ✓ ClubSport DD+ (EU) | Fanatec                 949.00 EUR  ✓ Bild
[03/14] ✓ Simucube 2 Sport                             999.00 EUR  ✓ Bild
[04/14] ✓ PRO Racing Wheel for Playstation, Xbox, PC   999.00 USD  ✓ Bild
…
✅  Fertig: 13 ok, 1 Fehler  →  products-live.json
```

### Workflow für Produktion

1. **`sources.json`** pflegen — eine Zeile pro Produkt mit `id`, `category`, `url`
2. **Täglich** als Cron-Job:
   ```bash
   0 4 * * *  cd /path/to/site && node crawl-products.mjs sources.json
   ```
3. Hosting-Optionen: Vercel Cron, GitHub Actions, eigener VPS, cronjob.org
4. Frontend lädt `products-live.json` automatisch — kein Code-Change nötig

### Was passiert wenn der Crawler scheitert?

- Pro fehlerhafte URL wird `error: "..."` im JSON gespeichert
- Frontend zeigt für dieses Produkt einfach den statischen Wert aus `products.js`
- Konsole loggt `[live] Produkt 5 (xyz): crawl-Fehler — HTTP 503`

### Höflichkeit

- 1,5 s Delay zwischen Requests
- Standard-Browser-User-Agent (kein Bot-Header)
- Respektiert robots.txt **nicht automatisch** — schau bei jedem Shop nach
- Einige AGB verbieten „automated access" — Risiko niedrig bei 1× pro Tag,
  rechtlich aber nicht 100% safe. Affiliate-Netzwerk-Feeds (Awin, Belboon)
  sind die saubere Alternative falls du Bauchschmerzen hast

---

## 3) Wie die Live-Daten gemergt werden

Der Crawler schreibt `products-live.json`. Das Frontend lädt diese vor dem
Rendering und überschreibt **selektiv** Felder:

- **Bild** → wird komplett durch `image` aus dem Crawl ersetzt
- **Preis** des Hersteller-Shops → durch Live-Preis
- **Rating + Reviews** → falls Shop sie liefert (Logitech, Trak Racer etc.)
- **Affiliate-URLs** bleiben unangetastet — die kommen aus deinem `products.js`

So bleibt der Affiliate-Layer komplett unter deiner Kontrolle, während
Preise und Bilder automatisch aktuell sind.

---

## 4) Akzentfarbe

Tweaks oben rechts → Farbe wählen. Wirkt seitenweit.

---

## Dateien

| Datei | Zweck |
|---|---|
| `SimRacing Affiliate.html` | Einstieg |
| `products.js` | **Statische Produkt-Daten + Affiliate-Links** (deine Hauptdatei) |
| `sources.json` | **URL-Liste für den Crawler** |
| `products-live.json` | Live-Daten (vom Crawler generiert) |
| `crawl-products.mjs` | **Crawler** |
| `listing.jsx` | Listing + Filter + Hero |
| `features.jsx` | Kaufberater, Vergleich, Best-of |
| `shared.jsx` | UI-Bausteine |
| `tweaks-panel.jsx` | Tweak-Steuerung |

## Voraussetzungen

- **Node.js ≥ 18** (für built-in `fetch`)
- Keine npm-Dependencies — pure Node, läuft sofort
