import { useState, useEffect, useRef, useCallback } from "react";

const BRAND        = "IceCubeTimer";
const AGENT_ID     = "agent_8201kjbxrhm2e55ae19ba8nm4f8z";
const WEBHOOK_URL  = "https://script.google.com/macros/s/AKfycbzveBc8uA2Zu1xOwh7e_2T703WkiFFBkNDE1o2wVhG2QRoEao6TiNwDzK8ggnVMrGG9/exec";
const FOUNDER_PHOTO = "data:image/jpeg;base64,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";
const FOUNDER_NAME  = "Luke Yarnton";
const FOUNDER_TITLE = "Founder, IceCubeTimer";

const REASONS = [
  { id: "cheaper", label: "Found a cheaper alternative",  agentText: "you found a cheaper alternative" },
  { id: "noNeed",  label: "I no longer need this",        agentText: "you no longer need the service" },
  { id: "budget",  label: "It is out of my budget",       agentText: "the price is out of your budget" },
  { id: "other",   label: "Something else",               agentText: "something else came up" },
];

const FEATURES = [
  { title: "Predictive Freeze Intelligence",  desc: "Adapts to your usage patterns, door openings, and ambient temperature." },
  { title: "Water and Ice Quality Analytics", desc: "Mineral content detection, filtration tips, and clarity scoring." },
  { title: "Freezer Performance Reports",     desc: "Weekly reports on energy efficiency and compressor health." },
  { title: "Hospitality Mode",                desc: "Schedule events, auto-optimize freezing, and get supply alerts." },
  { title: "Smart Hardware Integration",      desc: "Bluetooth sensors for temperature, door detection, and tray weight." },
  { title: "AI Voice Assistant",              desc: "Ask when your ice will be ready or if you have enough for tonight." },
];

const OFFER = {
  headline: "Six months free",
  desc:     "Stay on Ultra at no charge for six months. Come back when you are ready.",
  features: ["All Ultra features included", "No credit card required", "Cancel any time"],
};

const FALLBACK_OUTCOME = "runway_extension";

export default function App() {
  const [step, setStep]           = useState("features");
  const [selected, setSelected]   = useState(null);
  const [callStatus, setCallStatus] = useState("idle");
  const [claimed, setClaimed]     = useState(false);
  const [email, setEmail]         = useState("");
  const convRef                   = useRef(null);

  const reason = REASONS.find(r => r.id === selected);

  const handleCallEnd = useCallback((raw = "") => {
    setCallStatus("ended");
    fetch(WEBHOOK_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: selected, transcript: raw }),
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
        onConnect:    () => setCallStatus("active"),
        onDisconnect: () => { const raw = convRef.current?._transcript || ""; handleCallEnd(raw); },
        onMessage:    (msg) => {
          if (msg.type === "transcript" && convRef.current)
            convRef.current._transcript = (convRef.current._transcript || "") + " " + (msg.message || "");
        },
        onError: () => handleCallEnd(""),
      });
      convRef.current = conv;
      convRef.current._transcript = "";
    } catch (err) {
      console.error("Failed to start:", err);
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
        <div style={s.nav}><span style={s.logo}>{BRAND}</span></div>
        {step === "features"  && <FeaturesStep  onContinue={() => setStep("select")} />}
        {step === "select"    && <SelectStep    onSelect={id => { setSelected(id); setStep("incentive"); }} />}
        {step === "incentive" && <IncentiveStep onStart={() => { setStep("voice"); setCallStatus("connecting"); }} onSkip={() => setStep("outcome")} />}
        {step === "voice"     && <VoiceStep     callStatus={callStatus} onEndCall={stopConversation} onSkip={stopConversation} />}
        {step === "outcome"   && <OutcomeStep   onClaim={() => setStep("claim")} onDecline={() => setStep("done")} />}
        {step === "claim"     && <ClaimStep     email={email} setEmail={setEmail} onClaim={() => { setClaimed(true); setStep("done"); }} />}
        {step === "done"      && <DoneStep      claimed={claimed} email={email} />}
      </div>
      <p style={s.powered}>Powered by TalkBack</p>
    </div>
  );
}

