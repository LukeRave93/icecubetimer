import { useState, useEffect, useRef } from "react";

const BRAND       = "IceCubeTimer";
const AGENT_ID    = "agent_8201kjbxrhm2e55ae19ba8nm4f8z";
const WEBHOOK_URL = "YOUR_WEBHOOK_URL";

const REASONS = [
  { id: "cheaper", label: "Found a cheaper alternative",  agentText: "you found a cheaper alternative" },
  { id: "noNeed",  label: "I no longer need this",        agentText: "you no longer need the service" },
  { id: "budget",  label: "It's out of my budget",        agentText: "the price is out of your budget" },
  { id: "other",   label: "Something else",               agentText: "something else came up" },
];

const ULTRA_FEATURES = [
  { icon: "🧠", title: "Predictive Freeze Intelligence",  desc: "AI that adapts to your freezer load, door openings, ambient temp, and compressor cycles. Forecasts availability for events." },
  { icon: "🧊", title: "Smart Hardware Integration",      desc: "Bluetooth sensors for temperature, door detection, and tray weight. Automatic freeze-start detection." },
  { icon: "🥂", title: "Hospitality Mode",               desc: "Schedule events, auto-optimize freezing, get cocktail recommendations, and alerts if supply drops low." },
  { icon: "🧪", title: "Water & Ice Quality Analytics",  desc: "Mineral content detection, filtration tips, ice clarity scoring, and luxury cube optimization." },
  { icon: "📊", title: "Freezer Performance Reports",    desc: "Weekly reports on energy efficiency, compressor health, door-open heat loss, and estimated cost savings." },
  { icon: "🎙️", title: "AI Voice Assistant",             desc: "Ask 'When will my ice be ready?' or 'Do I have enough for tonight?' Smart suggestions included." },
];

const OUTCOMES = {
  professional_pivot: { icon: "🚀", label: "1 month free",         sub: "Full Premium, on us.",         color: "#2563eb" },
  runway_extension:   { icon: "🛤️", label: "6 months free",        sub: "Take the time you need.",      color: "#0891b2" },
  olive_branch:       { icon: "🫱",  label: "$80 Uber Eats credit", sub: "A genuine apology.",           color: "#059669" },
  hard_exit:          { icon: "👋",  label: "Safe travels",         sub: "We hope you'll be back.",      color: "#6b7280" },
};

const FALLBACK = {
  cheaper: ["professional_pivot", "runway_extension"],
  noNeed:  ["runway_extension",   "hard_exit"],
  budget:  ["runway_extension",   "olive_branch"],
  other:   ["olive_branch",       "professional_pivot"],
};

export default function App() {
  const [step, setStep]              = useState("features");
  const [selected, setSelected]      = useState(null);
  const [callStatus, setCallStatus]  = useState("idle");
  const [outcomes, setOutcomes]      = useState(null);
  const [chosenOffer, setChosenOffer] = useState(null);
  const [email, setEmail]            = useState("");

  const reason = REASONS.find(r => r.id === selected);

  useEffect(() => {
    if (!document.getElementById("el-script")) {
      const el = document.createElement("script");
      el.id = "el-script";
      el.src = "https://elevenlabs.io/convai-widget/index.js";
      el.async = true;
      document.body.appendChild(el);
    }
  }, []);

  useEffect(() => {
    if (step !== "voice") return;
    const h = (e) => {
      const d = e.detail || {};
      if (d.status === "connecting" || d.type === "conversation_start") setCallStatus("active");
      if (d.type === "conversation_end" || d.status === "ended") {
        const raw = d.transcript || d.full_transcript || "";
        setCallStatus("ended");
        const match = raw.match(/OUTCOME:\s*(\{.*?\})/s);
        let parsed = null;
        if (match) { try { parsed = JSON.parse(match[1]); } catch (_) {} }
        if (!parsed) {
          const fb = FALLBACK[selected] || ["professional_pivot", "runway_extension"];
          parsed = { primary: fb[0], secondary: fb[1] };
        }
        setOutcomes(parsed);
        if (WEBHOOK_URL !== "YOUR_WEBHOOK_URL") {
          fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason: selected, transcript: raw, outcomes: parsed }),
          }).catch(() => {});
        }
        setTimeout(() => setStep("outcome"), 1400);
      }
    };
    window.addEventListener("elevenlabs-convai", h);
    return () => window.removeEventListener("elevenlabs-convai", h);
  }, [step, selected]);

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.nav}>
          <span style={s.logo}>🧊 {BRAND}</span>
        </div>

        {step === "features"  && <FeaturesStep  onContinue={() => setStep("select")} />}
        {step === "select"    && <SelectStep    onSelect={id => { setSelected(id); setStep("incentive"); }} />}
        {step === "incentive" && reason && (
          <IncentiveStep
            reason={reason}
            onStart={() => { setStep("voice"); setCallStatus("connecting"); }}
            onSkip={() => { setOutcomes(null); setStep("outcome"); }}
          />
        )}
        {step === "voice" && reason && (
          <VoiceStep
            reason={reason}
            callStatus={callStatus}
            onSkip={() => { setOutcomes(null); setStep("outcome"); }}
          />
        )}
        {step === "outcome" && (
          <OutcomeStep
            outcomes={outcomes}
            selected={selected}
            onChoose={id => { setChosenOffer(id); setStep("claim"); }}
            onDecline={() => setStep("done")}
          />
        )}
        {step === "claim" && chosenOffer && (
          <ClaimStep
            offer={OUTCOMES[chosenOffer]}
            email={email}
            setEmail={setEmail}
            onClaim={() => setStep("done")}
          />
        )}
        {step === "done" && (
          <DoneStep offer={chosenOffer ? OUTCOMES[chosenOffer] : null} email={email} />
        )}
      </div>
      <p style={s.powered}>Powered by <strong>TalkBack</strong></p>
    </div>
  );
}

