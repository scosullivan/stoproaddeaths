<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
  <meta name="googlebot" content="noindex, nofollow" />
  <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="Referrer-Policy" content="no-referrer" />
  <title>Family Dashboard</title>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js"></script>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <!-- Recharts replaced with built-in SVG charts -->
  <style>* { margin: 0; padding: 0; box-sizing: border-box; } body { background: #F9F8F6; }</style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react">
const { useState, useRef, useEffect } = React;
// Built-in SVG line chart — no external dependency
function MiniLineChart({ data, dataKey, color = "#2B5BEE", height = 180, formatY, domain }) {
  const [tooltip, setTooltip] = React.useState(null);
  if (!data || data.length === 0) return null;
  const vals = data.map(d => Number(d[dataKey])).filter(v => !isNaN(v));
  if (vals.length === 0) return null;
  const rawMin = Math.min(...vals);
  const rawMax = Math.max(...vals);
  const padding = (rawMax - rawMin) * 0.15 || Math.abs(rawMax) * 0.1 || 1;
  const minVal = domain ? domain[0] : rawMin - padding;
  const maxVal = domain ? domain[1] : rawMax + padding;
  const padL = 52, padR = 16, padT = 12, padB = 32;
  const W = 400, H = height;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const xStep = data.length > 1 ? chartW / (data.length - 1) : 0;
  const yScale = v => { const n = Number(v); return isNaN(n) ? padT + chartH/2 : padT + chartH - ((n - minVal) / (maxVal - minVal || 1)) * chartH; };
  const xScale = i => padL + i * xStep;
  const points = data.map((d, i) => `${xScale(i)},${yScale(d[dataKey])}`).join(" ");
  const areaPoints = `${padL},${padT + chartH} ${points} ${xScale(data.length-1)},${padT + chartH}`;
  // Y axis ticks — use actual data range not padded range
  const yTicks = [rawMin, (rawMin+rawMax)/2, rawMax];
  // Find the label key — prefer 'month', 'date', 'label', otherwise first non-value key
  const labelKey = ['month','date','label','name','period'].find(k => k in data[0])
    || Object.keys(data[0]).find(k => k !== dataKey) || dataKey;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height }} preserveAspectRatio="none">
        {/* Y grid lines */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={W-padR} y1={yScale(v)} y2={yScale(v)} stroke="#EBEBEB" strokeWidth="1" />
            <text x={padL-6} y={yScale(v)+4} textAnchor="end" fontSize="10" fill="#8A8A8A">
              {formatY ? formatY(v) : v}
            </text>
          </g>
        ))}
        {/* Area fill */}
        <polygon points={areaPoints} fill={color} fillOpacity="0.08" />
        {/* Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots + hover targets */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={xScale(i)} cy={yScale(d[dataKey])} r="4" fill={color} />
            <rect x={xScale(i)-20} y={padT} width={40} height={chartH} fill="transparent"
              onMouseEnter={() => setTooltip({ i, x: xScale(i), y: yScale(d[dataKey]), d })}
              onMouseLeave={() => setTooltip(null)} />
          </g>
        ))}
        {/* X axis labels */}
        {data.map((d, i) => (
          <text key={i} x={xScale(i)} y={H-8} textAnchor="middle" fontSize="10" fill="#8A8A8A">{d[labelKey]}</text>
        ))}
        {/* Tooltip */}
        {tooltip && (
          <g>
            <line x1={tooltip.x} x2={tooltip.x} y1={padT} y2={padT+chartH} stroke={color} strokeWidth="1" strokeDasharray="3,3" />
            <rect x={Math.min(tooltip.x+8, W-padR-90)} y={tooltip.y-18} width={85} height={22} rx="4" fill="#1A1A1A" fillOpacity="0.85" />
            <text x={Math.min(tooltip.x+50, W-padR-48)} y={tooltip.y-3} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">
              {formatY ? formatY(tooltip.d[dataKey]) : tooltip.d[dataKey]}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
// Shim wrappers so existing JSX still works unchanged
const ResponsiveContainer = ({ children, width, height }) => {
  const child = React.Children.only(children);
  return <div style={{ width: width || "100%", height }}>{React.cloneElement(child, { _height: height })}</div>;
};
const LineChart = ({ children, data, _height }) => {
  const kids = React.Children.toArray(children);
  // Find Line specifically — XAxis also has dataKey so we must find the one with stroke
  const lineEl = kids.find(c => c?.props?.stroke && c?.props?.dataKey) || kids.find(c => c?.props?.dataKey);
  if (!lineEl) return null;
  const { dataKey, stroke } = lineEl.props;
  // YAxis has tickFormatter and optionally domain
  const yEl = kids.find(c => c?.props?.tickFormatter);
  const domain = yEl?.props?.domain;
  const tickFormatter = yEl?.props?.tickFormatter;
  // Tooltip has formatter for hover labels
  const tooltipEl = kids.find(c => c?.props?.formatter);
  const formatter = tooltipEl?.props?.formatter || tickFormatter;
  return <MiniLineChart data={data} dataKey={dataKey} color={stroke} height={_height || 180} formatY={formatter} domain={domain} />;
};
const Line = () => null; Line.displayName = "Line";
const BarChart = () => null;
const Bar = () => null;
const XAxis = () => null;
const YAxis = () => null;
const Tooltip = () => null;
const Cell = () => null;
const PieChart = () => null;
const Pie = () => null;

//  FIREBASE CONFIG 
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAn2OW6-_Elgg5PvGgJX37v3iqoMNNlk3I",
  authDomain: "family-dashboard-7802e.firebaseapp.com",
  projectId: "family-dashboard-7802e",
  storageBucket: "family-dashboard-7802e.firebasestorage.app",
  messagingSenderId: "608624809861",
  appId: "1:608624809861:web:222e8c4f04945c772616ec"
};

const ALLOWED_EMAILS = [
  "sinead.clare.osullivan@gmail.com",
  "eoinpmcd@gmail.com",
];

// Init Firebase using compat SDK (loaded via script tags above)
if (!firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

// Fetch a temporary download URL from Firebase Storage
async function getStorageUrl(path) {
  try {
    const ref = storage.ref(path);
    return await ref.getDownloadURL();
  } catch (e) {
    console.error("Storage error:", e);
    return null;
  }
}

// DownloadButton — fetches secure URL on click and opens file
function DocButton({ path, label = "View / Download", front, back }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const open = async (filePath) => {
    setLoading(true); setError(false);
    const url = await getStorageUrl(filePath);
    setLoading(false);
    if (url) window.open(url, '_blank');
    else setError(true);
  };

  if (front && back) {
    // Front/back pair
    return (
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={() => open(front)} disabled={loading}
          style={{ fontSize: 11, color: "#fff", background: "#2B5BEE", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600 }}>
          {loading ? "…" : "⬇ Front"}
        </button>
        <button onClick={() => open(back)} disabled={loading}
          style={{ fontSize: 11, color: "#2B5BEE", background: "#EEF1FD", border: "none", borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontWeight: 600 }}>
          {loading ? "…" : "⬇ Back"}
        </button>
        {error && <span style={{ fontSize: 11, color: "#C43535" }}>Not found in Storage</span>}
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button onClick={() => open(path)} disabled={loading}
        style={{ fontSize: 11, color: "#fff", background: "#2B5BEE", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>
        {loading ? "Opening…" : `⬇ ${label}`}
      </button>
      {error && <span style={{ fontSize: 11, color: "#C43535", marginLeft: 8 }}>File not found in Storage</span>}
    </div>
  );
}

function PensionTab({ data }) {
  const [personTab, setPersonTab] = useState("eoin");
  const person = personTab === "eoin" ? data.eoin : data.sinead;

  const statusConfig = {
    active:   { label: "Active", color: COLORS.green,  bg: COLORS.greenLight },
    deferred: { label: "Frozen / Deferred", color: COLORS.amber,  bg: COLORS.amberLight },
    missing:  { label: "None confirmed", color: COLORS.red,    bg: COLORS.redLight },
  };

  const typeIcon = { "🇬🇧": "🇬🇧", "🇺🇸": "🇺🇸", "—": "—" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Summary banner */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 20, border: "1px solid #c8d4fb" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>🇬🇧🇺🇸 Eoin — 3 pots</p>
          <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>~£{data.eoin.totalKnown.toLocaleString()}</p>
          <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Total estimated · verbal figure only — verify with statements</p>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <Tag color={COLORS.greenLight} text={COLORS.green}>1 active</Tag>
            <Tag color={COLORS.amberLight} text={COLORS.amber}>2 deferred</Tag>
          </div>
        </div>
        <div style={{ background: COLORS.redLight, borderRadius: 12, padding: 20, border: `1px solid #f5c5c5` }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.red, marginBottom: 4 }}>⚠ Sinead — no pension</p>
          <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>£0</p>
          <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>No confirmed pension pot. Opening a SIPP is the #1 financial priority.</p>
          <div style={{ marginTop: 10 }}>
            <Tag color={COLORS.redLight} text={COLORS.red}>Action needed</Tag>
          </div>
        </div>
      </div>

      {/* What is a pension — explainer */}
      <Card>
        <SectionTitle>Pension basics — how it works</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { icon: "💰", title: "What it is", body: "A tax-advantaged savings pot. Money goes in, gets invested, grows tax-free. You can't touch it until age 57 (UK) or 60 (US)." },
            { icon: "🏦", title: "DC vs DB", body: "Defined Contribution (DC): your pot = what goes in + investment returns. Defined Benefit (DB): guaranteed income based on salary × years. Eoin's are almost certainly DC." },
            { icon: "🧾", title: "The tax win", body: "Every £800 Sinead puts in a SIPP becomes £1,000 (basic rate relief). For Eoin at £200k, salary sacrifice saves ~45p in tax for every £1 contributed." },
          ].map(c => (
            <div key={c.title} style={{ background: COLORS.bg, borderRadius: 10, padding: 16 }}>
              <p style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</p>
              <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{c.title}</p>
              <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Person tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
        {[{ id: "eoin", label: "Eoin (3 pots)" }, { id: "sinead", label: "Sinead (0 pots)" }].map(t => (
          <button key={t.id} onClick={() => setPersonTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 16px", fontSize: 13, fontWeight: personTab === t.id ? 600 : 400,
            color: personTab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${personTab === t.id ? COLORS.accent : "transparent"}`,
            fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Pots */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {person.pots.map(pot => {
          const sc = statusConfig[pot.status];
          return (
            <Card key={pot.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{pot.country}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{pot.label}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>{pot.type}</p>
                  </div>
                </div>
                <Tag color={sc.bg} text={sc.color}>{sc.label}</Tag>
              </div>

              <div style={{ marginBottom: 14 }}>
                {pot.estimatedValue !== null ? (
                  <>
                    <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>£{pot.estimatedValue.toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>Estimated value</p>
                  </>
                ) : (
                  <div style={{ background: COLORS.amberLight, borderRadius: 8, padding: "10px 14px" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber }}>Value unknown</p>
                    <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Request annual statement from provider</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Employer", value: pot.employer },
                  { label: "Provider", value: pot.provider || "— find on payslip / P60" },
                  { label: "Annual contribution", value: pot.annualContribution === 0 ? "£0 (frozen)" : pot.annualContribution === null ? "— check payslip" : `£${pot.annualContribution.toLocaleString()}` },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: r.value.startsWith("—") ? COLORS.muted : COLORS.text, fontStyle: r.value.startsWith("—") ? "italic" : "normal" }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {pot.notes && (
                <p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.6, marginTop: 12, padding: "10px 12px", background: COLORS.bg, borderRadius: 8 }}>{pot.notes}</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Rough projection box — Eoin only */}
      {personTab === "eoin" && (
        <Card>
          <SectionTitle>What £300k could become — rough projection</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
            {[
              { label: "If left as-is (5% growth, ~23 yrs)", value: "~£890k", note: "No further contributions, 5% real return to 2049" },
              { label: "With £2,000/mo contributions", value: "~£1.8M", note: "£24k/year added at 5% growth to 2049" },
              { label: "Tax-free lump sum (25%)", value: "~£222k–£450k", note: "25% of pot can be taken tax-free at retirement" },
            ].map(p => (
              <div key={p.label} style={{ background: COLORS.bg, borderRadius: 10, padding: 16 }}>
                <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6, lineHeight: 1.4 }}>{p.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: COLORS.accent }}>{p.value}</p>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{p.note}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic" }}>⚠ These are rough illustrations only — not financial advice. Actual returns vary. Update once real pot values are confirmed.</p>
        </Card>
      )}

      {/* Sinead SIPP explainer */}
      {personTab === "sinead" && (
        <Card>
          <SectionTitle>How to open a SIPP — step by step</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { step: "1", text: "Choose a provider — Vanguard (lowest cost, simple), Fidelity (wider fund choice), or AJ Bell (good middle ground). All can be opened online." },
              { step: "2", text: "Open the SIPP account online — takes ~20 minutes. You'll need your National Insurance number and bank details." },
              { step: "3", text: "Choose a fund — if unsure, pick a global index fund (e.g. Vanguard FTSE Global All Cap). Diversified, low cost, no decisions needed." },
              { step: "4", text: "Set up a monthly payment — e.g. £500/month. The provider claims 20% tax relief automatically, so £500 in your bank becomes £625 in your pot." },
              { step: "5", text: "Once your UK self assessment is filed, claim higher-rate relief on your tax return if applicable — this arrives as a tax refund." },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.accent }}>{s.step}</div>
                <p style={{ fontSize: 13, lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <SectionTitle>{personTab === "eoin" ? "Eoin" : "Sinead"} — pension actions</SectionTitle>
        {person.actions.map((a, i) => <ActionItem key={i} {...a} />)}
      </Card>

    </div>
  );
}



function GoogleLoginScreen({ onAuth }) {
  const [status, setStatus] = useState("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        if (ALLOWED_EMAILS.includes(user.email)) {
          onAuth(user);
        } else {
          setStatus("denied");
          auth.signOut();
        }
      } else {
        setStatus("idle");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      await auth.signInWithPopup(googleProvider);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e.code === "auth/popup-closed-by-user" ? "Sign-in cancelled." : "Something went wrong. Try again.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#F8F9FB", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <div style={{
        background: "#fff", borderRadius: 20, padding: "48px 40px", maxWidth: 400, width: "100%",
        boxShadow: "0 4px 40px rgba(0,0,0,0.08)", textAlign: "center",
        border: "1px solid #E8EAF0"
      }}>
        <div style={{
          width: 56, height: 56, background: "#EEF2FF", borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: 26
        }}>⌂</div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1B2A4A", margin: "0 0 8px" }}>Family Dashboard</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 32px", lineHeight: 1.5 }}>
          Sign in with your Google account to access your family dashboard.
        </p>

        {status === "denied" && (
          <div style={{
            background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
            padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#DC2626"
          }}>
            ⛔ This Google account is not authorised to access this dashboard.
          </div>
        )}

        {status === "error" && (
          <div style={{
            background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 10,
            padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400E"
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={status === "loading" || status === "checking"}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            padding: "14px 20px", borderRadius: 12, border: "1px solid #E0E0E0",
            background: status === "loading" ? "#F5F5F5" : "#fff",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            fontSize: 15, fontWeight: 600, color: "#1B2A4A", fontFamily: "inherit",
            transition: "all 0.15s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {status === "loading" ? "Signing in…" : status === "checking" ? "Checking…" : "Sign in with Google"}
        </button>

        <p style={{ fontSize: 12, color: "#C0C4CC", marginTop: 24, lineHeight: 1.6 }}>
          Access restricted to authorised accounts only.
        </p>
      </div>
    </div>
  );
}




// PIN LOCK — third layer of security after Cloudflare Access + Google OAuth
const CORRECT_PIN = "1305"; // Change this to your preferred 4-digit PIN

function PinScreen({ onUnlock }) {
  const [input, setInput] = React.useState("");
  const [shake, setShake] = React.useState(false);
  const [attempts, setAttempts] = React.useState(0);
  const [locked, setLocked] = React.useState(false);
  const [lockTimer, setLockTimer] = React.useState(0);

  React.useEffect(() => {
    if (sessionStorage.getItem("fam_pin_ok") === "true") onUnlock();
  }, []);

  React.useEffect(() => {
    if (locked && lockTimer > 0) {
      const t = setTimeout(() => setLockTimer(n => n - 1), 1000);
      return () => clearTimeout(t);
    }
    if (locked && lockTimer === 0) setLocked(false);
  }, [locked, lockTimer]);

  const handleDigit = (d) => {
    if (locked) return;
    const next = input + d;
    setInput(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem("fam_pin_ok", "true");
        onUnlock();
      } else {
        const na = attempts + 1;
        setAttempts(na);
        setShake(true);
        setTimeout(() => { setShake(false); setInput(""); }, 600);
        if (na >= 5) { setLocked(true); setLockTimer(30); setAttempts(0); }
      }
    }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F8F9FB", fontFamily:"'DM Sans', sans-serif" }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"48px 40px", maxWidth:360, width:"100%", boxShadow:"0 4px 40px rgba(0,0,0,0.08)", textAlign:"center", border:"1px solid #E8EAF0" }}>
        <div style={{ width:56, height:56, background:"#EEF2FF", borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:26 }}>🔒</div>
        <h2 style={{ fontSize:20, fontWeight:700, color:"#1B2A4A", margin:"0 0 8px" }}>Enter PIN</h2>
        <p style={{ fontSize:13, color:"#9CA3AF", margin:"0 0 28px" }}>
          {locked ? `Too many attempts. Wait ${lockTimer}s.` : "Enter your 4-digit PIN to continue"}
        </p>
        <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>
        <div style={{ display:"flex", justifyContent:"center", gap:16, marginBottom:32, animation: shake ? "shake 0.5s ease" : "none" }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width:16, height:16, borderRadius:"50%", background: i < input.length ? "#2B5BEE" : "#E8EAF0", transition:"background 0.15s ease" }} />
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12 }}>
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
            <button key={i}
              onClick={() => d === "⌫" ? setInput(s => s.slice(0,-1)) : d ? handleDigit(d) : null}
              disabled={locked || !d}
              style={{ height:60, borderRadius:12, border: d === "" ? "none" : "1px solid #E8EAF0", background: d === "⌫" ? "#FEF2F2" : d === "" ? "transparent" : "#fff", fontSize: d === "⌫" ? 18 : 22, fontWeight:600, color: d === "⌫" ? "#DC2626" : "#1B2A4A", cursor: d && !locked ? "pointer" : "default", opacity: locked ? 0.4 : 1 }}
            >{d}</button>
          ))}
        </div>
        {attempts > 0 && !locked && (
          <p style={{ fontSize:12, color:"#DC2626", marginTop:16 }}>
            Incorrect — {5 - attempts} attempt{5-attempts!==1?"s":""} remaining
          </p>
        )}
      </div>
    </div>
  );
}

//  MASKED FIELD 
// Wraps any sensitive value. Shows ●●●● by default, click eye to reveal.
function Masked({ value, chars = 4 }) {
  const [revealed, setRevealed] = useState(false);
  const str = String(value);
  const masked = "●".repeat(Math.max(0, str.length - chars)) + str.slice(-chars);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "'DM Mono', monospace" }}>
      <span>{revealed ? str : masked}</span>
      <button onClick={() => setRevealed(r => !r)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0 2px", color: "#8A8A8A", fontSize: 12, lineHeight: 1 }}>
        {revealed ? "🙈" : "👁"}
      </button>
    </span>
  );
}


const COLORS = {
  bg: "#F9F8F6",
  surface: "#FFFFFF",
  border: "#EBEBEB",
  text: "#1A1A1A",
  muted: "#8A8A8A",
  accent: "#2B5BEE",
  accentLight: "#EEF1FD",
  green: "#1E8C5A",
  greenLight: "#EDFAF3",
  amber: "#C67B00",
  amberLight: "#FFF8EC",
  red: "#C43535",
  redLight: "#FDEAEA",
};

const initialData = {
  family: { name1: "Sinead", name2: "Eoin" },
  spend: {
    // Real data from bank statements. Currency note: BoA in USD, N26 in EUR.
    // Sinead only has statements (Eoin data pending). Combined = Sinead only for now.
    sinead: {
      note: "Starling (UK GBP) — UK current account. Bank of America (USD) — US savings/investments. N26 (EUR) — Irish/European income. Joint Monzo shared with Eoin.",
      accounts: [
        { id: "starling", name: "Starling Bank", currency: "GBP", flag: "🇬🇧", lastBalance: null, note: "UK current account. Balance unknown — add statement." },
        { id: "bofa", name: "Bank of America", currency: "USD", flag: "🇺🇸", lastBalance: 86545, note: "US account. Balance as of Feb 2026 — declining, no US income currently." },
        { id: "n26", name: "N26", currency: "EUR", flag: "🇩🇪", lastBalance: 4292, note: "Receives 2rn board fees + Irish Times income. Balance as of Feb 2026." },
      ],
      months: [
        {
          month: "Oct", label: "Oct '25",
          bofa: { income: 0, spending: 4798, fees: 65, notes: "Lufthansa £1,748 · Wise x2 ~£2,632 · London shopping" },
          n26: { income: 0, spending: 0, notes: "No statement" },
        },
        {
          month: "Nov", label: "Nov '25",
          bofa: { income: 1583, spending: 4768, fees: 4, notes: "DC trip: Apple $1,271 · Sephora $269 · Restaurants $391 · Wise x2 $2,661 · Wise refund +$1,333" },
          n26: { income: 0, spending: 0, notes: "No statement" },
        },
        {
          month: "Jan", label: "Jan '26",
          bofa: { income: 1961.37, spending: 1280.58, fees: 15.60, notes: "Japan trip: JR passes $251 · Hotel Seattle $488 · Pilates €40 · ChatGPT $212.50 · MoneySupermarket £85" },
          bofaChecking: { withdrawals: 4763.14, fees: 2.84, notes: "Wise £1,348 · CC payment $1,859 · Beauty Pie £80 · Holafly eSIM £92 · Chitose bus ¥15k · Wise £1,369" },
          n26: { income: 1045, spending: 441, notes: "2rn €1,031 · Valencia trip: restaurants, pharmacy · subscriptions" },
        },
        {
          month: "Feb", label: "Feb '26",
          bofa: { income: 1676.41, spending: 390.96, fees: 4.15, notes: "Japan: JR Central $138 · Pilates €40 · ChatGPT $212.50 · Credit balance -$87.50 (overpaid)" },
          n26: { income: 1331, spending: 710, notes: "2rn €1,031 · Irish Times €300 · Dublin trip · subscriptions · FT $285" },
          sainsburys: { spending: 294.55, orders: 2, notes: "18 Feb £157.24 (inc. wine £54) · 26 Feb £137.31 (inc. wine £42.50) · grocery-only est. ~£198" },
        },
        {
          month: "Mar", label: "Mar '26",
          bofa: { income: 0, spending: 0, notes: "No statement yet" },
          n26: { income: 0, spending: 0, notes: "Pending" },
          sainsburys: { spending: 86.31, orders: 1, notes: "8 Mar £86.31 (50 items, no wine)" },
        },
      ],
      // Sainsbury's delivery orders — from receipts uploaded Mar 2026
      sainsburysOrders: [
        { date: "14 Jan 2026", orderId: "1244123106", items: 42, total: 76.19, wine: 0, groceryNet: 76.19, card: "MC 6106" },
        { date: "18 Feb 2026", orderId: "1265967006", items: 58, total: 157.24, wine: 54.00, groceryNet: 103.24, card: "MC 6747", note: "2x Chablis 1er Cru £54" },
        { date: "26 Feb 2026", orderId: "1265967201", items: 51, total: 137.31, wine: 42.50, groceryNet: 94.81, card: "MC 6747", note: "Chablis £24.50 + English Sparkling £18" },
        { date: "08 Mar 2026", orderId: "1269294756", items: 50, total: 86.31, wine: 0, groceryNet: 86.31, card: "MC 6106" },
      ],
      // Categorised from Feb 2026 N26 (most recent full month with detail)
      // NOTE: Sainsbury's grocery spend is additional to N26 figures — paid on MC 6106/6747
      // Jan grocery spend: £76 · Feb grocery spend (ex-wine): ~£198 · Mar so far: £86
      categories: [
        { name: "Food & restaurants", amount: 116, icon: "🍽" },
        { name: "Transport", amount: 109, icon: "🚗" },
        { name: "Subscriptions", amount: 304, icon: "💻" },  // FT $285 + Mint $132 + Superhuman $30 + Canva + X + GoDaddy + Bookfunnel
        { name: "Groceries", amount: 149, icon: "🛒" },      // Lidl + Spar (N26) + Sainsbury's avg ex-wine (~£119/mo across Jan-Feb)
        { name: "Wine & drinks", amount: 48, icon: "🍷" },   // Sainsbury's wine avg across Feb orders
        { name: "Shopping", amount: 5, icon: "🛍" },
        { name: "Other", amount: 144, icon: "📦" },          // Accommodation, etc.
      ],
      // BoA balance history (from statement closing balances) — checking account (4747)
      bofaHistory: [
        { month: "Oct '25", balance: 104758 },
        { month: "Nov '25", balance: 99894 },
        { month: "Dec '25", balance: 95377 },
        { month: "Jan '26", balance: 91311 },
        { month: "Feb '26", balance: 86545 },
      ],
      // BoA credit card history (ending 1823) — statement closing balances
      bofaCCHistory: [
        { month: "Jan '26", balance: 1193.80 },
        { month: "Feb '26", balance: -87.50 },
      ],
      // N26 balance history
      n26History: [
        { month: "Dec '25", balance: 3067 },
        { month: "Jan '26", balance: 3671 },
        { month: "Feb '26", balance: 4292 },
      ],
      // Notable transactions across all accounts
      recentTransactions: [
        { date: "03 Mar", account: "BoA CC 1823", desc: "OpenAI ChatGPT subscription", amount: -212.50, type: "spend", flag: "💻" },
        { date: "08 Mar", account: "MC 6106", desc: "Sainsbury's delivery (50 items)", amount: -86.31, type: "spend", flag: "🛒" },
        { date: "26 Feb", account: "MC 6747", desc: "Sainsbury's delivery (51 items, inc. wine £42.50)", amount: -137.31, type: "spend", flag: "🛒" },
        { date: "20 Feb", account: "N26", desc: "2rn (RTÉ) board fee", amount: 1031, type: "income", flag: "🇮🇪" },
        { date: "18 Feb", account: "MC 6747", desc: "Sainsbury's delivery (58 items, inc. wine £54)", amount: -157.24, type: "spend", flag: "🛒" },
        { date: "08 Feb", account: "N26", desc: "Financial Times subscription", amount: -242, type: "spend", flag: "💻" },
        { date: "04 Feb", account: "N26", desc: "Mint Mobile", amount: -112, type: "spend", flag: "💻" },
        { date: "02 Feb", account: "N26", desc: "Irish Times article fee", amount: 300, type: "income", flag: "🇮🇪" },
        { date: "14 Jan", account: "MC 6106", desc: "Sainsbury's delivery (42 items)", amount: -76.19, type: "spend", flag: "🛒" },
        { date: "20 Jan", account: "N26", desc: "2rn (RTÉ) board fee", amount: 1031, type: "income", flag: "🇮🇪" },
        { date: "10 Nov", account: "BoA", desc: "Lufthansa flights", amount: -1748, type: "spend", flag: "✈️" },
        { date: "24 Nov", account: "BoA", desc: "Apple Store DC", amount: -1271, type: "spend", flag: "🛍" },
        { date: "05 Nov", account: "BoA", desc: "Wise transfer (GBP)", amount: -1312, type: "transfer", flag: "💸" },
      ],
    },
    eoin: {
      note: "Ulster Bank (98-01-55, *****703) — salary account. Monzo personal (04-00-03, 98676018) — day-to-day. Bank of Ireland — Irish account. Revolut — FX/travel. Joint Monzo shared with Sinead.",
      accounts: [
        { id: "ulster", name: "Ulster Bank", currency: "GBP", flag: "🇬🇧", lastBalance: null, note: "Salary account (Gresham House). No closing balance on statement — last tx 09 Mar 2026." },
        { id: "monzo", name: "Monzo", currency: "GBP", flag: "🇬🇧", lastBalance: 91.48, note: "Day-to-day spending. Balance as of 10 Mar 2026 — rent just cleared." },
        { id: "boi", name: "Bank of Ireland", currency: "EUR", flag: "🇮🇪", lastBalance: null, note: "Irish account. Balance unknown — add statement." },
        { id: "revolut", name: "Revolut", currency: "GBP", flag: "🌍", lastBalance: null, note: "FX / travel card. Balance unknown." },
      ],
      // Salary from Gresham House (net, after tax/NI/pension):
      // Dec 2025: £9,283.85 · Jan 2026: £9,283.85 · Feb 2026: £17,734.70 (bonus month)
      salaryHistory: [
        { month: "Dec '25", net: 9283.85 },
        { month: "Jan '26", net: 9283.85 },
        { month: "Feb '26", net: 17734.70, note: "Likely includes bonus" },
      ],
      // Monzo balance history (statement closing balances)
      monzoHistory: [
        { month: "Feb '26", balance: 7056.98 },
        { month: "Mar '26", balance: 91.48, note: "10 Mar only — rent just went out" },
      ],
      // Fixed monthly outgoings (via Monzo DDs)
      fixedCosts: [
        { name: "Rent (DN Lettings)", amount: 6779.50, type: "DD" },
        { name: "Council Tax (Westminster)", amount: 141.00, type: "DD" },
        { name: "Thames Water", amount: 45.00, type: "DD" },
        { name: "Pure Gym", amount: 36.99, type: "DD" },
      ],
      months: [
        {
          month: "Dec", label: "Dec '25",
          ulster: { income: 9283.85, spending: 0, notes: "Salary £9,283.85 · Transfer to Monzo £8,000 · Brigadiers £49 · TFL · Whole Foods · M&S · Waitrose" },
        },
        {
          month: "Jan", label: "Jan '26",
          ulster: { income: 9283.85, spending: 0, notes: "Salary £9,283.85 · Transfer to Monzo £8,000+£310 · EatTokyo £45 · Megan's £30 · Ryanair £26.50 · Waterstones £25 · Decathlon £38" },
          monzo: { income: 0, spending: 0, notes: "Rent £6,779.50 · Council Tax £141 · Thames Water £45 · TFL + daily spending" },
        },
        {
          month: "Feb", label: "Feb '26",
          ulster: { income: 17734.70, spending: 0, notes: "Salary £17,734.70 (inc. bonus) · Transfer to Monzo £7,500 · Savings transfer £9,000 · Ryanair £130.98+£57 · Dental £95+£39 · Khans £70 · Tappo Enoteca £110 · Royal Society £50" },
          monzo: { income: 7500, spending: 7872.11, notes: "Received £7,500 from Ulster · Rent £6,779.50 · Council Tax £141 · Thames Water £45 · Groceries/dining · TFL · Closing balance £7,056.98" },
        },
        {
          month: "Mar", label: "Mar '26",
          ulster: { income: 0, spending: 0, notes: "Anthropic x2 £12 · EatTokyo £45 · Zara Home £30 · Waitrose £83.92 · Roe Wood Wharf £189.22 (x2!) · Holland & Barrett £37.49 · PureGym DD £36.99" },
          monzo: { income: 0, spending: 6965.50, notes: "Rent £6,779.50 · Council Tax £141 · Thames Water £45 · No deposit yet · Balance £91.48 (10 Mar)" },
        },
      ],
      recentTransactions: [
        { date: "09 Mar", account: "Ulster", desc: "Roe Wood Wharf (x2 — possible duplicate?)", amount: -189.22, type: "spend", flag: "🍽" },
        { date: "09 Mar", account: "Ulster", desc: "Holland & Barrett", amount: -37.49, type: "spend", flag: "🛒" },
        { date: "09 Mar", account: "Ulster", desc: "South Kensington", amount: -22.70, type: "spend", flag: "🍽" },
        { date: "06 Mar", account: "Monzo", desc: "Rent (DN Lettings)", amount: -6779.50, type: "fixed", flag: "🏠" },
        { date: "03 Mar", account: "Ulster", desc: "Anthropic (Claude.ai)", amount: -6.00, type: "spend", flag: "💻" },
        { date: "02 Mar", account: "Ulster", desc: "Zara Home", amount: -30.09, type: "spend", flag: "🛍" },
        { date: "27 Feb", account: "Ulster", desc: "Savings transfer (A/C 11172893)", amount: -9000, type: "transfer", flag: "💰" },
        { date: "26 Feb", account: "Ulster", desc: "Gresham House salary (inc. bonus)", amount: 17734.70, type: "income", flag: "💼" },
        { date: "26 Feb", account: "Ulster", desc: "Transfer to Monzo", amount: -7500, type: "transfer", flag: "💸" },
        { date: "18 Feb", account: "Ulster", desc: "Bayswater Dental", amount: -95.00, type: "spend", flag: "🦷" },
        { date: "16 Feb", account: "Ulster", desc: "Ryanair flights", amount: -57.00, type: "spend", flag: "✈️" },
        { date: "09 Feb", account: "Ulster", desc: "Tappo Enoteca (dinner)", amount: -110.26, type: "spend", flag: "🍷" },
        { date: "09 Feb", account: "Ulster", desc: "Khan's Restaurant", amount: -70.00, type: "spend", flag: "🍽" },
        { date: "06 Feb", account: "Monzo", desc: "Rent (DN Lettings)", amount: -6779.50, type: "fixed", flag: "🏠" },
        { date: "02 Feb", account: "Ulster", desc: "Ryanair flights", amount: -130.98, type: "spend", flag: "✈️" },
      ],
    },
    joint: {
      note: "Joint Monzo account (04-00-03, 30427018). Used for shared household bills, groceries, and joint spending. Topped up by Eoin P2P payments and occasional Sinead transfers.",
      lastBalance: 536.08,
      lastBalanceDate: "28 Feb 2026",
      totalOutgoings: 3288.76,
      totalDeposits: 3133.91,
      balanceHistory: [
        { month: "Dec '25", balance: 533.40 },
        { month: "Jan '26", balance: 855.27 },
        { month: "Feb '26", balance: 536.08 },
      ],
      // Derived from actual statement: outgoings per month
      // Dec: spending £1,040.35 (excl. Dec 1 start balance context) | deposits £880 (Eoin P2Ps: 600+60+120+100)
      // Jan: spending £1,230.98 | deposits £1,634 (Eoin P2Ps: 800+150+500→Sinead £500; Air Do + Respoke major items)
      // Feb: spending £1,018.93 | deposits £650 (Eoin P2Ps: 50+100+500; Simplyhealth credit £60)
      monthSummary: [
        { month: "Dec '25", deposits: 880.00, spending: 1040.35, balance: 533.40, note: "Eoin P2Ps: £880. Octopus spike £211.45." },
        { month: "Jan '26", deposits: 1634.00, spending: 1230.98, balance: 855.27, note: "Eoin P2Ps: £950 + Sinead £500. Respoke bike £491 + Air Do £93." },
        { month: "Feb '26", deposits: 710.00, spending: 1018.93, balance: 536.08, note: "Eoin P2Ps: £650 + Simplyhealth cashback £60. Japan tail spend." },
      ],
      dec: {
        categories: [
          { name: "Groceries (Sainsbury's, Waitrose, Bayley Sage, Tesco)", amount: 292.14, icon: "🛒" },
          { name: "Utilities (Octopus £211.45 + Hyperoptic £59.38)", amount: 270.83, icon: "💡" },
          { name: "Dining & pubs (Funky Cellar, Grapeshots, Woodins, Rhubarb, Gun)", amount: 138.08, icon: "🍽" },
          { name: "Other (Post Office £103.54, Reeves x2 £33)", amount: 152.49, icon: "📦" },
          { name: "Transport (TfL + taxis + Uber)", amount: 72.53, icon: "🚇" },
          { name: "Shopping (ASICS)", amount: 18.00, icon: "🛍" },
          { name: "Health & pharmacy (Boots x3)", amount: 31.07, icon: "💊" },
          { name: "Subscriptions (Google Workspace)", amount: 28.52, icon: "💻" },
          { name: "Household (Ryman, Cewe, Laundry)", amount: 37.28, icon: "🏠" },
        ],
      },
      jan: {
        categories: [
          { name: "Shopping (Respoke bike £491 + Uniqlo £80 + Primark £8)", amount: 578.29, icon: "🛍" },
          { name: "Travel — Japan (Air Do £93 + transit + Alicante)", amount: 182.98, icon: "🇯🇵" },
          { name: "Utilities (Octopus £121.66 + Hyperoptic £60)", amount: 181.66, icon: "💡" },
          { name: "Groceries (Sainsbury's £76.19 + M&S + Naser)", amount: 122.87, icon: "🛒" },
          { name: "Transport (TfL + Lime)", amount: 37.59, icon: "🚇" },
          { name: "Subscriptions (Google Workspace)", amount: 28.00, icon: "💻" },
          { name: "Dining & cafés (Pret, Ole & Steen)", amount: 21.69, icon: "🍽" },
          { name: "Household (laundry)", amount: 12.00, icon: "🏠" },
          { name: "Health & pharmacy (Boots)", amount: 9.35, icon: "💊" },
          { name: "Other (Tool Shop £8)", amount: 7.99, icon: "📦" },
        ],
      },
      feb: {
        categories: [
          { name: "Travel — Japan (remaining) + Cambridge hotel", amount: 318.34, icon: "🇯🇵" },
          { name: "Utilities (Octopus £121.66 + Hyperoptic £60)", amount: 181.66, icon: "💡" },
          { name: "Transport (TfL £52.90 + Beam £43.65 + Shell £50)", amount: 152.15, icon: "🚇" },
          { name: "Subscriptions (Google £39.28 + GoDaddy £64.02)", amount: 103.30, icon: "💻" },
          { name: "Dining & cafés (Grato £81.56 + Pret + Ole & Steen)", amount: 95.16, icon: "🍽" },
          { name: "Groceries (Sainsbury's + M&S x6)", amount: 86.43, icon: "🛒" },
          { name: "Health & pharmacy (Boots £39.50 + £3.92)", amount: 43.42, icon: "💊" },
          { name: "Shopping (H&M £10 + Kiko £11.49)", amount: 21.48, icon: "🛍" },
          { name: "Household (laundry)", amount: 16.99, icon: "🏠" },
        ],
      },
      recentTransactions: [
        { date: "26 Feb", desc: "Top Laundry", amount: -16.99, flag: "🧺" },
        { date: "26 Feb", desc: "Eoin P2P top-up", amount: 500.00, flag: "💸" },
        { date: "25 Feb", desc: "Eoin P2P top-up", amount: 50.00, flag: "💸" },
        { date: "24 Feb", desc: "GoDaddy (augustst.com domain)", amount: -64.02, flag: "💻" },
        { date: "23 Feb", desc: "Hyperoptic broadband DD", amount: -60.00, flag: "🌐" },
        { date: "21 Feb", desc: "Eoin P2P top-up", amount: 100.00, flag: "💸" },
        { date: "19 Feb", desc: "Beam e-scooter", amount: -43.65, flag: "🛴" },
        { date: "12 Feb", desc: "Simplyhealth cashback credit", amount: 60.00, flag: "💚" },
        { date: "08 Feb", desc: "Grato Italian Restaurant", amount: -81.56, flag: "🍝" },
        { date: "08 Feb", desc: "Shell (petrol)", amount: -50.00, flag: "⛽" },
        { date: "08 Feb", desc: "Boots (pharmacy)", amount: -39.50, flag: "💊" },
        { date: "02 Feb", desc: "Octopus Energy DD", amount: -121.66, flag: "⚡" },
        { date: "01 Feb", desc: "Hotel Cambridge (Booking.com)", amount: -87.95, flag: "🏨" },
        { date: "01 Feb", desc: "Google Workspace", amount: -39.28, flag: "💻" },
        { date: "01 Feb", desc: "Ski tickets — Grand Hirafu, Hokkaido", amount: -57.30, flag: "⛷️" },
        { date: "29 Jan", desc: "Eoin P2P top-up", amount: 800.00, flag: "💸" },
        { date: "20 Jan", desc: "Sinead transfer (From S O'Sullivan)", amount: 500.00, flag: "💸" },
        { date: "20 Jan", desc: "SP Respoke bike purchase", amount: -490.99, flag: "🚲" },
        { date: "18 Jan", desc: "Air Do flight (Tokyo→Hokkaido)", amount: -93.13, flag: "✈️" },
        { date: "14 Jan", desc: "Sainsbury's grocery delivery", amount: -76.19, flag: "🛒" },
        { date: "02 Jan", desc: "Octopus Energy DD", amount: -121.66, flag: "⚡" },
        { date: "18 Dec", desc: "Eoin P2P top-up", amount: 600.00, flag: "💸" },
        { date: "12 Dec", desc: "Sainsbury's delivery (large shop)", amount: -176.67, flag: "🛒" },
        { date: "08 Dec", desc: "Funky Cellar (wine)", amount: -66.38, flag: "🍷" },
        { date: "08 Dec", desc: "Grato x Grapeshots evening", amount: -24.80, flag: "🍽" },
        { date: "01 Dec", desc: "Octopus Energy DD", amount: -211.45, flag: "⚡" },
      ],
    },
  },
  savings: {
    target: 180000,
    current: 112400,
    monthly: 1500,
    debts: [
      { name: "Student loan — Sinead", balance: 30000, type: "GBP", owner: "Sinead", note: "UK student loan. CRN: 18029009760. Repayments are income-contingent (9% above threshold ~£27,295/yr). Does not affect credit score. Written off after 30 years." },
    ],
    accounts: [
      { name: "Emergency fund", balance: 24000, target: 24000, type: "GBP" },
      { name: "ISA – Sinead", balance: 38200, target: 50000, type: "GBP" },
      { name: "ISA – Eoin", balance: 22400, target: 50000, type: "GBP" },
      { name: "US brokerage", balance: 22100, target: 40000, type: "USD" },
      { name: "Cash reserve", balance: 5700, target: 16000, type: "GBP" },
    ],
    history: [
      { month: "Oct", value: 98000 },
      { month: "Nov", value: 101500 },
      { month: "Dec", value: 99200 },
      { month: "Jan", value: 104800 },
      { month: "Feb", value: 108900 },
      { month: "Mar", value: 112400 },
    ],
  },
  travel: {
    trips: [
      {
        id: "eoin_spain_mar26",
        who: "Eoin",
        destination: "Madrid, Spain",
        flag: "🇪🇸",
        purpose: "work",
        departure: "2026-03-16",
        return: "2026-03-18",
        nights: 2,
        notes: "Work trip to Madrid. Irish passport — no visa needed. GHIC cover applies in Spain.",
        packed: false,
      },
      {
        id: "eoin_ireland_mar26",
        who: "Eoin",
        destination: "Ireland",
        flag: "🇮🇪",
        purpose: "family",
        departure: "2026-03-26",
        return: "2026-04-01",
        nights: 6,
        notes: "Family visit. Common Travel Area — no passport needed but bring it anyway. Track days for Irish tax residence.",
        packed: false,
      },
      {
        id: "eoin_ireland_jul26",
        who: "Eoin",
        destination: "Ireland",
        flag: "🇮🇪",
        purpose: "family",
        departure: "2026-07-05",
        return: "2026-07-06",
        nights: 1,
        notes: "Family vacation. Common Travel Area — no border control. Track days for Irish tax residence.",
        packed: false,
      },
      {
        id: "sinead_mallorca_jun26",
        who: "Sinead",
        destination: "Port de Sóller, Mallorca, Spain",
        flag: "🇪🇸",
        purpose: "leisure",
        departure: "2026-06-12",
        return: "2026-06-15",
        nights: 3,
        cost: 989.76,
        costNote: "£989.76 flights for 4 — easyJet EZY8088 out 14:00 LGW→PMI Fri 12 Jun, return 20:25 PMI→LGW Mon 15 Jun arr 21:55. Extra Bundle x4 (seats 11C/D/E/F, small cabin bag, 23kg hold bag). Hotel: Bikini Island & Mountain Hotel, Port de Sóller (bikini-hotels.com). Solo trip — friends group.",
        notes: "Gatwick → Palma, then Port de Sóller (~1hr drive north). UK passport — no visa needed (Schengen 90/180 rule, well within limits). GHIC valid in Spain. Post Office travel insurance covers this trip.",
        packed: false,
      },
      {
        id: "sinead_berlin_may26",
        who: "Sinead",
        destination: "Berlin, Germany",
        flag: "🇩🇪",
        purpose: "work",
        departure: "2026-05-19",
        return: "2026-05-20",
        nights: 1,
        cost: null,
        costNote: "Flights & accommodation arranged by ESPI (reply to Lena). 43rd ESPI Advisory Council.",
        notes: "43rd ESPI Advisory Council. UK passport — no visa needed (Schengen). GHIC valid in Germany. Post Office travel insurance covers this trip. Contact: Alida Mirković, Head of Director's Office — Alida.Mirkovic@espi.eu · +43 1 718 11 18-44. Reply travel preferences to Lena ASAP for booking.",
        packed: false,
        actionRequired: "Reply to Lena at ESPI with travel preferences so she can book flights & hotel",
      },
      {
        id: "sinead_abudhabi_apr26",
        who: "Sinead",
        destination: "Abu Dhabi",
        flag: "🇦🇪",
        purpose: "work",
        departure: "2026-04-03",
        return: "2026-04-07",
        nights: 4,
        notes: "Work trip. Irish passport — UAE visa on arrival (30 days free). Post Office travel insurance covers business travel — confirm UAE is included. No EHIC/GHIC applies.",
        packed: false,
      },
    ],
    documents: {
      sinead: [
        { type: "UK Passport", expiry: "2035-06-30", flag: "🇬🇧", note: "9+ years remaining" },
        { type: "US Visa (O-1B)", expiry: "2027-04-17", flag: "🇺🇸", note: "Expires Apr 2027 — renew before any US travel after that date" },
        { type: "GHIC", expiry: "2029-11-26", flag: "🇬🇧", note: "Valid for EU/EEA medical emergencies" },
      ],
      eoin: [
        { type: "Irish Passport", expiry: "2033-01-24", flag: "🇮🇪", note: "7+ years remaining" },
        { type: "UK BRP", expiry: "2028-08-27", flag: "🇬🇧", note: "Keep safe — needed for UK re-entry" },
        { type: "GHIC", expiry: "2029-11-26", flag: "🇬🇧", note: "Valid for EU/EEA medical emergencies" },
      ],
    },
    social: [
      {
        id: "dinner_alex_mar26",
        type: "dinner",
        label: "Dinner party — Alex Chalmers & Catherine",
        date: "2026-03-14",
        who: ["Sinead", "Eoin", "Alex Chalmers", "Catherine"],
        venue: "Our house",
        notes: "Hosting Alex Chalmers and his partner Catherine.",
        emoji: "🍽",
      },
      {
        id: "comedy_mar26",
        type: "concert",
        label: "Vittorio Angelone — Comedy Show",
        date: "2026-03-20",
        who: ["Sinead", "Eoin", "Chris Eastwood"],
        venue: "London",
        notes: "With Chris Eastwood. Comedian Vittorio Angelone.",
        emoji: "🎭",
      },
      {
        id: "dinner_mar26",
        type: "dinner",
        label: "Dinner party — Karen & partner",
        date: "2026-03-21",
        who: ["Sinead", "Eoin", "Karen"],
        venue: "TBC",
        notes: "Dinner party with Karen and her partner.",
        emoji: "🍽",
      },
      // Birthdays & anniversaries — add below
      // { id: "bday_1", type: "birthday", label: "Name's birthday", date: "2026-XX-XX", who: ["Sinead", "Eoin"], venue: "", notes: "", emoji: "🎂" },
      // Weddings & big events — add below
      // { id: "wedding_1", type: "wedding", label: "Name's wedding", date: "2026-XX-XX", who: ["Sinead", "Eoin"], venue: "", notes: "", emoji: "💒" },
    ],
    countryTips: {
      "🇦🇪": ["Dress modestly outside hotel/resort areas", "Alcohol only in licensed hotels and restaurants", "No GHIC — confirm medical cover with Post Office", "GMT+4 (3 hrs ahead of London)"],
      "🇪🇸": ["GHIC covers medical emergencies", "GMT+1 in March", "UK driving licence valid"],
      "🇮🇪": ["Common Travel Area — no border control", "Track days for Irish tax residence (183-day rule)", "Same timezone as London (GMT) in March"],
    },
  },
  calendar: {
    // All key dates pulled from across the dashboard — single source of truth
    events: [
      //  MARCH 2026 
      { date: "2026-03-08", label: "Today", category: "admin", who: "Both", note: "" },
      { date: "2026-03-16", label: "Eoin → Madrid, Spain (work)", category: "travel", who: "Eoin", note: "Returns 18 Mar" },
      { date: "2026-03-26", label: "Eoin → Ireland (family)", category: "travel", who: "Eoin", note: "Returns 1 Apr" },
      //  APRIL 2026 
      { date: "2026-04-01", label: "Amend Eoin 2024 Form 11 (Ireland)", category: "tax", who: "Eoin", note: "Fix marital status → Married, joint assessment", priority: "high" },
      { date: "2026-04-03", label: "Sinead → Abu Dhabi (work)", category: "travel", who: "Sinead", note: "Returns 7 Apr" },
      { date: "2026-04-05", label: "UK Self Assessment deadline", category: "tax", who: "Sinead", note: "Non-dom election worth up to £28k — must decide remittance vs arising basis", priority: "high" },
      { date: "2026-04-05", label: "Car insurance expires", category: "insurance", who: "Both", note: "Markerstudy policy TX103713004204 — renew early for classic car scheme", priority: "high" },
      { date: "2026-04-06", label: "Amazon Prime renews", category: "subscription", who: "Sinead", note: "£8.99/mo — consider switching to annual (£95/yr, saves £13)" },
      { date: "2026-04-07", label: "Lyca Mobile renews", category: "subscription", who: "Sinead", note: "£25/mo UK plan" },
      { date: "2026-04-15", label: "US FBAR (FinCEN 114) deadline", category: "tax", who: "Both", note: "Delinquent 2019–2024 — file via Streamlined Procedure", priority: "high" },
      { date: "2026-04-15", label: "US 2024 Federal Tax Return", category: "tax", who: "Both", note: "$20,640 estimated owed — extension available to Oct 2026", priority: "high" },
      //  MAY 2026 
      { date: "2026-05-01", label: "Irish Voluntary Disclosure deadline", category: "tax", who: "Both", note: "€29,506 owed — file before Revenue contact to limit surcharge to 5%", priority: "high" },
      //  JUNE 2026 
      { date: "2026-06-15", label: "auguststudios.co domain renews", category: "subscription", who: "Sinead", note: "GoDaddy ~£28.78/yr" },
      //  JULY 2026 
      { date: "2026-07-15", label: "romywest.com domain renews", category: "subscription", who: "Sinead", note: "GoDaddy ~£22.78/yr" },
      //  SEPT 2026 
      { date: "2026-09-15", label: "phoebesinclair.com domain renews", category: "subscription", who: "Sinead", note: "GoDaddy ~$28.78/yr" },
      //  DEC 2026 
      { date: "2026-12-09", label: "Lease break clause window opens", category: "property", who: "Both", note: "Either party can exit lease with 2 months' written notice from this date", priority: "medium" },
      { date: "2026-12-09", label: "Rent review — RPI linked", category: "property", who: "Both", note: "Min 3%, max 8% increase. Check RPI before this date.", priority: "high" },
      //  2027 
      { date: "2027-04-17", label: "Sinead US Visa (O-1B) expires", category: "visa", who: "Sinead", note: "Renew before any planned US travel after this date", priority: "medium" },
      { date: "2027-08-27", label: "Eoin UK BRP expires", category: "visa", who: "Eoin", note: "Biometric Residence Permit — apply to renew well in advance", priority: "medium" },
      { date: "2027-12-08", label: "Lease end", category: "property", who: "Both", note: "3-year AST ends — renew, renegotiate, or move", priority: "medium" },
      { date: "2027-03-08", label: "Contents insurance renewal — Homeprotect", category: "insurance", who: "Both", note: "Policy C09/1155684 · £74.60/yr · compare quotes at renewal", priority: "low" },
      { date: "2028-11-26", label: "GHIC expires — both", category: "admin", who: "Both", note: "Global Health Insurance Cards for Sinead & Eoin — renew via NHS" },
      //  RECURRING 
      { date: "recurring-monthly-06", label: "Rent due — £6,779.50", category: "property", who: "Both", note: "6th of every month — DN Lettings (confirmed from Monzo statements Feb & Mar 2026)" },
    ],
  },
  pension: {
    // Last updated: Mar 2026. Sources: verbal only — upload statements to confirm figures.
    eoin: {
      totalKnown: 300000,
      retirementTarget: 2049,
      pots: [
        {
          id: "eoin_uk_current",
          label: "UK — Current employer",
          employer: "Current London employer",
          status: "active",
          country: "🇬🇧",
          type: "Defined Contribution",
          estimatedValue: null,
          annualContribution: null,
          provider: null,
          notes: "Eoin is on £200k salary. Every £1 contributed via salary sacrifice saves ~45p tax above £125k. HIGH PRIORITY to confirm contribution rate.",
        },
        {
          id: "eoin_uk_prev",
          label: "UK — Previous employer",
          employer: "Previous UK employer (name unknown)",
          status: "deferred",
          country: "🇬🇧",
          type: "Defined Contribution",
          estimatedValue: null,
          annualContribution: 0,
          provider: null,
          notes: "Deferred pot from a previous UK job. Will grow with investment returns only. Can be consolidated into current employer scheme or a SIPP.",
        },
        {
          id: "eoin_us",
          label: "US — Former employer(s)",
          employer: "US employer(s) — likely includes pre-London US role",
          status: "deferred",
          country: "🇺🇸",
          type: "401(k) / US retirement account",
          estimatedValue: null,
          annualContribution: 0,
          provider: null,
          notes: "US 401k left with previous employer or rolled to IRA. As a non-US resident this is complex — do not withdraw early (30% penalty + tax). Consider rolling to IRA if not already done.",
        },
      ],
      actions: [
        { text: "Find all 3 pension providers — check old payslips, P60s, or use the Pension Tracing Service (0800 731 0193 / gov.uk/find-pension-contact-details)", priority: "high" },
        { text: "Check current employer pension contribution rate on payslip — confirm salary sacrifice is set up (saves ~45p per £1 above £125k)", priority: "high" },
        { text: "Request annual statements from all 3 pots to get accurate current values", priority: "high" },
        { text: "Consider consolidating the frozen UK pot into current employer scheme or a low-cost SIPP (e.g. Vanguard, Fidelity) — simplifies management", priority: "medium" },
        { text: "US 401k / IRA: do NOT withdraw early — get cross-border financial advice on managing as a UK resident. Report on US tax return annually.", priority: "medium" },
        { text: "Check if current UK employer offers enhanced matching — ensure Eoin contributes at least enough to get full employer match", priority: "medium" },
      ],
    },
    sinead: {
      totalKnown: 0,
      retirementTarget: 2051,
      pots: [
        {
          id: "sinead_none",
          label: "No pension confirmed",
          status: "missing",
          country: "—",
          type: "—",
          estimatedValue: 0,
          annualContribution: 0,
          provider: null,
          notes: "No confirmed pension pot. At ~38 with high earnings this is a significant gap. A UK SIPP is the most flexible option for self-employed / freelance income.",
        },
      ],
      actions: [
        { text: "Open a UK SIPP — Vanguard, Fidelity, or AJ Bell are low-cost options. Can be done online in 30 minutes.", priority: "high" },
        { text: "Start contributing — £500/month gets 20% basic rate relief automatically (£400 in, £500 in pot). Higher rate relief claimable via self assessment.", priority: "high" },
        { text: "Annual SIPP allowance is £60,000 (or 100% of UK earnings). With US income on remittance basis, UK-qualifying earnings may be low — get advice before large contributions.", priority: "medium" },
        { text: "Check if any Irish pension exists from pre-emigration employment — contact previous Irish employers or check with Revenue", priority: "low" },
        { text: "If a US 401k or IRA exists from MIT/NextSource employment, locate it and do not withdraw — roll to IRA if possible", priority: "medium" },
      ],
    },
  },
  healthcare: {
    health: {
      provider: "AXA Health",
      planType: "Private Medical Insurance — via Gresham House (Eoin's employer benefit)",
      underwriting: "Moratorium — pre-existing conditions from 5 years prior not covered initially; eligible after 2 years symptom-free",
      excess: 250,
      premiumPaidBy: "Gresham House (benefit in kind — taxed at Eoin's marginal rate)",
      claimsPhone: "0800 206 1808",
      claimsNote: "Must pre-authorise all claims before treatment",
      onlinePortal: "https://www.axahealth.co.uk/member-login",
      gpService: "Dr@Hand — unlimited 24/7 video/phone GP, prescriptions delivered, referrals",
      coverItems: [
        { item: "Hospital charges", cover: "Full Cover" },
        { item: "Consultant fees", cover: "Full Cover (fee-approved) / AXA schedule (non-approved)" },
        { item: "Diagnostic tests", cover: "Full Cover" },
        { item: "CT/MRI/PET Scans", cover: "Full Cover" },
        { item: "NHS cash benefit", cover: "£100/night up to £2,000/yr" },
        { item: "Specialist consultations (outpatient)", cover: "Full Cover (fee-approved)" },
        { item: "Therapies (physio, osteo, chiro, acupuncture)", cover: "Included" },
        { item: "Cancer cover", cover: "Comprehensive" },
        { item: "Mental health", cover: "Full Cover" },
        { item: "Online GP (Dr@Hand)", cover: "Unlimited" },
        { item: "Gym discount", cover: "Up to 40% off Nuffield / Hussle" },
      ],
    },
    dental: {
      sinead: {
        clinic: "Bayswater Dental Clinic",
        address: "1 Cervantes Court, Inverness Terrace, London W2 6JE",
        phone: "020 7229 4627",
        dentist: "Dr Korosh Majidi",
        treatmentPlan: {
          ref: "Course of Treatment 34006 (Private)",
          date: "26 Jul 2025",
          total: 2599,
          financeAvailable: "0% finance available on treatments over £600",
          cancellationPolicy: "48 hours notice required or deposit forfeited",
          appointments: [
            { appt: 1, items: [{ desc: "Clear Aligner Consultation", fee: 49 }] },
            { appt: 2, items: [
              { desc: "Spark Aligners Case Assessment, Planning & 3D Scan", fee: 400 },
              { desc: "Pre Treatment OPG Radiograph", fee: 60 },
              { desc: "Discount for OPG on Spark Aligners", fee: -60 },
              { desc: "Adjustment of consultation fee", fee: -49 },
              { desc: "Manufacturing of Spark-20 Aligners", fee: 799 },
            ]},
            { appt: 3, items: [{ desc: "Spark Aligners fit & review", fee: 350 }] },
            { appt: 4, items: [{ desc: "Spark Aligners fit & review", fee: 350 }] },
            { appt: 5, items: [{ desc: "Spark Aligners fit & review", fee: 350 }] },
            { appt: 6, items: [{ desc: "Spark Aligners fit & review", fee: 350 }] },
            { appt: 7, items: [
              { desc: "Removable Retainer (included)", fee: 0 },
              { desc: "Complementary Home Teeth Whitening", fee: 0 },
            ]},
          ],
        },
      },
    },
    simplyhealth: {
      provider: "Simplyhealth",
      planName: "Optimise Health Plan",
      planType: "Health Cash Plan — via Gresham House (Eoin's employer benefit)",
      portal: "simplyhealth.co.uk",
      claimsOnline: "simplyhealth.co.uk/register",
      claimsPhone: "0300 100 1020",
      claimsHours: "Mon–Fri, 8am–6pm",
      gpService: "24/7 GP via SimplyPlan app or telephone",
      counsellingService: "24/7 telephone counselling",
      gymDiscount: "Up to 25% off, 2,000+ gyms across the UK",
      claimsNote: "Claims submitted online or via app. Submit within 6 months of treatment. 100% payback up to annual limits.",
      levels: [
        { benefit: "Eye care", l1: 60, l2: 75, l3: 100, l4: 125, l5: 175, l6: 250 },
        { benefit: "Dental", l1: 60, l2: 75, l3: 100, l4: 125, l5: 175, l6: 250 },
        { benefit: "Dental accident", l1: 200, l2: 300, l3: 400, l4: 450, l5: 500, l6: 600 },
        { benefit: "Muscles, bones & joints", l1: 150, l2: 200, l3: 250, l4: 275, l5: 350, l6: 500 },
        { benefit: "Foot care", l1: 25, l2: 50, l3: 75, l4: 75, l5: 100, l6: 150 },
        { benefit: "Diagnostics", l1: 250, l2: 300, l3: 400, l4: 450, l5: 500, l6: 600 },
        { benefit: "Health assessment", l1: 50, l2: 100, l3: 250, l4: 300, l5: 350, l6: 500 },
        { benefit: "Private GP / dietitian / vaccination", l1: 75, l2: 75, l3: 75, l4: 75, l5: 75, l6: 75 },
        { benefit: "Prescriptions", l1: 15, l2: 20, l3: 25, l4: 30, l5: 30, l6: 35 },
        { benefit: "Hospital (per day/night, max 20)", l1: 20, l2: 20, l3: 20, l4: 20, l5: 20, l6: 20 },
        { benefit: "New child payment", l1: 200, l2: 200, l3: 200, l4: 200, l5: 200, l6: 200 },
      ],
      benefitDetails: [
        { name: "Eye care", icon: "👁", desc: "Eye tests (incl. retina scans), prescription glasses, sunglasses, safety glasses, contact lenses, fitting fees, frames, repairs, consumables.", notCovered: "Eye surgery (laser, cataract), magnifying glasses, ophthalmic consultations." },
        { name: "Dental", icon: "🦷", desc: "Check-ups, hygienist, fillings, crowns, bridges, dentures, endodontics, dental x-rays, orthodontist, braces.", notCovered: "Prescription charges, cosmetic treatment, dental treatment at hospital as inpatient/day-patient." },
        { name: "Dental accident", icon: "🚨", desc: "Restorative treatment within 30 days of accident. Sports injuries covered if wearing appropriate protection.", notCovered: "Injury from food/drink, injury from foreign bodies, under influence of alcohol/drugs, self-inflicted." },
        { name: "Muscles, bones & joints", icon: "💪", desc: "Physiotherapy, osteopathy, chiropractic, acupuncture (HCPC/GOC/GCC registered). Includes consumables from therapist.", notCovered: "Sports massage, reiki, aromatherapy, x-rays, scans, cosmetic pedicures." },
        { name: "Foot care", icon: "🦶", desc: "Chiropody, podiatry, reflexology, gait analysis, orthotics. HCPC-registered practitioners only.", notCovered: "Cosmetic pedicures, x-rays, scans, remedial massage." },
        { name: "Diagnostics", icon: "🔬", desc: "Private consultant appointments, diagnostic blood tests (GP-referred), scans (MRI, CT, x-ray, ECG), allergy tests.", notCovered: "Follow-up/ongoing management, surgery fees, home blood tests, fertility, psychological assessments." },
        { name: "Health assessment", icon: "📋", desc: "Full health screening at CQC-registered establishment — must include BMI/body composition, blood pressure, and cholesterol/diabetes check.", notCovered: "Individual checks only, self-administered home assessments." },
        { name: "Private GP / dietitian / vaccination", icon: "👨‍⚕️", desc: "Private GP consultation, registered dietitian consultation, vaccinations and inoculations, flu jabs.", notCovered: "Nothing specific excluded beyond registration requirements." },
        { name: "Prescriptions", icon: "💊", desc: "NHS prescriptions, NHS Prepayment Certificates (PPC), private prescriptions from GP or dentist (incl. SimplyPlan app).", notCovered: "Non-prescribed medication, OTC medicines." },
        { name: "Hospital", icon: "🏥", desc: "£20/night contribution for up to 20 nights/year. Cancer outpatient treatment covered. Parent staying with child inpatient also covered.", notCovered: "First 5 nights giving birth, kidney dialysis, laser eye surgery, cosmetic surgery." },
      ],
      policyYear: "1 Jul 2025 – 30 Jun 2026",
      renewalDate: "1 Jul 2026",
      members: {
        eoin: {
          name: "Eoin Mcdonald",
          level: 1,
          entitlements: [
            { benefit: "Dental",                  annual: 60,  remaining: 0,   unit: "£",      note: "Fully used — Bayswater Dental claims" },
            { benefit: "Dental Accident",          annual: 200, remaining: 200, unit: "£" },
            { benefit: "Diagnostics",             annual: 250, remaining: 250, unit: "£" },
            { benefit: "Eyes",                    annual: 60,  remaining: 60,  unit: "£" },
            { benefit: "Foot Care",               annual: 25,  remaining: 25,  unit: "£" },
            { benefit: "GP Visit",                annual: 75,  remaining: 75,  unit: "£" },
            { benefit: "Health Assessment",       annual: 50,  remaining: 50,  unit: "£" },
            { benefit: "Hospitalisation",         annual: 20,  remaining: 20,  unit: "stays" },
            { benefit: "Muscles, Bones & Joints", annual: 150, remaining: 150, unit: "£" },
            { benefit: "New Child Payment",       annual: 200, remaining: 200, unit: "£" },
            { benefit: "PMI Excess",              annual: 250, remaining: 250, unit: "£" },
            { benefit: "Prescription",            annual: 15,  remaining: 15,  unit: "£" },
          ],
        },
        sinead: {
          name: "Sinead O'Sullivan",
          level: 1,
          entitlements: [
            { benefit: "Dental",                  annual: 60,  remaining: 0,   unit: "£",      note: "Fully used" },
            { benefit: "Dental Accident",          annual: 200, remaining: 200, unit: "£" },
            { benefit: "Diagnostics",             annual: 250, remaining: 250, unit: "£" },
            { benefit: "Eyes",                    annual: 60,  remaining: 60,  unit: "£" },
            { benefit: "Foot Care",               annual: 25,  remaining: 25,  unit: "£" },
            { benefit: "GP Visit",                annual: 75,  remaining: 75,  unit: "£" },
            { benefit: "Health Assessment",       annual: 50,  remaining: 50,  unit: "£" },
            { benefit: "Hospitalisation",         annual: 20,  remaining: 20,  unit: "stays" },
            { benefit: "Muscles, Bones & Joints", annual: 150, remaining: 150, unit: "£" },
            { benefit: "PMI Excess",              annual: 250, remaining: 250, unit: "£" },
            { benefit: "Prescription",            annual: 15,  remaining: 15,  unit: "£" },
          ],
        },
      },
            claimsProcess: [
        { step: "1", text: "Register at simplyhealth.co.uk/register or download the SimplyPlan app." },
        { step: "2", text: "Pay for your treatment upfront — keep the original receipt showing patient name, practitioner, treatment, date, and amount." },
        { step: "3", text: "Submit your claim online or via app within 6 months of treatment. Invoices and card receipts are NOT accepted — must be a proper receipt." },
        { step: "4", text: "Simplyhealth will pay 100% of the cost up to your annual benefit limit, directly into your UK bank account." },
      ],
      exclusions: [
        "Treatment before your policy start date or during the qualifying period",
        "Treatment from an immediate family member or business you own",
        "Insurance premiums, extended warranties, or regular payment plans (e.g. dental practice plans)",
        "Administration, referral, joining, or registration fees",
        "Costs paid with vouchers, coupons, or retail loyalty points",
        "Missed appointment fees, claim form completion fees",
      ],
    },
    travel: {
      provider: "Post Office Travel Insurance",
      underwriter: "Collinson Insurance (Astrenska Insurance Ltd)",
      policyType: "Annual Multi-trip",
      coverLevel: "Max",
      coveredArea: "Worldwide",
      maxTripDuration: "31 days (extendable to 45 or 60)",
      renewalNote: "Auto-renews — review 3 weeks before expiry",
      claimsOnline: "postoffice.claimhere.co.uk",
      claimsPhone: "0333 333 9702",
      emergencyPhone: "+44 (0)20 8865 3074",
      keyBenefits: [
        { section: "Cancellation", limit: "£5,000", excess: "£75", note: "Per person. Must cancel via travel provider first." },
        { section: "Emergency medical", limit: "£15 million", excess: "£75", note: "Contact +44 (0)20 8865 3074 once admitted overnight." },
        { section: "Medical Assistance Plus", limit: "3 appts/person/trip", excess: "Nil", note: "24/7 video or clinic consultation. Outside UK only." },
        { section: "Cutting short trip", limit: "£5,000", excess: "£75", note: "Must authorise with insurer before returning." },
        { section: "Baggage", limit: "£3,000", excess: "£75", note: "Single item £400 · Valuables £400 · Mobile £100" },
        { section: "Baggage delay", limit: "£75/day, £300 max", excess: "Nil", note: "Outward journey only, delay >24hrs." },
        { section: "Delay benefit", limit: "£50 per 4hrs, £150 max", excess: "Nil", note: "At departure point after check-in." },
        { section: "Abandonment (12hr+)", limit: "£5,000", excess: "£75", note: "Unused travel & accommodation costs." },
        { section: "Money & travel docs", limit: "£500", excess: "£75", note: "Cash limit £500 (£750 if Post Office Travel Money Card)." },
        { section: "Personal accident", limit: "£20,000", excess: "Nil", note: "Death 18–65: £20k · Under 18: £2k · Over 65: £1k." },
        { section: "Personal liability", limit: "£2 million", excess: "£75", note: "All insured persons combined." },
        { section: "Hospital benefit", limit: "£40/day, £500 max", excess: "Nil", note: "Per 24hr inpatient stay." },
        { section: "Repatriation of remains", limit: "£12,500", excess: "£75", note: "Overseas only." },
        { section: "Missed departure (UK)", limit: "£1,500", excess: "£75", note: "Additional transport to reach destination." },
        { section: "Missed departure outside UK", limit: "£1,500", excess: "£75", note: "Stranded abroad." },
      ],
      notCovered: [
        "Pre-existing medical conditions unless declared and accepted in writing",
        "Claims where you knew you'd need to claim when buying the policy",
        "Government-imposed travel restrictions (border closures, lockdowns)",
        "FCDO advising against ALL travel to your destination",
        "Epidemics and pandemics (Covid-19 has limited specific cover only)",
        "Winter sports unless Winter Sports Upgrade purchased",
        "Riding quad bikes, ATVs, e-bikes, Segways or e-scooters — ever",
        "Balcony climbing/jumping regardless of height",
        "Manual work (construction, animal care, medical/carer work)",
        "Activities requiring specialist training not listed in covered list",
        "Sports equipment while in use (only covered when not in use)",
        "Items left unattended — no cover for theft",
        "Valuables/electronics in checked luggage (unless carrier insisted)",
        "Mobile phones over £100 without Gadget Upgrade",
      ],
      watchPoints: [
        { text: "Declare any new medical conditions — must re-screen if health changes after purchase", priority: "high" },
        { text: "Contact emergency line (+44 20 8865 3074) as soon as you know you'll be admitted overnight", priority: "high" },
        { text: "Report lost/stolen baggage within 48hrs to Police and obtain written report", priority: "high" },
        { text: "All claims must be submitted within 60 days of return", priority: "medium" },
        { text: "For UK trips: must have paid accommodation booked, OR be 100+ miles from home, OR have a sea crossing", priority: "medium" },
        { text: "Valuables and electronics must be kept with you or in a locked hotel safe", priority: "medium" },
        { text: "Max 31 days per trip on Max plan — check before booking long trips", priority: "medium" },
        { text: "Green Cards are listed as 'travel documents' — covered under money & travel docs section", priority: "low" },
        { text: "GHIC card can reduce/eliminate excess on EU medical claims — apply at ghic.org.uk", priority: "low" },
      ],
    },
    car: {
      insurer: "Markerstudy Insurance Services Ltd",
      broker: "Lancaster Insurance",
      scheme: "Lancaster Treasured IFR",
      policyNo: "TX103713004204",
      policyholder: "Ms Sinead O'Sullivan",
      drivers: ["Sinead O'Sullivan (policyholder)", "Eoin Mac Domhnaill (spouse)"],
      vehicle: {
        make: "Mercedes-Benz 450",
        year: 1978,
        reg: "UJG 500T",
        value: 45000,
        cc: 4520,
        cover: "Comprehensive",
      },
      vehicleTax: {
        status: "Valid",
        validFrom: "01 Apr 2026",
        expiry: "31 Mar 2027",
        cost: 0,
        ref: "1270-6647-9434-5896",
        note: "Historic vehicle exemption (pre-1981) — £0.00. Renewed 11 Mar 2026.",
      },
      period: { start: "5 Apr 2025", expiry: "2026-04-05" },
      premium: { net: 383.43, ipt: 46.01, total: 429.44 },
      use: "Social, Domestic & Pleasure — no commuting",
      mileageLimit: 3000,
      excesses: [
        { type: "Voluntary — AD/Malicious/Fire & Theft", amount: 250 },
        { type: "Compulsory — AD/Malicious/Fire & Theft", amount: 600 },
        { type: "Total excess (voluntary + compulsory)", amount: 850 },
        { type: "Windscreen", amount: 100 },
      ],
      endorsements: [
        { code: "003", title: "Limited Mileage 3,000", detail: "Cover void if driven over 3,000 miles in policy year. Contact Lancaster if limit likely exceeded." },
        { code: "005", title: "Garaging Endorsement", detail: "Must be kept in locked, secured building overnight when within ½ mile of home address." },
        { code: "012", title: "Excludes commuting", detail: "No cover for travel to/from any permanent place of work or study." },
        { code: "021", title: "No driving other cars", detail: "Sinead and Eoin are not covered to drive any other vehicle under this policy." },
        { code: "024", title: "Courtesy car", detail: "Available when using insurer approved repairer — not if write-off, stolen unrecovered, or damaged abroad." },
      ],
      europeanCover: "Minimum compulsory cover in EU + Andorra, Bosnia, Iceland, Liechtenstein, Norway, Serbia, Switzerland. Contact Lancaster before any trip abroad.",
      claimsPhone: "0344 873 8183",
      watchPoints: [
        { text: "Annual mileage cap 3,000 miles — cover voids entirely if exceeded. Track mileage carefully.", priority: "high" },
        { text: "Car must be garaged overnight at or near home — no street parking within ½ mile of home.", priority: "high" },
        { text: "No commuting — policy void if used for regular travel to work or study.", priority: "high" },
        { text: "Insurance expires 5 April 2026 — renew Lancaster policy imminently.", priority: "high" },
        { text: "Vehicle tax valid 1 Apr 2026 – 31 Mar 2027 — renewed 11 Mar 2026 (ref 1270-6647-9434-5896). £0 historic exemption.", priority: "low" },
        { text: "Total excess is £850 (£250 voluntary + £600 compulsory) — factor this into claim decisions.", priority: "medium" },
        { text: "Contact Lancaster before driving in Europe to confirm full cover applies.", priority: "medium" },
        { text: "No driving other cars — neither Sinead nor Eoin is covered in any other vehicle.", priority: "low" },
      ],
      file: "insurance/Car_Insurance_Certificate.pdf",
    },
  },
  addresses: {
    uk: {
      label: "UK Home Address",
      line1: "4 Caroline Place Mews",
      line2: "",
      city: "London",
      postcode: "W2 4AQ",
      country: "United Kingdom",
      flag: "🇬🇧",
    },
    us: {
      label: "US Mailing Address",
      line1: "5013 S Louise Ave",
      line2: "PMB 2162",
      city: "Sioux Falls",
      state: "SD",
      zip: "57108",
      country: "United States",
      flag: "🇺🇸",
      provider: "Provided by PostScanMail",
      note: "Virtual mailbox — used for USCIS, IRS, FBAR correspondence",
    },
  },
  immigration: [
    {
      person: "Sinead",
      nationality: "British",
      flag: "🇬🇧",
      dob: "17 Apr 1989",
      documents: [
        {
          type: "UK Passport",
          number: "149641323",
          country: "🇬🇧",
          issuer: "HMPO",
          issued: "30 Jun 2025",
          expiry: "2035-06-30",
          status: "Valid",
          file: "identity/Sinead OSullivan Passport.pdf",
        },
        {
          type: "US Green Card",
          number: "USCIS# 216-621-525",
          country: "🇺🇸",
          issuer: "USCIS",
          issued: "26 Nov 2019",
          expiry: "2029-11-26",
          status: "Valid",
          category: "E26",
          renewBy: "2029-05-26",
          fileFront: "identity/SOS Green Card Front.jpg", fileBack: "identity/SOS Green Card Back.jpg",
        },
        {
          type: "Global Entry",
          number: "PASSID 157263768",
          country: "🇺🇸",
          issuer: "US CBP / Trusted Traveler",
          issued: "06 Nov 2021",
          expiry: "2027-04-17",
          status: "Valid",
          fastid: "126472004",
          note: "Also covers TSA PreCheck",
          fileFront: "identity/SOS Global Entry Front.jpg", fileBack: "identity/SOS Global Entry Back.jpg",
        },
      ],
      ukRight: {
        type: "British Citizen — right to live and work in UK",
        note: "No visa required",
      },
      notes: "British citizen — no UK visa needed. FIG regime active from 2025/26.",
    },
    {
      person: "Eoin",
      nationality: "Irish",
      flag: "🇮🇪",
      dob: "27 Aug 1986",
      documents: [
        {
          type: "Irish Passport",
          number: "LB6422293",
          country: "🇮🇪",
          issuer: "Passport Office, Dublin",
          issued: "25 Jan 2023",
          expiry: "2033-01-24",
          status: "Valid",
          file: "identity/Eoin MacDomhnaill Passport.jpg",
        },
        {
          type: "US Green Card",
          number: "USCIS# 214-992-112",
          country: "🇺🇸",
          issuer: "USCIS",
          issued: "26 Nov 2019",
          expiry: "2029-11-26",
          status: "Valid",
          category: "E27",
          renewBy: "2029-05-26",
          fileFront: "identity/EMD Green Card Front.jpg", fileBack: "identity/EMD Green Card Back.jpg",
        },
        {
          type: "Global Entry",
          number: "PASSID 161599368",
          country: "🇺🇸",
          issuer: "US CBP / Trusted Traveler",
          issued: "18 May 2023",
          expiry: "2028-08-27",
          status: "Valid",
          fastid: "130124845",
          note: "Also covers TSA PreCheck",
          fileFront: "identity/EMD Global Entry Front.jpg", fileBack: "identity/EMD Global Entry Back.jpg",
        },
      ],
      ukRight: {
        type: "Irish Citizen — Common Travel Area rights",
        note: "Irish citizens have the right to live and work in the UK under the CTA — no visa required",
      },
      notes: "Irish citizen — right to live and work in UK under Common Travel Area. No visa required.",
    },
  ],
  tax: {
    // Source: Cross-Border Tax Briefing Pack (revised 4 March 2026)
    // Filing status: Married Filing Jointly (US) / Joint Assessment (Ireland)
    // Preparer (historical): Bean Accounting & Tax, PLLC (Darwin Mintu)
    obligations: [
      { obligation: "UK Self Assessment — Sinead non-dom election", due: "2026-04-05", amount: 28000, status: "urgent", jurisdiction: "🇬🇧", note: "Worth up to £28K — must decide remittance vs arising basis before April 2026" },
      { obligation: "Amend Eoin 2024 Form 11 — correct marital status + split-year", due: "2026-04-01", amount: 0, status: "urgent", jurisdiction: "🇮🇪", note: "Filed as 'Single'; must be Married + absorb into joint assessment" },
      { obligation: "FBAR (FinCEN 114) 2019–2024 — both Sinead & Eoin", due: "2026-04-15", amount: 0, status: "urgent", jurisdiction: "🇺🇸", note: "Delinquent filing, non-wilful — no penalty expected" },
      { obligation: "US 2024 Federal Return (MFJ)", due: "2026-04-15", amount: 20640, status: "urgent", jurisdiction: "🇺🇸", note: "Extension available to Oct 2026" },
      { obligation: "Irish Voluntary Disclosure — 2021–2024", due: "2026-05-01", amount: 29506, status: "urgent", jurisdiction: "🇮🇪", note: "File before Revenue contact to limit surcharge to 5%" },
      { obligation: "US 2025 Federal Return (MFJ)", due: "2026-10-15", amount: 8500, status: "upcoming", jurisdiction: "🇺🇸", note: "With automatic extension" },
      { obligation: "Irish Form 11 — 2025 (non-resident, Irish-source)", due: "2026-10-31", amount: 831, status: "upcoming", jurisdiction: "🇮🇪" },
      { obligation: "UK Self Assessment — 2025/26 (Sinead + Eoin)", due: "2027-01-31", amount: 0, status: "upcoming", jurisdiction: "🇬🇧", note: "Eoin PAYE settled; Sinead remittance basis election here" },
    ],
    totalCost: {
      // Grand Summary — best case (remittance basis elected)
      irelandBackTax: 29506,
      irelandPenaltiesInterest: 4975,
      usFederal: 29140,          // $29,140 converted ~€27,000
      ukTax: 0,                  // £0 if remittance basis elected
      professionalFees: 10000,
      total: 73600,
      previousEstimate: 139000,
      saving: 65400,
    },
    // Comparison stages
    estimateHistory: [
      { stage: "Original (Sinead only, single)", amount: 139000 },
      { stage: "After expenses + non-residence", amount: 78000 },
      { stage: "After filed returns + split-year + no IL", amount: 73600 },
    ],
    // Income summary by person & year (all currencies)
    incomeByPerson: {
      sinead: {
        irish: [
          { year: "2021", twoRn: 9000, theCurrency: 2800, businessPost: 0, irishTimes: 0, speaker: 0, total: 11800 },
          { year: "2022", twoRn: 13000, theCurrency: 9150, businessPost: 0, irishTimes: 0, speaker: 0, total: 22150 },
          { year: "2023", twoRn: 13000, theCurrency: 15900, businessPost: 1100, irishTimes: 0, speaker: 1250, total: 31250 },
          { year: "2024", twoRn: 13000, theCurrency: 5000, businessPost: 350, irishTimes: 0, speaker: 0, total: 18350 },
          { year: "2025", twoRn: 13000, theCurrency: 0, businessPost: 0, irishTimes: 1200, speaker: 0, total: 14200 },
        ],
        us: [
          { year: "2021", source: "MIT/NextSource W-2 + ScholarSite 1099", gross: 54490, schedCExpenses: 0, net: 54490 },
          { year: "2022", source: "None", gross: 0, schedCExpenses: 0, net: 0 },
          { year: "2023", source: "Sched C gross $39,000 + Illinois Institute $1,559", gross: 39000, schedCExpenses: 8675, net: 30325 },
          { year: "2024", source: "Janklow advance $127,500", gross: 127575, schedCExpenses: 37711, net: 89864 },
          { year: "2025", source: "Janklow $131,750 + Condé Nast + other", gross: 134932, schedCExpenses: 15000, net: 119932 },
        ],
      },
      eoin: {
        us: [
          { year: "2021", wages: 457461, notes: "Filed MFJ by Bean Accounting — SETTLED" },
          { year: "2022", wages: 175320, notes: "Filed MFJ by Bean Accounting — SETTLED" },
          { year: "2023", wages: 5500, notes: "Filed MFJ by Bean Accounting — SETTLED" },
          { year: "2024", wages: 0, notes: "No US source income" },
          { year: "2025", wages: 0, notes: "No US source income" },
        ],
        irish: [
          { year: "2024", fees: 13177, notes: "Form 11 filed (incorrectly as Single) — needs amending" },
          { year: "2025", fees: 13350, notes: "Non-resident, Irish-source only" },
        ],
        uk: [
          { year: "2024", salary: 33333, payeNi: 5000, notes: "Nov–Dec only, split-year s.822 — IE excludes this" },
          { year: "2025", salary: 200000, payeNi: 81688, notes: "Full year PAYE, all UK tax collected at source" },
        ],
      },
    },
    fig: {
      // FIG regime applies to Eoin only (full year UK resident 2024/25)
      // Sinead arrived March 2025 — qualifies from 2025/26
      yearStarted: 2025,
      yearsTotal: 4,
      yearsUsed: 1,
      qualifiers: ["Sinead", "Eoin"],
      benefits: [
        { label: "Foreign income exempt", detail: "All non-UK income fully excluded from UK tax for 4 years from 2025/26" },
        { label: "Foreign gains exempt", detail: "Capital gains from non-UK assets not subject to UK CGT" },
        { label: "No remittance restriction", detail: "FIG income can be brought into UK without charge" },
        { label: "Free for first 7 years", detail: "No £30,000 annual charge — remittance basis charge does not apply yet" },
      ],
      warnings: [
        "Must not have been UK resident in any of the 10 prior tax years — Sinead confirmed not UK resident 2015–2025 ✓",
        "Claim must be made annually on Self Assessment return — do not miss deadline",
        "Sinead loses personal allowance on remittance basis, but with no UK-source income this is immaterial",
        "FIG exemption ends after 4 years — plan foreign asset disposals before year 4 (2028/29)",
        "Irish ordinary residence continues until 2027/28 — may expose non-Irish income to Irish tax",
        "Eoin's full salary (£200K) taxable in UK from Nov 2024 — PAYE fully settled, no additional UK tax",
      ],
    },
    uk: {
      taxYear: "2025/26",
      eoin: {
        salary: 200000,
        payeNi: 81688,
        additionalOwed: 0,
        note: "All UK tax settled via PAYE. Personal allowance tapered to nil above £125,140.",
      },
      sinead: {
        foreignIncomeExempt: true,
        basis: "Remittance (recommended)",
        potentialSaving: 28000,
        note: "As Irish citizen, never previously UK-domiciled — almost certainly qualifies as non-UK-domiciled. Remittance basis: foreign income (US book advances, Irish fees) only taxable if brought to UK. Arising basis would add ~£28,700.",
      },
      allowances: [
        { label: "Personal Allowance (Eoin)", used: 0, total: 0, note: "Tapered to nil at £125,140+" },
        { label: "ISA allowance", used: 8200, total: 20000 },
        { label: "Pension annual allowance", used: 4800, total: 60000 },
        { label: "CGT annual exempt amount", used: 0, total: 3000 },
      ],
      actions: [
        { text: "URGENT: Register Sinead for UK Self Assessment and get UK tax advice before April 5 2026 — non-dom / remittance basis election worth £28K", priority: "high" },
        { text: "Sinead: Do NOT transfer foreign income (US book advances, Irish fees) to UK bank account while on remittance basis", priority: "high" },
        { text: "File UK Self Assessment 2025/26 — include FIG / remittance basis election on Sinead's first return", priority: "high" },
        { text: "Eoin PAYE 2025/26: verify P60 confirms all tax settled — no further action needed", priority: "low" },
        { text: "Max ISA allowances before 5 April 2026 — £20,000 each", priority: "medium" },
        { text: "Prior UK income 2021–2024 was £3,020 total (FT/Condé Nast/AFLAC) — below personal allowance, £0 prior UK liability", priority: "low" },
      ],
    },
    us: {
      taxYear: "2025",
      filingStatus: "Married Filing Jointly (MFJ)",
      preparer: "Bean Accounting & Tax, PLLC (Darwin Mintu) — filed 2021–2023; new preparer or Bean for 2024+",
      filedYears: {
        // 2021–2023 filed and SETTLED by Bean Accounting
        "2021": { agi: 463626, federalTax: 105440, paid: 120693, balance: -15253, ilBalance: 0, status: "SETTLED" },
        "2022": { agi: 168824, federalTax: 22677, paid: 36621, balance: -13944, ilBalance: 0, status: "SETTLED" },
        "2023": { agi: 33682, federalTax: 4763, paid: 1210, balance: 3712, ilBalance: 1227, status: "SETTLED — paid 4/11/24" },
      },
      unfiledYears: [
        {
          year: "2024", status: "UNFILED",
          combinedGross: 162804,  // Sinead Sched C net $89,864 + foreign earned $16,640 + Eoin Irish €13,177 + UK £33,333
          deductions: 39550,
          taxableIncome: 123254,
          federalTax: 19500,
          seTax: 12700,
          totalTax: 32200,
          estimatedPayments: 3560,
          ftcIrish: 3000,
          ftcUK: 5000,
          additionalOwed: 20640,
          notes: "Federal only. No state return (Chicago apt given up 2020). Address: Ireland.",
        },
        {
          year: "2025", status: "ESTIMATE",
          combinedGross: 401832,  // Sinead $135K + Eoin £200K ($281K)
          deductions: 42000,
          taxableIncome: 359832,
          federalTax: 92000,
          seTax: 0,
          totalTax: 92000,
          estimatedPayments: 890*4,
          ftcIrish: 1500,
          ftcUK: 82000,           // Excess credits from Eoin's UK PAYE carry forward 10 years
          additionalOwed: 8500,
          notes: "Eoin's UK PAYE (~$103K) creates excess FTC — carry forward 10 years.",
        },
      ],
      fbar: {
        required: true,
        deadline: "2026-04-15",
        bothPersons: true,
        accounts: [
          { name: "N26 (Germany)", holder: "Sinead", iban: "DE55 1001 1001 2626 8677 55", maskedIban: "DE55 ●●●● ●●●● ●●●● ●●●● 55" },
          { name: "Starling (UK)", holder: "Sinead", details: "Acct 69534662, Sort 60-83-71", maskedDetails: "Acct ●●●●4662, Sort ●●-●●-71" },
          { name: "Revolut", holder: "Sinead", details: "Details TBC" },
          { name: "Eoin's accounts", holder: "Eoin", details: "All non-US accounts to be listed" },
        ],
      },
      openQuestions: [
        "Kindle Unlimited (Phoebe Sinclair pseudonym) royalties — not yet in any year's estimates",
        "Janklow advance classification: royalties vs personal services under US-Ireland treaty Art. 23?",
        "Zelle $3,500 from Meghann Graham (Mar 2023) — personal or income?",
        "2024 IL estimated payments ($1,160) — not needed, may be refundable; check status",
      ],
      actions: [
        { text: "File FBARs (FinCEN 114) by April 15 2026 — both Sinead and Eoin, all non-US accounts 2019–2024", priority: "high" },
        { text: "File US 2024 federal MFJ return by April 2026 (or extend to October) — $20,640 owed", priority: "high" },
        { text: "Declare Kindle Unlimited (Phoebe Sinclair) royalties across all years", priority: "high" },
        { text: "File US 2025 federal MFJ return by October 2026 (with extension) — est. $8,500 owed", priority: "high" },
        { text: "Contact Bean Accounting re: 2024–2025 filing — or engage new cross-border preparer", priority: "high" },
        { text: "Clarify Janklow advance classification under US-Ireland treaty Article 23", priority: "medium" },
        { text: "Claim 2024 IL estimated payment refund ($1,160) — no IL nexus from 2024", priority: "medium" },
        { text: "Do not amend 2021–2023 IL returns — settled amounts, risk triggering MA nexus", priority: "medium" },
      ],
    },
    ireland: {
      taxYear: "2021–2025",
      filingStatus: "Joint Assessment (married)",
      note: "Eoin's 2024 Form 11 filed incorrectly as 'Single' — must be amended and absorbed into joint assessment",
      residency: [
        { period: "Before Sep 2020", who: "Both", location: "United States (Illinois)", status: "Non-resident IE" },
        { period: "Sep 2020 – Jul 2021", who: "Both", location: "Glaslough, Co. Monaghan", status: "Resident IE" },
        { period: "Jul 2021 – Jul 2022", who: "Both", location: "US / IE (split)", status: "Non-resident (check days)" },
        { period: "Jul 2022 – Oct 2024", who: "Both", location: "Glaslough, Co. Monaghan", status: "Resident IE" },
        { period: "Nov 2024+", who: "Eoin", location: "London", status: "Split-year s.822 TCA 1997" },
        { period: "Mar 2025+", who: "Sinead", location: "London", status: "Non-resident IE" },
      ],
      liabilityByYear: [
        { year: "2021", assessable: 11800, grossTax: 672, alreadyPaid: 500, ftc: 0, additionalOwed: 172, notes: "Non-resident — Sinead Irish-source only. Eoin: €0 IE income." },
        { year: "2022", assessable: 22660, grossTax: 2693, alreadyPaid: 616, ftc: 0, additionalOwed: 2077, notes: "Non-resident — Sinead Irish-source only. Eoin: €0 IE income." },
        { year: "2023", assessable: 60250, grossTax: 9954, alreadyPaid: 5016, ftc: 0, additionalOwed: 4938, notes: "Resident — joint worldwide. Eoin US wages $5,500 (€4,650) included." },
        { year: "2024", assessable: 114037, grossTax: 30725, alreadyPaid: 9237, ftc: 0, additionalOwed: 21488, notes: "Joint. Eoin split-year s.822 — UK salary Nov-Dec excluded. Sinead worldwide. FTC applied." },
        { year: "2025", assessable: 27550, grossTax: 1447, alreadyPaid: 616, ftc: 0, additionalOwed: 831, notes: "Non-resident — both Irish-source only (2rn + Irish fees)." },
      ],
      penalties: {
        surcharge: 1475,
        interest: 3500,
        total: 4975,
        note: "Voluntary disclosure reduces surcharge from 10% to 5%. Interest ~8% p.a. on late amounts.",
      },
      actions: [
        { text: "Contact Eoin's Irish tax agent (TAIN 75224T) IMMEDIATELY — amend 2024 Form 11: correct marital status, add split-year s.822 claim, absorb into joint assessment", priority: "high" },
        { text: "File voluntary disclosure with Revenue BEFORE they make contact — reduces surcharge from 10% to 5%", priority: "high" },
        { text: "File Form 11 returns for 2021, 2022, 2023 jointly (2021 window may be closing)", priority: "high" },
        { text: "Gather Sinead's exact day counts for 2021 and 2022 — critical for 183-day residency threshold", priority: "high" },
        { text: "File Form 11 2025 (non-resident) for both — Irish-source income only (Sinead €14,200 + Eoin €13,350)", priority: "medium" },
        { text: "Negotiate phased payment plan with Revenue — 12–24 months typical", priority: "medium" },
        { text: "Explore Artists' Exemption (S.195) for Janklow book deal — could exempt future Irish book income up to €50K/yr", priority: "low" },
        { text: "Monitor ordinary residence status — continues until 2027/28, may expose non-Irish income to Irish tax", priority: "medium" },
      ],
      openQuestions: [
        "Exact day counts 2021 (~210 days IE) and 2022 (~184 days IE) — 2-year lookback rule implications",
        "N26 account has 289 pages of statements — not fully extracted, likely contains additional deductible expenses",
        "2rn payslips 2021–2024 — confirm historical PRSI/USC structure for accurate credit allocation",
        "Artists' Exemption — does Janklow deal qualify? Apply to Revenue for ruling",
      ],
    },
  },
  property: {
    address: "4 Caroline Place Mews, London, W2 4AQ",
    type: "Rent",
    landlord: { name: "Andrew & Margo Jones", contact: "Via DN Lettings Company Ltd" },
    agent: { name: "DN Lettings Company Ltd", address: "17 Kensington Park Road, London, W11 2EU", phone: "020 7727 1717", email: "lettings@domusnova.com", noticesEmail: "notices@domusnova.com" },
    monthlyRent: 6779.50,
    rentDueDay: 9,
    leaseStart: "09 Dec 2024",
    leaseEnd: "08 Dec 2027",
    leaseTerm: "3 years (AST)",
    breakClause: "Either party may terminate after 12 months with 2 months' written notice",
    rentReview: "RPI-linked increase on 09 Dec 2025 and 09 Dec 2026 (min 3%, max 8%)",
    depositAmount: 9000,
    depositScheme: "The Deposit Protection Service (The DPS)",
    depositRef: "www.depositprotection.com · 0330 303 0030",
    contacts: [
      { role: "Property Manager", name: "Rupert Mackenzie", phone: "+44 7811 373510", icon: "🏠" },
      { role: "Letting Agent", name: "DN Lettings", phone: "020 7727 1717", email: "lettings@domusnova.com", icon: "🏢" },
      { role: "Plumber", name: "Maciej Matyjaszczuk", phone: "+34 603 306 993", icon: "🔧" },
      { role: "Gas Emergency", name: "National Gas", phone: "0800 111 999", icon: "⚠️" },
      { role: "Power Cut", name: "London Power Networks", phone: "105", icon: "⚡" },
    ],
    bills: [
      {
        name: "Octopus Energy — Electricity",
        provider: "Octopus Energy",
        category: "Energy",
        icon: "⚡",
        accountRef: "A-9747FB7A",
        monthlyEstimate: 63,
        annualEstimate: 750,
        paymentMethod: "Direct Debit",
        tariff: "Flexible Octopus (variable)",
        notes: "Smart meter installed · meter 23J0101323 · MPAN 1200025789254 · outstanding balance £454.30 as of Jan 2026",
        contact: "hello@octopus.energy · 0808 164 1088",
      },
      {
        name: "Octopus Energy — Gas",
        provider: "Octopus Energy",
        category: "Energy",
        icon: "🔥",
        accountRef: "A-9747FB7A",
        monthlyEstimate: 70,
        annualEstimate: 837,
        paymentMethod: "Direct Debit",
        tariff: "Flexible Octopus (variable)",
        notes: "Smart meter installed · meter E6S15446292361 · MPRN 3384031104 · Direct Debit £121.66/mo combined with electricity",
        contact: "hello@octopus.energy · 0808 164 1088",
      },
      {
        name: "Council Tax",
        provider: "Westminster City Council",
        category: "Council",
        icon: "🏛",
        accountRef: "— add reference",
        monthlyEstimate: null,
        annualEstimate: null,
        paymentMethod: "— add",
        tariff: "— add band",
        notes: "Tenant responsible per lease clause 3.1. W2 4AQ is Westminster Borough.",
        contact: "westminster.gov.uk · 020 7641 6000",
      },
      {
        name: "Contents Insurance — Homeprotect",
        provider: "Homeprotect (underwritten by AXA Insurance UK plc)",
        category: "Insurance",
        icon: "🛡",
        accountRef: "C09/1155684",
        monthlyEstimate: 6.22,
        annualEstimate: 74.60,
        paymentMethod: "Annual (paid upfront)",
        tariff: "Contents only · £33,000 cover · Full accidental damage included",
        notes: "Policy period: 09/03/2026 – 08/03/2027 · Both Sinead & Eoin on policy · Excess £149 standard / £500 escape of water · Personal possessions worldwide £2,000 · Basic Home Emergency & Legal Expenses included · Claims: 0330 660 0660 · Unoccupancy clause: cover limited if property empty 31+ days",
        contact: "homeprotect.co.uk · 0330 660 1000",
      },
      {
        name: "Broadband — 500Mb Fibre + Total Wi-Fi",
        provider: "Virgin Media (or similar)",
        category: "Connectivity",
        icon: "📡",
        accountRef: "000001067125",
        monthlyEstimate: 60,
        annualEstimate: 720,
        paymentMethod: "Direct Debit",
        tariff: "500Mb Fibre Connection · 12-month commitment · started 7 Dec 2024 · ends 7 Dec 2025",
        notes: "Commitment period ended Dec 2025 — check if auto-renewed or if you're now out of contract (prices may have risen). Last invoice £60 on 7 Mar 2026. Next invoice 7 Apr 2026.",
        contact: "s@sinead.co · +447459086135",
      },
    ],
    watchPoints: [
      { text: "Rent review due 09 Dec 2025 — RPI-linked, min 3% / max 8%. Check if this has been applied and confirm new amount.", priority: "high" },
      { text: "Break clause: either party can exit from 09 Dec 2025 with 2 months' written notice. Lease otherwise runs to 08 Dec 2027.", priority: "medium" },
      { text: "Deposit (£9,000) is protected with The DPS — confirmed in the Prescribed Information document.", priority: "low" },
      { text: "Octopus account shows outstanding balance of £454.30 as of Jan 2026 — check this is being paid down via Direct Debit.", priority: "high" },
      { text: "Contents insurance active: Homeprotect (AXA) · Policy C09/1155684 · £74.60/yr · £33,000 contents cover · renews 08 Mar 2027.", priority: "low" },
      { text: "Add Council Tax band and monthly amount — you are personally liable per lease clause 3.1.", priority: "medium" },
      { text: "Broadband 12-month commitment ended 7 Dec 2025 — you may now be out of contract and paying a higher rate. Check your current price and consider switching or re-contracting.", priority: "medium" },
    ],
  },
  subscriptions: [
    //  News & Reading 
    { name: "Financial Times", category: "News & Reading", who: "Sinead", currency: "USD", amount: 285, frequency: "annual", billedMonthly: 23.75, account: "N26", active: true, note: "Billed annually in Feb" },
    //  Writing Tools 
    { name: "Bookfunnel", category: "Writing Tools", who: "Sinead", currency: "USD", amount: 10, frequency: "monthly", billedMonthly: 10, account: "N26", active: true },
    //  Domains (GoDaddy) 
    { name: "sinead.co + privacy", category: "Domains", who: "Sinead", currency: "GBP", amount: 64.02, frequency: "annual", billedMonthly: 5.34, account: "GoDaddy (MC 6106)", active: true, note: "Renews Feb — domain + Full Privacy Protection" },
    { name: "phoebesinclair.com + privacy", category: "Domains", who: "Sinead", currency: "USD", amount: 28.78, frequency: "annual", billedMonthly: 2.40, account: "GoDaddy (MC 6747)", active: true, note: "Renews Sep" },
    { name: "romywest.com + privacy", category: "Domains", who: "Sinead", currency: "GBP", amount: 22.78, frequency: "annual", billedMonthly: 1.90, account: "GoDaddy (MC 6747)", active: true, note: "Renews Jul" },
    { name: "auguststudios.co + privacy", category: "Domains", who: "Sinead", currency: "GBP", amount: 28.78, frequency: "annual", billedMonthly: 2.40, account: "GoDaddy (MC 6106)", active: true, note: "Renews Jun" },
    { name: "butthistime.com", category: "Domains", who: "Sinead", currency: "GBP", amount: 11.99, frequency: "annual", billedMonthly: 1.00, account: "GoDaddy (MC 6747)", active: true, note: "Renews Feb — new registration" },
    { name: "stoproaddeaths.ie", category: "Domains", who: "Sinead", currency: "GBP", amount: 17.78, frequency: "annual", billedMonthly: 1.48, account: "GoDaddy (MC 6747)", active: true, note: "Renews Feb — new registration" },
    { name: "Microsoft 365 Email (s@sinead.co)", category: "Domains", who: "Sinead", currency: "USD", amount: 127.32, frequency: "annual", billedMonthly: 10.61, account: "GoDaddy (PayPal)", active: true, note: "Billed monthly ~$10.61/mo via PayPal" },
    //  Productivity 
    { name: "Google Workspace", category: "Productivity", who: "Sinead", currency: "GBP", amount: 165.60, frequency: "annual", billedMonthly: 13.80, account: "Unknown", active: true, note: "Annual plan · £13.80/mo · personal Workspace (separate from joint account Google Workspace £39.28/mo)" },
    { name: "Superhuman", category: "Productivity", who: "Sinead", currency: "USD", amount: 360, frequency: "annual", billedMonthly: 30, account: "N26", active: true },
    //  Social & Communication 
    { name: "X / Twitter", category: "Social", who: "Sinead", currency: "GBP", amount: 96, frequency: "annual", billedMonthly: 8, account: "N26", active: true },
    //  Phone & Connectivity 
    { name: "Mint Mobile", category: "Phone", who: "Sinead", currency: "USD", amount: 132, frequency: "annual", billedMonthly: 11, account: "N26", active: true, note: "US phone plan — billed annually" },
    { name: "Lyca Mobile", category: "Phone", who: "Sinead", currency: "GBP", amount: 300, frequency: "annual", billedMonthly: 25, account: "Unknown", active: true, note: "UK Plan Unlimited · £25/mo · 07459086135 · renews Apr 2026" },
    //  Entertainment 
    { name: "Spotify Premium Duo", category: "Entertainment", who: "Both", currency: "GBP", amount: 323.76, frequency: "annual", billedMonthly: 26.98, account: "MC 6747", active: true, note: "Duo + Audiobooks+ · S & E · bills 23rd monthly" },
    { name: "Amazon Prime", category: "Entertainment", who: "Sinead", currency: "GBP", amount: 107.88, frequency: "annual", billedMonthly: 8.99, account: "Amazon", active: true, note: "Renews 6 Apr 2026 · switch to annual to save £12.88/yr" },
    //  Eoin's subscriptions
    { name: "Pure Gym", category: "Fitness", who: "Eoin", currency: "GBP", amount: 443.88, frequency: "annual", billedMonthly: 36.99, account: "Monzo (DD)", active: true, note: "DD 9th monthly · confirmed from Monzo statements" },
    { name: "Claude.ai (Anthropic)", category: "AI Tools", who: "Eoin", currency: "GBP", amount: 180, frequency: "annual", billedMonthly: 15, account: "Ulster Bank", active: true, note: "£15/mo · confirmed from Ulster Bank statement Feb 2026" },
    { name: "PostScanMail", category: "Mail", who: "Both", currency: "USD", amount: 120, frequency: "annual", billedMonthly: 10, account: "Unknown", active: true, note: "Starter plan $10/mo · US virtual mailbox · 30 items · 2 recipients" },
  ],
  creditMortgage: {
    summary: {
      electoralRoll: { sinead: false, eoin: null, note: "Register at Caroline Place Mews — biggest single quick win for UK credit score" },
      ukCreditHistory: { sinead: "Thin — Starling debit only, no credit products", eoin: "Some — Ulster Bank long-standing, Monzo" },
      usCreditHistory: { sinead: "Moderate — Bank of America account several years", eoin: "None" },
    },
    tracks: [
      {
        id: "credit_now",
        label: "Credit building",
        timeframe: "Now",
        color: "#2B5BEE",
        icon: "💳",
        status: "Start immediately",
        actions: [
          { id: "c1", text: "Register on the electoral roll at Caroline Place Mews — single biggest quick win for UK credit score. Takes 5 minutes at gov.uk/register-to-vote", who: "Both", priority: "high", done: false },
          { id: "c2", text: "Apply for UK Amex Gold or British Airways Amex — realistic given income level. Eoin's PAYE income makes him a strong applicant. Sinead can apply separately on N26/Starling income.", who: "Both", priority: "high", done: false },
          { id: "c3", text: "Activate Monzo Flex (credit product, not debit) — reports to credit agencies, helps build UK credit file alongside Amex. Use for one regular purchase per month and pay in full.", who: "Eoin", priority: "medium", done: false },
          { id: "c4", text: "Check current UK credit files — Experian, Equifax, TransUnion all have free tiers. Identify any gaps or errors before applying for credit.", who: "Both", priority: "medium", done: false },
        ],
      },
      {
        id: "amex_us",
        label: "US Amex",
        timeframe: "6–12 months",
        color: "#00A86B",
        icon: "🇺🇸",
        status: "After UK Amex established",
        actions: [
          { id: "a1", text: "Once UK Amex is 6+ months old, use Amex Global Card Transfer programme to apply for a US Amex without needing to rebuild US credit history from scratch. Requires existing Amex membership.", who: "Sinead", priority: "high", done: false },
          { id: "a2", text: "Check Sinead's US credit report at annualcreditreport.com — Bank of America relationship may have already built some history.", who: "Sinead", priority: "medium", done: false },
          { id: "a3", text: "Keep Bank of America account open and active — length of credit history matters. Do not close it.", who: "Sinead", priority: "medium", done: false },
        ],
      },
      {
        id: "mortgage_ready",
        label: "Mortgage readiness",
        timeframe: "12–24 months",
        color: "#F59E0B",
        icon: "🏠",
        status: "Irish tax is the gating item",
        actions: [
          { id: "m1", text: "Resolve Irish tax filings 2021–2024 — this is the single most important mortgage prerequisite. Lenders doing affordability checks will ask for multiple years of accounts.", who: "Sinead", priority: "high", done: false },
          { id: "m2", text: "Ensure Sinead has 2–3 years of UK self-assessment returns filed and clean — lenders need to evidence self-employment income.", who: "Sinead", priority: "high", done: false },
          { id: "m3", text: "Build a clear savings history — regular transfers into ISA or savings account demonstrate financial discipline to lenders. Even £500/month consistently looks better than irregular large lumps.", who: "Both", priority: "medium", done: false },
          { id: "m4", text: "Decide on deposit strategy — current savings total ~£112k. UK lenders typically want 10–20% deposit. At London prices (£600k–£1.2m range), you need £60k–£240k. Clarify target budget.", who: "Both", priority: "medium", done: false },
          { id: "m5", text: "Speak to a whole-of-market mortgage broker (not a bank direct) — someone who understands complex income: PAYE + freelance + multi-currency + non-domicile. Try Trinity Financial or Habito.", who: "Both", priority: "medium", done: false },
          { id: "m6", text: "Note: Eoin's PAYE income (£9,283/mo net, ~£130k gross) alone could support a ~£500–550k mortgage at 4x salary. Joint application unlocks more but requires Sinead's income to be documentable.", who: "Eoin", priority: "low", done: false },
          { id: "m7", text: "UK student loan (Sinead, ~£30k) does not affect mortgage eligibility — lenders are aware it is income-contingent and it is not treated as commercial debt.", who: "Sinead", priority: "low", done: false },
        ],
      },
    ],
  },
};


const fmt = (n) => `£${n?.toLocaleString("en-GB")}`;
const pct = (a, b) => Math.round((a / b) * 100);
const daysUntil = (dateStr) => {
  const d = new Date(dateStr);
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
};

const ProgressBar = ({ value, max, color = COLORS.accent }) => {
  const p = Math.min(100, pct(value, max));
  return (
    <div style={{ background: COLORS.border, borderRadius: 99, height: 5, overflow: "hidden" }}>
      <div style={{ width: `${p}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

const Tag = ({ children, color = COLORS.accentLight, text = COLORS.accent }) => (
  <span style={{ background: color, color: text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, letterSpacing: "0.02em" }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24, ...style }}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 20 }}>
    {children}
  </p>
);

const tabs = ["Overview", "Spending", "Savings", "Credit", "Pension", "Healthcare", "Immigration", "Tax", "Property", "Subscriptions", "Travel", "Calendar"];

const PriorityDot = ({ priority }) => (
  <div style={{
    width: 7, height: 7, borderRadius: "50%", flexShrink: 0, marginTop: 4,
    background: priority === "high" ? COLORS.amber : priority === "medium" ? COLORS.accent : COLORS.muted
  }} />
);

const ActionItem = ({ text, priority }) => (
  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
    <PriorityDot priority={priority} />
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{text}</p>
    </div>
    <Tag
      color={priority === "high" ? COLORS.amberLight : priority === "medium" ? COLORS.accentLight : COLORS.border}
      text={priority === "high" ? COLORS.amber : priority === "medium" ? COLORS.accent : COLORS.muted}
    >{priority}</Tag>
  </div>
);

function AccountBalanceCard({ account: a, masked }) {
  const [revealed, setRevealed] = useState(false);
  const show = !masked || revealed;
  const fmtCur = (amount, currency) => {
    if (currency === "USD") return `$${Math.abs(amount).toLocaleString()}`;
    if (currency === "EUR") return `€${Math.abs(amount).toLocaleString()}`;
    return `£${Math.abs(amount).toLocaleString()}`;
  };
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{a.flag} {a.name} · {a.currency}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>
              {show ? fmtCur(a.lastBalance, a.currency) : (a.currency === "USD" ? "$●,●●●" : "€●,●●●")}
            </p>
            {masked && (
              <button onClick={() => setRevealed(r => !r)} style={{ background: COLORS.accentLight, border: "none", borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontSize: 11, color: COLORS.accent, fontWeight: 500, fontFamily: "inherit" }}>
                {revealed ? "hide" : "reveal"}
              </button>
            )}
          </div>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Latest statement balance</p>
        </div>
        <Tag color={COLORS.accentLight} text={COLORS.accent}>{a.currency}</Tag>
      </div>
    </Card>
  );
}

function DocDetailCard({ doc, masked }) {
  const [showNum, setShowNum] = useState(false);
  const days = daysUntil(doc.expiry);
  const urgent = days < 365;
  return (
    <div style={{ background: COLORS.bg, borderRadius: 8, padding: 14, border: `1px solid ${urgent ? "#f5d78e" : COLORS.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{doc.country} {doc.type}</span>
        <Tag color={urgent ? COLORS.amberLight : COLORS.greenLight} text={urgent ? COLORS.amber : COLORS.green}>{days}d</Tag>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {[
          { label: "Number", value: masked && !showNum ? "●●●●" + doc.number.slice(-4) : doc.number, sensitive: true },
          { label: "Issued", value: doc.issued },
          { label: "Expires", value: doc.expiry },
          doc.category && { label: "Category", value: doc.category },
          doc.fastid && { label: "FAST ID", value: masked && !showNum ? "●●●●" + doc.fastid.slice(-4) : doc.fastid, sensitive: true },
          doc.renewBy && { label: "Renew by", value: doc.renewBy },
          doc.note && { label: "Note", value: doc.note },
        ].filter(Boolean).map(row => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: COLORS.muted }}>{row.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{row.value}</span>
              {row.sensitive && masked && (
                <button onClick={() => setShowNum(s => !s)} style={{ background: COLORS.accentLight, border: "none", borderRadius: 4, padding: "2px 6px", cursor: "pointer", fontSize: 10, color: COLORS.accent, fontWeight: 500, fontFamily: "inherit" }}>
                  {showNum ? "hide" : "reveal"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {doc.file && <DocButton path={doc.file} />}
      {doc.fileFront && <DocButton front={doc.fileFront} back={doc.fileBack} />}
    </div>
  );
}

function JointSection({ data, masked }) {
  const jt = data.joint;
  const [jMonth, setJMonth] = React.useState("feb");
  const [showAll, setShowAll] = React.useState(false);
  const catData = jt[jMonth];
  const maxCat = Math.max(...catData.categories.map(c => c.amount));
  const txList = showAll ? jt.recentTransactions : jt.recentTransactions.slice(0, 10);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf0ff 100%)", borderRadius: 12, padding: 20, border: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>🔗 Joint Monzo Account</p>
            <p style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{masked ? "£●●●.●●" : `£${jt.lastBalance.toFixed(2)}`}</p>
            <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Balance as of {jt.lastBalanceDate} · Sort code 04-00-03 · Account 30427018</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color={COLORS.accentLight} text={COLORS.accent}>GBP</Tag>
            <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>3-month outgoings: {masked ? "£●,●●●" : `£${jt.totalOutgoings.toFixed(2)}`}</p>
            <p style={{ fontSize: 11, color: COLORS.muted }}>3-month deposits: {masked ? "£●,●●●" : `£${jt.totalDeposits.toFixed(2)}`}</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 12, lineHeight: 1.6 }}>{jt.note}</p>
      </div>

      {/* Balance history + monthly summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <SectionTitle>Balance history</SectionTitle>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={jt.balanceHistory}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} domain={[0, 1100]} />
              <Tooltip formatter={v => `£${v.toFixed(2)}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="balance" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.accent }} />
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Topped up by P2P transfers as needed. Jan peak driven by Respoke bike purchase (£491) + Japan travel.</p>
        </Card>
        <Card>
          <SectionTitle>Monthly summary — deposits vs spending</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  {["Month", "Deposits", "Spending", "End balance"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: h === "Month" ? "left" : "right", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jt.monthSummary.map((r, i) => (
                  <tr key={i} style={{ borderBottom: i < jt.monthSummary.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                    <td style={{ padding: "9px 10px", fontWeight: 500 }}>{r.month}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: COLORS.green, fontWeight: 600 }}>{masked ? "£●●●" : `+£${r.deposits.toFixed(2)}`}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", color: COLORS.red, fontWeight: 600 }}>{masked ? "£●,●●●" : `-£${r.spending.toFixed(2)}`}</td>
                    <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 600 }}>{masked ? "£●●●" : `£${r.balance.toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 12, padding: "10px 12px", background: COLORS.amberLight, borderRadius: 8, border: "1px solid #f5d78e" }}>
            <p style={{ fontSize: 11, color: COLORS.amber, fontWeight: 600, marginBottom: 2 }}>⚑ Dec Octopus Energy spike</p>
            <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>Dec bill was £211.45 vs £121.66 in Jan & Feb — likely included a catch-up charge. Worth checking tariff history on Octopus account.</p>
          </div>
        </Card>
      </div>

      {/* Spending by category with month switcher */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <SectionTitle style={{ margin: 0 }}>Spending by category</SectionTitle>
          <div style={{ display: "flex", gap: 4 }}>
            {[{ id: "dec", label: "Dec '25" }, { id: "jan", label: "Jan '26" }, { id: "feb", label: "Feb '26" }].map(m => (
              <button key={m.id} onClick={() => setJMonth(m.id)} style={{
                background: jMonth === m.id ? COLORS.accent : COLORS.bg,
                color: jMonth === m.id ? "white" : COLORS.muted,
                border: `1px solid ${jMonth === m.id ? COLORS.accent : COLORS.border}`,
                borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>{m.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {catData.categories.map(c => (
            <div key={c.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{c.icon} {c.name}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{masked ? "£●●●" : `£${c.amount.toFixed(2)}`}</span>
              </div>
              <ProgressBar value={c.amount} max={maxCat} color={COLORS.accent} />
            </div>
          ))}
          <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Total spending</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{masked ? "£●,●●●" : `£${catData.categories.reduce((s, c) => s + c.amount, 0).toFixed(2)}`}</span>
          </div>
        </div>
        {jMonth === "jan" && (
          <div style={{ marginTop: 12, padding: "10px 12px", background: "#f0f4ff", borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
            <p style={{ fontSize: 11, color: COLORS.accent, fontWeight: 600, marginBottom: 2 }}>ℹ Japan trip — Dec/Jan overlap</p>
            <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>Ski trip to Hokkaido (Niseko/Grand Hirafu) + Kyoto + Osaka. Jan charges include Air Do domestic flight £93, Suica top-ups, hotels, dining. Remaining Japan charges appear in Feb (ski lift tickets £57, Cambridge hotel also in Feb).</p>
          </div>
        )}
      </Card>

      {/* All transactions */}
      <Card>
        <SectionTitle>All transactions (Dec '25 – Feb '26)</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {txList.map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < txList.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{t.flag}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500 }}>{t.desc}</p>
                  <p style={{ fontSize: 11, color: COLORS.muted }}>{t.date} · Joint Monzo</p>
                </div>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: t.amount > 0 ? COLORS.green : COLORS.text }}>
                {masked ? "●●●" : (t.amount > 0 ? `+£${t.amount.toFixed(2)}` : `-£${Math.abs(t.amount).toFixed(2)}`)}
              </p>
            </div>
          ))}
        </div>
        {jt.recentTransactions.length > 10 && (
          <button onClick={() => setShowAll(v => !v)} style={{ marginTop: 12, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 500, color: COLORS.accent, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
            {showAll ? "Show fewer" : `Show all ${jt.recentTransactions.length} transactions`}
          </button>
        )}
      </Card>
    </div>
  );
}

function SpendingTab({ data, masked }) {
  const [sTab, setSTab] = useState("sinead");
  const s = data.sinead;

  const fmtCur = (amount, currency) => {
    if (currency === "USD") return `$${Math.abs(amount).toLocaleString()}`;
    if (currency === "EUR") return `€${Math.abs(amount).toLocaleString()}`;
    return `£${Math.abs(amount).toLocaleString()}`;
  };

  const tabs = [
    { id: "sinead", label: "Sinead" },
    { id: "eoin", label: "Eoin" },
    { id: "joint", label: "🔗 Joint" },
    { id: "combined", label: "Combined" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setSTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 16px", fontSize: 13, fontWeight: sTab === t.id ? 600 : 400,
            color: sTab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${sTab === t.id ? COLORS.accent : "transparent"}`,
            transition: "all 0.15s", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* EOIN */}
      {sTab === "eoin" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Account balance cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>🇬🇧 Ulster Bank · GBP</p>
                  <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>Salary a/c</p>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>98-01-55 · No closing balance on statement</p>
                </div>
                <Tag color={COLORS.accentLight} text={COLORS.accent}>GBP</Tag>
              </div>
            </Card>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>🇬🇧 Monzo · GBP</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{masked ? "£●●.●●" : "£91.48"}</p>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>10 Mar 2026 · Rent just cleared</p>
                </div>
                <Tag color={COLORS.accentLight} text={COLORS.accent}>GBP</Tag>
              </div>
            </Card>
          </div>

          {/* Charts row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Monzo balance history */}
            <Card>
              <SectionTitle>Monzo — balance history (GBP)</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.eoin.monzoHistory}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => `£${v.toLocaleString()}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="balance" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.accent }} />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Feb balance £7,057 (pre-rent). Drops to £91 on 10 Mar after rent £6,779.50 clears. Replenished monthly from Ulster salary.</p>
            </Card>

            {/* Salary history chart */}
            <Card>
              <SectionTitle>Gresham House — net salary (GBP)</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.eoin.salaryHistory}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={v => masked ? "£●●,●●●" : `£${v.toLocaleString()}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="net" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.green }} />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Feb spike includes bonus. Regular net salary ~£9,284/mo. Salary paid via Ulster Bank; transferred to Monzo for day-to-day spending.</p>
            </Card>
          </div>

          {/* Spending breakdown + statement summary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Feb 2026 spending categories */}
            <Card>
              <SectionTitle>Feb 2026 — spending by category (Ulster + Monzo)</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                {[
                  { name: "Rent & housing", amount: 6779.50, icon: "🏠" },
                  { name: "Council Tax / utilities", amount: 186.00, icon: "💡" },
                  { name: "Flights (Ryanair)", amount: 187.98, icon: "✈️" },
                  { name: "Dining & restaurants", amount: 225.26, icon: "🍽" },
                  { name: "Dental (Bayswater)", amount: 134.00, icon: "🦷" },
                  { name: "Gym (Pure Gym)", amount: 36.99, icon: "🏋️" },
                  { name: "Other / miscellaneous", amount: 123.00, icon: "📦" },
                ].map(c => (
                  <div key={c.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{c.icon} {c.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{masked ? "£●,●●●" : `£${c.amount.toFixed(2)}`}</span>
                    </div>
                    <ProgressBar value={c.amount} max={6779.50} color={COLORS.accent} />
                  </div>
                ))}
                <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Total (excl. savings transfer £9k)</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{masked ? "£●,●●●" : "£7,672.73"}</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 10 }}>Note: £9,000 transferred to savings on 27 Feb not included above. Net salary after rent & savings: ~£968 discretionary.</p>
            </Card>

            {/* Monthly statement summary */}
            <Card>
              <SectionTitle>Statement summary — all accounts</SectionTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                      {["Period", "Account", "Income", "Spending", "Notes"].map(h => (
                        <th key={h} style={{ padding: "8px 8px", textAlign: h === "Period" || h === "Account" || h === "Notes" ? "left" : "right", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "Dec '25", account: "Ulster", income: 9283.85, spending: null, notes: "Salary · Transfer £8k to Monzo" },
                      { period: "Jan '26", account: "Ulster", income: 9283.85, spending: null, notes: "Salary · Transfer £8.3k to Monzo" },
                      { period: "Jan '26", account: "Monzo",  income: 8310, spending: 7056.98, notes: "Rent + DDs + daily" },
                      { period: "Feb '26", account: "Ulster", income: 17734.70, spending: null, notes: "Salary + bonus · £9k savings · £7.5k → Monzo" },
                      { period: "Feb '26", account: "Monzo",  income: 7500, spending: 7872.11, notes: "Rent + DDs + dining" },
                      { period: "Mar '26", account: "Monzo",  income: null, spending: 6965.50, notes: "Rent + DDs · Salary not yet received" },
                    ].map((r, i, arr) => (
                      <tr key={i} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                        <td style={{ padding: "9px 8px", fontWeight: 500 }}>{r.period}</td>
                        <td style={{ padding: "9px 8px", color: COLORS.muted }}>{r.account}</td>
                        <td style={{ padding: "9px 8px", textAlign: "right", color: COLORS.green, fontWeight: 600 }}>
                          {r.income ? (masked ? "£●●,●●●" : `£${r.income.toLocaleString()}`) : "—"}
                        </td>
                        <td style={{ padding: "9px 8px", textAlign: "right", color: r.spending ? COLORS.red : COLORS.muted, fontWeight: r.spending ? 600 : 400 }}>
                          {r.spending ? (masked ? "£●,●●●" : `£${r.spending.toLocaleString()}`) : "—"}
                        </td>
                        <td style={{ padding: "9px 8px", color: COLORS.muted, fontSize: 11 }}>{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Recent transactions */}
          <Card>
            <SectionTitle>Recent transactions</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {data.eoin.recentTransactions.map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < data.eoin.recentTransactions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 18 }}>{t.flag}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500 }}>{t.desc}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted }}>{t.date} · {t.account}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: t.amount > 0 ? COLORS.green : t.type === "transfer" ? COLORS.amber : COLORS.text }}>
                    {masked ? "●●●" : (t.amount > 0 ? `+£${t.amount.toLocaleString()}` : `-£${Math.abs(t.amount).toLocaleString()}`)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* COMBINED */}
      {sTab === "combined" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle>All Accounts — Latest Balances</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {s.accounts.map(a => (
                <div key={a.id} style={{ background: COLORS.bg, borderRadius: 8, padding: 14 }}>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{a.flag} {a.name} · Sinead</p>
                  <p style={{ fontSize: 20, fontWeight: 600 }}>{masked ? (a.currency === "USD" ? "$●,●●●" : "€●,●●●") : fmtCur(a.lastBalance, a.currency)}</p>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Latest balance</p>
                </div>
              ))}
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 14 }}>
                <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>🇬🇧 Monzo · Eoin</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>{masked ? "£●●.●●" : "£91.48"}</p>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>10 Mar 2026 (post-rent)</p>
              </div>
              <div style={{ background: COLORS.bg, borderRadius: 8, padding: 14 }}>
                <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>🇬🇧 Ulster Bank · Eoin</p>
                <p style={{ fontSize: 13, fontWeight: 500, marginTop: 4 }}>Salary account</p>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Balance not on statement</p>
              </div>
            </div>
          </Card>
          <Card>
            <SectionTitle>Combined Fixed Monthly Costs</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { name: "Rent (DN Lettings)", amount: 6779.50, owner: "Eoin / Both" },
                { name: "Council Tax (Westminster)", amount: 141.00, owner: "Eoin" },
                { name: "Thames Water", amount: 45.00, owner: "Eoin" },
                { name: "Pure Gym (Eoin)", amount: 36.99, owner: "Eoin" },
              ].map((c, i, arr) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div>
                    <p style={{ fontSize: 13 }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>{c.owner}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{masked ? "●,●●●" : `£${c.amount.toFixed(2)}`}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* JOINT */}
      {sTab === "joint" && <JointSection data={data} masked={masked} />}

      {/* SINEAD */}
      {sTab === "sinead" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Account balance cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {s.accounts.map(a => (
              <AccountBalanceCard key={a.id} account={a} masked={masked} />
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* BoA balance history */}
            <Card>
              <SectionTitle>Bank of America — balance history (USD)</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={s.bofaHistory}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} domain={[90000, 110000]} />
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="balance" stroke={COLORS.red} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.red }} />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Balance declining — primarily Wise transfers to UK + travel spending. No US income since Janklow advance.</p>
            </Card>

            {/* N26 balance history */}
            <Card>
              <SectionTitle>N26 — balance history (EUR)</SectionTitle>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={s.n26History}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `€${v.toLocaleString()}`} />
                  <Tooltip formatter={v => `€${v.toLocaleString()}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="balance" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.green }} />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Growing slowly — 2rn fees €1,031/month + occasional Irish Times income. Low spending on this account.</p>
            </Card>
          </div>

          {/* Feb 2026 N26 spending breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Feb 2026 — N26 spending by category</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                {s.categories.map(c => (
                  <div key={c.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>{c.icon} {c.name}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>€{c.amount}</span>
                    </div>
                    <ProgressBar value={c.amount} max={710} color={COLORS.accent} />
                  </div>
                ))}
                <div style={{ paddingTop: 10, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Total spending</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>€710</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 10 }}>Note: Large subscription figure dominated by FT ($285/yr billed in Feb). Underlying monthly subscriptions ~€55.</p>
            </Card>

            {/* Monthly statement summary table */}
            <Card>
              <SectionTitle>Statement summary — all accounts</SectionTitle>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                      {["Period", "Account", "Income", "Spending", "Balance"].map(h => (
                        <th key={h} style={{ padding: "8px 10px", textAlign: h === "Period" || h === "Account" ? "left" : "right", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "Oct '25", account: "BoA", currency: "USD", income: 0, spending: 4798+65, balance: 99894 },
                      { period: "Nov '25", account: "BoA", currency: "USD", income: 1583, spending: 4768+4, balance: 95377 },
                      { period: "Jan '26", account: "N26", currency: "EUR", income: 1045, spending: 441, balance: 3671 },
                      { period: "Feb '26", account: "N26", currency: "EUR", income: 1331, spending: 710, balance: 4292 },
                    ].map((r, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.bg : "transparent" }}>
                        <td style={{ padding: "10px 10px", fontWeight: 500 }}>{r.period}</td>
                        <td style={{ padding: "10px 10px", color: COLORS.muted }}>{r.account}</td>
                        <td style={{ padding: "10px 10px", textAlign: "right", color: r.income > 0 ? COLORS.green : COLORS.muted }}>
                          {r.income > 0 ? `${r.currency === "USD" ? "$" : "€"}${r.income.toLocaleString()}` : "—"}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", color: COLORS.red }}>
                          {r.currency === "USD" ? "$" : "€"}{r.spending.toLocaleString()}
                        </td>
                        <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 500 }}>
                          {r.currency === "USD" ? "$" : "€"}{r.balance.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Recent transactions */}
          <Card>
            <SectionTitle>Notable transactions — recent statements</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
              {s.recentTransactions.map((tx, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 12px", borderBottom: `1px solid ${COLORS.border}`,
                  background: i % 2 === 0 ? "transparent" : COLORS.bg,
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>{tx.flag}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 500 }}>{tx.desc}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted }}>{tx.date} · {tx.account}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600,
                    color: tx.type === "income" ? COLORS.green : tx.type === "transfer" ? COLORS.muted : COLORS.text,
                  }}>
                    {tx.type === "income" ? "+" : tx.type === "transfer" ? "↗" : ""}
                    {tx.account === "BoA" ? "$" : "€"}{Math.abs(tx.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tax flag */}
          <Card>
            <div style={{ background: COLORS.amberLight, borderRadius: 10, padding: 16, border: `1px solid #f5d78e` }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, marginBottom: 6 }}>⚠ Tax note — Bank of America (FBAR)</p>
              <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                The BoA account (ending ●●●●4747) must be reported on the US FBAR for each year the balance exceeded $10,000. The Oct '25 balance confirms this account is reportable. Wise transfers are not income — they are balance movements between accounts and should be documented accordingly.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}


function SimplyhealthSection({ data }) {
  const sh = data.simplyhealth;
  const [shTab, setShTab] = React.useState("overview");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header banner */}
      <div style={{ background: "#E8F8F0", borderRadius: 12, padding: 20, border: "1px solid #A8DFC4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1E8C5A", marginBottom: 4 }}>💚 Simplyhealth — Optimise Health Plan</p>
            <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{sh.planType}</p>
            <p style={{ fontSize: 12, color: COLORS.muted }}>100% cashback on all claims up to your annual limits · Worldwide cover · Submit via app or online</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color={COLORS.greenLight} text={COLORS.green}>Employer benefit</Tag>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          <Tag color={COLORS.accentLight} text={COLORS.accent}>📞 {sh.claimsPhone}</Tag>
          <Tag color="#E8F8F0" text="#1E8C5A">🕐 {sh.claimsHours}</Tag>
          <Tag color={COLORS.accentLight} text={COLORS.accent}>🌐 {sh.claimsOnline}</Tag>
        </div>
      </div>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
        {[{ id: "overview", label: "Overview" }, { id: "benefits", label: "All Benefits" }, { id: "howto", label: "How to Claim" }].map(st => (
          <button key={st.id} onClick={() => setShTab(st.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 14px", fontSize: 12, fontWeight: shTab === st.id ? 600 : 400,
            color: shTab === st.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${shTab === st.id ? COLORS.accent : "transparent"}`,
            transition: "all 0.15s", fontFamily: "inherit",
          }}>{st.label}</button>
        ))}
      </div>

      {shTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Member entitlements — current year remaining */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <SectionTitle style={{ margin: 0 }}>This year's entitlements</SectionTitle>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Both on Level 1 · {sh.policyYear} · Renews {sh.renewalDate}</p>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: COLORS.muted }}>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: COLORS.red, marginRight: 5, verticalAlign: "middle" }}/>Used</span>
                <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 2, background: "#E8F8F0", border: `1px solid #A8DFC4`, marginRight: 5, verticalAlign: "middle" }}/>Remaining</span>
              </div>
            </div>

            {/* Build merged list — all unique benefits across both members */}
            {(() => {
              const eoin = sh.members.eoin;
              const sinead = sh.members.sinead;
              // Get all benefit names (use eoin as primary, sinead may have fewer)
              const allBenefits = eoin.entitlements.map(e => e.benefit);
              return (
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {/* Header row */}
                  <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 0, paddingBottom: 8, borderBottom: `2px solid ${COLORS.border}`, marginBottom: 4 }}>
                    <div />
                    <div style={{ paddingLeft: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Eoin</p>
                    </div>
                    <div style={{ paddingLeft: 12 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>Sinead</p>
                    </div>
                  </div>

                  {allBenefits.map((benefit, i) => {
                    const eE = eoin.entitlements.find(e => e.benefit === benefit);
                    const sE = sinead.entitlements.find(e => e.benefit === benefit);
                    const isLast = i === allBenefits.length - 1;

                    const renderCell = (e) => {
                      if (!e) return <div style={{ paddingLeft: 12 }}><p style={{ fontSize: 11, color: COLORS.muted }}>—</p></div>;
                      const usedPct = ((e.annual - e.remaining) / e.annual) * 100;
                      const empty = e.remaining === 0;
                      const full = e.remaining === e.annual;
                      const label = e.unit === "stays"
                        ? (full ? "20 stays" : `${e.remaining} left`)
                        : (empty ? "Used up" : (full ? `£${e.annual} available` : `£${e.remaining} of £${e.annual}`));
                      const labelColor = empty ? COLORS.red : full ? "#1E8C5A" : COLORS.amber;
                      return (
                        <div style={{ paddingLeft: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: labelColor }}>{label}</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 4, background: "#E8F8F0", border: "1px solid #A8DFC4", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: `${usedPct}%`,
                              borderRadius: 4,
                              background: empty ? COLORS.red : usedPct > 0 ? COLORS.amber : "transparent",
                            }} />
                          </div>
                          {e.note && <p style={{ fontSize: 10, color: COLORS.muted, marginTop: 3 }}>{e.note}</p>}
                        </div>
                      );
                    };

                    return (
                      <div key={benefit} style={{
                        display: "grid", gridTemplateColumns: "180px 1fr 1fr",
                        padding: "10px 0",
                        borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`,
                        alignItems: "center",
                      }}>
                        <p style={{ fontSize: 12, fontWeight: 500, color: COLORS.text }}>{benefit}</p>
                        {renderCell(eE)}
                        {renderCell(sE)}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ padding: "10px 12px", background: COLORS.redLight, borderRadius: 8, border: "1px solid #f5b5b5" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.red, marginBottom: 2 }}>⚠ Dental — fully used by both</p>
                <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>£60 annual limit exhausted. Resets 1 Jul 2026. Dental Accident (£200 each) still fully available for emergencies.</p>
              </div>
              <div style={{ padding: "10px 12px", background: "#E8F8F0", borderRadius: 8, border: "1px solid #A8DFC4" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#1E8C5A", marginBottom: 2 }}>💡 Use before 30 Jun 2026</p>
                <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>Diagnostics £250, Eyes £60, GP Visit £75, Health Assessment £50 — all untouched for both of you.</p>
              </div>
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { icon: "🩺", label: "24/7 GP", desc: sh.gpService, color: "#E8F8F0", border: "#A8DFC4", text: "#1E8C5A" },
              { icon: "🧠", label: "Counselling", desc: sh.counsellingService, color: COLORS.accentLight, border: "#c8d4fb", text: COLORS.accent },
              { icon: "🏋️", label: "Gym discount", desc: sh.gymDiscount, color: COLORS.amberLight, border: "#f5d78e", text: COLORS.amber },
            ].map(s => (
              <div key={s.label} style={{ background: s.color, borderRadius: 10, padding: 16, border: `1px solid ${s.border}` }}>
                <p style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: s.text, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <Card>
            <SectionTitle>Annual benefit limits by level (check Membership Certificate for your level)</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    <th style={{ textAlign: "left", padding: "8px 10px", color: COLORS.muted, fontWeight: 600, fontSize: 11, minWidth: 180 }}>Benefit</th>
                    {["L1","L2","L3","L4","L5","L6"].map(l => (
                      <th key={l} style={{ textAlign: "center", padding: "8px 10px", color: COLORS.accent, fontWeight: 700, fontSize: 11 }}>{l}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sh.levels.map((row, i) => (
                    <tr key={row.benefit} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.bg : "white" }}>
                      <td style={{ padding: "9px 10px", fontWeight: 500, color: COLORS.text }}>{row.benefit}</td>
                      {[row.l1, row.l2, row.l3, row.l4, row.l5, row.l6].map((v, j) => (
                        <td key={j} style={{ textAlign: "center", padding: "9px 10px", color: COLORS.green, fontWeight: 600 }}>£{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 12 }}>💡 Check your Membership Certificate (via online account) to see which level applies to you. Up to 4 children under 24 covered free — shared annual entitlement.</p>
          </Card>
          <Card>
            <SectionTitle>Claiming — quick reference</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sh.claimsProcess.map(s => (
                <div key={s.step} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: "#E8F8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#1E8C5A" }}>{s.step}</div>
                  <p style={{ fontSize: 12, lineHeight: 1.6, flex: 1 }}>{s.text}</p>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.amberLight, borderRadius: 8, padding: 12, marginTop: 12, border: "1px solid #f5d78e" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, marginBottom: 3 }}>⚠ Important</p>
              <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>{sh.claimsNote}</p>
            </div>
          </Card>
        </div>
      )}

      {shTab === "benefits" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {sh.benefitDetails.map(b => (
            <Card key={b.name}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{b.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{b.name}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>✓ Covered</p>
                      <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{b.desc}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.red, marginBottom: 4 }}>✗ Not covered</p>
                      <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{b.notCovered}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Card>
            <SectionTitle>General exclusions — apply to all benefits</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sh.exclusions.map((e, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "6px 0", borderBottom: i < sh.exclusions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <span style={{ color: COLORS.red, fontWeight: 700, flexShrink: 0 }}>✗</span>
                  <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{e}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {shTab === "howto" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle>Step-by-step claims guide</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { step: "1", title: "Register", text: "Create your account at simplyhealth.co.uk/register or download the SimplyPlan app. You'll need this before you can claim." },
                { step: "2", title: "Get treatment & pay", text: "See your practitioner and pay upfront. Make sure you get a proper receipt — not just a card payment slip or invoice. It must show: patient name, practitioner details, treatment description, date, and amount paid." },
                { step: "3", title: "Submit your claim", text: "Log in online or use the app. Fill in all sections of the claim form and attach a photo of your original receipt. Submit ideally within 6 months of treatment." },
                { step: "4", title: "Get paid", text: "Simplyhealth pays 100% of the cost up to your annual benefit limit, directly into your UK bank account. You can only claim under one benefit per treatment." },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "#E8F8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#1E8C5A" }}>{s.step}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.title}</p>
                    <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Acceptable receipts ✓</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Original receipts from the practitioner", "Shows patient name, practitioner, treatment, date, amount", "NHS prescription receipts for prescription benefit", "Translated (English) receipts for overseas claims"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>Not accepted ✗</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Invoices (even if paid)", "Credit or debit card receipts alone", "Receipts that have been altered", "Costs paid with vouchers, coupons, or loyalty points"].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ color: COLORS.red, fontWeight: 700, flexShrink: 0 }}>✗</span>
                    <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card>
            <SectionTitle>Contact & complaints</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Claims phone", value: "0300 100 1020" },
                { label: "Hours", value: "Mon–Fri, 8am–6pm" },
                { label: "Online", value: "simplyhealth.co.uk/customercontact" },
                { label: "Complaints", value: "customerrelations@simplyhealth.co.uk" },
                { label: "Complaints escalation", value: "Financial Ombudsman: 0800 023 4567" },
                { label: "Register / claim", value: "simplyhealth.co.uk/register" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", flexDirection: "column", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontSize: 11, color: COLORS.muted, marginBottom: 2 }}>{r.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function HealthcareTab({ data, masked }) {
  const [hTab, setHTab] = useState("health");
  const t = data.travel;
  const h = data.health;
  const c = data.car;
  const sh = data.simplyhealth;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
        {[{ id: "health", label: "🏥 AXA Health" }, { id: "simplyhealth", label: "💚 Simplyhealth" }, { id: "dental", label: "🦷 Dental" }, { id: "travel", label: "✈️ Travel" }, { id: "car", label: "🚗 Car" }, { id: "vaccinations", label: "💉 Vaccinations" }, { id: "watchpoints", label: "⚠ Watch Points" }, { id: "documents", label: "📄 Documents" }].map(t => (
          <button key={t.id} onClick={() => setHTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 14px", fontSize: 12, fontWeight: hTab === t.id ? 600 : 400,
            color: hTab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${hTab === t.id ? COLORS.accent : "transparent"}`,
            transition: "all 0.15s", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* HEALTH INSURANCE */}
      {hTab === "health" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { label: "Provider", value: h.provider },
              { label: "Excess", value: `£${h.excess} per person/yr` },
              { label: "Premium", value: h.premiumPaidBy ? "Employer-paid" : `£${h.premium}/mo` },
            ].map(s => (
              <Card key={s.label}>
                <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: s.label === "Provider" ? 20 : 24, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.3 }}>{s.value}</p>
              </Card>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Cover summary</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {h.coverItems.map(ci => (
                  <div key={ci.item} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 12, color: COLORS.muted, flexShrink: 0, minWidth: 160 }}>{ci.item}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, textAlign: "right" }}>{ci.cover}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>How to use</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ background: COLORS.amberLight, borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, marginBottom: 4 }}>⚠ Always pre-authorise</p>
                  <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>You must call AXA before any treatment. Claims without pre-authorisation may not be paid.</p>
                </div>
                {[
                  { label: "Claims helpline", value: h.claimsPhone },
                  { label: "GP service", value: "Dr@Hand — 24/7 video/phone, prescriptions, referrals" },
                  { label: "Online portal", value: "axahealth.co.uk/member-login" },
                  { label: "Gym discount", value: "Up to 40% off Nuffield Health & Hussle" },
                  { label: "Plan type", value: h.planType },
                  { label: "Underwriting", value: h.underwriting },
                  { label: "Premium paid by", value: h.premiumPaidBy },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 120 }}>{r.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {false && <Card>
              <SectionTitle>Recent claims</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {(h.claims||[]).map(c => (
                  <div key={c.date + c.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500 }}>{c.type}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted }}>{c.date}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13 }}>{fmt(c.amount)}</p>
                      <Tag
                        color={c.status === "Claimed" ? COLORS.greenLight : c.status === "Pending" ? COLORS.amberLight : COLORS.redLight}
                        text={c.status === "Claimed" ? COLORS.green : c.status === "Pending" ? COLORS.amber : COLORS.red}
                      >{c.status}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </Card>}
        </div>
      )}


      {/* SIMPLYHEALTH */}
      {hTab === "simplyhealth" && <SimplyhealthSection data={data} />}





      {/* DENTAL */}
      {hTab === "dental" && (() => {
        const d = data.dental.sinead;
        const tp = d.treatmentPlan;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Header */}
            <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 20, border: "1px solid #c8d4fb" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>🦷 Sinead — Dental Treatment Plan</p>
              <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>{d.clinic}</p>
              <p style={{ fontSize: 13, color: COLORS.muted }}>{d.address} · {d.phone}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Tag>Dr {d.dentist}</Tag>
                <Tag color={COLORS.amberLight} text={COLORS.amber}>{tp.ref}</Tag>
                <Tag color={COLORS.greenLight} text={COLORS.green}>{tp.date}</Tag>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Total cost card */}
              <Card>
                <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Total treatment cost</p>
                <p style={{ fontSize: 36, fontWeight: 600, color: COLORS.accent }}>£{tp.total.toLocaleString()}</p>
                <p style={{ fontSize: 12, color: COLORS.green, marginTop: 6 }}>✓ {tp.financeAvailable}</p>
              </Card>
              {/* Practical info */}
              <Card>
                <SectionTitle>Practical info</SectionTitle>
                {[
                  { label: "Cancellation policy", value: tp.cancellationPolicy },
                  { label: "Payment", value: "Cash, debit/credit card, or finance" },
                  { label: "Note", value: "Treatment plan may change due to clinical necessity" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", flexDirection: "column", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 11, color: COLORS.muted, marginBottom: 2 }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500 }}>{r.value}</span>
                  </div>
                ))}
              </Card>
            </div>

            {/* Appointment breakdown */}
            <Card>
              <SectionTitle>Appointment breakdown</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tp.appointments.map(a => (
                  <div key={a.appt} style={{ borderRadius: 8, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                    <div style={{ background: COLORS.bg, padding: "8px 14px", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent }}>Appointment {a.appt}</span>
                    </div>
                    {a.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 14px", borderBottom: i < a.items.length - 1 ? `1px solid ${COLORS.border}` : "none", background: item.fee < 0 ? COLORS.greenLight : "transparent" }}>
                        <span style={{ fontSize: 12, color: item.fee < 0 ? COLORS.green : COLORS.text }}>{item.desc}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: item.fee < 0 ? COLORS.green : item.fee === 0 ? COLORS.muted : COLORS.text }}>
                          {item.fee < 0 ? `-£${Math.abs(item.fee)}` : item.fee === 0 ? "Included" : `£${item.fee}`}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 14px", background: COLORS.accentLight, borderRadius: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>£{tp.total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>
        );
      })()}

      {/* TRAVEL INSURANCE */}
      {hTab === "travel" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Policy header */}
          <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 20, border: `1px solid #c8d4fb` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>Post Office Travel Insurance — Max Level</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>Annual Multi-trip · Worldwide · up to 31 days/trip</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Underwritten by Collinson Insurance (Astrenska Insurance Ltd)</p>
              </div>
              <Tag color={COLORS.accent} text="#fff">Active</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
              {[
                { label: "Claims online", value: "postoffice.claimhere.co.uk" },
                { label: "Claims phone", value: t.claimsPhone },
                { label: "Emergency (24/7)", value: t.emergencyPhone },
                { label: "Claim deadline", value: "60 days from return" },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                  <p style={{ fontSize: 12, fontWeight: 500, fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits table */}
          <Card>
            <SectionTitle>Cover limits — Max level</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    {["Section", "Limit", "Excess", "Key notes"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.keyBenefits.map((b, i) => (
                    <tr key={b.section} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.bg : "transparent" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{b.section}</td>
                      <td style={{ padding: "10px 12px", fontWeight: 600, color: COLORS.accent, whiteSpace: "nowrap" }}>{b.limit}</td>
                      <td style={{ padding: "10px 12px", color: b.excess === "Nil" ? COLORS.green : COLORS.text, whiteSpace: "nowrap" }}>{b.excess}</td>
                      <td style={{ padding: "10px 12px", color: COLORS.muted, fontSize: 11 }}>{b.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Not covered */}
          <Card>
            <SectionTitle>Key exclusions</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {t.notCovered.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ color: COLORS.red, fontSize: 13, flexShrink: 0 }}>✕</span>
                  <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* CAR INSURANCE */}
      {hTab === "car" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Policy header */}
          <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 20, border: `1px solid #c8d4fb` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>Markerstudy / Lancaster Treasured IFR</p>
                <p style={{ fontSize: 20, fontWeight: 600 }}>🚗 {c.vehicle.make} · {c.vehicle.reg}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{c.vehicle.year} · {c.vehicle.cc}cc · Value £{c.vehicle.value.toLocaleString()} · {c.vehicle.cover}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <Tag color={daysUntil(c.period.expiry) < 60 ? COLORS.redLight : daysUntil(c.period.expiry) < 120 ? COLORS.amberLight : COLORS.greenLight}
                     text={daysUntil(c.period.expiry) < 60 ? COLORS.red : daysUntil(c.period.expiry) < 120 ? COLORS.amber : COLORS.green}>
                  {daysUntil(c.period.expiry)}d remaining
                </Tag>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 6, fontFamily: "'DM Mono', monospace" }}>Expires 5 Apr 2026</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
              {[
                { label: "Annual premium", value: `£${c.premium.total}` },
                { label: "Mileage limit", value: `${c.mileageLimit.toLocaleString()} miles/yr` },
                { label: "Claims line", value: c.claimsPhone },
                { label: "Policy no.", value: masked ? "TX●●●●●●●●04" : c.policyNo },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 8, padding: 12 }}>
                  <p style={{ fontSize: 10, color: COLORS.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Drivers & use */}
            <Card>
              <SectionTitle>Drivers & use</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {c.drivers.map(d => (
                  <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ color: COLORS.green }}>✓</span>
                    <span style={{ fontSize: 13 }}>{d}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 3 }}>Permitted use</p>
                  <p style={{ fontSize: 13 }}>{c.use}</p>
                </div>
                <div style={{ padding: "8px 0" }}>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 3 }}>European cover</p>
                  <p style={{ fontSize: 12, lineHeight: 1.5 }}>{c.europeanCover}</p>
                </div>
              </div>
            </Card>

            {/* Excesses */}
            <Card>
              <SectionTitle>Excesses</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {c.excesses.map((e, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: e.type.includes("Total") ? "10px 4px" : "10px 0", borderBottom: `1px solid ${COLORS.border}`, background: e.type.includes("Total") ? COLORS.amberLight : "transparent" }}>
                    <span style={{ fontSize: 12, color: e.type.includes("Total") ? COLORS.amber : COLORS.muted }}>{e.type}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: e.type.includes("Total") ? COLORS.amber : COLORS.text }}>£{e.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Endorsements */}
          <Card>
            <SectionTitle>Endorsements applicable</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {c.endorsements.map((e, i) => (
                <div key={e.code} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, alignItems: "flex-start" }}>
                  <Tag color={COLORS.accentLight} text={COLORS.accent}>{e.code}</Tag>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{e.title}</p>
                    <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{e.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Document download */}
          <div onClick={async()=>{const u=await getStorageUrl("insurance/Car_Insurance_Certificate.pdf");if(u)window.open(u,'_blank');}} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 16, display: "flex", gap: 14, alignItems: "center", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🚗</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Car Insurance Certificate & Schedule</p>
                <p style={{ fontSize: 11, color: COLORS.muted }}>Markerstudy · Policy TX103713004204 · Expires 5 Apr 2026</p>
              </div>
              <span style={{ fontSize: 12, color: COLORS.accent, fontWeight: 500 }}>⬇ Download</span>
            </div>
        </div>
      )}

      {/* WATCH POINTS */}
      {hTab === "watchpoints" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: COLORS.amberLight, borderRadius: 12, padding: 16, border: `1px solid #f5d78e` }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.amber, marginBottom: 4 }}>Important reminders across all policies</p>
            <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>Key things to keep in mind for health, travel, and car insurance to avoid claims being rejected.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>✈️ Travel insurance</SectionTitle>
              {t.watchPoints.map((w, i) => <ActionItem key={i} {...w} />)}
            </Card>
            <Card>
              <SectionTitle>🚗 Car insurance</SectionTitle>
              {c.watchPoints.map((w, i) => <ActionItem key={i} {...w} />)}
            </Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>If you need emergency medical help abroad</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "1", text: "Call +44 (0)20 8865 3074 — 24/7 emergency line" },
                  { step: "2", text: "Tell them you'll be admitted as inpatient overnight" },
                  { step: "3", text: "Do not agree to or pay for treatment without their authorisation" },
                  { step: "4", text: "Keep all receipts and medical reports" },
                  { step: "5", text: "Claim within 60 days of return at postoffice.claimhere.co.uk" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: COLORS.accent }}>{s.step}</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>If baggage is lost or stolen</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { step: "1", text: "Report to Police within 48 hours — get written report" },
                  { step: "2", text: "If airline lost it — get Property Irregularity Report (PIR)" },
                  { step: "3", text: "If phone stolen — contact network to suspend SIM" },
                  { step: "4", text: "Keep all receipts for replacement essential items" },
                  { step: "5", text: "Claim within 60 days of return — provide proof of ownership" },
                ].map(s => (
                  <div key={s.step} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: COLORS.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: COLORS.accent }}>{s.step}</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
      {/* IMPORTANT DOCUMENTS */}
      {hTab === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 16, border: "1px solid #c8d4fb" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, marginBottom: 4 }}>📄 Important documents</p>
            <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>Key documents, reference numbers and where physical copies are stored. Add location notes as you file things.</p>
          </div>

          {/* SINEAD */}
          <Card>
            <SectionTitle>Sinead O'Sullivan</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Birth Certificate */}
              <div style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📜</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>Birth Certificate — UK</p>
                      <Tag color={COLORS.greenLight} text={COLORS.green}>Certified copy</Tag>
                    </div>
                    {[
                      { label: "Full name", value: "Sinéad Clare O'Sullivan" },
                      { label: "Date of birth", value: "17 April 1989" },
                      { label: "Place of birth", value: "Hillingdon Hospital, Hillingdon, London Borough of Hillingdon" },
                      { label: "Registration district", value: "Hillingdon" },
                      { label: "Reference", value: "QBDAA 688538 · Application 8602043-1 · Entry No. 7" },
                      { label: "Father", value: "Paul Robert O'Sullivan — Consultant Engineer, England" },
                      { label: "Mother", value: "Donna Mary O'Sullivan (née Wilson) — Hayes, Hillingdon" },
                      { label: "Certified copy issued", value: "24 September 2017, General Register Office" },
                      { label: "Physical location", value: "— add where stored" },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                        <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QUB Degree */}
              {[
                {
                  icon: "🎓", title: "BEng Aerospace Engineering — Queen's University Belfast", tag: "Undergraduate", tagBg: COLORS.accentLight, tagColor: COLORS.accent,
                  file: "SOSullivan_Unofficial_Transcript_QUB.pdf", fileLabel: "Unofficial Transcript (PDF)",
                  rows: [
                    { label: "Institution", value: "The Queen's University of Belfast" },
                    { label: "School", value: "School of Mechanical and Aerospace Engineering" },
                    { label: "Qualification", value: "BEng, 2nd Class Honours, First Division (66%)" },
                    { label: "Graduated", value: "7 July 2011" },
                    { label: "Student number", value: "40018985 · HESA: 0811841323692" },
                    { label: "Transcript", value: "Unofficial — order official via qub.ac.uk/sgc/srecords" },
                    { label: "Physical location", value: "— add where stored" },
                  ]
                },
                {
                  icon: "🎓", title: "MSc Aerospace Engineering — Georgia Institute of Technology", tag: "Postgraduate", tagBg: COLORS.accentLight, tagColor: COLORS.accent,
                  file: "Gatech Transcript.pdf", fileLabel: "Official Transcript (PDF)",
                  rows: [
                    { label: "Institution", value: "Georgia Institute of Technology, Atlanta, GA" },
                    { label: "Major", value: "Aerospace Engineering" },
                    { label: "GPA", value: "3.27 · 46 credit hours earned" },
                    { label: "Student number", value: "902-99-8511" },
                    { label: "Transcript issued", value: "24 November 2014 (Official — pick-up)" },
                    { label: "Note", value: "Transcript shows degree in progress — confirm final award date" },
                    { label: "Physical location", value: "— add where stored" },
                  ]
                },
                {
                  icon: "🎓", title: "MBA — Harvard Business School", tag: "Postgraduate", tagBg: "#f3e8ff", tagColor: "#7c3aed",
                  file: "HBS transcript (image).jpg", fileLabel: "Official Transcript (JPG)",
                  rows: [
                    { label: "Institution", value: "Harvard Business School, Boston MA" },
                    { label: "Qualification", value: "Master of Business Administration (M.B.A.)" },
                    { label: "Degree awarded", value: "13 March 2018" },
                    { label: "Units earned", value: "63" },
                    { label: "Transcript issued", value: "22 October 2020 (Official — signed & sealed)" },
                    { label: "Physical location", value: "— add where stored" },
                  ]
                },
              ].map((deg, idx) => (
                <div key={deg.title} style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: deg.tagBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{deg.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{deg.title}</p>
                        <Tag color={deg.tagBg} text={deg.tagColor}>{deg.tag}</Tag>
                      </div>
                      {deg.rows.map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                          <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                        </div>
                      ))}
                      <span style={{ cursor:"pointer" }} onClick={async()=>{const u=await getStorageUrl("education/"+deg.file);if(u)window.open(u,'_blank');}}>
                        <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: COLORS.accentLight, borderRadius: 6, cursor: "pointer" }}>
                          <span style={{ fontSize: 12 }}>⬇</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.accent }}>{deg.fileLabel}</span>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Marriage Certificate */}
              <div style={{ padding: "14px 0" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>💍</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>Marriage Certificate — Commonwealth of Massachusetts</p>
                      <Tag color={COLORS.greenLight} text={COLORS.green}>Complete</Tag>
                    </div>
                    {[
                      { label: "Date of marriage", value: "23 February 2017" },
                      { label: "Place", value: "Cambridge, City of Boston, Suffolk County, Massachusetts, USA" },
                      { label: "Certificate number", value: "589980 · Registered No. 572 · Intention No. 0632" },
                      { label: "Officiant", value: "Paula M. Crane, Justice of the Peace, Arlington MA" },
                      { label: "Recorded", value: "1 March 2017 — City Registrar Patricia A. McMahon" },
                      { label: "Eoin's parents", value: "Mary Elizabeth McDonald/Gardiner · Michael Joseph McDonald" },
                      { label: "Physical location", value: "— add where stored" },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                        <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                      </div>
                    ))}
                    <span style={{ textDecoration: "none", cursor: "pointer" }} onClick={async()=>{const u=await getStorageUrl("identity/MarriageCertificate.pdf");if(u)window.open(u,'_blank');}}>
                      <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: COLORS.greenLight, borderRadius: 6, cursor: "pointer" }}>
                        <span style={{ fontSize: 12 }}>⬇</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.green }}>Marriage Certificate (PDF)</span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </Card>

          {/* SINEAD BIRTH CERT download card */}
          <Card>
            <SectionTitle>Sinead O'Sullivan — Birth Certificate & Irish Citizenship</SectionTitle>
            <div style={{ padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: COLORS.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📜</div>
                <div style={{ flex: 1 }}>
                  {[
                    { label: "Full name", value: "Sinéad Clare O'Sullivan" },
                    { label: "Date of birth", value: "17 April 1989" },
                    { label: "Place of birth", value: "Hillingdon Hospital, London Borough of Hillingdon" },
                    { label: "Reference", value: "QBDAA 688538 · Application 8602043-1 · Entry No. 7" },
                    { label: "Father", value: "Paul Robert O'Sullivan — Consultant Engineer" },
                    { label: "Mother", value: "Donna Mary O'Sullivan (née Wilson)" },
                    { label: "Certified copy issued", value: "24 September 2017, General Register Office" },
                    { label: "Physical location", value: "— add where stored" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                      <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                    </div>
                  ))}
                  <span style={{ cursor:"pointer" }} onClick={async()=>{const u=await getStorageUrl("identity/Birth certificate.jpg");if(u)window.open(u,'_blank');}}>
                    <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: COLORS.greenLight, borderRadius: 6, cursor: "pointer" }}>
                      <span style={{ fontSize: 12 }}>⬇</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.green }}>Birth Certificate (JPG)</span>
                    </div>
                  </span>
                </div>
              </div>
            </div>

            {/* Irish citizenship lineage */}
            <div style={{ padding: "14px 0" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🇮🇪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>Irish Citizenship — Foreign Births Registration</p>
                    <Tag color="#e8f5e9" text="#2e7d32">By descent</Tag>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.6, marginBottom: 8 }}>Citizenship established through grandfather Patrick Joseph O'Sullivan (born Dublin) → father Paul Robert O'Sullivan (born England to Irish parent) → Sinead.</p>
                  {[
                    { label: "Citizenship basis", value: "Born abroad to a parent born in Ireland (Section B/C)" },
                    { label: "Grandfather", value: "Patrick Joseph O'Sullivan — born Dublin, 5 June 1924 (mother's surname: Jordison)" },
                    { label: "Father", value: "Paul Robert O'Sullivan — born Kettering, Northampton, 26 Aug 1955 (mother's surname: Wilson)" },
                    { label: "Father's status", value: "Irish citizen — born abroad to parent born in Ireland" },
                    { label: "Register entry date", value: "1 December 1989" },
                    { label: "Certificate number", value: "FB 410825" },
                    { label: "Entry number", value: "27241" },
                    { label: "Application status", value: "✓ Registered — Foreign Births Register, Ireland" },
                    { label: "Issued", value: "March 2026 (new certificate received)" },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                      <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                      <span style={{ fontSize: 11, fontWeight: 500, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                    </div>
                  ))}
                  <DocButton path="identity/SOSullivan Foreign Birth Certificate.jpg" label="Foreign Birth Certificate (JPG)" />
                </div>
              </div>
            </div>
          </Card>

          {/* EOIN */}
          <Card>
            <SectionTitle>Eoin Mac Domhnaill</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { icon: "📜", label: "Birth Certificate — Irish", bg: COLORS.greenLight, details: [
                  { label: "Status", value: "— add details / upload scan" },
                  { label: "Date of birth", value: "27 August 1986" },
                  { label: "Place of birth", value: "— add" },
                  { label: "Reference number", value: "— add" },
                  { label: "Physical location", value: "— add where stored" },
                ]},
                { icon: "🎓", label: "Degree(s)", bg: COLORS.accentLight, details: [
                  { label: "Institution", value: "— add" },
                  { label: "Qualification", value: "— add" },
                  { label: "Year graduated", value: "— add" },
                  { label: "Physical location", value: "— add where stored" },
                ]},
              ].map((doc, idx, arr) => (
                <div key={doc.label} style={{ padding: "14px 0", borderBottom: idx < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: doc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{doc.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{doc.label}</p>
                        <Tag color={COLORS.amberLight} text={COLORS.amber}>Add details</Tag>
                      </div>
                      {doc.details.map(r => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "5px 0", gap: 16 }}>
                          <span style={{ fontSize: 11, color: COLORS.muted, flexShrink: 0, minWidth: 140 }}>{r.label}</span>
                          <span style={{ fontSize: 11, fontWeight: 500, color: COLORS.muted, textAlign: "right", lineHeight: 1.5 }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

        </div>
      )}

      {/* VACCINATIONS TAB */}
      {hTab === "vaccinations" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Sinead */}
          <Card>
            <SectionTitle>💉 Sinead O'Sullivan — Vaccination record</SectionTitle>
            <div style={{ background: COLORS.accentLight, borderRadius: 8, padding: 12, marginBottom: 14, border: "1px solid #c8d4fb" }}>
              <p style={{ fontSize: 12, color: COLORS.accent, lineHeight: 1.6 }}>Record based on US Green Card medical exam (Form I-693), completed 2018. All vaccines were verified or administered by a USCIS Civil Surgeon.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { vaccine: "MMR", full: "Measles, Mumps, Rubella", status: "✓ Complete", note: "2 doses confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Tdap", full: "Tetanus, Diphtheria, Pertussis", status: "✓ Complete", note: "Booster due every 10 years — next ~2028", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Varicella", full: "Chickenpox", status: "✓ Complete", note: "2 doses or confirmed immunity", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Hep B", full: "Hepatitis B", status: "✓ Complete", note: "3-dose series — lifelong protection", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Polio (IPV)", full: "Inactivated Polio Vaccine", status: "✓ Complete", note: "3-dose childhood series confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Flu", full: "Seasonal Influenza", status: "Annual", note: "Get each autumn — Oct/Nov ideal", color: COLORS.amberLight, textColor: COLORS.amber },
                { vaccine: "Pneumococcal", full: "Pneumonia", status: "✓ Complete", note: "Age-appropriate dose confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Meningococcal", full: "Meningitis ACWY", status: "✓ Complete", note: "Booster may be needed after 5 years", color: COLORS.greenLight, textColor: COLORS.green },
              ].map(v => (
                <div key={v.vaccine} style={{ background: COLORS.bg, borderRadius: 10, padding: 12, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{v.vaccine}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: v.textColor, background: v.color, padding: "2px 7px", borderRadius: 10 }}>{v.status}</span>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{v.full}</p>
                  <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.4 }}>{v.note}</p>
                </div>
              ))}
            </div>
            <SectionTitle>Travel vaccines</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { vaccine: "Hep A", full: "Hepatitis A", status: "Check records", note: "Recommended for UAE & all travel — check if on I-693", color: COLORS.amberLight, textColor: COLORS.amber },
                { vaccine: "COVID-19", full: "Coronavirus", status: "Check records", note: "Check NHS App for current booster status", color: COLORS.amberLight, textColor: COLORS.amber },
                { vaccine: "Yellow Fever", full: "Yellow Fever", status: "Not required", note: "Not needed for UAE, Ireland, Spain — required for sub-Saharan Africa", color: COLORS.bg, textColor: COLORS.muted },
                { vaccine: "Typhoid", full: "Typhoid", status: "Not required", note: "Not needed for current destinations", color: COLORS.bg, textColor: COLORS.muted },
              ].map(v => (
                <div key={v.vaccine} style={{ background: COLORS.bg, borderRadius: 10, padding: 12, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{v.vaccine}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: v.textColor, background: v.color, padding: "2px 7px", borderRadius: 10 }}>{v.status}</span>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{v.full}</p>
                  <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.4 }}>{v.note}</p>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.amberLight, borderRadius: 8, padding: 12, border: "1px solid #f5d78e" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, marginBottom: 3 }}>📋 To do</p>
              <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>Retrieve original Form I-693 (Civil Surgeon, 2018) — this is your official proof. Also check NHS App for COVID boosters and any additional records.</p>
            </div>
          </Card>

          {/* Eoin */}
          <Card>
            <SectionTitle>💉 Eoin Mac Domhnaill — Vaccination record</SectionTitle>
            <div style={{ background: COLORS.accentLight, borderRadius: 8, padding: 12, marginBottom: 14, border: "1px solid #c8d4fb" }}>
              <p style={{ fontSize: 12, color: COLORS.accent, lineHeight: 1.6 }}>Record based on US Green Card medical exam (Form I-693), completed 2016. All vaccines were verified or administered by a USCIS Civil Surgeon.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              {[
                { vaccine: "MMR", full: "Measles, Mumps, Rubella", status: "✓ Complete", note: "2 doses confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Tdap", full: "Tetanus, Diphtheria, Pertussis", status: "⚠ Due now", note: "10-year booster — due ~2026, book GP", color: COLORS.amberLight, textColor: COLORS.amber },
                { vaccine: "Varicella", full: "Chickenpox", status: "✓ Complete", note: "2 doses or confirmed immunity", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Hep B", full: "Hepatitis B", status: "✓ Complete", note: "3-dose series — lifelong protection", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Polio (IPV)", full: "Inactivated Polio Vaccine", status: "✓ Complete", note: "3-dose childhood series confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Flu", full: "Seasonal Influenza", status: "Annual", note: "Get each autumn — Oct/Nov ideal", color: COLORS.amberLight, textColor: COLORS.amber },
                { vaccine: "Pneumococcal", full: "Pneumonia", status: "✓ Complete", note: "Age-appropriate dose confirmed", color: COLORS.greenLight, textColor: COLORS.green },
                { vaccine: "Meningococcal", full: "Meningitis ACWY", status: "⚠ Check", note: "Booster overdue — was due ~2021, check status", color: COLORS.amberLight, textColor: COLORS.amber },
              ].map(v => (
                <div key={v.vaccine} style={{ background: COLORS.bg, borderRadius: 10, padding: 12, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>{v.vaccine}</p>
                    <span style={{ fontSize: 10, fontWeight: 600, color: v.textColor, background: v.color, padding: "2px 7px", borderRadius: 10 }}>{v.status}</span>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>{v.full}</p>
                  <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.4 }}>{v.note}</p>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.amberLight, borderRadius: 8, padding: 12, border: "1px solid #f5d78e" }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.amber, marginBottom: 3 }}>📋 To do</p>
              <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.6 }}>Retrieve original Form I-693 (Civil Surgeon, 2016). Book GP for Tdap booster (overdue) and Meningococcal check.</p>
            </div>
          </Card>

        </div>
      )}

    </div>
  );
}


