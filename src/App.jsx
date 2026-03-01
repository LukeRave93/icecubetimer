import { useState, useEffect, useRef, useCallback } from "react";

const BRAND       = "IceCubeTimer";
const AGENT_ID    = "agent_8201kjbxrhm2e55ae19ba8nm4f8z";
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzveBc8uA2Zu1xOwh7e_2T703WkiFFBkNDE1o2wVhG2QRoEao6TiNwDzK8ggnVMrGG9/exec";
const FOUNDER_PHOTO = "data:image/jpeg;base64,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";
const FOUNDER_NAME  = "Luke Rave";
const FOUNDER_TITLE = "Founder, TalkBack";

const REASONS = [
  { id: "cheaper", label: "Found a cheaper alternative",  agentText: "you found a cheaper alternative" },
  { id: "noNeed",  label: "I no longer need this",        agentText: "you no longer need the service" },
  { id: "budget",  label: "It's out of my budget",        agentText: "the price is out of your budget" },
  { id: "other",   label: "Something else",               agentText: "something else came up" },
];

const PREMIUM_FEATURES = [
  { icon: "🧠", title: "Predictive Freeze Intelligence",  desc: "AI that adapts to your freezer load, door openings, ambient temp, and compressor cycles." },
  { icon: "🧪", title: "Water & Ice Quality Analytics",  desc: "Mineral content detection, filtration tips, ice clarity scoring." },
  { icon: "📊", title: "Freezer Performance Reports",    desc: "Weekly reports on energy efficiency, compressor health, and estimated cost savings." },
  { icon: "🔔", title: "Push Notifications",             desc: "Alerts when your cubes are ready, and warnings if supply runs low." },
  { icon: "📱", title: "Multi-tray Tracking",            desc: "Track up to 12 trays simultaneously with individual timers." },
];

const ULTRA_FEATURES = [
  ...PREMIUM_FEATURES,
  { icon: "🥂", title: "Hospitality Mode",               desc: "Schedule events, auto-optimize freezing, get cocktail recommendations, and alerts if supply drops low." },
  { icon: "🧊", title: "Smart Hardware Integration",     desc: "Bluetooth sensors for temperature, door detection, and tray weight. Automatic freeze-start detection." },
  { icon: "🎙️", title: "AI Voice Assistant",             desc: "Ask 'When will my ice be ready?' or 'Do I have enough for tonight?' Smart suggestions included." },
];