// ── 1. FEATURES ───────────────────────────────────────────────────────────────
function FeaturesStep({ onContinue }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={s.body}>
      <p style={s.eyebrow}>IceCubeTimer Ultra — $99/month</p>
      <h2 style={s.h2}>The operating system<br />for your freezer.</h2>
      <div style={s.featureCards}>
        {ULTRA_FEATURES.map(f => (
          <div key={f.title} style={s.featureCard}>
            <span style={s.featureCardIcon}>{f.icon}</span>
            <div>
              <p style={s.featureCardTitle}>{f.title}</p>
              <p style={s.featureCardDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        style={{ ...s.ghostBtn, ...(hov ? s.ghostBtnHov : {}) }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onContinue}
      >
        I still want to cancel
      </button>
    </div>
  );
}

// ── 2. SELECT REASON ──────────────────────────────────────────────────────────
function SelectStep({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={s.body}>
      <h2 style={s.h2}>Why are you leaving?</h2>
      <div style={s.stack}>
        {REASONS.map(r => (
          <button
            key={r.id}
            style={{ ...s.rowBtn, ...(hov === r.id ? s.rowBtnHov : {}) }}
            onMouseEnter={() => setHov(r.id)}
            onMouseLeave={() => setHov(null)}
            onClick={() => onSelect(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 3. INCENTIVE ──────────────────────────────────────────────────────────────
function IncentiveStep({ reason, onStart, onSkip }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={s.body}>
      <h2 style={s.h2}>Can we dig a little deeper?</h2>
      <p style={s.sub}>
        90 seconds or less — and we'll send you a <strong>$10 Uber Eats credit</strong> just
        for helping us understand this better.
      </p>
      <button
        style={{ ...s.primaryBtn, ...(hov ? s.primaryBtnHov : {}) }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onStart}
      >
        🎙&thinsp;Unlock $10 Uber Eats credit
      </button>
      <button style={s.textBtn} onClick={onSkip}>No thanks, skip to my offer</button>
    </div>
  );
}

// ── 4. VOICE CALL ─────────────────────────────────────────────────────────────
function VoiceStep({ reason, callStatus, onSkip }) {
  const [bars, setBars] = useState(Array(12).fill(0.15));
  const raf = useRef(null);

  useEffect(() => {
    if (callStatus === "active") {
      const tick = () => {
        setBars(p => p.map(b => b + (0.1 + Math.random() * 0.85 - b) * 0.28));
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
      setBars(Array(12).fill(0.12));
    }
    return () => cancelAnimationFrame(raf.current);
  }, [callStatus]);

  const active = callStatus === "active";
  const ended  = callStatus === "ended";

  return (
    <div style={{ ...s.body, alignItems: "center", textAlign: "center" }}>
      <div style={{
        ...s.orb,
        borderColor: active ? "#bfdbfe" : ended ? "#bbf7d0" : "#e5e7eb",
        boxShadow: active
          ? "0 0 0 8px rgba(37,99,235,0.05), 0 0 40px rgba(37,99,235,0.08)"
          : ended ? "0 0 0 8px rgba(22,163,74,0.05)" : "none",
      }}>
        <span style={{ fontSize: 38, lineHeight: 1 }}>
          {ended ? <span style={{ color: "#16a34a" }}>✓</span> : "🧊"}
        </span>
        <div style={s.waveRow}>
          {bars.map((h, i) => (
            <div key={i} style={{
              ...s.waveBar,
              height: `${Math.max(3, Math.round(h * 30))}px`,
              background: active
                ? `rgba(37,99,235,${0.25 + h * 0.65})`
                : ended ? "rgba(22,163,74,0.3)" : "rgba(209,213,219,0.6)",
              transition: active ? "height 0.07s ease" : "height 0.5s ease, background 0.5s ease",
            }} />
          ))}
        </div>
      </div>

      <p style={{ ...s.orbLabel, marginTop: 20 }}>
        {ended ? "Wrapping up..." : active ? "Listening" : "Connecting..."}
      </p>

      <div style={{ height: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line */}
        <elevenlabs-convai
          agent-id={AGENT_ID}
          dynamic-variables={JSON.stringify({ churn_reason: reason.agentText })}
        />
      </div>

      {!ended && (
        <button style={{ ...s.textBtn, marginTop: 24 }} onClick={onSkip}>
          Skip to offer
        </button>
      )}
    </div>
  );
}

// ── 5. OUTCOME ────────────────────────────────────────────────────────────────
function OutcomeStep({ outcomes, selected, onChoose, onDecline }) {
  const fb          = FALLBACK[selected] || ["professional_pivot", "runway_extension"];
  const primaryId   = outcomes?.primary   || fb[0];
  const secondaryId = outcomes?.secondary || fb[1];
  const primary     = OUTCOMES[primaryId]   || OUTCOMES.professional_pivot;
  const secondary   = OUTCOMES[secondaryId] || OUTCOMES.runway_extension;
  const hardExit    = primaryId === "hard_exit";

  return (
    <div style={s.body}>
      <h2 style={s.h2}>Here's what we can do.</h2>
      <div style={{ ...s.stack, gap: 8, marginBottom: 16 }}>
        <OfferRow cfg={primary}   id={primaryId}   featured onChoose={() => onChoose(primaryId)} />
        {!hardExit && (
          <OfferRow cfg={secondary} id={secondaryId} onChoose={() => onChoose(secondaryId)} />
        )}
      </div>
      <button style={s.textBtn} onClick={onDecline}>No thanks, cancel my account</button>
    </div>
  );
}

function OfferRow({ cfg, id, featured, onChoose }) {
  const [hov, setHov]           = useState(false);
  const [expanded, setExpanded] = useState(false);
  const showFeatures = id === "professional_pivot" || id === "runway_extension";

  return (
    <div style={{
      ...s.offerRow,
      borderColor:  featured ? cfg.color : "#e5e7eb",
      borderWidth:  featured ? 1.5 : 1,
      flexDirection: "column",
      alignItems:   "stretch",
      padding:      0,
      overflow:     "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "13px 14px" }}>
        <div style={s.offerLeft}>
          <span style={{ fontSize: 20 }}>{cfg.icon}</span>
          <div>
            <p style={s.offerLabel}>{cfg.label}</p>
            <p style={s.offerSub}>{cfg.sub}</p>
          </div>
        </div>
        <button
          style={{
            ...s.claimBtn,
            background: featured ? cfg.color : "#f3f4f6",
            color:      featured ? "#fff" : "#374151",
            ...(hov ? { filter: "brightness(0.93)" } : {}),
          }}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          onClick={onChoose}
        >
          {id === "hard_exit" ? "OK, goodbye" : "Claim"}
        </button>
      </div>

      {showFeatures && (
        <>
          <button style={s.seeFeatures} onClick={() => setExpanded(e => !e)}>
            {expanded ? "Hide features ↑" : "See what's included ↓"}
          </button>
          {expanded && (
            <div style={s.featureDrawer}>
              {ULTRA_FEATURES.map(f => (
                <div key={f.title} style={s.drawerRow}>
                  <span style={s.drawerIcon}>{f.icon}</span>
                  <div>
                    <p style={s.drawerTitle}>{f.title}</p>
                    <p style={s.drawerDesc}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── 6. CLAIM ──────────────────────────────────────────────────────────────────
function ClaimStep({ offer, email, setEmail, onClaim }) {
  const valid = email.includes("@") && email.includes(".");
  const [hov, setHov] = useState(false);
  return (
    <div style={s.body}>
      <h2 style={s.h2}>{offer.icon}&ensp;{offer.label}</h2>
      <p style={s.sub}>Enter your email to confirm.</p>
      <input
        style={s.input}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
      />
      <button
        style={{
          ...s.primaryBtn,
          background: valid ? offer.color : "#e5e7eb",
          color:      valid ? "#fff" : "#9ca3af",
          cursor:     valid ? "pointer" : "default",
          ...(hov && valid ? { filter: "brightness(0.93)" } : {}),
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={() => valid && onClaim()}
        disabled={!valid}
      >
        Confirm
      </button>
    </div>
  );
}

// ── 7. DONE ───────────────────────────────────────────────────────────────────
function DoneStep({ offer, email }) {
  const cancelled = !offer || offer.icon === "👋";
  return (
    <div style={{ ...s.body, alignItems: "center", textAlign: "center" }}>
      <span style={{ fontSize: 40 }}>{cancelled ? "👋" : "🧊"}</span>
      <h2 style={{ ...s.h2, marginTop: 14 }}>
        {cancelled ? "Take care." : "You're all set."}
      </h2>
      <p style={{ ...s.sub, marginBottom: 0 }}>
        {cancelled
          ? "Account cancelled. We hope to see you back."
          : <>Confirmation sent to <strong>{email}</strong>.</>}
      </p>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = {
  root: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    padding: "13px 20px",
    borderBottom: "1px solid #f3f4f6",
  },
  logo: { fontSize: 13, fontWeight: 600, color: "#111827" },

  body: {
    padding: "24px 20px 28px",
    display: "flex",
    flexDirection: "column",
  },

  eyebrow: { fontSize: 11, fontWeight: 500, color: "#9ca3af", margin: "0 0 6px", letterSpacing: "0.02em" },
  h2:      { fontSize: 17, fontWeight: 600, color: "#111827", margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.3 },
  sub:     { fontSize: 14, color: "#6b7280", margin: "0 0 20px", lineHeight: 1.6 },

  featureCards:     { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  featureCard:      { display: "flex", gap: 12, alignItems: "flex-start" },
  featureCardIcon:  { fontSize: 18, flexShrink: 0, width: 24, textAlign: "center", marginTop: 1 },
  featureCardTitle: { fontSize: 13, fontWeight: 600, color: "#111827", margin: "0 0 2px" },
  featureCardDesc:  { fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 },

  stack:     { display: "flex", flexDirection: "column", gap: 7 },
  rowBtn:    { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "11px 14px", fontSize: 14, color: "#374151", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color 0.1s, background 0.1s" },
  rowBtnHov: { borderColor: "#2563eb", background: "#eff6ff", color: "#1d4ed8" },

  orb:      { width: 140, height: 140, borderRadius: "50%", border: "1.5px solid", alignSelf: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "box-shadow 0.5s, border-color 0.5s" },
  waveRow:  { display: "flex", alignItems: "flex-end", gap: 2.5, height: 30 },
  waveBar:  { width: 3, borderRadius: 3, minHeight: 3 },
  orbLabel: { fontSize: 13, color: "#9ca3af", margin: 0 },

  offerRow:   { border: "1px solid", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "background 0.1s" },
  offerLeft:  { display: "flex", alignItems: "center", gap: 12, flex: 1 },
  offerLabel: { fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 },
  offerSub:   { fontSize: 12, color: "#9ca3af", margin: "2px 0 0" },
  claimBtn:   { border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, transition: "filter 0.1s", whiteSpace: "nowrap" },

  seeFeatures:   { background: "none", border: "none", borderTop: "1px solid #f3f4f6", padding: "9px 14px", fontSize: 12, color: "#6b7280", cursor: "pointer", textAlign: "left", fontFamily: "inherit", width: "100%", transition: "background 0.1s" },
  featureDrawer: { borderTop: "1px solid #f3f4f6", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10, background: "#fafafa" },
  drawerRow:     { display: "flex", gap: 10, alignItems: "flex-start" },
  drawerIcon:    { fontSize: 14, flexShrink: 0, width: 20, textAlign: "center", marginTop: 1 },
  drawerTitle:   { fontSize: 12, fontWeight: 600, color: "#374151", margin: "0 0 2px" },
  drawerDesc:    { fontSize: 11, color: "#9ca3af", margin: 0, lineHeight: 1.5 },

  primaryBtn:    { background: "#2563eb", color: "#fff", border: "none", borderRadius: 7, padding: "11px 0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginBottom: 10, transition: "filter 0.1s" },
  primaryBtnHov: { filter: "brightness(0.93)" },
  ghostBtn:      { background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 7, padding: "11px 0", fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "border-color 0.1s, color 0.1s" },
  ghostBtnHov:   { borderColor: "#d1d5db", color: "#374151" },
  textBtn:       { background: "none", border: "none", color: "#9ca3af", fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline", fontFamily: "inherit", alignSelf: "center" },

  input: { border: "1px solid #e5e7eb", borderRadius: 7, padding: "10px 13px", fontSize: 14, color: "#111827", fontFamily: "inherit", outline: "none", marginBottom: 10, width: "100%", boxSizing: "border-box", transition: "border-color 0.1s" },

  powered: { marginTop: 14, fontSize: 11, color: "#c4c9d4" },
};
