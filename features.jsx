// Kaufberater-Quiz · Produktvergleich · Best-of 2026
// Wird über window.openFeature(name, payload) geöffnet.

(function() {
  // ─── State store ────────────────────────────────────────────────────────
  let listeners = new Set();
  let state = { view: null, payload: null };
  function setState(next) { state = { ...state, ...next }; listeners.forEach(l => l()); }
  window.openFeature = (view, payload = null) => setState({ view, payload });
  window.closeFeature = () => setState({ view: null, payload: null });
  window.useFeatureState = function() {
    const [, force] = React.useReducer(x => x+1, 0);
    React.useEffect(() => { listeners.add(force); return () => listeners.delete(force); }, []);
    return state;
  };

  // ─── Quiz definition ────────────────────────────────────────────────────
  const QUIZ = [
    {
      id: "goal", label: "Was suchst du?",
      sub: "Wir empfehlen passende Produkte aus genau dieser Kategorie.",
      options: [
        { v:"komplett",  l:"Komplett-Setup",      d:"Base + Wheel + Pedale, alles aus einer Hand" },
        { v:"wheelbase", l:"Nur Wheelbase",       d:"Du hast schon Lenkrad und Pedale" },
        { v:"wheel",     l:"Nur Lenkrad",         d:"Andere Base, neues Wheel drauf" },
        { v:"pedale",    l:"Nur Pedale",          d:"Upgrade auf Loadcell o.ä." },
        { v:"cockpit",   l:"Cockpit / Sitz",      d:"Stabile Basis fürs Setup" },
      ],
    },
    {
      id: "platform", label: "Welche Plattform?",
      sub: "Bestimmt welche Hardware kompatibel ist — wichtig bei Konsolen.",
      options: [
        { v:"PC",       l:"PC",        d:"Volle Auswahl, alle Marken" },
        { v:"Xbox",     l:"Xbox",      d:"Series X/S oder One" },
        { v:"PS5",      l:"PlayStation 5", d:"PS-Lizenz nötig" },
        { v:"mehrere",  l:"Mehrere",   d:"Will plattformübergreifend nutzen" },
      ],
    },
    {
      id: "budget", label: "Wie viel willst du ausgeben?",
      sub: "Inkl. ggf. Lenkrad und Pedale wenn Komplett-Setup gewählt.",
      options: [
        { v:"unter300",  l:"unter 300 €",   d:"Einsteiger-Tier" },
        { v:"300-700",   l:"300 – 700 €",   d:"Sweet Spot für Hobby-Racer" },
        { v:"700-1500",  l:"700 – 1.500 €", d:"Ernsthaftes Setup" },
        { v:"1500plus",  l:"1.500 € +",     d:"Pro / E-Sport" },
      ],
    },
    {
      id: "experience", label: "Wie viel Erfahrung hast du?",
      sub: "Ehrlich antworten — beeinflusst, wie viel Drehmoment Sinn ergibt.",
      options: [
        { v:"erstkauf", l:"Erstkauf",       d:"Noch nie ein Sim-Wheel benutzt" },
        { v:"hobby",    l:"Schon was da",   d:"Einsteiger-Wheel besessen, will upgraden" },
        { v:"pro",      l:"Lange dabei",    d:"Setup-erfahren, weiß was ich will" },
      ],
    },
    {
      id: "sim", label: "Was fährst du am meisten?",
      sub: "Bestimmt Lenkrad-Form und FFB-Charakteristik.",
      options: [
        { v:"gt",      l:"GT / ACC",        d:"Assetto Corsa Competizione, iRacing GT3" },
        { v:"formula", l:"Formel",          d:"F1, Open-Wheel" },
        { v:"rally",   l:"Rally",           d:"Dirt Rally, EA WRC" },
        { v:"mix",     l:"Querbeet",        d:"Alles ein bisschen" },
      ],
    },
    {
      id: "location", label: "Wo soll's stehen?",
      sub: "Klemm-Lösung oder eigenes Rig — macht beim Drehmoment einen Unterschied.",
      options: [
        { v:"desk",     l:"Schreibtisch",    d:"Klemme, abbaubar, ≤ 8 Nm sinnvoll" },
        { v:"rig",      l:"Eigenes Cockpit", d:"Festeingebaut, 12 Nm+ machbar" },
        { v:"livingroom", l:"Wohnzimmer",    d:"Faltbar, Couch-tauglich" },
      ],
    },
    {
      id: "loadcell", label: "Wie wichtig ist eine Loadcell-Bremse?",
      sub: "Größter spürbarer Sprung beim Brems-Feeling. Aber teurer.",
      options: [
        { v:"must",  l:"Must-have",        d:"Konstante Bremszeiten, kompromisslos" },
        { v:"nice",  l:"Wäre schön",       d:"Wenn's ins Budget passt" },
        { v:"egal",  l:"Erstmal egal",     d:"Ich fang klein an" },
      ],
    },
  ];

  // ─── Scoring / recommendation ───────────────────────────────────────────
  function getRecommendations(answers) {
    const products = [...window.SIMRACING_DATA.products, window.SIMRACING_DATA.hero];

    const budgetMax = { unter300:300, "300-700":700, "700-1500":1500, "1500plus":99999 }[answers.budget] || 99999;
    const categoryMap = {
      komplett:  ["bundle","wheelbase"],
      wheelbase: ["wheelbase"],
      wheel:     ["wheel"],
      pedale:    ["pedals"],
      cockpit:   ["cockpit","seat"],
    };
    const wantedCats = categoryMap[answers.goal] || [];

    let candidates = products.filter(p => {
      if (wantedCats.length && !wantedCats.includes(p.category)) return false;
      const best = window.bestShop(p);
      if (best && best.price > budgetMax * 1.1) return false; // 10% Toleranz
      if (answers.platform && answers.platform !== "mehrere") {
        const pl = answers.platform;
        if (!(p.platforms.includes(pl) || p.platforms.includes("Universal"))) return false;
      }
      return true;
    });

    candidates = candidates.map(p => {
      let score = p.rating * 10;
      const text = (p.name + " " + p.bestFor + " " + p.specs.flat().join(" ")).toLowerCase();
      const best = window.bestShop(p);

      // Erfahrung
      if (answers.experience === "erstkauf") {
        if (text.includes("einsteiger") || p.tag === "Bestseller" || p.tag === "Beliebteste Beratung") score += 30;
        if (best && best.price > budgetMax * 0.85) score -= 10; // lieber günstiger für Anfänger
      }
      if (answers.experience === "pro") {
        if (p.tag === "High-End" || p.tag === "Premium-Tipp" || p.tag === "Editor's Pick") score += 25;
      }
      if (answers.experience === "hobby") {
        if (p.tag === "Editor's Pick" || p.tag === "Empfohlen") score += 20;
      }

      // Sim
      if (answers.sim === "rally" && text.includes("rally")) score += 25;
      if (answers.sim === "formula" && (text.includes("formula") || text.includes("open-wheel"))) score += 25;
      if (answers.sim === "gt" && (text.includes("gt") || text.includes("endurance"))) score += 25;

      // Loadcell
      const hasLoadcell = text.includes("loadcell");
      if (answers.loadcell === "must" && hasLoadcell && p.category === "pedals") score += 50;
      if (answers.loadcell === "must" && p.category === "pedals" && !hasLoadcell) score -= 30;

      // Location → torque
      const torqueSpec = p.specs.find(s => /drehmoment|torque/i.test(s[0]));
      if (torqueSpec) {
        const nm = parseInt(torqueSpec[1]) || 0;
        if (answers.location === "desk" && nm > 10) score -= 15;
        if (answers.location === "rig"  && nm >= 12) score += 15;
      }

      // Editor's Pick bias
      if (p.tag === "Editor's Pick") score += 10;

      return { ...p, _score: score };
    });

    candidates.sort((a,b) => b._score - a._score);
    return candidates.slice(0, 3);
  }

  // ─── Quiz Component ─────────────────────────────────────────────────────
  function Quiz({ onClose }) {
    const [step, setStep] = React.useState(0);
    const [answers, setAnswers] = React.useState({});
    const [done, setDone] = React.useState(false);

    const q = QUIZ[step];
    const progress = ((step + (done?1:0)) / QUIZ.length) * 100;

    const choose = (val) => {
      const next = { ...answers, [q.id]: val };
      setAnswers(next);
      if (step === QUIZ.length - 1) {
        setTimeout(() => setDone(true), 200);
      } else {
        setTimeout(() => setStep(step + 1), 150);
      }
    };

    if (done) {
      const recs = getRecommendations(answers);
      return (
        <FeatureShell title="Deine Empfehlung" subtitle={`Basierend auf ${Object.keys(answers).length} Antworten · ${recs.length} Treffer`} onClose={onClose}>
          <div style={{ padding:"32px 48px 48px", maxWidth:1200, margin:"0 auto" }}>
            <div style={{ marginBottom:32, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
              <div>
                <div className="fx-mono" style={{ fontSize:11, letterSpacing:"0.18em", color:"var(--accent)", textTransform:"uppercase", marginBottom:8 }}>// Match-Score · höchstens für dich</div>
                <h2 className="fx-h" style={{ fontSize:48, margin:0 }}>{recs.length === 0 ? "Hmm, kein klarer Treffer." : "Das passt zu dir."}</h2>
              </div>
              <button className="fx-btn" onClick={() => { setStep(0); setAnswers({}); setDone(false); }}>↻ Neu starten</button>
            </div>

            {recs.length === 0 ? (
              <div style={{ padding:60, border:"1px dashed var(--line)", textAlign:"center", color:"var(--text-2)" }}>
                <p>Mit deiner Kombination finden wir gerade nichts. Versuch's mit höherem Budget oder einer anderen Plattform.</p>
              </div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:`repeat(${recs.length},1fr)`, gap:16 }}>
                {recs.map((p, i) => <RecCard key={p.id} p={p} rank={i+1} answers={answers} />)}
              </div>
            )}

            <AnswerSummary answers={answers} onEdit={(idx) => { setDone(false); setStep(idx); }} />
          </div>
        </FeatureShell>
      );
    }

    return (
      <FeatureShell title="Kaufberater" subtitle={`Frage ${step + 1} von ${QUIZ.length}`} onClose={onClose} progress={progress}>
        <div style={{ padding:"40px 48px 48px", maxWidth:920, margin:"0 auto" }}>
          <div className="fx-mono" style={{ fontSize:11, letterSpacing:"0.2em", color:"var(--accent)", textTransform:"uppercase", marginBottom:14 }}>
            {String(step+1).padStart(2,"0")} / {String(QUIZ.length).padStart(2,"0")}
          </div>
          <h2 className="fx-h" style={{ fontSize:52, margin:0, marginBottom:14, lineHeight:1 }}>{q.label}</h2>
          <p style={{ margin:0, marginBottom:36, color:"var(--text-2)", fontSize:15, maxWidth:620 }}>{q.sub}</p>

          <div style={{ display:"grid", gridTemplateColumns: q.options.length > 4 ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(220px, 1fr))", gap:12, marginBottom:32 }}>
            {q.options.map(opt => (
              <button key={opt.v} onClick={() => choose(opt.v)} className={`fx-option ${answers[q.id]===opt.v?"active":""}`}>
                <div className="fx-h" style={{ fontSize:22, marginBottom:6 }}>{opt.l}</div>
                <div style={{ fontSize:12, color:"var(--text-2)", lineHeight:1.5 }}>{opt.d}</div>
              </button>
            ))}
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:24, borderTop:"1px solid var(--line)" }}>
            <button onClick={() => step > 0 && setStep(step-1)} className="fx-btn" disabled={step===0} style={step===0?{opacity:.4}:{}}>← Zurück</button>
            <div style={{ display:"flex", gap:6 }}>
              {QUIZ.map((_, i) => (
                <div key={i} style={{ width:20, height:3, background: i<=step?"var(--accent)":"var(--line)" }} />
              ))}
            </div>
            <button onClick={() => answers[q.id] && (step === QUIZ.length-1 ? setDone(true) : setStep(step+1))} className="fx-btn fx-btn-primary" disabled={!answers[q.id]} style={!answers[q.id]?{opacity:.4, cursor:"not-allowed"}:{}}>
              {step === QUIZ.length - 1 ? "Empfehlung zeigen" : "Weiter"} →
            </button>
          </div>
        </div>
      </FeatureShell>
    );
  }

  function RecCard({ p, rank, answers }) {
    const best = window.bestShop(p);
    const reasons = buildReasons(p, answers);
    return (
      <div style={{ background:"var(--panel)", border: rank===1?"1px solid var(--accent)":"1px solid var(--line)", padding:0, position:"relative", display:"flex", flexDirection:"column" }}>
        <div style={{ position:"absolute", top:14, left:14, padding:"4px 10px", background: rank===1?"var(--accent)":"var(--panel-2)", color: rank===1?"#0a0a0a":"var(--text)", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.18em", fontWeight:700, textTransform:"uppercase", zIndex:2 }}>
          {rank===1 ? "Top Match" : `#${rank}`}
        </div>
        <div style={{ position:"absolute", top:14, right:14, padding:"4px 10px", background:"#0a0a0a", border:"1px solid var(--line-2)", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.14em", color:"var(--accent)", zIndex:2 }}>
          {p._score.toFixed(0)} pkt
        </div>
        <ProductImage category={p.category} label={p.categoryLabel} height={200} src={p.image} />
        <div style={{ padding:"18px 20px 22px", flex:1, display:"flex", flexDirection:"column" }}>
          <div className="fx-mono" style={{ fontSize:9, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:6 }}>{p.brand}</div>
          <h3 className="fx-h" style={{ fontSize:24, margin:0, marginBottom:10 }}>{p.name}</h3>
          <Stars value={p.rating} size={12} />

          <div style={{ marginTop:14, marginBottom:14 }}>
            <div className="fx-mono" style={{ fontSize:9, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:8 }}>Warum für dich</div>
            <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:6 }}>
              {reasons.map((r,i)=>(
                <li key={i} style={{ display:"flex", gap:10, fontSize:12, color:"var(--text-2)", lineHeight:1.5 }}>
                  <span style={{ color:"var(--accent)" }}>●</span>{r}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop:"auto", paddingTop:14, borderTop:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
            <div>
              <div className="fx-mono" style={{ fontSize:9, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.14em" }}>ab {p.shops.length} Shops</div>
              <div className="fx-h" style={{ fontSize:28, color: rank===1?"var(--accent)":"var(--text)" }}>{fmtPrice(best?.price || 0)}</div>
            </div>
          </div>
          <a href={window.affiliateUrl(best) || "#"} target="_blank" rel="sponsored noopener" onClick={(e)=>{ if(!window.affiliateUrl(best)) e.preventDefault(); }} className={`fx-btn ${rank===1?"fx-btn-primary":""}`} aria-disabled={!window.affiliateUrl(best)} style={{ width:"100%", justifyContent:"center", height:42 }}>
            Zum Bestpreis · {best?.name} →
          </a>
        </div>
      </div>
    );
  }

  function buildReasons(p, a) {
    const r = [];
    const text = (p.name + " " + p.bestFor + " " + p.specs.flat().join(" ")).toLowerCase();
    if (a.experience === "erstkauf" && (text.includes("einsteiger") || p.tag === "Bestseller" || p.tag === "Beliebteste Beratung")) r.push("Bewährter Einsteiger-Pick");
    if (a.experience === "pro" && (p.tag === "High-End" || p.tag === "Premium-Tipp")) r.push("Premium-Klasse für Erfahrene");
    if (a.loadcell === "must" && text.includes("loadcell")) r.push("Loadcell-Bremse — wie gewünscht");
    if (a.sim === "gt" && (text.includes("gt") || text.includes("endurance"))) r.push("Optimiert für GT3 / Endurance");
    if (a.sim === "rally" && text.includes("rally")) r.push("Stark für Rally / Drift");
    if (a.sim === "formula" && (text.includes("formula") || text.includes("open-wheel"))) r.push("Made for Formel / Open-Wheel");
    if (a.platform && a.platform !== "mehrere" && p.platforms.includes(a.platform)) r.push(`Voll kompatibel mit ${a.platform}`);
    if (p.tag === "Editor's Pick") r.push("Unsere Redaktions-Empfehlung");
    if (r.length === 0) r.push("Solide Bewertungen", "Passt ins Budget");
    return r.slice(0, 4);
  }

  function AnswerSummary({ answers, onEdit }) {
    const labels = {
      goal: "Ziel", platform: "Plattform", budget: "Budget",
      experience: "Erfahrung", sim: "Sim", location: "Aufstellung", loadcell: "Loadcell",
    };
    return (
      <div style={{ marginTop:48, padding:"24px 28px", background:"var(--panel)", border:"1px solid var(--line)" }}>
        <div className="fx-mono" style={{ fontSize:10, letterSpacing:"0.2em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:14 }}>// Deine Antworten</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {QUIZ.map((q, i) => answers[q.id] && (
            <button key={q.id} onClick={()=>onEdit(i)} className="fx-pill" style={{ cursor:"pointer" }}>
              <span style={{ color:"var(--text-3)" }}>{labels[q.id]}:</span> {q.options.find(o=>o.v===answers[q.id])?.l}
              <span style={{ color:"var(--text-3)", marginLeft:6 }}>✎</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Compare Component ──────────────────────────────────────────────────
  function Compare({ ids, onClose }) {
    const all = [...window.SIMRACING_DATA.products, window.SIMRACING_DATA.hero];
    const products = all.filter(p => ids.has(p.id));

    if (products.length === 0) {
      return (
        <FeatureShell title="Vergleich" subtitle="Noch keine Produkte ausgewählt" onClose={onClose}>
          <div style={{ padding:60, textAlign:"center", maxWidth:600, margin:"60px auto" }}>
            <div className="fx-mono" style={{ fontSize:11, letterSpacing:"0.18em", color:"var(--accent)", textTransform:"uppercase", marginBottom:14 }}>// LEER</div>
            <h2 className="fx-h" style={{ fontSize:36, margin:"0 0 12px" }}>Wähle Produkte aus.</h2>
            <p style={{ color:"var(--text-2)", marginBottom:24 }}>Klick auf das ⚖-Icon bei Produkten um sie hier zu vergleichen. Bis zu 4 gleichzeitig.</p>
            <button onClick={onClose} className="fx-btn fx-btn-primary">Zur Liste →</button>
          </div>
        </FeatureShell>
      );
    }

    // Collect all spec keys
    const allSpecKeys = [...new Set(products.flatMap(p => p.specs.map(s => s[0])))];

    return (
      <FeatureShell title="Vergleichen" subtitle={`${products.length} Produkte side-by-side`} onClose={onClose}>
        <div style={{ padding:"32px 48px 48px", overflowX:"auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:`220px repeat(${products.length}, minmax(240px,1fr))`, gap:0, minWidth:"fit-content", border:"1px solid var(--line)" }}>
            {/* Header row */}
            <div style={{ padding:18, background:"var(--panel)", borderRight:"1px solid var(--line)" }}>
              <div className="fx-mono" style={{ fontSize:10, letterSpacing:"0.18em", color:"var(--text-3)", textTransform:"uppercase" }}>// Vergleich</div>
            </div>
            {products.map(p => (
              <div key={p.id} style={{ padding:0, background:"var(--panel)", borderRight:"1px solid var(--line)" }}>
                <ProductImage category={p.category} label={p.categoryLabel} height={140} src={p.image} />
                <div style={{ padding:"14px 16px" }}>
                  <div className="fx-mono" style={{ fontSize:9, letterSpacing:"0.14em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:4 }}>{p.brand}</div>
                  <div className="fx-h" style={{ fontSize:18, marginBottom:6 }}>{p.name}</div>
                  <Stars value={p.rating} size={11} />
                </div>
              </div>
            ))}

            <CompareRow label="Kategorie" values={products.map(p => p.categoryLabel)} />
            <CompareRow label="Bewertung" values={products.map(p => `${p.rating} (${p.reviews})`)} />
            <CompareRow label="Best für" values={products.map(p => p.bestFor)} highlight />
            <CompareRow label="Plattformen" values={products.map(p => p.platforms.join(" · "))} />

            {allSpecKeys.map(k => (
              <CompareRow key={k} label={k} values={products.map(p => {
                const s = p.specs.find(s => s[0] === k);
                return s ? s[1] : "—";
              })} />
            ))}

            <CompareRow label="Bestpreis" values={products.map(p => {
              const best = window.bestShop(p);
              const min = Math.min(...products.map(pp => window.bestShop(pp)?.price || 99999));
              return { v: fmtPrice(best?.price || 0), accent: best?.price === min };
            })} big />
            <CompareRow label="Anzahl Shops" values={products.map(p => `${p.shops.length}`)} />

            {/* CTA row */}
            <div style={{ padding:18, background:"var(--panel)", borderRight:"1px solid var(--line)", borderTop:"1px solid var(--line)" }}>
              <div className="fx-mono" style={{ fontSize:10, letterSpacing:"0.18em", color:"var(--text-3)", textTransform:"uppercase" }}>Aktion</div>
            </div>
            {products.map(p => {
              const best = window.bestShop(p);
              return (
                <div key={p.id} style={{ padding:18, background:"var(--panel)", borderRight:"1px solid var(--line)", borderTop:"1px solid var(--line)" }}>
                  <a href={window.affiliateUrl(best) || "#"} target="_blank" rel="sponsored noopener" onClick={(e)=>{if(!window.affiliateUrl(best))e.preventDefault();}} className="fx-btn fx-btn-primary" aria-disabled={!window.affiliateUrl(best)} style={{ width:"100%", justifyContent:"center" }}>
                    Zum Bestpreis →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </FeatureShell>
    );
  }

  function CompareRow({ label, values, highlight, big }) {
    return (
      <>
        <div style={{ padding:"14px 18px", background:"var(--panel)", borderRight:"1px solid var(--line)", borderTop:"1px solid var(--line)", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.14em", color:"var(--text-3)", textTransform:"uppercase", display:"flex", alignItems:"center" }}>
          {label}
        </div>
        {values.map((v, i) => {
          const isObj = typeof v === "object" && v !== null;
          const text = isObj ? v.v : v;
          const accent = isObj ? v.accent : false;
          return (
            <div key={i} style={{ padding:"14px 18px", background:"var(--panel)", borderRight:"1px solid var(--line)", borderTop:"1px solid var(--line)", fontSize: big ? 22 : 13, fontFamily: big ? "var(--display)" : "var(--sans)", color: highlight ? "var(--accent)" : (accent ? "var(--accent)" : "var(--text)"), fontWeight: big ? 700 : 400, textTransform: big ? "uppercase" : "none" }}>
              {text}
            </div>
          );
        })}
      </>
    );
  }

  // ─── Best-of 2026 ───────────────────────────────────────────────────────
  function BestOf({ onClose }) {
    const all = [...window.SIMRACING_DATA.products, window.SIMRACING_DATA.hero];
    const cats = window.SIMRACING_DATA.categories;
    const groups = cats.map(cat => ({
      ...cat,
      items: all.filter(p => p.category === cat.id).sort((a,b) => b.rating - a.rating).slice(0, 3),
    })).filter(g => g.items.length > 0);

    return (
      <FeatureShell title="Best of 2026" subtitle={`Unsere Top-Picks pro Kategorie · Stand Mai 2026`} onClose={onClose}>
        <div style={{ padding:"32px 48px 48px", maxWidth:1280, margin:"0 auto" }}>
          <div style={{ marginBottom:36 }}>
            <div className="fx-mono" style={{ fontSize:11, letterSpacing:"0.2em", color:"var(--accent)", textTransform:"uppercase", marginBottom:8 }}>// JÄHRLICHER ÜBERBLICK</div>
            <h2 className="fx-h" style={{ fontSize:64, margin:0, lineHeight:0.95 }}>BEST OF<br/><span style={{ color:"var(--accent)" }}>2026</span></h2>
            <p style={{ color:"var(--text-2)", maxWidth:560, marginTop:18, fontSize:15, lineHeight:1.6 }}>
              Pro Kategorie die drei stärksten Picks — gewählt nach Bewertungen, Preis-Leistung, Markt-Position. Direkter Affiliate-Klick zu jedem Bestpreis.
            </p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:48 }}>
            {groups.map(g => (
              <div key={g.id}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:18, paddingBottom:14, borderBottom:"1px solid var(--line)" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <span style={{ color:"var(--accent)" }}><CatIcon name={g.icon} size={24} /></span>
                    <h3 className="fx-h" style={{ fontSize:34, margin:0 }}>{g.label}</h3>
                  </div>
                  <span className="fx-mono" style={{ fontSize:10, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase" }}>{g.items.length} Picks · {g.count} Produkte gesamt</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14 }}>
                  {g.items.map((p, i) => <BestOfCard key={p.id} p={p} rank={i+1} />)}
                  {g.items.length < 3 && Array.from({length: 3-g.items.length}).map((_,i)=>(
                    <div key={"empty"+i} style={{ background:"transparent", border:"1px dashed var(--line)", padding:24, color:"var(--text-3)", fontSize:12, fontFamily:"var(--mono)", textTransform:"uppercase", letterSpacing:"0.14em", display:"flex", alignItems:"center", justifyContent:"center" }}>// mehr in Vorbereitung</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </FeatureShell>
    );
  }

  function BestOfCard({ p, rank }) {
    const best = window.bestShop(p);
    const labels = ["GOLD","SILBER","BRONZE"];
    return (
      <div style={{ background:"var(--panel)", border: rank===1?"1px solid var(--accent)":"1px solid var(--line)", display:"flex", flexDirection:"column", position:"relative" }}>
        <div style={{ position:"absolute", top:14, left:14, zIndex:2, padding:"4px 10px", fontFamily:"var(--mono)", fontSize:10, letterSpacing:"0.2em", fontWeight:700, textTransform:"uppercase", background: rank===1?"var(--accent)":"#0a0a0a", color: rank===1?"#0a0a0a":"var(--text)", border: rank===1?"none":"1px solid var(--line-2)" }}>
          {labels[rank-1]}
        </div>
        <ProductImage category={p.category} label={p.categoryLabel} height={170} src={p.image} />
        <div style={{ padding:"16px 18px 18px", flex:1, display:"flex", flexDirection:"column" }}>
          <div className="fx-mono" style={{ fontSize:9, letterSpacing:"0.16em", color:"var(--text-3)", textTransform:"uppercase", marginBottom:6 }}>{p.brand}</div>
          <h4 className="fx-h" style={{ fontSize:20, margin:0, marginBottom:8 }}>{p.name}</h4>
          <Stars value={p.rating} size={11} />
          <div style={{ marginTop:"auto", paddingTop:14, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div className="fx-h" style={{ fontSize:22, color: rank===1?"var(--accent)":"var(--text)" }}>{fmtPrice(best?.price || 0)}</div>
            <a href={window.affiliateUrl(best) || "#"} target="_blank" rel="sponsored noopener" onClick={(e)=>{if(!window.affiliateUrl(best))e.preventDefault();}} className="fx-btn" aria-disabled={!window.affiliateUrl(best)} style={{ height:32, padding:"0 12px", fontSize:10 }}>Shop →</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Shell / Overlay manager ────────────────────────────────────────────
  function FeatureShell({ title, subtitle, onClose, progress, children }) {
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", h);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { window.removeEventListener("keydown", h); document.body.style.overflow = prevOverflow; };
    }, [onClose]);

    return (
      <div className="fx-root" style={{ position:"fixed", inset:0, background:"var(--bg)", zIndex:9999, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <style>{`
          .fx-root { --bg:#0a0a0a; --panel:#111; --panel-2:#181818; --line:rgba(255,255,255,0.07); --line-2:rgba(255,255,255,0.16); --text:#fafafa; --text-2:#a0a0a0; --text-3:#5e5e5e; --accent:var(--accent-color, #ff2d2d); --sans:'Inter',system-ui,sans-serif; --mono:'JetBrains Mono',ui-monospace,monospace; --display:'Barlow Condensed',sans-serif; color:var(--text); font-family:var(--sans); }
          .fx-root *, .fx-root *::before, .fx-root *::after { box-sizing: border-box; }
          .fx-h { font-family:var(--display); font-weight:700; line-height:0.95; text-transform:uppercase; letter-spacing:-0.005em; }
          .fx-mono { font-family:var(--mono); }
          .fx-btn { display:inline-flex; align-items:center; gap:8px; height:38px; padding:0 16px; border:1px solid var(--line-2); background:transparent; color:var(--text); font-family:var(--mono); font-size:11px; letter-spacing:0.12em; text-transform:uppercase; cursor:pointer; transition:all .15s; text-decoration:none; }
          .fx-btn:hover { background:var(--panel-2); border-color:var(--accent); }
          .fx-btn-primary { background:var(--accent); color:#0a0a0a; border-color:var(--accent); font-weight:600; }
          .fx-btn:disabled, .fx-btn[aria-disabled="true"] { opacity:.4; cursor:not-allowed; }
          .fx-pill { display:inline-flex; align-items:center; gap:6px; padding:7px 12px; background:var(--panel-2); border:1px solid var(--line); color:var(--text); font-family:var(--mono); font-size:10px; letter-spacing:0.12em; text-transform:uppercase; }
          .fx-option { background:var(--panel); border:1px solid var(--line); color:var(--text); padding:20px 22px; cursor:pointer; text-align:left; transition:all .15s; font-family:inherit; }
          .fx-option:hover { border-color:var(--accent); background:var(--panel-2); transform:translateY(-2px); }
          .fx-option.active { border-color:var(--accent); background:rgba(255,45,45,0.08); }
        `}</style>

        {/* Header */}
        <header style={{ padding:"18px 32px", borderBottom:"1px solid var(--line)", display:"flex", justifyContent:"space-between", alignItems:"center", flex:"none", background:"#080808", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={onClose} className="fx-btn" style={{ width:38, padding:0, justifyContent:"center" }} title="Schließen (Esc)">✕</button>
            <div>
              <div className="fx-mono" style={{ fontSize:9, letterSpacing:"0.2em", color:"var(--text-3)", textTransform:"uppercase" }}>// SimRaceHub</div>
              <div className="fx-h" style={{ fontSize:18 }}>{title}</div>
            </div>
          </div>
          <div className="fx-mono" style={{ fontSize:10, letterSpacing:"0.16em", color:"var(--text-2)", textTransform:"uppercase" }}>{subtitle}</div>
        </header>

        {progress != null && (
          <div style={{ height:2, background:"var(--line)", flex:"none" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"var(--accent)", transition:"width .3s ease" }} />
          </div>
        )}

        <div style={{ flex:1 }}>{children}</div>
      </div>
    );
  }

  function FeatureOverlay() {
    const { view, payload } = window.useFeatureState();
    if (!view) return null;
    const onClose = () => window.closeFeature();
    if (view === "quiz") return <Quiz onClose={onClose} />;
    if (view === "compare") return <Compare ids={payload?.ids || new Set()} onClose={onClose} />;
    if (view === "bestof") return <BestOf onClose={onClose} />;
    return null;
  }

  Object.assign(window, { FeatureOverlay });
})();