const OUTCOMES = {
  professional_pivot: {
    icon: "🚀", label: "1 month of Premium free", sub: "Full Premium, on us.",
    tier: "Premium", features: PREMIUM_FEATURES, color: "#2563eb",
  },
  runway_extension: {
    icon: "🛤️", label: "6 months of Ultra free", sub: "Our most powerful tier, zero cost.",
    tier: "Ultra", features: ULTRA_FEATURES, color: "#0891b2",
  },
  olive_branch: {
    icon: "🫱", label: "$80 Uber Eats credit", sub: "A genuine apology.",
    tier: null, features: [], color: "#059669",
  },
  hard_exit: {
    icon: "👋", label: "Safe travels", sub: "We hope you'll be back.",
    tier: null, features: [], color: "#6b7280",
  },
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
  const convRef                      = useRef(null);

  const reason = REASONS.find(r => r.id === selected);

  const handleCallEnd = useCallback((raw = "") => {
    setCallStatus("ended");
    const match = raw.match(/OUTCOME:\s*(\{.*?\})/s);
    let parsed = null;
    if (match) { try { parsed = JSON.parse(match[1]); } catch (_) {} }
    if (!parsed) {
      const fb = FALLBACK[selected] || ["professional_pivot", "runway_extension"];
      parsed = { primary: fb[0], secondary: fb[1] };
    }
    setOutcomes(parsed);
    fetch(WEBHOOK_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: selected, transcript: raw, outcomes: parsed }),
    }).catch(() => {});
    setTimeout(() => setStep("outcome"), 1800);
  }, [selected]);

  const startConversation = useCallback(async (agentText) => {
    try {
      const { Conversation } = await import("@11labs/client");
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const conv = await Conversation.startSession({
        agentId: AGENT_ID,
        dynamicVariables: { churn_reason: agentText },
        onConnect: () => setCallStatus("active"),
        onDisconnect: () => { const raw = convRef.current?._transcript || ""; handleCallEnd(raw); },
        onMessage: (msg) => {
          if (msg.type === "transcript" && convRef.current)
            convRef.current._transcript = (convRef.current._transcript || "") + " " + (msg.message || "");
        },
        onError: () => handleCallEnd(""),
      });
      convRef.current = conv;
      convRef.current._transcript = "";
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setCallStatus("idle");
    }
  }, [handleCallEnd]);

  const stopConversation = useCallback(async () => {
    if (convRef.current) {
      try { await convRef.current.endSession(); } catch (_) {}
      const raw = convRef.current._transcript || "";
      convRef.current = null;
      handleCallEnd(raw);
    } else {
      handleCallEnd("");
    }
  }, [handleCallEnd]);

  useEffect(() => {
    if (step === "voice" && reason && callStatus === "connecting")
      startConversation(reason.agentText);
  }, [step, reason, callStatus, startConversation]);

  useEffect(() => {
    return () => { if (convRef.current) { try { convRef.current.endSession(); } catch (_) {} } };
  }, []);

  return (
    <div style={s.root}>
      <div style={s.card}>
        <div style={s.nav}><span style={s.logo}>🧊 {BRAND}</span></div>

        {step === "features"  && <FeaturesStep  onContinue={() => setStep("select")} />}
        {step === "select"    && <SelectStep    onSelect={id => { setSelected(id); setStep("incentive"); }} />}
        {step === "incentive" && reason && (
          <IncentiveStep
            onStart={() => { setStep("voice"); setCallStatus("connecting"); }}
            onSkip={() => { setOutcomes(null); setStep("outcome"); }}
          />
        )}
        {step === "voice" && reason && (
          <VoiceStep callStatus={callStatus} onEndCall={stopConversation} onSkip={stopConversation} />
        )}
        {step === "outcome" && (
          <OutcomeStep
            outcomes={outcomes} selected={selected}
            onChoose={id => { setChosenOffer(id); setStep("claim"); }}
            onDecline={() => setStep("done")}
          />
        )}
        {step === "claim" && chosenOffer && (
          <ClaimStep offer={OUTCOMES[chosenOffer]} email={email} setEmail={setEmail} onClaim={() => setStep("done")} />
        )}
        {step === "done" && <DoneStep offer={chosenOffer ? OUTCOMES[chosenOffer] : null} email={email} />}
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
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
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
            onMouseEnter={() => setHov(r.id)} onMouseLeave={() => setHov(null)}
            onClick={() => onSelect(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── 3. INCENTIVE — founder hero treatment ─────────────────────────────────────
function IncentiveStep({ onStart, onSkip }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={s.incentiveBody}>
      {/* Founder avatar + name */}
      <div style={s.founderRow}>
        <img src={FOUNDER_PHOTO} alt={FOUNDER_NAME} style={s.founderAvatarLg} />
        <div style={s.founderMeta}>
          <span style={s.founderName}>{FOUNDER_NAME}</span>
          <span style={s.founderTitle}>{FOUNDER_TITLE}</span>
        </div>
      </div>

      {/* Big serif headline */}
      <h1 style={s.incentiveH1}>Before you go —<br />can I ask you something?</h1>

      <p style={s.incentiveSub}>
        60 seconds with me — help us not make the same mistake twice.
      </p>

      <button
        style={{ ...s.pillBtn, ...(hov ? s.pillBtnHov : {}) }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        onClick={onStart}
      >
        Start talking →
      </button>

      <button style={s.textBtn} onClick={onSkip}>No thanks, skip to my offer</button>
    </div>
  );
}

// ── 4. VOICE CALL ─────────────────────────────────────────────────────────────
function VoiceStep({ callStatus, onEndCall, onSkip }) {
  const [bars, setBars]     = useState(Array(12).fill(0.15));
  const [fading, setFading] = useState(false);
  const raf                 = useRef(null);
  const active = callStatus === "active";
  const ended  = callStatus === "ended";

  useEffect(() => {
    if (active) {
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
  }, [active]);

  useEffect(() => { if (ended) setFading(true); }, [ended]);

  const handleEndCall = () => { setFading(true); setTimeout(() => onEndCall(), 1000); };

  return (
    <div style={{ ...s.body, alignItems: "center", textAlign: "center", opacity: fading ? 0 : 1, transform: fading ? "scale(0.97)" : "scale(1)", transition: fading ? "opacity 0.9s ease, transform 0.9s ease" : "none" }}>
      <div style={{ ...s.orb, borderColor: active ? "#bfdbfe" : ended ? "#bbf7d0" : "#e5e7eb", boxShadow: active ? "0 0 0 8px rgba(37,99,235,0.05), 0 0 40px rgba(37,99,235,0.08)" : ended ? "0 0 0 8px rgba(22,163,74,0.05)" : "none" }}>
        <span style={{ fontSize: 38, lineHeight: 1 }}>{ended ? <span style={{ color: "#16a34a" }}>✓</span> : "🧊"}</span>
        <div style={s.waveRow}>
          {bars.map((h, i) => (
            <div key={i} style={{ ...s.waveBar, height: `${Math.max(3, Math.round(h * 30))}px`, background: active ? `rgba(37,99,235,${0.25 + h * 0.65})` : ended ? "rgba(22,163,74,0.3)" : "rgba(209,213,219,0.6)", transition: active ? "height 0.07s ease" : "height 0.5s ease, background 0.5s ease" }} />
          ))}
        </div>
      </div>
      <p style={{ ...s.orbLabel, marginTop: 20 }}>{ended ? "Call complete" : active ? "Listening" : "Connecting..."}</p>
      {ended && <p style={s.endNudge}>You can end the call now</p>}
      {(active || ended) && <button style={s.endCallBtn} onClick={handleEndCall}>End call</button>}
      {!ended && <button style={{ ...s.textBtn, marginTop: 14 }} onClick={onSkip}>Skip to offer</button>}
    </div>
  );
}

// ── 5. OUTCOME — small founder note ───────────────────────────────────────────
function OutcomeStep({ outcomes, selected, onChoose, onDecline }) {
  const fb          = FALLBACK[selected] || ["professional_pivot", "runway_extension"];
  const primaryId   = outcomes?.primary   || fb[0];
  const secondaryId = outcomes?.secondary || fb[1];
  const primary     = OUTCOMES[primaryId]   || OUTCOMES.professional_pivot;
  const secondary   = OUTCOMES[secondaryId] || OUTCOMES.runway_extension;
  const hardExit    = primaryId === "hard_exit";

  return (
    <div style={s.body}>
      {/* Small founder note */}
      <div style={s.founderNote}>
        <img src={FOUNDER_PHOTO} alt={FOUNDER_NAME} style={s.founderAvatarSm} />
        <p style={s.founderNoteText}>
          <strong>{FOUNDER_NAME}</strong> put this together personally based on what you shared.
        </p>
      </div>

      <h2 style={s.h2}>Here's what we can do.</h2>
      <div style={{ ...s.stack, gap: 8, marginBottom: 16 }}>
        <OfferRow cfg={primary}   id={primaryId}   featured onChoose={() => onChoose(primaryId)} />
        {!hardExit && <OfferRow cfg={secondary} id={secondaryId} onChoose={() => onChoose(secondaryId)} />}
      </div>
      <button style={s.textBtn} onClick={onDecline}>No thanks, cancel my account</button>
    </div>
  );
}

function OfferRow({ cfg, id, featured, onChoose }) {
  const [hov, setHov]           = useState(false);
  const [expanded, setExpanded] = useState(false);
  const showFeatures = cfg.features && cfg.features.length > 0;
  return (
    <div style={{ ...s.offerRow, borderColor: featured ? cfg.color : "#e5e7eb", borderWidth: featured ? 1.5 : 1, flexDirection: "column", alignItems: "stretch", padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "13px 14px" }}>
        <div style={s.offerLeft}>
          <span style={{ fontSize: 20 }}>{cfg.icon}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <p style={s.offerLabel}>{cfg.label}</p>
              {cfg.tier && (
                <span style={{ ...s.tierBadge, background: featured ? cfg.color + "18" : "#f3f4f6", color: featured ? cfg.color : "#6b7280", borderColor: featured ? cfg.color + "40" : "#e5e7eb" }}>
                  {cfg.tier}
                </span>
              )}
            </div>
            <p style={s.offerSub}>{cfg.sub}</p>
          </div>
        </div>
        <button
          style={{ ...s.claimBtn, background: featured ? cfg.color : "#f3f4f6", color: featured ? "#fff" : "#374151", ...(hov ? { filter: "brightness(0.93)" } : {}) }}
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={onChoose}
        >
          {id === "hard_exit" ? "OK, goodbye" : "Claim"}
        </button>
      </div>
      {showFeatures && (
        <>
          <button style={s.seeFeatures} onClick={() => setExpanded(e => !e)}>
            {expanded ? "Hide features ↑" : `See what's in ${cfg.tier} ↓`}
          </button>
          {expanded && (
            <div style={s.featureDrawer}>
              {cfg.features.map(f => (
                <div key={f.title} style={s.drawerRow}>
                  <span style={s.drawerIcon}>{f.icon}</span>
                  <div><p style={s.drawerTitle}>{f.title}</p><p style={s.drawerDesc}>{f.desc}</p></div>
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
      <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
      <button
        style={{ ...s.primaryBtn, background: valid ? offer.color : "#e5e7eb", color: valid ? "#fff" : "#9ca3af", cursor: valid ? "pointer" : "default", ...(hov && valid ? { filter: "brightness(0.93)" } : {}) }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        onClick={() => valid && onClaim()} disabled={!valid}
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
      <h2 style={{ ...s.h2, marginTop: 14 }}>{cancelled ? "Take care." : "You're all set."}</h2>
      <p style={{ ...s.sub, marginBottom: 0 }}>{cancelled ? "Account cancelled. We hope to see you back." : <>Confirmation sent to <strong>{email}</strong>.</>}</p>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const s = {
  root: { minHeight: "100vh", background: "#f3f4f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, width: "100%", maxWidth: 440, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", overflow: "hidden" },
  nav:  { display: "flex", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid #f3f4f6" },
  logo: { fontSize: 13, fontWeight: 600, color: "#111827" },

  body: { padding: "24px 20px 28px", display: "flex", flexDirection: "column" },

  // ── Incentive screen ──
  incentiveBody: {
    padding: "32px 28px 36px",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    background: "#FAF8F4",
  },
  founderRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  founderAvatarLg: {
    width: 64, height: 64, borderRadius: "50%",
    objectFit: "cover", objectPosition: "center top",
    border: "2px solid #e5e7eb",
    flexShrink: 0,
  },
  founderMeta:  { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 },
  founderName:  { fontSize: 15, fontWeight: 600, color: "#111827" },
  founderTitle: { fontSize: 12, color: "#9ca3af" },
  incentiveH1: {
    fontSize: 30, fontWeight: 700, color: "#111827", margin: "0 0 14px",
    letterSpacing: "-0.03em", lineHeight: 1.2,
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  incentiveSub: { fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.6, maxWidth: 320 },
  pillBtn: {
    background: "#111827", color: "#fff", border: "none",
    borderRadius: 100, padding: "14px 36px",
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    fontFamily: "inherit", marginBottom: 16,
    transition: "background 0.15s",
  },
  pillBtnHov: { background: "#374151" },

  // ── Offer screen founder note ──
  founderNote: {
    display: "flex", alignItems: "center", gap: 10,
    background: "#FAF8F4", border: "1px solid #e5e7eb",
    borderRadius: 8, padding: "10px 12px", marginBottom: 16,
  },
  founderAvatarSm: {
    width: 36, height: 36, borderRadius: "50%",
    objectFit: "cover", objectPosition: "center top",
    border: "1.5px solid #e5e7eb", flexShrink: 0,
  },
  founderNoteText: { fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 },

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
  endNudge: { fontSize: 12, color: "#16a34a", margin: "8px 0 0", fontWeight: 500 },
  endCallBtn: { marginTop: 20, background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 7, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", transition: "background 0.1s" },

  offerRow:   { border: "1px solid", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, transition: "background 0.1s" },
  offerLeft:  { display: "flex", alignItems: "center", gap: 12, flex: 1 },
  offerLabel: { fontSize: 14, fontWeight: 600, color: "#111827", margin: 0 },
  offerSub:   { fontSize: 12, color: "#9ca3af", margin: "2px 0 0" },
  tierBadge:  { fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 100, border: "1px solid", letterSpacing: "0.04em" },
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