// ── 1. FEATURES ───────────────────────────────────────────────────────────────
function FeaturesStep({ onContinue }) {
  return (
    <div style={s.body}>
      <p style={s.eyebrow}>IceCubeTimer Ultra</p>
      <h2 style={s.serifH}>The operating system for your freezer.</h2>
      <p style={s.sub}>Everything you have access to right now, before you go.</p>
      <div style={s.featureList}>
        {FEATURES.map(f => (
          <div key={f.title} style={s.featureRow}>
            <div style={s.dot} />
            <div>
              <p style={s.featureTitle}>{f.title}</p>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <button style={s.ghostBtn} onClick={onContinue}>I still want to cancel</button>
    </div>
  );
}

// ── 2. SELECT REASON ──────────────────────────────────────────────────────────
function SelectStep({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={s.body}>
      <h2 style={s.serifHSm}>Why are you leaving?</h2>
      <div style={s.stack}>
        {REASONS.map(r => (
          <button
            key={r.id}
            style={{ ...s.reasonBtn, ...(hov === r.id ? s.reasonBtnHov : {}) }}
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
function IncentiveStep({ onStart, onSkip }) {
  return (
    <div style={s.body}>
      <div style={s.founderHero}>
        <img src={FOUNDER_PHOTO} alt={FOUNDER_NAME} style={s.avatarLg} />
        <div>
          <p style={s.founderName}>{FOUNDER_NAME}</p>
          <p style={s.founderTitle}>{FOUNDER_TITLE}</p>
        </div>
      </div>
      <h2 style={s.serifH}>Before you go, can I ask you something?</h2>
      <p style={s.sub}>60 seconds with me. Help us not make the same mistake twice.</p>
      <button style={s.pillDark} onClick={onStart}>Start talking</button>
      <button style={s.skipLink} onClick={onSkip}>No thanks, skip</button>
    </div>
  );
}

// ── 4. VOICE CALL ─────────────────────────────────────────────────────────────
function VoiceStep({ callStatus, onEndCall, onSkip }) {
  const [bars, setBars]     = useState(Array(9).fill(0.3));
  const [fading, setFading] = useState(false);
  const raf                 = useRef(null);
  const active = callStatus === "active";
  const ended  = callStatus === "ended";

  useEffect(() => {
    if (active) {
      const tick = () => {
        setBars(p => p.map(b => b + (0.15 + Math.random() * 0.7 - b) * 0.3));
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
      setBars(Array(9).fill(0.2));
    }
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  useEffect(() => { if (ended) setFading(true); }, [ended]);

  const handleEnd = () => { setFading(true); setTimeout(() => onEndCall(), 900); };

  return (
    <div style={{ ...s.voiceBody, opacity: fading ? 0 : 1, transform: fading ? "scale(0.97)" : "scale(1)", transition: fading ? "opacity 0.9s ease, transform 0.9s ease" : "none" }}>
      <div style={{ ...s.orb, borderColor: active ? "#C4A882" : ended ? "#A8C4A0" : "#E0D8CE", boxShadow: active ? "0 0 0 10px rgba(196,168,130,0.08), 0 0 36px rgba(196,168,130,0.14)" : ended ? "0 0 0 10px rgba(168,196,160,0.08)" : "none" }}>
        <div style={s.waveRow}>
          {bars.map((h, i) => (
            <div key={i} style={{ ...s.waveBar, height: `${Math.max(4, Math.round(h * 28))}px`, background: active ? `rgba(196,168,130,${0.3 + h * 0.6})` : ended ? "rgba(168,196,160,0.5)" : "rgba(196,168,130,0.25)", transition: active ? "height 0.07s ease" : "height 0.5s ease, background 0.5s ease" }} />
          ))}
        </div>
      </div>
      <p style={s.orbLabel}>{ended ? "Call complete" : active ? "Listening" : "Connecting"}</p>
      {ended && <p style={s.endNudge}>You can end the call now</p>}
      {(active || ended) && <button style={s.endCallBtn} onClick={handleEnd}>End call</button>}
      {!ended && <button style={{ ...s.skipLink, marginTop: 12 }} onClick={onSkip}>No thanks, skip</button>}
    </div>
  );
}

// ── 5. OUTCOME ────────────────────────────────────────────────────────────────
function OutcomeStep({ onClaim, onDecline }) {
  return (
    <div style={s.body}>
      <div style={s.founderNote}>
        <img src={FOUNDER_PHOTO} alt={FOUNDER_NAME} style={s.avatarSm} />
        <p style={s.noteText}><strong>Luke</strong> put this together based on what you shared.</p>
      </div>
      <h2 style={s.serifHSm}>Here is what we can do.</h2>
      <div style={s.offerCard}>
        <p style={s.offerHeadline}>{OFFER.headline}</p>
        <p style={s.offerDesc}>{OFFER.desc}</p>
        <div style={s.offerFeatures}>
          {OFFER.features.map(f => (
            <div key={f} style={s.offerFeatureRow}>
              <div style={s.offerDot} />
              <span style={s.offerFeatureText}>{f}</span>
            </div>
          ))}
        </div>
        <button style={s.pillWarm} onClick={onClaim}>Claim this offer</button>
      </div>
      <button style={s.skipLink} onClick={onDecline}>No thanks, skip</button>
    </div>
  );
}

// ── 6. CLAIM ──────────────────────────────────────────────────────────────────
function ClaimStep({ email, setEmail, onClaim }) {
  const valid = email.includes("@") && email.includes(".");
  return (
    <div style={s.body}>
      <h2 style={s.serifHSm}>Where should we send confirmation?</h2>
      <p style={s.sub}>Just your email. Nothing else.</p>
      <input
        style={s.input}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoFocus
      />
      <button
        style={{ ...s.pillDark, opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "default" }}
        onClick={() => valid && onClaim()}
      >
        Confirm
      </button>
    </div>
  );
}

// ── 7. DONE ───────────────────────────────────────────────────────────────────
function DoneStep({ claimed, email }) {
  return (
    <div style={{ ...s.body, alignItems: "center", textAlign: "center", padding: "48px 24px" }}>
      <h2 style={{ ...s.serifH, marginBottom: 10 }}>{claimed ? "You are all set." : "Take care."}</h2>
      <p style={{ ...s.sub, marginBottom: 0 }}>
        {claimed
          ? <>Confirmation is on its way to <strong>{email}</strong>.</>
          : "Account cancelled. We hope to see you back."}
      </p>
    </div>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS  = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif";

const s = {
  root:  { minHeight: "100vh", background: "#F5F1EB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "28px 16px", fontFamily: SANS },
  card:  { background: "#FDFAF6", border: "1px solid #E8E0D5", borderRadius: 14, width: "100%", maxWidth: 420, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" },
  nav:   { display: "flex", alignItems: "center", padding: "15px 22px", borderBottom: "1px solid #EDE7DE" },
  logo:  { fontSize: 13, fontWeight: 600, color: "#2C2416", letterSpacing: "-0.01em" },
  powered: { marginTop: 14, fontSize: 11, color: "#C4B8A8" },

  body:  { padding: "28px 24px 32px", display: "flex", flexDirection: "column" },
  eyebrow: { fontSize: 11, fontWeight: 500, color: "#a0917e", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 },
  serifH:   { fontFamily: SERIF, fontSize: 26, fontWeight: 700, color: "#1C1610", lineHeight: 1.25, marginBottom: 12, letterSpacing: "-0.01em" },
  serifHSm: { fontFamily: SERIF, fontSize: 20, fontWeight: 600, color: "#1C1610", lineHeight: 1.3,  marginBottom: 16, letterSpacing: "-0.01em" },
  sub:      { fontSize: 14, color: "#7A6E62", lineHeight: 1.65, marginBottom: 24 },

  featureList: { display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 },
  featureRow:  { display: "flex", gap: 14, alignItems: "flex-start" },
  dot:         { width: 6, height: 6, borderRadius: "50%", background: "#C4A882", flexShrink: 0, marginTop: 6 },
  featureTitle: { fontSize: 13, fontWeight: 600, color: "#2C2416", marginBottom: 2 },
  featureDesc:  { fontSize: 12, color: "#9A8E82", lineHeight: 1.5, margin: 0 },

  stack:       { display: "flex", flexDirection: "column", gap: 8 },
  reasonBtn:   { background: "#FDFAF6", border: "1px solid #E0D8CE", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#3C3429", cursor: "pointer", textAlign: "left", fontFamily: SANS, transition: "border-color 0.15s, background 0.15s" },
  reasonBtnHov:{ borderColor: "#C4A882", background: "#FAF5EE" },

  founderHero:  { display: "flex", alignItems: "center", gap: 14, marginBottom: 24 },
  avatarLg:     { width: 60, height: 60, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "2px solid #E0D8CE", flexShrink: 0 },
  founderName:  { fontSize: 15, fontWeight: 600, color: "#1C1610", margin: 0 },
  founderTitle: { fontSize: 12, color: "#a0917e", marginTop: 3 },

  founderNote: { display: "flex", alignItems: "center", gap: 10, background: "#F5F0E8", border: "1px solid #E0D8CE", borderRadius: 8, padding: "10px 13px", marginBottom: 18 },
  avatarSm:    { width: 34, height: 34, borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "1.5px solid #E0D8CE", flexShrink: 0 },
  noteText:    { fontSize: 12, color: "#7A6E62", lineHeight: 1.5, margin: 0 },

  offerCard:       { border: "1.5px solid #C4A882", borderRadius: 10, padding: 18, marginBottom: 16, background: "#FAF5EE" },
  offerHeadline:   { fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#1C1610", marginBottom: 8 },
  offerDesc:       { fontSize: 13, color: "#7A6E62", lineHeight: 1.55, marginBottom: 16 },
  offerFeatures:   { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
  offerFeatureRow: { display: "flex", gap: 8, alignItems: "flex-start" },
  offerDot:        { width: 5, height: 5, borderRadius: "50%", background: "#C4A882", flexShrink: 0, marginTop: 5 },
  offerFeatureText:{ fontSize: 12, color: "#5C5046" },

  voiceBody: { padding: "36px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" },
  orb:       { width: 120, height: 120, borderRadius: "50%", border: "1.5px solid", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAF5EE", marginBottom: 18, transition: "box-shadow 0.5s, border-color 0.5s" },
  waveRow:   { display: "flex", alignItems: "flex-end", gap: 3, height: 28 },
  waveBar:   { width: 3, borderRadius: 3, minHeight: 4 },
  orbLabel:  { fontSize: 13, color: "#9A8E82", marginBottom: 20 },
  endNudge:  { fontSize: 12, color: "#7A9A72", fontWeight: 500, marginBottom: 8 },
  endCallBtn:{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA", borderRadius: 100, padding: "10px 28px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: SANS, marginBottom: 12, transition: "background 0.1s" },

  pillDark: { background: "#1C1610", color: "#FAF5EE", border: "none", borderRadius: 100, padding: "14px 0", width: "100%", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: SANS, letterSpacing: "-0.01em", marginBottom: 14, transition: "background 0.15s" },
  pillWarm: { background: "#2C2416", color: "#FAF5EE", border: "none", borderRadius: 100, padding: "13px 0", width: "100%", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: SANS, transition: "background 0.15s" },
  ghostBtn: { background: "transparent", color: "#9A8E82", border: "1px solid #E0D8CE", borderRadius: 100, padding: "12px 0", width: "100%", fontSize: 14, cursor: "pointer", fontFamily: SANS, transition: "border-color 0.15s" },
  skipLink: { background: "none", border: "none", color: "#b0a398", fontSize: 12, cursor: "pointer", textDecoration: "underline", fontFamily: SANS, alignSelf: "center" },

  input: { border: "1px solid #E0D8CE", borderRadius: 8, padding: "12px 14px", fontSize: 14, color: "#1C1610", fontFamily: SANS, background: "#FDFAF6", width: "100%", marginBottom: 12, outline: "none" },
};
