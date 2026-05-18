// ============================================================================
// SIMRACEHUB · PRODUKT- & AFFILIATE-DATEN
// ============================================================================
//
// SO BAUST DU DEINE AFFILIATE-LINKS EIN
// --------------------------------------
// Jedes Produkt hat ein `shops`-Array. Jeder Eintrag = ein Shop.
// Trage in `url` deinen kompletten Affiliate-Link ein.
//
//   { name: "Amazon.de",  price: 599, url: "DEIN_AFFILIATE_LINK_HIER", inStock: true }
//
// Tipps:
//   • Amazon Partnernet:    https://amazon.de/dp/B0XYZ?tag=DEIN-21
//   • Awin/Belboon/Webgains: kompletten Deeplink reinkopieren
//   • Leerer url       → Button wird grau, Hinweis "● Link einfügen"
//   • Billigster Shop  → automatisch als "Bestpreis" markiert
//
// LIVE-DATEN (Bilder + Preise automatisch ziehen)
// -----------------------------------------------
// Pro Produkt gibt's ein optionales Feld `liveUrl` (Hersteller-Produktseite).
// Diese URL crawlt das Skript `crawl-products.mjs` und schreibt Live-Daten
// in `products-live.json`. Das Frontend mischt diese automatisch in die
// statischen Daten — du musst NICHTS umstellen.
//
// Workflow:
//   1. node crawl-products.mjs sources.json
//   2. fertig — beim Reload sind Bilder + Preise aktuell
// ============================================================================

