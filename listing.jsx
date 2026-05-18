// SimRaceHub Listing — voll funktional, mit echten Affiliate-CTAs
// Daten kommen aus products.js (window.SIMRACING_DATA + bestShop/affiliateUrl helpers)

const Listing = () => {
  const { categories, products, hero } = window.SIMRACING_DATA;
  const [activeCat, setActiveCat] = React.useState("all");
  const [activeBudget, setActiveBudget] = React.useState("alle");
  const [activePlatforms, setActivePlatforms] = React.useState(new Set());
  const [activeView, setActiveView] = React.useState("kuratiert");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [openShopFor, setOpenShopFor] = React.useState(null);
  const [favorites, setFavorites] = React.useState(new Set());
  const [compare, setCompare] = React.useState(new Set());

  // Filter logic
  const filtered = React.useMemo(() => {
    return products.filter(p => {
      if (activeCat !== "all" && p.category !== activeCat) return false;
      const best = window.bestShop(p);
      if (activeBudget !== "alle" && best) {
        const ranges = { "< 200 €":[0,200], "200–500 €":[200,500], "500–1000 €":[500,1000], "1000+ €":[1000,99999] };
        const [lo,hi] = ranges[activeBudget] || [0,99999];
        if (best.price < lo || best.price >= hi) return false;
      }
      if (activePlatforms.size > 0) {
        if (!p.platforms.some(pl => activePlatforms.has(pl))) return false;
      }
      if (searchQuery && !(p.name + " " + p.brand + " " + p.categoryLabel).toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeCat, activeBudget, activePlatforms, searchQuery, products]);

  const togglePlatform = (p) => {
    setActivePlatforms(prev => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });
  };
  const toggleFav = (id) => setFavorites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleCompare = (id) => setCompare(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const heroBest = window.bestShop(hero);
  const heroBestUrl = window.affiliateUrl(heroBest);

  // Close shop popover on outside click
  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest("[data-shoplist]") && !e.target.closest("[data-shoptrigger]")) {
        setOpenShopFor(null);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="vb-root" style={{ background:"var(--bg)", color:"var(--text)", minHeight:"100vh", fontFamily:"var(--sans)" }}>
      <style>{`
        .vb-root { --bg:#0a0a0a; --panel:#111111; --panel-2:#181818; --line:rgba(255,255,255,0.07); --line-2:rgba(255,255,255,0.16); --text:#fafafa; --text-2:#a0a0a0; --text-3:#5e5e5e; --accent:var(--accent-color, #ff2d2d); --sans:'Inter',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace; --display:'Barlow Condensed',sans-serif; }
        .vb-root *, .vb-root *::before, .vb-root *::after { box-sizing: border-box; }
        .vb-h { font-family: var(--display); font-weight:700; line-height:0.95; text-transform:uppercase; letter-spacing:-0.005em; }
        .vb-mono { font-family: var(--mono); }
        .vb-btn { display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 16px; border:1px solid var(--line-2); background:transparent; color:var(--text); font-family:var(--mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition: all .15s; text-decoration:none; }
        .vb-btn:hover { background:var(--panel-2); border-color:var(--accent); }
        .vb-btn-primary { background:var(--accent); color:#0a0a0a; border-color:var(--accent); font-weight:600; }
        .vb-btn-primary:hover { filter:brightness(1.1); }
        .vb-btn:disabled, .vb-btn[aria-disabled="true"] { opacity:.4; cursor:not-allowed; }
        .vb-pill { display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:transparent; border:1px solid var(--line); color:var(--text-2); font-family:var(--mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition: all .12s; white-space:nowrap; }
        .vb-pill:hover { color:var(--text); border-color:var(--line-2); }
        .vb-pill.active { background:var(--text); color:#0a0a0a; border-color:var(--text); font-weight:600; }
        .vb-pill.active.accent { background:var(--accent); border-color:var(--accent); }
        .vb-card { background:var(--panel); border:1px solid var(--line); position:relative; transition:all .2s; display:flex; flex-direction:column; overflow:visible; }
        .vb-card:hover { border-color:var(--accent); transform:translateY(-3px); }
        .vb-card .ribbon { position:absolute; top:14px; left:0; background:var(--accent); color:#0a0a0a; padding:5px 12px; font-family:var(--mono); font-size:10px; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; z-index:2; }
        .vb-spec { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid var(--line); font-size:12px; }
        .vb-spec:last-child { border-bottom:none; }
        .vb-shoplist { position:absolute; top:calc(100% + 4px); left:0; right:0; background:#0a0a0a; border:1px solid var(--accent); z-index:50; padding:0; box-shadow: 0 8px 24px rgba(0,0,0,.6); }
        .vb-shoplist .row { display:flex; justify-content:space-between; align-items:center; padding:10px 14px; border-bottom:1px solid var(--line); text-decoration:none; color:var(--text); transition: background .12s; }
        .vb-shoplist .row:last-child { border-bottom:none; }
        .vb-shoplist .row:hover { background: rgba(255,255,255,.04); }
        .vb-shoplist .row[aria-disabled="true"] { opacity:.45; pointer-events:none; }
        .vb-input { height:38px; padding:0 14px 0 36px; background:var(--panel); border:1px solid var(--line); color:var(--text); font-family:var(--sans); font-size:13px; width:100%; }
        .vb-input:focus { outline:none; border-color:var(--accent); }
      `}</style>

      {/* Top utility — Disclosure */}
      <div style={{ background:"#000", borderBottom:"1px solid var(--line)", padding:"7px 40px", display:"flex", justifyContent:"space-between", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase" }}>
        <span><LiveStatusBadge /></span>
        <span style={{ color:"var(--text-2)" }}>* Werbung · Affiliate-Links · Wir erhalten ggf. Provision</span>
        <span>DE · EUR · Versand DE/AT/CH</span>
      </div>

      {/* Header */}
      <header style={{ padding:"20px 40px", display:"flex", alignItems:"center", gap:36, borderBottom:"1px solid var(--line)" }}>
        <div className="vb-h" style={{ fontSize:26, display:"flex", alignItems:"center", gap:12 }}>
          <svg width="34" height="22" viewBox="0 0 34 22"><path d="M0 22 L8 0 L18 0 L10 22 Z" fill="var(--accent)" /><path d="M14 22 L22 0 L32 0 L24 22 Z" fill="var(--text)" /></svg>
          SIM<span style={{ color:"var(--accent)" }}>:</span>RACEHUB
        </div>
        <nav style={{ display:"flex", gap:28, fontSize:13, color:"var(--text-2)" }}>
          <a href="#produkte" style={{ color:"var(--text)", textDecoration:"none" }}>Alle Produkte</a>
          <a onClick={()=>window.openFeature('bestof')} style={{ color:"var(--text-2)", textDecoration:"none", cursor:"pointer" }}>Best of 2026</a>
          <a onClick={()=>window.openFeature('quiz')} style={{ color:"var(--text-2)", textDecoration:"none", cursor:"pointer" }}>Kaufberater</a>
          <a onClick={()=>window.openFeature('compare', { ids: compare })} style={{ color:"var(--text-2)", textDecoration:"none", cursor:"pointer" }}>Vergleich {compare.size>0 && <span style={{color:"var(--accent)"}}>· {compare.size}</span>}</a>
          <a href="#magazin" style={{ color:"var(--text-2)", textDecoration:"none" }}>Magazin</a>
        </nav>
        <div style={{ flex:1, maxWidth:340, marginLeft:"auto", position:"relative" }}>
          <input className="vb-input" placeholder="Direct Drive unter 500€..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" style={{position:"absolute", left:14, top:12, pointerEvents:"none"}}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>
        </div>
        <button onClick={()=>window.openFeature('quiz')} className="vb-btn vb-btn-primary"><Chevron /> Quiz starten</button>
      </header>

      {/* Hero */}
      <section style={{ padding:"40px 40px 30px", display:"grid", gridTemplateColumns:"1.05fr 1fr", gap:48, alignItems:"center", borderBottom:"1px solid var(--line)" }}>
        <div>
          <div className="vb-mono" style={{ fontSize:11, letterSpacing:"0.22em", color:"var(--accent)", textTransform:"uppercase", marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ width:24, height:1, background:"var(--accent)" }} />
            EDITOR'S PICK · {hero.badge}
          </div>
          <h1 className="vb-h" style={{ fontSize:84, margin:0, marginBottom:18 }}>
            {hero.name.split(" ").slice(0,2).join(" ")}<br/>
            <span style={{ color:"var(--accent)" }}>{hero.name.split(" ").slice(2).join(" ")}</span>
          </h1>
          <p style={{ margin:0, marginBottom:24, fontSize:15, color:"var(--text-2)", maxWidth:480, lineHeight:1.6 }}>
            {hero.blurb}
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, auto)", gap:32, marginBottom:32 }}>
            {hero.specs.map(([k,v])=>(
              <div key={k}>
                <div className="vb-mono" style={{ fontSize:10, color:"var(--text-3)", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:6 }}>{k}</div>
                <div className="vb-h" style={{ fontSize:24 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:18, marginBottom:24 }}>
            <div>
              <div className="vb-mono" style={{ fontSize:10, color:"var(--text-3)", letterSpacing:"0.14em", textTransform:"uppercase" }}>
                Bestpreis · {hero.shops.length} Shops · bei <span style={{color:"var(--text-2)"}}>{heroBest?.name}</span>
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:14 }}>
                <span className="vb-h" style={{ fontSize:42, color:"var(--accent)" }}>{fmtPrice(heroBest?.price || 0)}</span>
                {hero.shops.length > 1 && <span style={{ fontFamily:"var(--mono)", color:"var(--text-3)", fontSize:13 }}>bis {fmtPrice(Math.max(...hero.shops.map(s=>s.price)))}</span>}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, position:"relative" }}>
            <ShopCTA shop={heroBest} primary size="lg">Zum Bestpreis</ShopCTA>
            <button data-shoptrigger onClick={(e)=>{e.stopPropagation(); setOpenShopFor(openShopFor==="hero"?null:"hero");}} className="vb-btn" style={{ height:48 }}>
              Alle {hero.shops.length} Shops <Chevron dir={openShopFor==="hero"?"down":"right"} />
            </button>
            <button onClick={()=>toggleCompare(hero.id)} className="vb-btn" style={{ height:48, width:48, padding:0, justifyContent:"center", borderColor: compare.has(hero.id)?"var(--accent)":"var(--line-2)", color: compare.has(hero.id)?"var(--accent)":"var(--text)" }}>⚖</button>
            {openShopFor==="hero" && <ShopList product={hero} />}
          </div>
        </div>

        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", top:-20, right:-20, fontFamily:"var(--display)", fontSize:240, lineHeight:0.8, color:"transparent", WebkitTextStroke:"1px rgba(255,45,45,0.18)", fontWeight:700, pointerEvents:"none", zIndex:0 }}>01</div>
          <div style={{ position:"relative", zIndex:1, border:"1px solid var(--line-2)" }}>
            <ProductImage category={hero.category} label={hero.categoryLabel} height={420} src={hero.image} />
          </div>
          <div style={{ position:"absolute", bottom:-14, left:-14, background:"var(--bg)", padding:"12px 16px", border:"1px solid var(--accent)", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:6, height:6, background:"var(--accent)", borderRadius:"50%" }} />
            <span className="vb-mono" style={{ fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase" }}>auf lager · sofort lieferbar</span>
          </div>
        </div>
      </section>

      {/* Sticky filter bar */}
      <section style={{ padding:"24px 40px", borderBottom:"1px solid var(--line)", position:"sticky", top:0, background:"var(--bg)", zIndex:5 }}>
        <div style={{ display:"flex", flexWrap:"wrap", gap:24, alignItems:"flex-start" }}>
          <FilterGroup label="Kategorie">
            <button onClick={()=>setActiveCat("all")} className={`vb-pill ${activeCat==="all"?"active":""}`}>Alle ({products.length})</button>
            {categories.slice(0,6).map(c=>{
              const n = products.filter(p => p.category === c.id).length;
              return (
                <button key={c.id} onClick={()=>setActiveCat(c.id)} className={`vb-pill ${activeCat===c.id?"active":""}`} disabled={n===0} style={n===0?{opacity:.4}:{}}>
                  <CatIcon name={c.icon} size={12} /> {c.label} <span style={{opacity:.55}}>{n}</span>
                </button>
              );
            })}
          </FilterGroup>

          <FilterGroup label="Budget">
            {["alle","< 200 €","200–500 €","500–1000 €","1000+ €"].map(b=>(
              <button key={b} onClick={()=>setActiveBudget(b)} className={`vb-pill ${activeBudget===b?"active accent":""}`}>{b}</button>
            ))}
          </FilterGroup>

          <FilterGroup label="Plattform">
            {["PC","Xbox","PS5"].map(p=>(
              <button key={p} onClick={()=>togglePlatform(p)} className={`vb-pill ${activePlatforms.has(p)?"active":""}`}>{p}</button>
            ))}
          </FilterGroup>

          <div style={{ marginLeft:"auto", display:"flex", gap:10, alignItems:"center" }}>
            {[["Kuratiert","kuratiert"],["Bestseller","bestseller"],["Neu","neu"]].map(([l,v])=>(
              <button key={v} onClick={()=>setActiveView(v)} className={`vb-pill ${activeView===v?"active":""}`}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section id="produkte" style={{ padding:"40px 40px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:28 }}>
          <div>
            <div className="vb-mono" style={{ fontSize:10, letterSpacing:"0.2em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:6 }}>// TOP-PICKS · Mai 2026</div>
            <h2 className="vb-h" style={{ fontSize:38, margin:0 }}>
              {filtered.length} Produkte. Handverlesen.
              {activeCat!=="all" && <span style={{color:"var(--accent)"}}> · {categories.find(c=>c.id===activeCat)?.label}</span>}
            </h2>
          </div>
          <a onClick={()=>window.openFeature('compare', { ids: compare })} className="vb-mono" style={{ fontSize:11, color:"var(--text-2)", textDecoration:"none", letterSpacing:"0.14em", textTransform:"uppercase", display:"inline-flex", alignItems:"center", gap:8, cursor:"pointer" }}>
            Vollständiger Vergleich <Chevron />
          </a>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding:"60px", textAlign:"center", border:"1px dashed var(--line)", color:"var(--text-2)" }}>
            <div className="vb-mono" style={{ fontSize:11, letterSpacing:"0.18em", color:"var(--accent)", textTransform:"uppercase", marginBottom:12 }}>// KEINE TREFFER</div>
            <p style={{ margin:0, marginBottom:18 }}>Keine Produkte passen zu deinen Filtern.</p>
            <button onClick={()=>{setActiveCat("all"); setActiveBudget("alle"); setActivePlatforms(new Set()); setSearchQuery("");}} className="vb-btn">Filter zurücksetzen</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:14 }}>
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                p={p}
                rank={i+2}
                isOpen={openShopFor===p.id}
                onToggleShops={()=>setOpenShopFor(openShopFor===p.id?null:p.id)}
                isFav={favorites.has(p.id)}
                onToggleFav={()=>toggleFav(p.id)}
                isCompare={compare.has(p.id)}
                onToggleCompare={()=>toggleCompare(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Buying guide CTA strip */}
      <section id="kaufberater" style={{ padding:"40px", display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16, borderTop:"1px solid var(--line)" }}>
        {[
          { t:"Kaufberater", d:"7 Fragen, klare Empfehlung. Perfekt für den ersten Kauf.", icon:<CatIcon name="wheelbase" size={22} />, action:()=>window.openFeature('quiz') },
          { t:"Vergleichen", d:"Bis zu 4 Produkte Side-by-Side. Specs, Preise, Reviews.", icon:<CatIcon name="accessory" size={22} />, action:()=>window.openFeature('compare', { ids: compare }) },
          { t:"Best-of 2026", d:"Unsere getesteten Top-Picks pro Kategorie und Budget.", icon:<CatIcon name="bundle" size={22} />, action:()=>window.openFeature('bestof') },
        ].map(c=>(
          <div key={c.t} onClick={c.action} style={{ background:"var(--panel)", border:"1px solid var(--line)", padding:"28px 24px", display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:160, position:"relative", cursor:"pointer" }}>
            <div>
              <div style={{ marginBottom:14, color:"var(--accent)" }}>{c.icon}</div>
              <h3 className="vb-h" style={{ fontSize:24, margin:0, marginBottom:8 }}>{c.t}</h3>
              <p style={{ margin:0, fontSize:13, color:"var(--text-2)", lineHeight:1.5 }}>{c.d}</p>
            </div>
            <div className="vb-mono" style={{ fontSize:10, letterSpacing:"0.18em", color:"var(--accent)", textTransform:"uppercase", marginTop:18, display:"flex", alignItems:"center", gap:8 }}>
              Jetzt starten <Chevron />
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer style={{ padding:"32px 40px 40px", borderTop:"1px solid var(--line)", background:"#080808" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:32, marginBottom:32 }}>
          <div>
            <div className="vb-h" style={{ fontSize:20, marginBottom:10 }}>SIM<span style={{color:"var(--accent)"}}>:</span>RACEHUB</div>
            <p style={{ fontSize:12, color:"var(--text-2)", margin:0, lineHeight:1.6, maxWidth:380 }}>
              Unabhängige Kaufberatung für Sim Racing. Wir testen Direct-Drive-Wheelbases, Pedale, Cockpits und Zubehör. Wenn du über unsere Links kaufst, erhalten wir eine kleine Provision — für dich ändert sich am Preis nichts.
            </p>
          </div>
          {[
            ["Produkte", ["Wheelbases","Lenkräder","Pedale","Cockpits","Bundles"]],
            ["Service",  ["Kaufberater","Vergleich","Best of 2026","Magazin"]],
            ["Rechtlich",["Impressum","Datenschutz","Affiliate-Disclaimer","AGB"]],
          ].map(([h,items])=>(
            <div key={h}>
              <div className="vb-mono" style={{ fontSize:10, letterSpacing:"0.18em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:14 }}>{h}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {items.map(i => <a key={i} href="#" style={{ fontSize:13, color:"var(--text-2)", textDecoration:"none" }}>{i}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ paddingTop:20, borderTop:"1px solid var(--line)", display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-3)", fontFamily:"var(--mono)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          <span>© 2026 SimRaceHub · Demo-Site</span>
          <span>Mit ♥ in Deutschland</span>
        </div>
      </footer>
    </div>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────
function LiveStatusBadge() {
  const [live, setLive] = React.useState(null);
  React.useEffect(() => {
    const p = window.__liveDataReady;
    if (p && typeof p.then === "function") p.then(setLive);
  }, []);

  if (!live) {
    // Datei nicht vorhanden → Crawler noch nicht gelaufen
    return <><span style={{ color:"#666" }}>○</span> Statische Daten · Crawler nicht ausgeführt</>;
  }
  // Zeitstempel relativ formatieren
  const minsAgo = Math.max(1, Math.round((Date.now() - new Date(live.generatedAt).getTime()) / 60000));
  let ago;
  if (minsAgo < 60) ago = `${minsAgo} Min.`;
  else if (minsAgo < 1440) ago = `${Math.round(minsAgo/60)} h`;
  else ago = `${Math.round(minsAgo/1440)} T.`;
  const total = live.okCount + live.failCount;
  const failPart = live.failCount > 0 ? ` · ${live.failCount} Fehler` : "";
  return <><span style={{ color:"var(--accent)" }}>●</span> Live · {live.okCount}/{total} Quellen gecrawlt{failPart} · vor {ago}</>;
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <div className="vb-mono" style={{ fontSize:9, letterSpacing:"0.2em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{children}</div>
    </div>
  );
}

function ShopCTA({ shop, primary, size, children }) {
  const url = window.affiliateUrl(shop);
  const disabled = !url;
  const baseStyle = size === "lg" ? { height:48, padding:"0 24px", fontSize:12 } : {};
  return (
    <a
      href={url || "#"}
      onClick={(e)=>{ if(disabled) e.preventDefault(); }}
      target={url ? "_blank" : undefined}
      rel="sponsored noopener"
      className={`vb-btn ${primary?"vb-btn-primary":""}`}
      aria-disabled={disabled}
      style={baseStyle}
      title={disabled ? "Noch kein Affiliate-Link in products.js eingetragen" : undefined}
    >
      {children}{!disabled && <Chevron />}
    </a>
  );
}

function ShopList({ product }) {
  const sorted = [...product.shops].sort((a,b) => a.price - b.price);
  const lowest = sorted[0]?.price;
  return (
    <div className="vb-shoplist" data-shoplist>
      <div style={{ padding:"10px 14px", borderBottom:"1px solid var(--accent)", background:"rgba(255,45,45,0.08)" }}>
        <div className="vb-mono" style={{ fontSize:9, letterSpacing:"0.18em", color:"var(--accent)", textTransform:"uppercase" }}>// Preisvergleich · {product.shops.length} Shops</div>
      </div>
      {sorted.map((s,i)=>{
        const url = window.affiliateUrl(s);
        return (
          <a key={s.name} href={url || "#"} target={url?"_blank":undefined} rel="sponsored noopener" onClick={(e)=>{if(!url) e.preventDefault();}} aria-disabled={!url} className="row">
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{s.name}</span>
                {s.badge && <span className="vb-mono" style={{ fontSize:8, padding:"2px 5px", border:"1px solid var(--line-2)", color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>{s.badge}</span>}
                {s.price === lowest && <span className="vb-mono" style={{ fontSize:8, padding:"2px 5px", background:"var(--accent)", color:"#0a0a0a", letterSpacing:"0.1em", fontWeight:700, textTransform:"uppercase" }}>Bestpreis</span>}
                {!s.inStock && <span className="vb-mono" style={{ fontSize:8, padding:"2px 5px", border:"1px solid var(--line)", color:"var(--text-3)", textTransform:"uppercase" }}>Nicht vorrätig</span>}
                {!url && <span className="vb-mono" style={{ fontSize:8, padding:"2px 5px", color:"var(--accent)", textTransform:"uppercase", letterSpacing:"0.1em" }}>● Link einfügen</span>}
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span className="vb-h" style={{ fontSize:18, color: s.price===lowest?"var(--accent)":"var(--text)" }}>{fmtPrice(s.price)}</span>
              <Chevron />
            </div>
          </a>
        );
      })}
    </div>
  );
}

function ProductCard({ p, rank, isOpen, onToggleShops, isFav, onToggleFav, isCompare, onToggleCompare }) {
  const best = window.bestShop(p);
  return (
    <div className="vb-card">
      {p.tag && <div className="ribbon">{p.tag}</div>}
      <div style={{ position:"relative" }}>
        <ProductImage category={p.category} label={p.categoryLabel} height={180} src={p.image} />
        <div style={{ position:"absolute", bottom:10, right:10, background:"#0a0a0a", padding:"4px 8px", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.14em", color:"var(--text-2)", border:"1px solid var(--line-2)" }}>
          #{String(rank).padStart(2,"0")}
        </div>
        <button onClick={onToggleFav} title={isFav?"Aus Favoriten":"Zu Favoriten"} style={{ position:"absolute", top:10, right:10, width:30, height:30, background:"rgba(0,0,0,0.7)", border:"1px solid var(--line)", color: isFav?"var(--accent)":"var(--text-2)", cursor:"pointer", fontSize:14 }}>
          {isFav ? "♥" : "♡"}
        </button>
      </div>

      <div style={{ padding:"16px 16px 18px", flex:1, display:"flex", flexDirection:"column" }}>
        <div className="vb-mono" style={{ fontSize:9, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:6 }}>
          {p.brand} · {p.categoryLabel.split("·")[1]?.trim() || p.category}
        </div>
        <h3 className="vb-h" style={{ fontSize:20, margin:0, marginBottom:8 }}>{p.name}</h3>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, fontSize:11 }}>
          <Stars value={p.rating} size={11} showValue={false} />
          <span className="vb-mono" style={{ fontSize:10, color:"var(--text-3)" }}>{p.rating} ({p.reviews})</span>
        </div>

        <div style={{ background:"#0c0c0c", padding:"6px 12px", marginBottom:12, border:"1px solid var(--line)" }}>
          <div className="vb-spec">
            <span style={{ color:"var(--text-3)", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase" }}>Best für</span>
            <span style={{ color:"var(--accent)", fontFamily:"var(--mono)", fontSize:11 }}>{p.bestFor}</span>
          </div>
        </div>

        <div style={{ display:"flex", gap:5, marginBottom:14, flexWrap:"wrap" }}>
          {p.platforms.map(pl => <PlatformChip key={pl} p={pl} />)}
        </div>

        <div style={{ marginTop:"auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10 }}>
            <div>
              <div className="vb-mono" style={{ fontSize:9, color:"var(--text-3)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                ab · {p.shops.length} Shop{p.shops.length>1?"s":""}
              </div>
              <div className="vb-h" style={{ fontSize:24, color:"var(--text)" }}>{fmtPrice(best?.price || 0)}</div>
            </div>
            <button onClick={onToggleCompare} title="Zum Vergleich" style={{ width:32, height:32, background: isCompare?"var(--accent)":"transparent", color: isCompare?"#0a0a0a":"var(--text-2)", border:`1px solid ${isCompare?"var(--accent)":"var(--line-2)"}`, cursor:"pointer", fontSize:14 }}>⚖</button>
          </div>

          <div style={{ display:"flex", gap:6, position:"relative" }}>
            <ShopCTA shop={best} primary>Zum Bestpreis</ShopCTA>
            {p.shops.length > 1 && (
              <button data-shoptrigger onClick={(e)=>{e.stopPropagation(); onToggleShops();}} className="vb-btn" style={{ height:38, width:38, padding:0, justifyContent:"center" }} title={`${p.shops.length} Shops vergleichen`}>
                <Chevron dir={isOpen?"up":"down"} />
              </button>
            )}
            {isOpen && <ShopList product={p} />}
          </div>
        </div>
      </div>
    </div>
  );
}

window.Listing = Listing;