function ImmigrationTab({ data, masked }) {
  const [immTab, setImmTab] = React.useState("status");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Sub-tabs */}
            <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
              {[
                { id: "status", label: "🛂 Status & Documents" },
                { id: "addresses", label: "🏠 Address History" },
              ].map(t => (
                <button key={t.id} onClick={() => setImmTab(t.id)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "8px 14px", fontSize: 12, fontWeight: immTab === t.id ? 600 : 400,
                  color: immTab === t.id ? COLORS.accent : COLORS.muted,
                  borderBottom: `2px solid ${immTab === t.id ? COLORS.accent : "transparent"}`,
                  transition: "all 0.15s", fontFamily: "inherit",
                }}>{t.label}</button>
              ))}
            </div>

          {immTab === "status" && <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Current Addresses */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[data.addresses.uk, data.addresses.us].map(addr => (
                <Card key={addr.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 8 }}>{addr.flag} {addr.label}</p>
                      <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{addr.line1}</p>
                      {addr.line2 && <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{addr.line2}</p>}
                      <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.postcode || addr.zip}</p>
                      <p style={{ fontSize: 13, color: COLORS.muted }}>{addr.country}</p>
                      {addr.provider && <p style={{ fontSize: 11, color: COLORS.accent, marginTop: 6 }}>📬 {addr.provider}</p>}
                      {addr.note && <p style={{ fontSize: 11, color: COLORS.amber, marginTop: 8, background: COLORS.amberLight, padding: "4px 8px", borderRadius: 6 }}>ℹ {addr.note}</p>}
                    </div>
                    <button onClick={() => navigator.clipboard?.writeText(`${addr.line1}${addr.line2 ? "\n"+addr.line2 : ""}\n${addr.city}${addr.state ? ", "+addr.state : ""} ${addr.postcode || addr.zip}\n${addr.country}`)}
                      style={{ background: COLORS.accentLight, border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 11, color: COLORS.accent, fontWeight: 500, fontFamily: "inherit", flexShrink: 0 }}>
                      📋 Copy
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Expiry timeline — all docs at a glance */}
            <Card>
              <SectionTitle>Document expiry tracker</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { person: "Sinead", flag: "🇬🇧", doc: "UK Passport", expiry: "2035-06-30", number: "149641323" },
                  { person: "Sinead", flag: "🇺🇸", doc: "US Green Card", expiry: "2029-11-26", number: "USCIS# 216-621-525", warn: "Renew 6 months early → by May 2029" },
                  { person: "Sinead", flag: "🇺🇸", doc: "Global Entry", expiry: "2027-04-17", number: "PASSID 157263768", warn: "Renew 6 months early → by Oct 2026" },
                  { person: "Eoin", flag: "🇮🇪", doc: "Irish Passport", expiry: "2033-01-24", number: "LB6422293" },
                  { person: "Eoin", flag: "🇺🇸", doc: "US Green Card", expiry: "2029-11-26", number: "USCIS# 214-992-112", warn: "Renew 6 months early → by May 2029" },
                  { person: "Eoin", flag: "🇺🇸", doc: "Global Entry", expiry: "2028-08-27", number: "PASSID 161599368" },
                ].map((d, i) => {
                  const days = daysUntil(d.expiry);
                  const color = days < 180 ? COLORS.red : days < 365 ? COLORS.amber : COLORS.green;
                  const bgColor = days < 180 ? COLORS.redLight : days < 365 ? COLORS.amberLight : COLORS.greenLight;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{d.flag}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{d.person}</span>
                          <span style={{ fontSize: 12, color: COLORS.muted }}>·</span>
                          <span style={{ fontSize: 12, color: COLORS.muted }}>{d.doc}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: COLORS.muted }}>
                            {d.number !== "—" ? (masked ? "●".repeat(Math.max(0,d.number.length-4))+d.number.slice(-4) : d.number) : ""}
                          </span>
                          {d.warn && <span style={{ fontSize: 11, color: COLORS.amber }}>⚠ {d.warn}</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <Tag color={bgColor} text={color}>{days > 0 ? `${days}d` : "EXPIRED"}</Tag>
                        <p style={{ fontSize: 10, color: COLORS.muted, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>{d.expiry}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Document vault */}
            <Card>
              <SectionTitle>Document vault</SectionTitle>
              <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Click any document to open or download. Store copies securely — do not share links publicly.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  {
                    person: "Sinead", flag: "🇬🇧", label: "UK Passport",
                    sublabel: masked ? "No. ●●●●1323 · Expires 30 Jun 2035" : "No. 149641323 · Expires 30 Jun 2035",
                    file: "identity/Sinead OSullivan Passport.pdf", type: "PDF", issued: "30 Jun 2025",
                  },
                  {
                    person: "Sinead", flag: "🇺🇸", label: "US Green Card",
                    sublabel: masked ? "USCIS# ●●●-●●●-525 · Cat E26 · Expires 26 Nov 2029" : "USCIS# 216-621-525 · Cat E26 · Expires 26 Nov 2029",
                    fileFront: "identity/SOS Green Card Front.jpg", fileBack: "identity/SOS Green Card Back.jpg", type: "PDF", issued: "26 Nov 2019",
                  },
                  {
                    person: "Sinead", flag: "🇺🇸", label: "Global Entry Card",
                    sublabel: masked ? "PASSID ●●●●3768 · Expires 17 Apr 2027" : "PASSID 157263768 · Expires 17 Apr 2027",
                    fileFront: "identity/SOS Global Entry Front.jpg", fileBack: "identity/SOS Global Entry Back.jpg", type: "PDF", issued: "06 Nov 2021",
                  },
                  {
                    person: "Eoin", flag: "🇮🇪", label: "Irish Passport",
                    sublabel: masked ? "No. ●●●●2293 · Expires 24 Jan 2033" : "No. LB6422293 · Expires 24 Jan 2033",
                    file: "identity/Eoin MacDomhnaill Passport.jpg", type: "JPG", issued: "25 Jan 2023",
                  },
                  {
                    person: "Eoin", flag: "🇺🇸", label: "US Green Card",
                    sublabel: masked ? "USCIS# ●●●-●●●-112 · Cat E27 · Expires 26 Nov 2029" : "USCIS# 214-992-112 · Cat E27 · Expires 26 Nov 2029",
                    fileFront: "identity/EMD Green Card Front.jpg", fileBack: "identity/EMD Green Card Back.jpg", type: "PDF", issued: "26 Nov 2019",
                  },
                  {
                    person: "Eoin", flag: "🇺🇸", label: "Global Entry Card",
                    sublabel: masked ? "PASSID ●●●●9368 · Expires 27 Aug 2028" : "PASSID 161599368 · Expires 27 Aug 2028",
                    fileFront: "identity/EMD Global Entry Front.jpg", fileBack: "identity/EMD Global Entry Back.jpg", type: "PDF", issued: "18 May 2023",
                  },
                ].map((doc) => (
                  <a
                    key={doc.file || doc.fileFront}
                    href="#"
                    onClick={async (e) => { e.preventDefault(); const p = doc.file || doc.fileFront; if(p){const u=await getStorageUrl(p);if(u)window.open(u,'_blank');} }}
                    style={{ textDecoration: "none" }}
                  >
                    <div style={{
                      background: COLORS.bg, borderRadius: 10, padding: 16,
                      border: `1px solid ${COLORS.border}`, cursor: "pointer",
                      transition: "border-color 0.15s",
                      display: "flex", gap: 14, alignItems: "flex-start",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.accent}
                      onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}
                    >
                      {/* Icon */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                        background: COLORS.accentLight,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 22,
                      }}>{doc.flag}</div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 3, color: COLORS.text }}>{doc.person} · {doc.label}</p>
                            <p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.4 }}>{doc.sublabel}</p>
                          </div>
                          <Tag color={COLORS.accentLight} text={COLORS.accent}>{doc.type}</Tag>
                        </div>
                        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 11, color: COLORS.accent, fontWeight: 500 }}>⬇ Download / View</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </Card>

            {/* Per-person detail cards */}
            {data.immigration.map(person => (
              <Card key={person.person}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 24 }}>{person.flag}</span>
                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 600 }}>{person.person}</h2>
                      <p style={{ fontSize: 12, color: COLORS.muted }}>{person.nationality} national · DOB {person.dob}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic", maxWidth: 280, textAlign: "right" }}>{person.notes}</p>
                </div>

                {/* UK right to reside */}
                <div style={{ background: COLORS.greenLight, borderRadius: 8, padding: 14, marginBottom: 12, border: `1px solid #b8edd6` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>🇬🇧 UK Status</span>
                    <Tag color={COLORS.greenLight} text={COLORS.green}>✓ No visa required</Tag>
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 6 }}>{person.ukRight.type}</p>
                  <p style={{ fontSize: 11, color: COLORS.green, marginTop: 4 }}>{person.ukRight.note}</p>
                </div>

                {/* Other docs */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
                  {person.documents.map(doc => (
                    <DocDetailCard key={doc.type} doc={doc} masked={masked} />
                  ))}
                </div>
              </Card>
            ))}
          </div>}

      {immTab === "addresses" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle>Sinead O'Sullivan — Address History</SectionTitle>
            <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 14 }}>Chronological record — useful for visa applications, background checks, and FBAR/tax filings.</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { period: "Pre-2003 – Jun 2007", address: "34 Drumman Hill, Armagh", country: "🇬🇧 Northern Ireland" },
                { period: "Sep 2007 – Dec 2007", address: "Bold Street, Liverpool", country: "🇬🇧 England" },
                { period: "Dec 2007 – Apr 2008", address: "Serre Chevalier, France", country: "🇫🇷 France" },
                { period: "May 2008 – Aug 2008", address: "Reggio di Calabria, Italy", country: "🇮🇹 Italy" },
                { period: "Sep 2008 – Jun 2009", address: "Wellington Park Terrace, Belfast", country: "🇬🇧 Northern Ireland" },
                { period: "Sep 2009 – Jun 2010", address: "Riverview Street, Belfast", country: "🇬🇧 Northern Ireland" },
                { period: "Sep 2010 – Jul 2011", address: "14A Chlorine Gardens, Belfast BT9 5DL", country: "🇬🇧 Northern Ireland" },
                { period: "21 Sep 2012 – Jun 2013", address: "Apt 19 Thomastown House, Spencer Dock, Dublin 1", country: "🇮🇪 Ireland" },
                { period: "Aug 2013 – Apr 2014", address: "251 10th St NW, Apt G302, Atlanta GA 30318", country: "🇺🇸 USA" },
                { period: "19 Apr 2014 – May 2015", address: "1377 Dresden Drive, Apt 5249, Atlanta GA 30319", country: "🇺🇸 USA" },
                { period: "Oct 2015 – Aug 2016", address: "11 Story St, Unit 34, Cambridge MA 02138", country: "🇺🇸 USA" },
                { period: "22 Aug 2016 – Jan 2017", address: "350 W 42nd St, Apt 55C, New York NY 10036", country: "🇺🇸 USA" },
                { period: "Feb 2017 – Aug 2017", address: "11 Story St, Unit 34, Cambridge MA 02138", country: "🇺🇸 USA" },
                { period: "Sep 2017 – Feb 2018", address: "1648 Mass Ave, Apt 24, Cambridge MA 02138", country: "🇺🇸 USA" },
                { period: "Jun 2018 – Sep 2020", address: "833 N Clark St, Apt 905, Chicago IL 60610", country: "🇺🇸 USA" },
                { period: "Mar 2020 – Jul 2020", address: "17 Old Mystic Circle, North Falmouth MA 02556", country: "🇺🇸 USA", note: "COVID overlap — secondary address" },
                { period: "Sep 2020 – Aug 2023", address: "26 Village Square, Glaslough, Co. Monaghan", country: "🇮🇪 Ireland" },
                { period: "Sep 2021 – Aug 2022", address: "50 Follen St, Apt 407, Cambridge MA 02138", country: "🇺🇸 USA", note: "US address overlap during Ireland period" },
                { period: "Sep 2023 – Dec 2024", address: "50 Glenesky Square, Castleknock, Dublin D15 RH60", country: "🇮🇪 Ireland" },
                { period: "9 Dec 2024 – present", address: "4 Caroline Place Mews, London W2 4AQ", country: "🇬🇧 England", current: true },
              ].map((a, i, arr) => (
                <div key={i} style={{ display: "flex", gap: 0, borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ width: 28, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14, flexShrink: 0 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: a.current ? COLORS.green : COLORS.accent, flexShrink: 0 }} />
                    {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />}
                  </div>
                  <div style={{ flex: 1, padding: "12px 0 12px 8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{a.address}</p>
                        <p style={{ fontSize: 11, color: COLORS.muted }}>{a.country}</p>
                        {a.note && <p style={{ fontSize: 11, color: COLORS.amber, marginTop: 4 }}>⚠ {a.note}</p>}
                      </div>
                      <span style={{ fontSize: 11, color: COLORS.muted, whiteSpace: "nowrap", flexShrink: 0, textAlign: "right" }}>{a.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TaxTab({ data, masked }) {
  const [jurisdictionTab, setJurisdictionTab] = useState("overview");
  const fig = data.fig;
  const figPct = (fig.yearsUsed / fig.yearsTotal) * 100;

  const jTabs = [
    { id: "overview", label: "Overview" },
    { id: "fig", label: "🇬🇧 FIG Regime" },
    { id: "uk", label: "🇬🇧 UK" },
    { id: "us", label: "🇺🇸 US" },
    { id: "ireland", label: "🇮🇪 Ireland" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 0, marginBottom: 4 }}>
        {jTabs.map(t => (
          <button key={t.id} onClick={() => setJurisdictionTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 14px", fontSize: 12, fontWeight: jurisdictionTab === t.id ? 600 : 400,
            color: jurisdictionTab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${jurisdictionTab === t.id ? COLORS.accent : "transparent"}`,
            transition: "all 0.15s", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/* OVERVIEW SUB-TAB */}
      {jurisdictionTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Total cost banner */}
          <div style={{ background: "#FFF8EC", borderRadius: 12, padding: 20, border: `1px solid #f5d78e` }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.amber, marginBottom: 10 }}>Estimated total compliance cost — best case (remittance basis elected)</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
              {[
                { label: "Ireland back tax", value: `€${data.totalCost.irelandBackTax.toLocaleString()}` },
                { label: "IE penalties & interest", value: `€${data.totalCost.irelandPenaltiesInterest.toLocaleString()}` },
                { label: "US Federal (2024–25)", value: `~€${Math.round(data.totalCost.usFederal * 0.93).toLocaleString()}` },
                { label: "Professional fees", value: `€${data.totalCost.professionalFees.toLocaleString()}` },
                { label: "Total estimated cost", value: `~€${data.totalCost.total.toLocaleString()}`, highlight: true },
              ].map(s => (
                <div key={s.label} style={{ background: s.highlight ? COLORS.amber : "rgba(255,255,255,0.6)", borderRadius: 8, padding: 14 }}>
                  <p style={{ fontSize: 10, color: s.highlight ? "rgba(255,255,255,0.8)" : COLORS.muted, marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: s.highlight ? "#fff" : COLORS.text }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(198,123,0,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 20 }}>
                {data.estimateHistory.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: i === 2 ? COLORS.green : i === 1 ? COLORS.amber : COLORS.red }} />
                    <span style={{ fontSize: 11, color: COLORS.text }}>{e.stage}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: i === 2 ? COLORS.green : COLORS.text }}>€{e.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Tag color={COLORS.greenLight} text={COLORS.green}>Saved €{data.totalCost.saving.toLocaleString()} vs original estimate</Tag>
            </div>
            <p style={{ fontSize: 11, color: COLORS.amber, marginTop: 8 }}>⚠ UK tax = £0 only if Sinead elects remittance basis before 5 April 2026 — this is the single most urgent action</p>
          </div>

          {/* Obligations table */}
          <Card>
            <SectionTitle>All obligations</SectionTitle>
            <div>
              {data.obligations.map((t, i) => (
                <div key={t.obligation} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "14px 0",
                  borderBottom: i < data.obligations.length - 1 ? `1px solid ${COLORS.border}` : "none"
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{t.jurisdiction} {t.obligation}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>Due: {t.due}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {t.amount != null && t.amount > 0 && <span style={{ fontSize: 14, fontWeight: 600 }}>€{t.amount.toLocaleString()}</span>}
                    <Tag
                      color={t.status === "filed" ? COLORS.greenLight : t.status === "urgent" ? COLORS.amberLight : t.status === "active" ? COLORS.accentLight : COLORS.border}
                      text={t.status === "filed" ? COLORS.green : t.status === "urgent" ? COLORS.amber : t.status === "active" ? COLORS.accent : COLORS.muted}
                    >{t.status}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* All actions consolidated */}
          <Card>
            <SectionTitle>All priority actions</SectionTitle>
            {[
              ...data.uk.actions.map(a => ({ ...a, source: "🇬🇧 UK" })),
              ...data.us.actions.map(a => ({ ...a, source: "🇺🇸 US" })),
              ...data.ireland.actions.map(a => ({ ...a, source: "🇮🇪 Ireland" })),
            ]
              .sort((a, b) => {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
              })
              .map((a, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <PriorityDot priority={a.priority} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{a.text}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{a.source}</span>
                    <Tag
                      color={a.priority === "high" ? COLORS.amberLight : a.priority === "medium" ? COLORS.accentLight : COLORS.border}
                      text={a.priority === "high" ? COLORS.amber : a.priority === "medium" ? COLORS.accent : COLORS.muted}
                    >{a.priority}</Tag>
                  </div>
                </div>
              ))}
          </Card>
        </div>
      )}

      {/* FIG REGIME SUB-TAB */}
      {jurisdictionTab === "fig" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
            {[
              { label: "Regime started", value: "Apr 2024", sub: "Tax year 2024/25" },
              { label: "Years used", value: `${fig.yearsUsed} / ${fig.yearsTotal}`, sub: "Year 1 of 4" },
              { label: "Years remaining", value: fig.yearsTotal - fig.yearsUsed, sub: "Until Apr 2028" },
              { label: "Qualifiers", value: fig.qualifiers.join(" & "), sub: "Both residents" },
            ].map(s => (
              <Card key={s.label}>
                <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.sub}</p>
              </Card>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>What FIG covers</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {fig.benefits.map(b => (
                  <div key={b.label} style={{ background: COLORS.bg, borderRadius: 8, padding: 14 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                      <span style={{ color: COLORS.green, fontSize: 14 }}>✓</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
                    </div>
                    <p style={{ fontSize: 12, color: COLORS.muted, paddingLeft: 22 }}>{b.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <SectionTitle>Important conditions & warnings</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {fig.warnings.map((w, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < fig.warnings.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                    <span style={{ color: COLORS.amber, fontSize: 13, flexShrink: 0 }}>⚠</span>
                    <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>{w}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Year timeline */}
          <Card>
            <SectionTitle>FIG year timeline</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { year: "Year 1", period: "2024/25", status: "current", note: "Claim on SA return — declare FIG election" },
                { year: "Year 2", period: "2025/26", status: "upcoming", note: "Re-elect annually — keep foreign income records" },
                { year: "Year 3", period: "2026/27", status: "future", note: "Review foreign asset disposals — plan ahead" },
                { year: "Year 4", period: "2027/28", status: "future", note: "Final year — review investment structure before expiry" },
              ].map(y => (
                <div key={y.year} style={{
                  background: y.status === "current" ? COLORS.accentLight : COLORS.bg,
                  border: `1px solid ${y.status === "current" ? "#c8d4fb" : COLORS.border}`,
                  borderRadius: 10, padding: 16
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: y.status === "current" ? COLORS.accent : COLORS.text }}>{y.year}</span>
                    {y.status === "current" && <Tag color={COLORS.accent} text="#fff">Now</Tag>}
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>{y.period}</p>
                  <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{y.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* UK SUB-TAB */}
      {jurisdictionTab === "uk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: COLORS.greenLight, borderRadius: 12, padding: 20, border: `1px solid #b8e8d0` }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.green, marginBottom: 6 }}>✓ Eoin — PAYE Settled</p>
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
                Eoin's £200,000 salary (from Nov 2024) generates ~£81,700 income tax + NI, all collected at source via PAYE. Personal allowance tapered to nil above £125,140. <strong>No additional UK tax owed by Eoin.</strong>
              </p>
            </div>
            <div style={{ background: COLORS.amberLight, borderRadius: 12, padding: 20, border: `1px solid #f5d78e` }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.amber, marginBottom: 6 }}>⚠ Sinead — Non-Dom Decision Before April 2026</p>
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
                As an Irish citizen never previously UK-domiciled, Sinead almost certainly qualifies as non-UK-domiciled. Remittance basis: foreign income taxable only if brought to UK. <strong>Worth £28,000</strong> vs arising basis. Register for Self Assessment now.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Sinead — remittance vs arising basis comparison</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { label: "Basis", remittance: "Remittance (recommended)", arising: "Arising basis" },
                  { label: "Foreign income taxed?", remittance: "Only if remitted to UK", arising: "Yes — worldwide" },
                  { label: "Est. UK tax 2025/26", remittance: "£0", arising: "~£38,000 gross" },
                  { label: "After FTC (Irish/US)", remittance: "£0", arising: "~£28,700 net" },
                  { label: "Personal allowance", remittance: "Lost (nil anyway)", arising: "Retained (but tapered)" },
                  { label: "Annual charge (yrs 1–7)", remittance: "None", arising: "N/A" },
                  { label: "KEY DECISION", remittance: "Saving: £28,000", arising: "Extra cost: £28,000", bold: true },
                ].map(r => (
                  <div key={r.label} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "9px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: r.bold ? 700 : 400, color: r.bold ? COLORS.green : COLORS.green }}>{r.remittance}</span>
                    <span style={{ fontSize: 12, fontWeight: r.bold ? 700 : 400, color: r.bold ? COLORS.red : COLORS.muted }}>{r.arising}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 10 }}>Do NOT transfer US book advances or Irish fees to UK bank while on remittance basis.</p>
            </Card>

            <Card>
              <SectionTitle>Annual allowance usage 2025/26</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {data.uk.allowances.map(a => (
                  <div key={a.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12 }}>{a.label}</span>
                      <div>
                        {a.total > 0 ? (
                          <>
                            <span style={{ fontSize: 12, fontWeight: 500 }}>{fmt(a.used)}</span>
                            <span style={{ fontSize: 11, color: COLORS.muted }}> / {fmt(a.total)}</span>
                          </>
                        ) : <span style={{ fontSize: 11, color: COLORS.muted }}>{a.note}</span>}
                      </div>
                    </div>
                    {a.total > 0 && <ProgressBar value={a.used} max={a.total} color={a.used >= a.total ? COLORS.green : COLORS.accent} />}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 14, background: COLORS.bg, borderRadius: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Prior UK-source income (2021–2024)</p>
                <p style={{ fontSize: 12, color: COLORS.muted }}>FT, Condé Nast, AFLAC — total £3,020. Below personal allowance every year. <span style={{ color: COLORS.green, fontWeight: 600 }}>£0 UK tax liability for prior years.</span></p>
              </div>
            </Card>
          </div>

          <Card>
            <SectionTitle>UK actions</SectionTitle>
            {data.uk.actions.map((a, i) => <ActionItem key={i} {...a} />)}
          </Card>
        </div>
      )}

      {/* US SUB-TAB */}
      {jurisdictionTab === "us" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Filing status banner */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: COLORS.greenLight, borderRadius: 12, padding: 20, border: `1px solid #b8e8d0` }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.green, marginBottom: 6 }}>✓ 2021–2023 Filed & Settled</p>
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
                All three years filed Married Filing Jointly by <strong>Bean Accounting & Tax, PLLC</strong> (Darwin Mintu). Includes Eoin's US wages ($457K in 2021, $175K in 2022). Federal refunds received. No Streamlined procedure needed for these years.
              </p>
            </div>
            <div style={{ background: COLORS.amberLight, borderRadius: 12, padding: 20, border: `1px solid #f5d78e` }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.amber, marginBottom: 6 }}>⚠ 2024–2025 Unfiled — Action Required</p>
              <p style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.6 }}>
                2024: MFJ return needed, ~<strong>$20,640</strong> owed. 2025: MFJ estimate ~<strong>$8,500</strong> (UK FTC nearly eliminates US tax on Eoin's salary). FBARs required for both persons 2019–2024.
              </p>
            </div>
          </div>

          {/* Settled years */}
          <Card>
            <SectionTitle>Filed & settled years — 2021–2023 (Bean Accounting MFJ)</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    {["Year", "AGI", "Federal Tax", "Paid/Withheld", "Balance", "IL State", "Status"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(data.us.filedYears).map(([year, row], i) => (
                    <tr key={year} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.bg : "transparent" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{year}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>${row.agi.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>${row.federalTax.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.green }}>${row.paid.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: row.balance < 0 ? COLORS.green : COLORS.amber }}>
                        {row.balance < 0 ? `(${Math.abs(row.balance).toLocaleString()})` : `$${row.balance.toLocaleString()}`}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.muted }}>{row.ilBalance > 0 ? `$${row.ilBalance.toLocaleString()}` : "—"}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <Tag color={COLORS.greenLight} text={COLORS.green}>{row.status}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8 }}>Brackets indicate refunds received. Effective rates: 23.4% (2021), 15.9% (2022), 10.0% (2023). All IL state tax also settled.</p>
          </Card>

          {/* Unfiled years */}
          <Card>
            <SectionTitle>Unfiled years — 2024 & 2025 (MFJ estimates)</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {data.us.unfiledYears.map(row => (
                <div key={row.year} style={{ background: COLORS.bg, borderRadius: 10, padding: 16, border: `1px solid ${COLORS.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{row.year}</span>
                    <Tag color={row.status === "ESTIMATE" ? COLORS.accentLight : COLORS.amberLight} text={row.status === "ESTIMATE" ? COLORS.accent : COLORS.amber}>{row.status}</Tag>
                  </div>
                  {[
                    { label: "Combined gross income", value: `$${row.combinedGross.toLocaleString()}` },
                    { label: "Deductions", value: `($${row.deductions.toLocaleString()})`, color: COLORS.green },
                    { label: "Taxable income", value: `$${row.taxableIncome.toLocaleString()}`, bold: true },
                    { label: "Federal income + SE tax", value: `$${row.totalTax.toLocaleString()}` },
                    { label: "Less: estimated payments", value: `($${row.estimatedPayments.toLocaleString()})`, color: COLORS.green },
                    { label: "Less: Irish FTC", value: `($${row.ftcIrish.toLocaleString()})`, color: COLORS.green },
                    { label: "Less: UK PAYE FTC", value: `($${row.ftcUK.toLocaleString()})`, color: COLORS.green },
                    { label: "Additional federal owed", value: `$${row.additionalOwed.toLocaleString()}`, bold: true, color: row.additionalOwed > 0 ? COLORS.amber : COLORS.green },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: r.bold ? 700 : 400, color: r.color || COLORS.text, fontFamily: "'DM Mono', monospace" }}>{r.value}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 8, lineHeight: 1.5 }}>{row.notes}</p>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>FBAR — accounts to report (both persons)</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {data.us.fbar.accounts.map(a => (
                  <div key={a.name} style={{ background: COLORS.bg, borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</span>
                      <Tag color={COLORS.amberLight} text={COLORS.amber}>{a.holder}</Tag>
                    </div>
                    <p style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'DM Mono', monospace" }}>{masked ? (a.maskedIban || a.maskedDetails || (a.iban ? a.iban.replace(/\S/g, "●").slice(0,-4) + a.iban.slice(-4) : a.details)) : (a.iban || a.details)}</p>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>File FinCEN 114 by April 15 2026 — delinquent non-wilful, no penalties expected.</p>
              </div>
            </Card>

            <Card>
              <SectionTitle>Open questions — US</SectionTitle>
              {data.us.openQuestions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ color: COLORS.accent, fontSize: 13, flexShrink: 0 }}>?</span>
                  <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{q}</p>
                </div>
              ))}
            </Card>
          </div>

          <Card>
            <SectionTitle>US actions</SectionTitle>
            {data.us.actions.map((a, i) => <ActionItem key={i} {...a} />)}
          </Card>
        </div>
      )}

      {/* IRELAND SUB-TAB */}
      {jurisdictionTab === "ireland" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Total Irish liability summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {[
              { label: "Total additional owed", value: `€${data.ireland.liabilityByYear.reduce((s,y) => s + y.additionalOwed, 0).toLocaleString()}`, color: COLORS.amber, sub: "Joint assessment, all years" },
              { label: "Surcharge (5% voluntary)", value: `€${data.ireland.penalties.surcharge.toLocaleString()}`, sub: "vs 10% if Revenue contacts first" },
              { label: "Interest (~8% p.a.)", value: `€${data.ireland.penalties.interest.toLocaleString()}`, sub: "On outstanding amounts" },
              { label: "Total incl. penalties", value: `€${(data.ireland.liabilityByYear.reduce((s,y) => s+y.additionalOwed,0) + data.ireland.penalties.surcharge + data.ireland.penalties.interest).toLocaleString()}`, sub: "Before professional fees", color: COLORS.red },
            ].map(s => (
              <Card key={s.label}>
                <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: s.color || COLORS.text }}>{s.value}</p>
                {s.sub && <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.sub}</p>}
              </Card>
            ))}
          </div>

          {/* Liability by year */}
          <Card>
            <SectionTitle>Irish tax liability by year</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                    {["Year", "Assessable Income", "Gross Tax", "Already Paid (2rn)", "US Tax Credit", "Additional Owed"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: COLORS.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.ireland.liabilityByYear.map((row, i) => (
                    <tr key={row.year} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.bg : "transparent" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.year}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>€{row.assessable.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>€{row.grossTax.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.green }}>€{row.alreadyPaid.toLocaleString()}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.green }}>{row.ftc > 0 ? `€${row.ftc.toLocaleString()}` : "—"}</td>
                      <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: row.additionalOwed > 5000 ? COLORS.red : row.additionalOwed > 0 ? COLORS.amber : COLORS.green }}>
                        €{row.additionalOwed.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: `2px solid ${COLORS.border}`, background: COLORS.amberLight }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700 }}>TOTAL</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>€{data.ireland.liabilityByYear.reduce((s,y) => s+y.assessable,0).toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600 }}>€{data.ireland.liabilityByYear.reduce((s,y) => s+y.grossTax,0).toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.green, fontWeight: 600 }}>€{data.ireland.liabilityByYear.reduce((s,y) => s+y.alreadyPaid,0).toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", color: COLORS.green, fontWeight: 600 }}>€{data.ireland.liabilityByYear.reduce((s,y) => s+y.ftc,0).toLocaleString()}</td>
                    <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: COLORS.amber }}>€{data.ireland.liabilityByYear.reduce((s,y) => s+y.additionalOwed,0).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 10 }}>Joint assessment figures. 2021–2022: non-resident, Irish-source only. 2023–2024: resident worldwide (Eoin split-year s.822 in 2024). 2025: non-resident again.</p>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card>
              <SectionTitle>Residency timeline</SectionTitle>
              {data.ireland.residency.map(r => (
                <div key={r.period} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 500 }}>{r.period} <span style={{ color: COLORS.muted, fontWeight: 400 }}>· {r.who}</span></p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>{r.location}</p>
                  </div>
                  <Tag
                    color={r.status === "Resident IE" ? COLORS.greenLight : r.status.includes("split") || r.status.includes("Non-resident") ? COLORS.amberLight : COLORS.border}
                    text={r.status === "Resident IE" ? COLORS.green : r.status.includes("split") || r.status.includes("Non-resident") ? COLORS.amber : COLORS.muted}
                  >{r.status.split(" ")[0]}</Tag>
                </div>
              ))}
            </Card>

            <Card>
              <SectionTitle>Key notes & savings already applied</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Joint assessment", saving: "Included", detail: "Married rate band €51,000+ (2024). Already in these figures — not an additional saving." },
                  { label: "Eoin split-year 2024 (s.822)", saving: "~€13K saved", detail: "UK salary Nov–Dec excluded from Irish tax. Already applied above.", color: COLORS.green },
                  { label: "Higher documented expenses", saving: "~€5K saved", detail: "$37,711 documented expenses vs $13K original estimate. Already applied.", color: COLORS.green },
                  { label: "Revenue payment plan", saving: "Cashflow only", detail: "Back taxes can be spread over 12–24 months — doesn't reduce amount." },
                  { label: "Artists' Exemption (future)", saving: "Up to €50K/yr", detail: "S.195 TCA 1997 — Janklow book deal may qualify. Not retroactive.", color: COLORS.accent },
                ].map(r => (
                  <div key={r.label} style={{ background: COLORS.bg, borderRadius: 8, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{r.label}</span>
                      <Tag color={r.color ? `${r.color}22` : COLORS.greenLight} text={r.color || COLORS.green}>{r.saving}</Tag>
                    </div>
                    <p style={{ fontSize: 12, color: COLORS.muted }}>{r.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <SectionTitle>Open questions — Ireland</SectionTitle>
            {data.ireland.openQuestions.map((q, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.accent, fontSize: 13, flexShrink: 0 }}>?</span>
                <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.5 }}>{q}</p>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle>Ireland actions</SectionTitle>
            {data.ireland.actions.map((a, i) => <ActionItem key={i} {...a} />)}
          </Card>
        </div>
      )}
    </div>
  );
}

function PropertyTab({ data }) {
  const p = data;
  const annualRent = p.monthlyRent * 12;
  const billsKnown = p.bills.filter(b => b.monthlyEstimate);
  const totalBillsMonthly = billsKnown.reduce((s, b) => s + b.monthlyEstimate, 0);
  const categoryColors = { Energy: COLORS.amber, Council: COLORS.accent, Connectivity: COLORS.green };
  const categoryBg = { Energy: COLORS.amberLight, Council: COLORS.accentLight, Connectivity: COLORS.greenLight };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div style={{ background: COLORS.accentLight, borderRadius: 12, padding: 20, border: `1px solid #c8d4fb` }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.accent, marginBottom: 4 }}>🏠 Current Home</p>
        <p style={{ fontSize: 20, fontWeight: 600, marginBottom: 2 }}>{p.address}</p>
        <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 10 }}>{p.leaseTerm} · AST · {p.leaseStart} → {p.leaseEnd}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag color={COLORS.greenLight} text={COLORS.green}>Renting</Tag>
          <Tag color={COLORS.accentLight} text={COLORS.accent}>London W2</Tag>
          <Tag color={COLORS.greenLight} text={COLORS.green}>Deposit protected (DPS) ✓</Tag>
        </div>
      </div>

      {/* Key figures row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <Card>
          <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>Monthly rent</p>
          <p style={{ fontSize: 28, fontWeight: 600 }}>£{p.monthlyRent.toLocaleString()}</p>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Due {p.rentDueDay}th each month · £{annualRent.toLocaleString()}/yr</p>
        </Card>
        <Card>
          <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>Deposit held</p>
          <p style={{ fontSize: 28, fontWeight: 600 }}>£{p.depositAmount.toLocaleString()}</p>
          <p style={{ fontSize: 11, color: COLORS.green, marginTop: 4 }}>✓ Protected · The DPS</p>
        </Card>
        <Card>
          <p style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>Known bills (est.)</p>
          <p style={{ fontSize: 28, fontWeight: 600 }}>~£{totalBillsMonthly}/mo</p>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Electricity + gas + broadband · excl. council tax</p>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Tenancy details */}
        <Card>
          <SectionTitle>Tenancy details</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {[
              { label: "Type", value: "Assured Shorthold Tenancy" },
              { label: "Monthly rent", value: `£${p.monthlyRent.toLocaleString()}` },
              { label: "Rent due", value: `${p.rentDueDay}th of each month` },
              { label: "Lease start", value: p.leaseStart },
              { label: "Lease end", value: p.leaseEnd },
              { label: "Break clause", value: p.breakClause },
              { label: "Rent review", value: p.rentReview },
              { label: "Landlord", value: p.landlord.name },
              { label: "Agent", value: p.agent.name },
              { label: "Agent phone", value: p.agent.phone },
              { label: "Agent email", value: p.agent.email },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${COLORS.border}`, gap: 16 }}>
                <span style={{ fontSize: 12, color: COLORS.muted, flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.text, textAlign: "right", lineHeight: 1.4 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Deposit */}
          <Card>
            <SectionTitle>Deposit & protection</SectionTitle>
            {[
              { label: "Deposit amount", value: `£${p.depositAmount.toLocaleString()}` },
              { label: "Scheme", value: p.depositScheme },
              { label: "Contact / ref", value: p.depositRef },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${COLORS.border}`, gap: 16 }}>
                <span style={{ fontSize: 12, color: COLORS.muted, flexShrink: 0 }}>{r.label}</span>
                <span style={{ fontSize: 12, fontWeight: 500, textAlign: "right", lineHeight: 1.4 }}>{r.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: 12, background: COLORS.greenLight, borderRadius: 8 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.green, marginBottom: 3 }}>✓ Contents insurance — active</p>
              <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>Homeprotect (AXA) · Policy C09/1155684 · £74.60/yr · £33,000 cover · Renews 08 Mar 2027</p>
            </div>
          </Card>

          {/* Contacts */}
          <Card>
            <SectionTitle>Contacts</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {p.contacts.map((c, i) => (
                <div key={c.role} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < p.contacts.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{c.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>{c.role}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: COLORS.accent }}>{c.phone}</p>
                    {c.email && <p style={{ fontSize: 11, color: COLORS.muted }}>{c.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bills */}
      <Card>
        <SectionTitle>Bills & utilities</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {p.bills.map((bill) => (
            <div key={bill.name} style={{ background: COLORS.bg, borderRadius: 10, padding: 16, border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{bill.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{bill.name}</p>
                    <p style={{ fontSize: 11, color: COLORS.muted }}>{bill.tariff} · {bill.paymentMethod}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {bill.monthlyEstimate ? (
                    <>
                      <p style={{ fontSize: 18, fontWeight: 600 }}>~£{bill.monthlyEstimate}<span style={{ fontSize: 11, fontWeight: 400, color: COLORS.muted }}>/mo</span></p>
                      <p style={{ fontSize: 11, color: COLORS.muted }}>~£{bill.annualEstimate}/yr est.</p>
                    </>
                  ) : (
                    <Tag color={COLORS.amberLight} text={COLORS.amber}>Add details</Tag>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <Tag color={categoryBg[bill.category] || COLORS.accentLight} text={categoryColors[bill.category] || COLORS.accent}>{bill.category}</Tag>
                {bill.accountRef && !bill.accountRef.startsWith("—") && (
                  <Tag color={COLORS.bg} text={COLORS.muted}>Ref: {bill.accountRef}</Tag>
                )}
              </div>
              {bill.notes && <p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.5, marginBottom: 4 }}>{bill.notes}</p>}
              {bill.contact && !bill.contact.startsWith("—") && (
                <p style={{ fontSize: 11, color: COLORS.accent }}>{bill.contact}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Watch points */}
      <Card>
        <SectionTitle>Watch points</SectionTitle>
        {p.watchPoints.map((w, i) => <ActionItem key={i} {...w} />)}
      </Card>
    </div>
  );
}

function CreditTab({ data }) {
  const [activeTrack, setActiveTrack] = useState("credit_now");
  const cm = data.creditMortgage;
  const track = cm.tracks.find(t => t.id === activeTrack);
  const [done, setDone] = useState({});

  const totalActions = cm.tracks.reduce((s, t) => s + t.actions.length, 0);
  const doneCount = Object.values(done).filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header banner */}
      <div style={{ background: "linear-gradient(135deg, #1a3a8f 0%, #2B5BEE 100%)", borderRadius: 12, padding: 24, color: "#fff" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.7, marginBottom: 6 }}>Credit & Mortgage Roadmap</p>
        <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 16 }}>Three tracks to full credit access</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {cm.tracks.map(t => {
            const trackDone = t.actions.filter(a => done[a.id]).length;
            const pct = Math.round((trackDone / t.actions.length) * 100);
            return (
              <div key={t.id} onClick={() => setActiveTrack(t.id)} style={{
                background: activeTrack === t.id ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                borderRadius: 10, padding: 14, cursor: "pointer", border: `1px solid ${activeTrack === t.id ? "rgba(255,255,255,0.5)" : "transparent"}`,
                transition: "all 0.15s",
              }}>
                <p style={{ fontSize: 18, marginBottom: 4 }}>{t.icon}</p>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.label}</p>
                <p style={{ fontSize: 11, opacity: 0.75, marginBottom: 8 }}>{t.timeframe}</p>
                <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, background: "#fff", height: "100%", borderRadius: 99 }} />
                </div>
                <p style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>{trackDone}/{t.actions.length} done</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credit file status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Sinead — UK credit", value: cm.summary.ukCreditHistory.sinead, flag: "🇬🇧" },
          { label: "Eoin — UK credit", value: cm.summary.ukCreditHistory.eoin, flag: "🇬🇧" },
          { label: "Sinead — US credit", value: cm.summary.usCreditHistory.sinead, flag: "🇺🇸" },
          { label: "Electoral roll", value: cm.summary.electoralRoll.note, flag: "🗳" },
        ].map(s => (
          <Card key={s.label} style={{ padding: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 6 }}>{s.flag} {s.label}</p>
            <p style={{ fontSize: 13, lineHeight: 1.5 }}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Active track actions */}
      {track && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 24 }}>{track.icon}</span>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>{track.label}</p>
              <p style={{ fontSize: 12, color: COLORS.muted }}>{track.timeframe} · {track.status}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {track.actions.map((action, i) => (
              <div key={action.id} onClick={() => setDone(d => ({ ...d, [action.id]: !d[action.id] }))} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: 14, borderRadius: 10, cursor: "pointer",
                background: done[action.id] ? COLORS.greenLight : action.priority === "high" ? "#FAFBFF" : COLORS.bg,
                border: `1px solid ${done[action.id] ? "#b8e8cc" : action.priority === "high" ? "#c8d4fb" : COLORS.border}`,
                transition: "all 0.15s",
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", border: `2px solid ${done[action.id] ? COLORS.green : action.priority === "high" ? COLORS.accent : COLORS.muted}`,
                  background: done[action.id] ? COLORS.green : "transparent",
                  flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {done[action.id] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, lineHeight: 1.5, color: done[action.id] ? COLORS.muted : COLORS.text, textDecoration: done[action.id] ? "line-through" : "none" }}>{action.text}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <Tag color={action.who === "Both" ? COLORS.accentLight : action.who === "Sinead" ? "#fce8f3" : "#e8f0ff"} text={action.who === "Both" ? COLORS.accent : action.who === "Sinead" ? "#c0186a" : "#1a3a8f"}>{action.who}</Tag>
                    {action.priority === "high" && <Tag color={COLORS.accentLight} text={COLORS.accent}>High priority</Tag>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress summary */}
      <Card style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 600 }}>Overall progress</p>
          <p style={{ fontSize: 13, color: COLORS.muted }}>{doneCount} of {totalActions} actions complete</p>
        </div>
        <div style={{ background: COLORS.border, borderRadius: 99, height: 8, overflow: "hidden", marginTop: 10 }}>
          <div style={{ width: `${Math.round((doneCount / totalActions) * 100)}%`, background: COLORS.accent, height: "100%", borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>
      </Card>
    </div>
  );
}

function SubscriptionsTab({ data, masked }) {
  const subs = data;
  const [filterWho, setFilterWho] = useState("All");

  const fmtCurrency = (amount, currency) => {
    if (!amount) return "—";
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
    return `${sym}${amount}`;
  };

  const filtered = filterWho === "All" ? subs : subs.filter(s => s.who === filterWho || s.who === "Both");

  // Calculate totals (monthly equivalent in GBP approx)
  const gbpRate = { USD: 0.79, EUR: 0.85, GBP: 1 };
  const knownMonthly = subs.filter(s => s.billedMonthly).reduce((sum, s) => sum + (s.billedMonthly * (gbpRate[s.currency] || 1)), 0);

  const categories = [...new Set(subs.map(s => s.category))];
  const categoryColors = {
    "News & Reading": COLORS.accent,
    "Writing Tools": COLORS.green,
    "Productivity": "#8B5CF6",
    "Social": "#EC4899",
    "Phone": COLORS.amber,
    "Entertainment": "#EF4444",
    "Domains": "#0891B2",
    "Fitness": "#10B981",
    "AI Tools": "#7C3AED",
    "Mail": "#6B7280",
  };
  const categoryBg = {
    "News & Reading": COLORS.accentLight,
    "Writing Tools": COLORS.greenLight,
    "Productivity": "#F3F0FF",
    "Social": "#FDF2F8",
    "Phone": COLORS.amberLight,
    "Entertainment": COLORS.redLight,
    "Domains": "#E0F2FE",
    "Fitness": "#D1FAE5",
    "AI Tools": "#EDE9FE",
    "Mail": "#F3F4F6",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        <Card>
          <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Known monthly cost</p>
          <p style={{ fontSize: 28, fontWeight: 600, color: COLORS.accent }}>~£{Math.round(knownMonthly)}</p>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Monthly equivalent (GBP approx)</p>
        </Card>
        <Card>
          <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Known annual cost</p>
          <p style={{ fontSize: 28, fontWeight: 600 }}>~£{Math.round(knownMonthly * 12)}</p>
          <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>Across all accounts</p>
        </Card>

      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8 }}>
        {["All", "Sinead", "Eoin", "Both"].map(f => (
          <button key={f} onClick={() => setFilterWho(f)} style={{
            padding: "6px 14px", borderRadius: 8, border: `1px solid ${filterWho === f ? COLORS.accent : COLORS.border}`,
            background: filterWho === f ? COLORS.accentLight : COLORS.surface,
            color: filterWho === f ? COLORS.accent : COLORS.muted,
            fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{f}</button>
        ))}
      </div>

      {/* Subscriptions by category */}
      {categories.map(cat => {
        const catSubs = filtered.filter(s => s.category === cat);
        if (!catSubs.length) return null;
        return (
          <Card key={cat}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: categoryColors[cat] || COLORS.accent }} />
              <SectionTitle style={{ margin: 0 }}>{cat}</SectionTitle>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {catSubs.map((s, i) => (
                <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: i < catSubs.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</span>
                      <Tag color={categoryBg[cat] || COLORS.accentLight} text={categoryColors[cat] || COLORS.accent}>{s.category}</Tag>
                      {s.who !== "Both" && <Tag color={COLORS.bg} text={COLORS.muted}>{s.who}</Tag>}
                      {s.who === "Both" && <Tag color={COLORS.bg} text={COLORS.muted}>Both</Tag>}
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{s.account} · {s.frequency}</span>
                      {s.note && <span style={{ fontSize: 11, color: COLORS.amber }}>ℹ {s.note}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{fmtCurrency(s.billedMonthly, s.currency)}<span style={{ fontSize: 11, color: COLORS.muted, fontWeight: 400 }}>/mo</span></p>
                    {s.frequency === "annual" && s.amount && (
                      <p style={{ fontSize: 11, color: COLORS.muted }}>{fmtCurrency(s.amount, s.currency)}/yr</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}


    </div>
  );
}


//  TRAVEL TAB 
function TravelTab({ data }) {
  const [subTab, setSubTab] = useState("trips");
  const today = new Date("2026-03-08");
  const daysUntilDate = (d) => Math.ceil((new Date(d) - today) / 86400000);

  const typeConfig = {
    dinner:      { label: "Dinner / Night out", emoji: "🍽", color: COLORS.accent,  bg: COLORS.accentLight },
    concert:     { label: "Concert / Show",     emoji: "🎭", color: "#7c3aed",      bg: "#ede9fe" },
    birthday:    { label: "Birthday",           emoji: "🎂", color: COLORS.amber,   bg: COLORS.amberLight },
    anniversary: { label: "Anniversary",        emoji: "💕", color: COLORS.red,     bg: COLORS.redLight },
    wedding:     { label: "Wedding",            emoji: "💒", color: COLORS.green,   bg: COLORS.greenLight },
    family:      { label: "Family visit",       emoji: "👨‍👩‍👧", color: COLORS.green, bg: COLORS.greenLight },
    other:       { label: "Other",              emoji: "📅", color: COLORS.muted,   bg: COLORS.bg },
  };

  const subTabs = [
    { id: "trips",     label: "✈️ Trips" },
    { id: "social",    label: "🎉 Social" },
    { id: "documents", label: "🛂 Documents" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Sub-tab nav */}
      <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${COLORS.border}` }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setSubTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 16px", fontSize: 13, fontWeight: subTab === t.id ? 600 : 400,
            color: subTab === t.id ? COLORS.accent : COLORS.muted,
            borderBottom: `2px solid ${subTab === t.id ? COLORS.accent : "transparent"}`,
            fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>

      {/*  TRIPS  */}
      {subTab === "trips" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {data.trips.map(trip => {
              const days = daysUntilDate(trip.departure);
              const isActive = days <= 0 && daysUntilDate(trip.return) >= 0;
              const isPast = daysUntilDate(trip.return) < 0;
              return (
                <Card key={trip.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 28 }}>{trip.flag}</span>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700 }}>{trip.destination}</p>
                        <p style={{ fontSize: 11, color: COLORS.muted }}>{trip.who}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {isActive ? <Tag color={COLORS.greenLight} text={COLORS.green}>✈ In progress</Tag>
                        : isPast ? <Tag color={COLORS.bg} text={COLORS.muted}>Past</Tag>
                        : <Tag color={days < 14 ? COLORS.amberLight : COLORS.accentLight} text={days < 14 ? COLORS.amber : COLORS.accent}>{days}d away</Tag>}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 12 }}>
                    {[
                      { label: "Depart", value: new Date(trip.departure).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) },
                      { label: "Return", value: new Date(trip.return).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) },
                      { label: "Duration", value: trip.nights + " nights" },
                      { label: "Purpose", value: trip.purpose.charAt(0).toUpperCase() + trip.purpose.slice(1) },
                    ].map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                        <span style={{ fontSize: 12, color: COLORS.muted }}>{r.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 500 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.6, background: COLORS.bg, borderRadius: 8, padding: "8px 10px" }}>{trip.notes}</p>
                  {data.countryTips[trip.flag] && (
                    <div style={{ marginTop: 10 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Country tips</p>
                      {data.countryTips[trip.flag].map((tip, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderTop: `1px solid ${COLORS.border}` }}>
                          <span style={{ color: COLORS.accent, fontSize: 12, flexShrink: 0 }}>→</span>
                          <p style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          <Card>
            <div style={{ background: COLORS.accentLight, borderRadius: 10, padding: 16, border: "1px solid #c8d4fb" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, marginBottom: 6 }}>✈️ Travel insurance — Post Office Annual Multi-Trip</p>
              <p style={{ fontSize: 12, color: COLORS.text, lineHeight: 1.6 }}>
                Covers both of you for annual multi-trip travel. For each trip confirm the destination is covered and business travel is included (Abu Dhabi especially). Emergency line: <strong>+44 (0)20 8865 3074</strong>. For UAE, GHIC does not apply — Post Office cover is your only medical protection.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/*  SOCIAL  */}
      {subTab === "social" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Upcoming events */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            {[...data.social].sort((a, b) => new Date(a.date) - new Date(b.date)).map((ev, i, arr) => {
              const days = daysUntilDate(ev.date);
              const isPast = days < 0;
              const tc = typeConfig[ev.type] || typeConfig.other;
              return (
                <div key={ev.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 20px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  opacity: isPast ? 0.5 : 1,
                }}>
                  {/* Emoji + date */}
                  <div style={{ flexShrink: 0, textAlign: "center", width: 48 }}>
                    <p style={{ fontSize: 24 }}>{ev.emoji}</p>
                    <p style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.1, color: isPast ? COLORS.muted : COLORS.text }}>
                      {new Date(ev.date).getDate()}
                    </p>
                    <p style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase" }}>
                      {new Date(ev.date).toLocaleDateString("en-GB", { month: "short" })}
                    </p>
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{ev.label}</p>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                        <Tag color={tc.bg} text={tc.color}>{tc.label}</Tag>
                        {!isPast && <Tag color={days <= 7 ? COLORS.amberLight : COLORS.bg} text={days <= 7 ? COLORS.amber : COLORS.muted}>{days}d</Tag>}
                        {isPast && <Tag color={COLORS.bg} text={COLORS.muted}>Past</Tag>}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: ev.notes ? 6 : 0 }}>
                      {ev.venue && <p style={{ fontSize: 12, color: COLORS.muted }}>📍 {ev.venue}</p>}
                      {ev.who && <p style={{ fontSize: 12, color: COLORS.muted }}>👥 {ev.who.join(", ")}</p>}
                    </div>
                    {ev.notes && <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>{ev.notes}</p>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add event placeholder */}
          <div style={{ border: `2px dashed ${COLORS.border}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 4 }}>+ Add birthdays, anniversaries, weddings, concerts...</p>
            <p style={{ fontSize: 11, color: COLORS.muted }}>Tell Claude to add events to the social list</p>
          </div>
        </div>
      )}

      {/*  DOCUMENTS  */}
      {subTab === "documents" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { name: "Sinead", docs: data.documents.sinead, flag: "👩" },
            { name: "Eoin", docs: data.documents.eoin, flag: "👨" },
          ].map(person => (
            <Card key={person.name}>
              <SectionTitle>{person.flag} {person.name} — travel documents</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {person.docs.map(doc => {
                  const daysLeft = daysUntilDate(doc.expiry);
                  const yearsLeft = (daysLeft / 365).toFixed(1);
                  const urgent = daysLeft < 365;
                  const warning = daysLeft < 730;
                  return (
                    <div key={doc.type} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 18 }}>{doc.flag}</span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 500 }}>{doc.type}</p>
                          <p style={{ fontSize: 11, color: COLORS.muted }}>{doc.note}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Tag color={urgent ? COLORS.redLight : warning ? COLORS.amberLight : COLORS.greenLight}
                             text={urgent ? COLORS.red : warning ? COLORS.amber : COLORS.green}>
                          {urgent ? "Renew soon" : yearsLeft + "y left"}
                        </Tag>
                        <p style={{ fontSize: 10, color: COLORS.muted, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>
                          {new Date(doc.expiry).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

//  CALENDAR TAB 
function CalendarTab({ data }) {
  const [filterCat, setFilterCat] = useState("all");
  const today = new Date("2026-03-08");

  const catConfig = {
    all:          { label: "All", color: COLORS.text,   bg: COLORS.bg },
    tax:          { label: "💰 Tax",         color: COLORS.red,    bg: COLORS.redLight },
    travel:       { label: "✈️ Travel",      color: COLORS.accent, bg: COLORS.accentLight },
    insurance:    { label: "🛡 Insurance",   color: COLORS.amber,  bg: COLORS.amberLight },
    property:     { label: "🏠 Property",    color: COLORS.green,  bg: COLORS.greenLight },
    visa:         { label: "🛂 Visa/Docs",   color: "#7c3aed",     bg: "#ede9fe" },
    subscription: { label: "💻 Subscriptions", color: COLORS.muted, bg: COLORS.bg },
    admin:        { label: "📋 Admin",       color: COLORS.muted,  bg: COLORS.bg },
  };

  const fixedEvents = data.events.filter(e => !e.date.startsWith("recurring"));
  const sorted = [...fixedEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filtered = filterCat === "all" ? sorted : sorted.filter(e => e.category === filterCat);

  // Group by month
  const grouped = filtered.reduce((acc, ev) => {
    const d = new Date(ev.date);
    const key = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!acc[key]) acc[key] = [];
    acc[key].push(ev);
    return acc;
  }, {});

  const daysUntil = (dateStr) => Math.ceil((new Date(dateStr) - today) / 86400000);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Urgent strip */}
      <div style={{ background: COLORS.redLight, borderRadius: 12, padding: 16, border: "1px solid #f5c5c5" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: COLORS.red, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.07em" }}>🚨 Urgent — next 30 days</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {sorted.filter(e => {
            const d = daysUntil(e.date);
            return d >= 0 && d <= 30 && e.priority === "high";
          }).map((e, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.7)", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600 }}>{e.label}</p>
                <p style={{ fontSize: 11, color: COLORS.muted }}>{e.who} · {new Date(e.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                {e.note && <p style={{ fontSize: 11, color: COLORS.text, marginTop: 3, lineHeight: 1.4 }}>{e.note}</p>}
              </div>
              <Tag color={COLORS.redLight} text={COLORS.red} style={{ flexShrink: 0 }}>{daysUntil(e.date)}d</Tag>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Object.entries(catConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilterCat(key)} style={{
            padding: "5px 12px", borderRadius: 20, border: `1px solid ${filterCat === key ? cfg.color : COLORS.border}`,
            background: filterCat === key ? cfg.bg : "transparent",
            color: filterCat === key ? cfg.color : COLORS.muted,
            fontSize: 12, fontWeight: filterCat === key ? 600 : 400, cursor: "pointer", fontFamily: "inherit",
          }}>{cfg.label}</button>
        ))}
      </div>

      {/* Month-grouped events */}
      {Object.entries(grouped).map(([month, events]) => (
        <div key={month}>
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{month}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, background: COLORS.card, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
            {events.map((ev, i) => {
              const d = daysUntil(ev.date);
              const isPast = d < 0;
              const cat = catConfig[ev.category] || catConfig.admin;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 16px",
                  borderBottom: i < events.length - 1 ? `1px solid ${COLORS.border}` : "none",
                  background: isPast ? "transparent" : "transparent",
                  opacity: isPast ? 0.5 : 1,
                }}>
                  {/* Date pill */}
                  <div style={{ flexShrink: 0, width: 44, textAlign: "center", paddingTop: 2 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1, color: isPast ? COLORS.muted : COLORS.text }}>
                      {new Date(ev.date).getDate()}
                    </p>
                    <p style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase" }}>
                      {new Date(ev.date).toLocaleDateString("en-GB", { month: "short" })}
                    </p>
                  </div>
                  {/* Category dot */}
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, flexShrink: 0, marginTop: 6 }} />
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{ev.label}</p>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0, marginLeft: 12 }}>
                        <Tag>{ev.who}</Tag>
                        {!isPast && d <= 30 && <Tag color={d <= 7 ? COLORS.redLight : COLORS.amberLight} text={d <= 7 ? COLORS.red : COLORS.amber}>{d}d</Tag>}
                        {isPast && <Tag color={COLORS.bg} text={COLORS.muted}>Done</Tag>}
                      </div>
                    </div>
                    {ev.note && <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 3, lineHeight: 1.5 }}>{ev.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Recurring note */}
      <Card>
        <SectionTitle>📅 Monthly recurring</SectionTitle>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Rent — £6,500</p>
            <p style={{ fontSize: 11, color: COLORS.muted }}>9th of every month · DN Lettings / Andrew & Margo Jones</p>
          </div>
          <Tag color={COLORS.greenLight} text={COLORS.green}>Monthly</Tag>
        </div>
      </Card>
    </div>
  );
}

function FamilyDashboard() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [pinOk, setPinOk] = useState(() => sessionStorage.getItem("fam_pin_ok") === "true");
  const [active, setActive] = useState("Overview");
  const [data] = useState(initialData);
  const [masked, setMasked] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      if (u && ALLOWED_EMAILS.includes(u.email)) {
        setUser(u);
      } else {
        setUser(null);
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (!authReady) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FB", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #EEF2FF", borderTopColor: "#2B5BEE", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#9CA3AF", fontSize: 14 }}>Loading…</p>
      </div>
    </div>
  );

  if (!user) return <GoogleLoginScreen onAuth={setUser} />;
  if (!pinOk) return <PinScreen onUnlock={() => setPinOk(true)} />;

  const totalPension = data.pension.eoin.totalKnown;
  const spentThisMonth = data.spend.sinead.categories.reduce((s, c) => s + c.amount, 0);
  const savingsPct = pct(data.savings.current, data.savings.target);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 14 }}>⌂</span>
            </div>
            <span style={{ fontWeight: 600, fontSize: 15 }}>{data.family.name1} & {data.family.name2}</span>
            <span style={{ color: COLORS.muted, fontSize: 13 }}>Family Dashboard</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: COLORS.muted, fontFamily: "'DM Mono', monospace" }}>
              {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <button onClick={() => setMasked(m => !m)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 8, border: `1px solid ${COLORS.border}`, background: masked ? COLORS.amberLight : COLORS.greenLight,
              cursor: "pointer", fontSize: 12, fontWeight: 500,
              color: masked ? COLORS.amber : COLORS.green, fontFamily: "inherit",
            }}>
              {masked ? "👁 Show sensitive" : "🙈 Hide sensitive"}
            </button>
            {user?.photoURL && <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: `2px solid ${COLORS.border}` }} />}
            <button onClick={handleSignOut} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
              borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.surface,
              cursor: "pointer", fontSize: 12, fontWeight: 500, color: COLORS.muted, fontFamily: "inherit",
            }}>
              Sign out
            </button>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActive(t)} style={{
              background: "none", border: "none", cursor: "pointer", padding: "12px 14px",
              fontSize: 13, fontWeight: active === t ? 600 : 400,
              color: active === t ? COLORS.accent : COLORS.muted,
              borderBottom: `2px solid ${active === t ? COLORS.accent : "transparent"}`,
              transition: "all 0.15s", fontFamily: "inherit",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 32px" }}>

        {/* OVERVIEW */}
        {active === "Overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
              {[
                { label: "Sinead N26 (Feb)", value: `€${spentThisMonth}`, sub: masked ? "BoA balance $●●,●●●" : "BoA balance $95,377", color: COLORS.text },
                { label: "Total savings", value: fmt(data.savings.current), sub: `${savingsPct}% of goal`, color: COLORS.accent },
                { label: "Eoin's pension (est.)", value: fmt(totalPension), sub: "3 pots — unverified", color: COLORS.amber },
                { label: "Student loan — Sinead", value: "£30,000", sub: "income-contingent repayment", color: COLORS.red },
              ].map(stat => (
                <Card key={stat.label}>
                  <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 8 }}>{stat.label}</p>
                  <p style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: stat.color, marginBottom: 4 }}>{stat.value}</p>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>{stat.sub}</p>
                </Card>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle>BoA balance — recent months (USD)</SectionTitle>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data.spend.sinead.bofaHistory}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="balance" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.accent }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle>Savings trajectory</SectionTitle>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={data.savings.history}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="value" stroke={COLORS.accent} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
              {/* Upcoming */}
              <Card>
                <SectionTitle>Upcoming deadlines</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { label: "Green card renewal – both", date: "Feb 2026", days: 330, color: COLORS.amber },
                    { label: "UK Self Assessment", date: "31 Jan 2026", days: 329, color: COLORS.amber },
                    { label: "Bupa renewal", date: "Sep 2025", days: 176, color: COLORS.green },
                    { label: "US tax return", date: "Jun 2026", days: 465, color: COLORS.muted },
                  ].map(d => (
                    <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</p>
                        <p style={{ fontSize: 11, color: COLORS.muted }}>{d.date}</p>
                      </div>
                      <Tag color={d.days < 200 ? COLORS.amberLight : COLORS.accentLight} text={d.days < 200 ? COLORS.amber : COLORS.accent}>
                        {d.days}d
                      </Tag>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Visa summary */}
              <Card>
                <SectionTitle>Immigration status</SectionTitle>
                {data.immigration.map(p => (
                  <div key={p.person} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{p.flag} {p.person}</span>
                      <span style={{ fontSize: 11, color: COLORS.muted }}>{p.nationality}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: COLORS.muted }}>🇬🇧 UK Status</span>
                        <Tag color={COLORS.greenLight} text={COLORS.green}>✓ No visa</Tag>
                      </div>
                      {p.documents.map(doc => (
                        <div key={doc.type} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: COLORS.muted }}>{doc.country} {doc.type}</span>
                          <Tag color={daysUntil(doc.expiry) < 365 ? COLORS.amberLight : COLORS.greenLight}
                               text={daysUntil(doc.expiry) < 365 ? COLORS.amber : COLORS.green}>
                            {daysUntil(doc.expiry)}d
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>

              {/* Tax status */}
              <Card>
                <SectionTitle>Tax obligations</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.tax.obligations.map(t => (
                    <div key={t.obligation} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 500 }}>{t.jurisdiction} {t.obligation}</p>
                        <p style={{ fontSize: 11, color: COLORS.muted }}>{t.due}</p>
                      </div>
                      <Tag
                        color={t.status === "filed" ? COLORS.greenLight : t.status === "active" ? COLORS.accentLight : COLORS.amberLight}
                        text={t.status === "filed" ? COLORS.green : t.status === "active" ? COLORS.accent : COLORS.amber}
                      >
                        {t.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* SPENDING */}
        {active === "Spending" && (
          <SpendingTab data={data.spend} masked={masked} />
        )}

        {/* SAVINGS */}
        {active === "Savings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <Card>
                <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Total saved</p>
                <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{fmt(data.savings.current)}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Goal: {fmt(data.savings.target)}</p>
                <div style={{ marginTop: 12 }}>
                  <ProgressBar value={data.savings.current} max={data.savings.target} />
                </div>
              </Card>
              <Card>
                <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Monthly contribution</p>
                <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{fmt(data.savings.monthly)}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Est. goal reached ~2030</p>
              </Card>
              <Card>
                <p style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6 }}>Progress</p>
                <p style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em" }}>{savingsPct}%</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{fmt(data.savings.target - data.savings.current)} remaining</p>
              </Card>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Card>
                <SectionTitle>Savings accounts</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {data.savings.accounts.map(a => (
                    <div key={a.name}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</span>
                          <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 6 }}>{a.type}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{fmt(a.balance)}</span>
                          <span style={{ fontSize: 11, color: COLORS.muted }}> / {fmt(a.target)}</span>
                        </div>
                      </div>
                      <ProgressBar value={a.balance} max={a.target} color={a.balance >= a.target ? COLORS.green : COLORS.accent} />
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionTitle>Growth trajectory</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.savings.history}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: COLORS.muted }} axisLine={false} tickLine={false} tickFormatter={v => `£${v/1000}k`} />
                    <Tooltip formatter={(v) => fmt(v)} contentStyle={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="value" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.accent }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Debts */}
            <Card>
              <SectionTitle>Debts & liabilities</SectionTitle>
              {data.savings.debts.map(d => (
                <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                      <Tag color={COLORS.redLight} text={COLORS.red}>{d.type}</Tag>
                      <Tag>{d.owner}</Tag>
                    </div>
                    <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6, maxWidth: 480 }}>{d.note}</p>
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 700, color: COLORS.red, marginLeft: 20, whiteSpace: "nowrap" }}>£{d.balance.toLocaleString()}</p>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: "12px 14px", background: COLORS.bg, borderRadius: 8 }}>
                <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>
                  💡 <strong>UK student loans are different from commercial debt.</strong> Repayments are automatically deducted as 9% of income above ~£27,295/yr via PAYE or self assessment. The balance doesn't affect your credit score and is written off after 30 years regardless of balance. Overpaying is rarely financially optimal.
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* PENSION */}
        {active === "Pension" && (
          <PensionTab data={data.pension} />
        )}

        {/* HEALTHCARE */}
        {active === "Healthcare" && (
          <HealthcareTab data={data.healthcare} masked={masked} />
        )}

        {/* IMMIGRATION */}
        {active === "Immigration" && (
          <ImmigrationTab data={data} masked={masked} />
        )}


        {/* TAX */}
        {active === "Tax" && (
          <TaxTab data={data.tax} masked={masked} />
        )}

        {active === "Property" && (
          <PropertyTab data={data.property} />
        )}

        {active === "Subscriptions" && (
          <SubscriptionsTab data={data.subscriptions} masked={masked} />
        )}

        {/* TRAVEL */}
        {active === "Travel" && (
          <TravelTab data={data.travel} />
        )}

        {/* CREDIT & MORTGAGE */}
        {active === "Credit" && (
          <CreditTab data={data} />
        )}

        {/* CALENDAR */}
        {active === "Calendar" && (
          <CalendarTab data={data.calendar} />
        )}

      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(FamilyDashboard));
  </script>
</body>
</html>