window.SIMRACING_DATA = {
  categories: [
    { id: "wheelbase", label: "Wheelbases",        icon: "wheelbase", count: 18 },
    { id: "wheel",     label: "Lenkräder",         icon: "wheel",     count: 32 },
    { id: "pedals",    label: "Pedale",            icon: "pedals",    count: 14 },
    { id: "shifter",   label: "Shifter & Handbrake", icon: "shifter", count: 11 },
    { id: "cockpit",   label: "Cockpits & Rigs",   icon: "cockpit",   count: 9  },
    { id: "monitor",   label: "Monitore & VR",     icon: "monitor",   count: 16 },
    { id: "seat",      label: "Sitze",             icon: "seat",      count: 8  },
    { id: "accessory", label: "Zubehör",           icon: "accessory", count: 24 },
    { id: "bundle",    label: "Komplett-Setups",   icon: "bundle",    count: 6  },
  ],

  brands: ["MOZA Racing", "Fanatec", "Simucube", "Logitech", "Heusinkveld", "Trak Racer", "Playseat", "LG"],

  // ─── HERO ─────────────────────────────────────────────────────────────────
  hero: {
    id: 0,
    name: "MOZA R9 V3 Direct Drive",
    brand: "MOZA Racing",
    category: "wheelbase",
    categoryLabel: "Direct-Drive Wheelbase · 9 Nm",
    tag: "Editor's Pick",
    badge: "Mai 2026",
    rating: 4.8,
    reviews: 1247,
    bestFor: "Fortgeschrittene Einsteiger",
    blurb: "Wenn du nur einmal kaufen willst: das hier. Linear, leise, kompatibel mit fast allen Quick-Releases — und mit 9 Nm Drehmoment der Sweet-Spot zwischen Realismus und Schreibtisch-Tauglichkeit.",
    liveUrl: "https://mozaracing.com/products/r9-wheelbase",
    specs: [
      ["Drehmoment", "9 Nm"],
      ["Plattform",  "PC"],
      ["Encoder",    "21-bit"],
    ],
    platforms: ["PC"],
    shops: [
      { name: "MOZA Store",   price: 569,  url: "", inStock: true,  badge: "Hersteller" },
      { name: "Amazon.de",    price: 589,  url: "", inStock: true,  badge: "Prime" },
      { name: "Caseking",     price: 599,  url: "", inStock: true },
      { name: "BestSim",      price: 619,  url: "", inStock: false },
    ],
  },

  // ─── PRODUKT-GRID ─────────────────────────────────────────────────────────
  products: [
    {
      id: 1, name: "Fanatec ClubSport DD+", brand: "Fanatec", category: "wheelbase",
      categoryLabel: "Wheelbase · 15 Nm DD",
      tag: "Premium-Tipp", rating: 4.9, reviews: 612,
      bestFor: "Sim-Enthusiasten", platforms: ["PC", "Xbox", "PS5"],
      specs: [["Drehmoment","15 Nm"],["Plattform","Multi"],["Quick-Release","QR2"]],
      liveUrl: "https://www.fanatec.com/eu/en/p/wheel-bases/cs_dd_15nm_eu/clubsport-dd-15-nm-eu",
      shops: [
        { name: "Fanatec.com", price: 949, url: "", inStock: true, badge: "Hersteller" },
        { name: "Amazon.de",   price: 989, url: "", inStock: true },
      ],
    },
    {
      id: 2, name: "Simucube 2 Sport", brand: "Simucube", category: "wheelbase",
      categoryLabel: "Wheelbase · 17 Nm DD",
      tag: "High-End", rating: 4.8, reviews: 188,
      bestFor: "Pro / E-Sport", platforms: ["PC"],
      specs: [["Drehmoment","17 Nm"],["Industrieller Servo","✓"],["SQR Quick-Release","Inkl."]],
      liveUrl: "https://simucube.com/simucube-2-sport/",
      shops: [
        { name: "Simucube",    price: 999, url: "", inStock: true, badge: "Hersteller" },
        { name: "Ricmotech",   price: 1049, url: "", inStock: true },
        { name: "Caseking",    price: 1079, url: "", inStock: false },
      ],
    },
    {
      id: 3, name: "Logitech G PRO Racing Wheel", brand: "Logitech", category: "wheel",
      categoryLabel: "Lenkrad · GT mit DD-Base",
      tag: "Bestseller", rating: 4.6, reviews: 1820,
      bestFor: "Konsolen-Setups", platforms: ["PC", "Xbox", "PS5"],
      specs: [["Drehmoment","11 Nm"],["Material","Leder"],["TRUEFORCE","✓"]],
      liveUrl: "https://www.logitechg.com/en-us/shop/p/pro-racing-wheel",
      shops: [
        { name: "Amazon.de",     price: 999, url: "", inStock: true, badge: "Prime" },
        { name: "MediaMarkt",    price: 1029, url: "", inStock: true },
        { name: "Logitech.com",  price: 1099, url: "", inStock: true, badge: "Hersteller" },
      ],
    },
    {
      id: 4, name: "Fanatec Formula V2.5 X", brand: "Fanatec", category: "wheel",
      categoryLabel: "Lenkrad · Formula",
      tag: null, rating: 4.7, reviews: 412,
      bestFor: "Open-Wheel-Fans", platforms: ["PC", "Xbox", "PS5"],
      specs: [["Durchmesser","300 mm"],["Material","Carbon / Alcantara"],["Display","OLED"]],
      liveUrl: "https://www.fanatec.com/eu/en/p/steering-wheels/formula_v2.5x_eu/formula-v2.5-x-eu",
      shops: [
        { name: "Fanatec.com", price: 449, url: "", inStock: true, badge: "Hersteller" },
      ],
    },
    {
      id: 5, name: "MOZA CS V2P Wheel", brand: "MOZA Racing", category: "wheel",
      categoryLabel: "Lenkrad · GT3",
      tag: "Empfohlen", rating: 4.7, reviews: 524,
      bestFor: "GT3 / Endurance", platforms: ["PC"],
      specs: [["Durchmesser","290 mm"],["Material","Alcantara"],["Tasten","12 + 4 Encoder"]],
      liveUrl: "https://mozaracing.com/products/cs-v2p-steering-wheel",
      shops: [
        { name: "Amazon.de",   price: 379, url: "", inStock: true, badge: "Prime" },
        { name: "MOZA Store",  price: 399, url: "", inStock: true, badge: "Hersteller" },
        { name: "Caseking",    price: 409, url: "", inStock: true },
      ],
    },
    {
      id: 6, name: "Heusinkveld Sprint Pedals", brand: "Heusinkveld", category: "pedals",
      categoryLabel: "Pedale · Loadcell",
      tag: "Editor's Pick", rating: 4.9, reviews: 802,
      bestFor: "Konstante Bremszeiten", platforms: ["PC", "Xbox", "PS5"],
      specs: [["Bremse","Loadcell 100 kg"],["Pedale","3"],["Material","Stahl"]],
      liveUrl: "https://www.heusinkveld.com/shop/sim-pedals/sim-pedals-sprint/",
      shops: [
        { name: "Heusinkveld.com", price: 689, url: "", inStock: true, badge: "Hersteller" },
        { name: "Ricmotech",       price: 729, url: "", inStock: true },
      ],
    },
    {
      id: 7, name: "MOZA SR-P Lite Pedals", brand: "MOZA Racing", category: "pedals",
      categoryLabel: "Pedale · Einsteiger Loadcell",
      tag: "Budget", rating: 4.5, reviews: 967,
      bestFor: "Erste Pedale", platforms: ["PC", "Xbox", "PS5"],
      specs: [["Bremse","Loadcell"],["Pedale","2 (3 optional)"],["Material","Stahl"]],
      liveUrl: "https://mozaracing.com/products/sr-p-lite-pedals",
      shops: [
        { name: "Amazon.de",  price: 199, url: "", inStock: true, badge: "Prime" },
        { name: "MOZA Store", price: 219, url: "", inStock: true, badge: "Hersteller" },
      ],
    },
    {
      id: 8, name: "Heusinkveld Sim Handbrake", brand: "Heusinkveld", category: "shifter",
      categoryLabel: "Handbrake · Loadcell",
      tag: null, rating: 4.8, reviews: 142,
      bestFor: "Rally / Drift", platforms: ["PC"],
      specs: [["Sensor","200 kg Loadcell"],["Verstellung","Härte + Winkel"]],
      liveUrl: "https://www.heusinkveld.com/shop/sim-handbrake/sim-handbrake/",
      shops: [
        { name: "Heusinkveld.com", price: 369, url: "", inStock: true, badge: "Hersteller" },
        { name: "Caseking",        price: 389, url: "", inStock: false },
      ],
    },
    {
      id: 9, name: "Trak Racer TR8 PRO", brand: "Trak Racer", category: "cockpit",
      categoryLabel: "Cockpit · 80×40 Profil",
      tag: "Bestseller", rating: 4.7, reviews: 488,
      bestFor: "Stabile Basis", platforms: ["Universal"],
      specs: [["Material","Aluminium 80×40"],["Verstellung","Komplett modular"],["Max. Drehmoment","20 Nm"]],
      liveUrl: "https://www.trakracer.com/products/tr8-pro-aluminium-sim-racing-cockpit",
      shops: [
        { name: "TrakRacer.com", price: 599, url: "", inStock: true, badge: "Hersteller" },
        { name: "Amazon.de",     price: 649, url: "", inStock: true },
      ],
    },
    {
      id: 10, name: "Playseat Trophy", brand: "Playseat", category: "seat",
      categoryLabel: "Cockpit-Sitz · GT",
      tag: null, rating: 4.4, reviews: 256,
      bestFor: "Wohnzimmer-Setup", platforms: ["Universal"],
      specs: [["Material","Stahl + Stoff"],["Bis Körpergröße","200 cm"]],
      liveUrl: "https://www.playseatstore.com/playseat-trophy/",
      shops: [
        { name: "Amazon.de",   price: 549, url: "", inStock: true, badge: "Prime" },
        { name: "Playseat.com",price: 599, url: "", inStock: true, badge: "Hersteller" },
      ],
    },
    {
      id: 11, name: "LG UltraGear 34GP950G-B", brand: "LG", category: "monitor",
      categoryLabel: "Monitor · 34\" UWQHD",
      tag: null, rating: 4.6, reviews: 2104,
      bestFor: "Single-Monitor-Setup", platforms: ["PC"],
      specs: [["Diagonale","34\" Curved"],["Auflösung","3440×1440"],["Hz","160 Hz"]],
      liveUrl: "https://www.lg.com/de/monitore/lg-34gp950g-b",
      shops: [
        { name: "Amazon.de",    price: 799, url: "", inStock: true, badge: "Prime" },
        { name: "Alternate",    price: 829, url: "", inStock: true },
        { name: "MediaMarkt",   price: 849, url: "", inStock: true },
      ],
    },
    {
      id: 12, name: "Fanatec GT DD Pro Bundle", brand: "Fanatec", category: "bundle",
      categoryLabel: "Komplett-Setup · 8 Nm",
      tag: "Beliebteste Beratung", rating: 4.7, reviews: 1503,
      bestFor: "Sofort loslegen", platforms: ["PC", "PS5"],
      specs: [["Inhalt","Base + Wheel + 3 Pedale"],["Drehmoment","8 Nm"],["Aufbau","Plug & Play"]],
      liveUrl: "https://www.fanatec.com/eu/en/p/sim-racing-bundles/gran-turismo-dd-pro-8nm-bundle-eu/gran-turismo-dd-pro-8-nm-bundle-eu",
      shops: [
        { name: "Fanatec.com", price: 899, url: "", inStock: true, badge: "Hersteller" },
        { name: "Amazon.de",   price: 949, url: "", inStock: true, badge: "Prime" },
      ],
    },
    {
      id: 13, name: "Fanatec CSL DD Ready2Race WRC", brand: "Fanatec", category: "bundle",
      categoryLabel: "Komplett-Setup · 5 Nm · Rally",
      tag: "Live-Daten", rating: 4.7, reviews: 318,
      bestFor: "Rally-Einsteiger (PC/Xbox)", platforms: ["PC", "Xbox"],
      image: "https://assets.fanatec.com/image/upload/c_fill,q_auto,h_1333,w_2000/products/Bundles/ready2race/R2R_CSL_DD_QR2_WRC_5NM/R2R_CSL_DD_QR2_WRC_5NM-01B.webp",
      specs: [["Drehmoment","5 Nm DD"],["Wheel","CSL Elite WRC (Alcantara)"],["Pedale","CSL 2-Pedal"]],
      liveUrl: "https://www.fanatec.com/eu/en/p/sim-racing-bundles/r2r_csl_dd_qr2_wrc_5nm_eu/csl-dd-qr2-ready2race-wrc-bundle-5nm-eu",
      shops: [
        { name: "Fanatec.com", price: 479.95, originalPrice: 649.85, url: "https://www.fanatec.com/eu/en/p/sim-racing-bundles/r2r_csl_dd_qr2_wrc_5nm_eu/csl-dd-qr2-ready2race-wrc-bundle-5nm-eu", inStock: true, badge: "Hersteller · -26%" },
      ],
      lastCrawled: "2026-05-14",
    },
  ],
};

// ─── Affiliate-Tag-Anhängung (optional) ────────────────────────────────────
// Hinterlege hier Tags pro Domain — werden beim Klick automatisch angehängt,
// falls die url-Felder oben noch keinen Tag enthalten.
window.AFFILIATE_TAGS = {
  // "amazon.de":      "?tag=DEIN-21",
  // "fanatec.com":    "?utm_source=YOUR_AFFILIATE_ID",
  // "mozaracing.com": "?ref=YOUR_REF",
};

// ─── Helpers für UI ─────────────────────────────────────────────────────────
window.bestShop = function(p) {
  if (!p || !p.shops || !p.shops.length) return null;
  const sorted = [...p.shops].sort((a,b) => a.price - b.price);
  return sorted.find(s => s.inStock) || sorted[0];
};
window.affiliateUrl = function(shop) {
  if (!shop || !shop.url) return null;
  for (const host in window.AFFILIATE_TAGS) {
    if (shop.url.includes(host) && !shop.url.includes("tag=") && !shop.url.includes("ref=")) {
      const sep = shop.url.includes("?") ? "&" : "?";
      return shop.url + sep + window.AFFILIATE_TAGS[host].replace(/^[?&]/, "");
    }
  }
  return shop.url;
};

// ─── Live-Daten-Overlay (wird vor Render automatisch geladen) ──────────────
// Wenn `products-live.json` neben dieser Datei existiert, werden Bild/Preis/
// Rating-Felder pro Produkt überschrieben. Generiert vom Crawler-Script.
window.applyLiveData = function(live) {
  if (!live || !live.products) return;
  const merge = (p) => {
    const data = live.products["id:" + p.id];
    if (!data) return p;
    if (data.error) {
      console.warn(`[live] Produkt ${p.id} (${p.name}): crawl-Fehler — ${data.error}`);
      return p;
    }
    // Bild + Beschreibung mergen
    if (data.image) p.image = data.image;
    // Preis nur in den Hersteller-Shop einsetzen (oft Index 0/erster passender)
    if (data.price && data.currency === "EUR") {
      // Match Hersteller-Shop (Fanatec.com / MOZA Store / Heusinkveld.com etc.)
      const heuristics = [/hersteller/i, /\.com$/i];
      let target = p.shops.find(s => heuristics.some(re => re.test(s.badge || s.name)));
      if (!target) target = p.shops[0];
      if (target) target.price = data.price;
    }
    // Rating ggf. übernehmen
    if (data.rating && data.reviews) {
      p.rating = data.rating;
      p.reviews = data.reviews;
    }
    p.lastCrawled = data.crawledAt;
    return p;
  };
  if (window.SIMRACING_DATA.hero) merge(window.SIMRACING_DATA.hero);
  window.SIMRACING_DATA.products.forEach(merge);
  console.log(`[live] ${live.okCount} Produkte aktualisiert · zuletzt: ${live.generatedAt}`);
};
