import React, { useState, useEffect, useCallback } from "react";

/* =========================================================================
   Trident Elanzza — Vehicle Registry (prototype)
   Society total: 272 flats / 4 towers (A–D) / 14 floors
   Rule per flat: 1 car + 2 two-wheelers
   Storage: window.storage (shared registry, prototype only — see ai_handoff.md)
   ========================================================================= */

const SOCIETY_NAME = "Trident Elanzza";
const TOTAL_FLATS = 272;
const TOWERS = ["A", "B", "C", "D"];
const MAX_CARS = 1;
const MAX_TWO = 2;

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Oswald:wght@600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#14202E; --ink-soft:#2A3B4D; --paper:#EBEEF2; --card:#FFFFFF;
  --teal:#15605A; --teal-deep:#0E423D; --marigold:#E6A93C;
  --green:#2E8B6A; --rust:#B14A2C; --line:#D7DDE4; --muted:#6A7785;
}
.app{font-family:'Inter',system-ui,sans-serif;background:var(--paper);
  min-height:100vh;color:var(--ink);max-width:540px;margin:0 auto;
  -webkit-font-smoothing:antialiased;}

/* Header */
.hdr{background:var(--ink);color:#fff;padding:18px 18px 16px;
  border-bottom:3px solid var(--marigold);position:sticky;top:0;z-index:20;}
.hdr-eyebrow{font-size:11px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--marigold);font-weight:600;}
.hdr-title{font-family:'Space Grotesk',sans-serif;font-weight:700;
  font-size:23px;line-height:1.1;margin-top:2px;}
.hdr-sub{font-size:12.5px;color:#9FB0C0;margin-top:3px;}
.stats{display:flex;gap:8px;margin-top:14px;}
.stat{flex:1;background:var(--ink-soft);border:1px solid #33455A;
  border-radius:11px;padding:9px 11px;}
.stat-n{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:18px;}
.stat-l{font-size:10.5px;color:#9FB0C0;letter-spacing:.04em;text-transform:uppercase;margin-top:1px;}

/* Tabs */
.tabs{display:flex;background:var(--card);border-bottom:1px solid var(--line);
  position:sticky;top:0;z-index:10;}
.tab{flex:1;padding:13px 8px;border:none;background:none;font-family:'Inter';
  font-size:14px;font-weight:600;color:var(--muted);cursor:pointer;
  border-bottom:2.5px solid transparent;}
.tab.on{color:var(--teal);border-bottom-color:var(--teal);}

.wrap{padding:18px 16px 60px;}
.section-eyebrow{font-size:11px;letter-spacing:.15em;text-transform:uppercase;
  color:var(--muted);font-weight:600;margin-bottom:10px;}

/* Tower picker */
.towers{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.tower{padding:14px 0;border-radius:12px;border:1.5px solid var(--line);
  background:var(--card);font-family:'Space Grotesk';font-weight:700;
  font-size:20px;cursor:pointer;color:var(--ink);transition:.12s;}
.tower.on{background:var(--teal);color:#fff;border-color:var(--teal);}
.tower span{display:block;font-family:'Inter';font-size:9.5px;font-weight:500;
  letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin-top:2px;}

.field-row{display:flex;gap:8px;margin-top:12px;}
.input{width:100%;padding:13px 13px;border:1.5px solid var(--line);
  border-radius:11px;font-family:'Inter';font-size:15px;background:var(--card);
  color:var(--ink);}
.input:focus{outline:none;border-color:var(--teal);}
.label{font-size:12px;font-weight:600;color:var(--ink-soft);
  margin-bottom:5px;display:block;}

.btn{padding:13px 16px;border-radius:11px;border:none;font-family:'Inter';
  font-size:14.5px;font-weight:600;cursor:pointer;transition:.12s;}
.btn-primary{background:var(--teal);color:#fff;}
.btn-primary:active{background:var(--teal-deep);}
.btn-ghost{background:var(--card);color:var(--ink);border:1.5px solid var(--line);}
.btn-block{width:100%;}
.btn:disabled{opacity:.45;cursor:not-allowed;}

/* Flat card */
.flat-card{background:var(--card);border:1px solid var(--line);
  border-radius:16px;padding:16px;margin-top:18px;}
.flat-head{display:flex;justify-content:space-between;align-items:flex-start;}
.flat-id{font-family:'Space Grotesk';font-weight:700;font-size:21px;}
.flat-sub{font-size:12px;color:var(--muted);margin-top:1px;}
.flat-change{font-size:12.5px;color:var(--teal);font-weight:600;
  background:none;border:none;cursor:pointer;padding:4px;}

.slot-group{margin-top:16px;}
.slot-title{font-size:12px;font-weight:600;color:var(--ink-soft);
  display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.slot-quota{font-size:11px;font-weight:500;color:var(--muted);}
.quota-full{color:var(--rust);}
.quota-open{color:var(--green);}

.add-slot{width:100%;padding:14px;border:1.5px dashed var(--line);
  border-radius:12px;background:#FAFBFC;color:var(--teal);font-weight:600;
  font-size:14px;cursor:pointer;display:flex;align-items:center;
  justify-content:center;gap:7px;}
.add-slot:active{background:#F2F5F8;}

/* Vehicle card */
.veh{display:flex;gap:12px;padding:12px;border:1px solid var(--line);
  border-radius:13px;background:#FCFDFE;margin-bottom:8px;}
.veh-photo{width:78px;height:78px;border-radius:10px;object-fit:cover;
  background:#E3E8ED;flex-shrink:0;}
.veh-photo.empty{display:flex;align-items:center;justify-content:center;
  color:var(--muted);font-size:10px;text-align:center;padding:4px;}
.veh-body{flex:1;min-width:0;}
.veh-name{font-weight:600;font-size:14.5px;}
.veh-color{font-size:12px;color:var(--muted);margin-bottom:7px;}
.veh-actions{display:flex;gap:14px;margin-top:8px;}
.veh-act{font-size:12.5px;font-weight:600;background:none;border:none;
  cursor:pointer;padding:0;}
.veh-act.edit{color:var(--teal);}
.veh-act.del{color:var(--rust);}

/* Number plate (signature element) */
.plate{display:inline-flex;align-items:stretch;border:2px solid #111;
  border-radius:5px;overflow:hidden;background:#fff;height:30px;
  box-shadow:0 1px 0 rgba(0,0,0,.15);}
.plate-ind{background:#1B4ED8;color:#fff;display:flex;flex-direction:column;
  align-items:center;justify-content:center;padding:0 4px;min-width:20px;}
.plate-ind b{font-family:'Oswald';font-size:9px;line-height:1;letter-spacing:.04em;}
.plate-ind i{width:10px;height:6px;border-radius:1px;font-style:normal;
  background:linear-gradient(#FF9933 33%,#fff 33% 66%,#138808 66%);margin-top:1px;}
.plate-num{font-family:'Oswald';font-weight:700;color:#111;font-size:17px;
  letter-spacing:.06em;padding:0 9px;display:flex;align-items:center;
  white-space:nowrap;}

/* Form */
.form{background:var(--card);border:1px solid var(--line);border-radius:14px;
  padding:16px;margin-top:10px;}
.form-title{font-family:'Space Grotesk';font-weight:700;font-size:16px;margin-bottom:14px;}
.form-field{margin-bottom:13px;}
.photo-pick{display:block;border:1.5px dashed var(--line);border-radius:12px;
  padding:16px;text-align:center;cursor:pointer;background:#FAFBFC;}
.photo-pick.has{padding:8px;}
.photo-preview{width:100%;max-height:200px;object-fit:cover;border-radius:9px;}
.photo-hint{font-size:13px;color:var(--teal);font-weight:600;}
.photo-sub{font-size:11px;color:var(--muted);margin-top:3px;}
.form-actions{display:flex;gap:8px;margin-top:6px;}
.err{font-size:12px;color:var(--rust);margin-top:4px;}

/* Search / gate */
.search-results{margin-top:16px;}
.empty{text-align:center;padding:40px 20px;color:var(--muted);}
.empty-big{font-family:'Space Grotesk';font-weight:700;font-size:17px;
  color:var(--ink-soft);margin-bottom:6px;}
.res-flat{font-size:12px;color:var(--muted);margin-top:6px;}
.badge{display:inline-block;font-size:10.5px;font-weight:600;padding:2px 8px;
  border-radius:20px;background:#E9F2F0;color:var(--teal);
  text-transform:uppercase;letter-spacing:.05em;}

.foot{font-size:11px;color:var(--muted);text-align:center;
  padding:18px 24px 0;line-height:1.5;}
.spinner{text-align:center;padding:50px;color:var(--muted);font-size:14px;}
`;

/* ---------- storage helpers (shared registry) ---------- */
const IDX_KEY = "registry-index";
async function loadIndex() {
  try {
    const r = await window.storage.get(IDX_KEY, true);
    return r && r.value ? JSON.parse(r.value) : [];
  } catch (e) { return []; }
}
async function saveIndex(arr) {
  try { await window.storage.set(IDX_KEY, JSON.stringify(arr), true); }
  catch (e) { console.error("saveIndex", e); }
}
async function savePhoto(id, dataUrl) {
  try { await window.storage.set("vphoto:" + id, dataUrl, true); }
  catch (e) { console.error("savePhoto", e); }
}
async function loadPhoto(id) {
  try { const r = await window.storage.get("vphoto:" + id, true); return r ? r.value : null; }
  catch (e) { return null; }
}
async function deletePhoto(id) {
  try { await window.storage.delete("vphoto:" + id, true); } catch (e) {}
}

/* ---------- image compression ---------- */
function compressImage(file, maxDim = 900, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = (height * maxDim) / width; width = maxDim; }
        else if (height > maxDim) { width = (width * maxDim) / height; height = maxDim; }
        const c = document.createElement("canvas");
        c.width = width; c.height = height;
        c.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---------- small components ---------- */
function Plate({ value }) {
  return (
    <div className="plate">
      <div className="plate-ind"><b>IND</b><i /></div>
      <div className="plate-num">{(value || "—").toUpperCase()}</div>
    </div>
  );
}

function PhotoThumb({ id, hasPhoto, className }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let on = true;
    if (hasPhoto) loadPhoto(id).then((d) => { if (on) setSrc(d); });
    return () => { on = false; };
  }, [id, hasPhoto]);
  if (src) return <img src={src} className={className} alt="vehicle" />;
  return <div className={className + " empty"}>{hasPhoto ? "…" : "No photo"}</div>;
}

/* ---------- vehicle form ---------- */
function VehicleForm({ type, initial, onSave, onCancel }) {
  const [make, setMake] = useState(initial?.make || "");
  const [color, setColor] = useState(initial?.color || "");
  const [plate, setPlate] = useState(initial?.plate || "GJ ");
  const [dataUrl, setDataUrl] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const label = type === "car" ? "Car" : "Two-wheeler";

  async function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try { setDataUrl(await compressImage(f)); } catch { setErr("Could not read that image."); }
    setBusy(false);
  }

  function submit() {
    if (!make.trim()) return setErr("Add the make & model.");
    if (plate.replace(/\s/g, "").length < 6) return setErr("Enter the full number plate.");
    onSave({ make: make.trim(), color: color.trim(), plate: plate.toUpperCase().trim(), dataUrl });
  }

  return (
    <div className="form">
      <div className="form-title">{initial ? "Edit" : "Add"} {label.toLowerCase()}</div>

      <div className="form-field">
        <label className="label">Make & model</label>
        <input className="input" value={make} onChange={(e) => setMake(e.target.value)}
          placeholder={type === "car" ? "e.g. Maruti Swift" : "e.g. Honda Activa"} />
      </div>

      <div className="form-field">
        <label className="label">Colour</label>
        <input className="input" value={color} onChange={(e) => setColor(e.target.value)}
          placeholder="e.g. White" />
      </div>

      <div className="form-field">
        <label className="label">Number plate</label>
        <input className="input" value={plate}
          onChange={(e) => setPlate(e.target.value.toUpperCase())}
          placeholder="GJ 01 AB 1234" style={{ fontFamily: "'Oswald',sans-serif", letterSpacing: ".05em" }} />
        <div style={{ marginTop: 10 }}><Plate value={plate} /></div>
      </div>

      <div className="form-field">
        <label className="label">Photo</label>
        <label className={"photo-pick" + (dataUrl ? " has" : "")}>
          {dataUrl
            ? <img src={dataUrl} className="photo-preview" alt="preview" />
            : <><div className="photo-hint">{busy ? "Processing…" : "Take or choose a photo"}</div>
                <div className="photo-sub">Show the vehicle with its number plate</div></>}
          <input type="file" accept="image/*" capture="environment"
            onChange={pick} style={{ display: "none" }} />
        </label>
        {dataUrl && <div className="photo-sub" style={{ marginTop: 6 }}>Tap the image to replace it.</div>}
      </div>

      {err && <div className="err">{err}</div>}
      <div className="form-actions">
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-block" onClick={submit} disabled={busy}>
          {initial ? "Save changes" : "Add to flat"}
        </button>
      </div>
    </div>
  );
}

/* ---------- vehicle card ---------- */
function VehicleCard({ v, onEdit, onDelete }) {
  return (
    <div className="veh">
      <PhotoThumb id={v.id} hasPhoto={v.hasPhoto} className="veh-photo" />
      <div className="veh-body">
        <div className="veh-name">{v.make}</div>
        <div className="veh-color">{v.color || "Colour not set"}</div>
        <Plate value={v.plate} />
        <div className="veh-actions">
          <button className="veh-act edit" onClick={onEdit}>Edit</button>
          <button className="veh-act del" onClick={onDelete}>Remove</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- flat view ---------- */
function FlatView({ flatKey, tower, flatNo, index, onChange, refresh }) {
  const [adding, setAdding] = useState(null);   // 'car' | 'two_wheeler'
  const [editing, setEditing] = useState(null); // vehicle id

  const mine = index.filter((v) => v.flatKey === flatKey);
  const cars = mine.filter((v) => v.type === "car");
  const twos = mine.filter((v) => v.type === "two_wheeler");

  async function add(type, payload) {
    const id = "v" + Date.now() + Math.floor(Math.random() * 1000);
    if (payload.dataUrl) await savePhoto(id, payload.dataUrl);
    const rec = {
      id, flatKey, tower, flatNo, type,
      make: payload.make, color: payload.color, plate: payload.plate,
      hasPhoto: !!payload.dataUrl, createdAt: Date.now(),
    };
    const fresh = await loadIndex();
    await saveIndex([...fresh, rec]);
    setAdding(null);
    refresh();
  }

  async function update(id, payload) {
    if (payload.dataUrl) await savePhoto(id, payload.dataUrl);
    const fresh = await loadIndex();
    const next = fresh.map((v) => v.id === id
      ? { ...v, make: payload.make, color: payload.color, plate: payload.plate,
          hasPhoto: payload.dataUrl ? true : v.hasPhoto }
      : v);
    await saveIndex(next);
    setEditing(null);
    refresh();
  }

  async function remove(id) {
    await deletePhoto(id);
    const fresh = await loadIndex();
    await saveIndex(fresh.filter((v) => v.id !== id));
    refresh();
  }

  const Slot = ({ title, type, list, max }) => {
    const full = list.length >= max;
    return (
      <div className="slot-group">
        <div className="slot-title">
          <span>{title}</span>
          <span className={"slot-quota " + (full ? "quota-full" : "quota-open")}>
            {list.length} / {max} used
          </span>
        </div>
        {list.map((v) => editing === v.id
          ? <VehicleForm key={v.id} type={type} initial={v}
              onSave={(p) => update(v.id, p)} onCancel={() => setEditing(null)} />
          : <VehicleCard key={v.id} v={v} onEdit={() => setEditing(v.id)} onDelete={() => remove(v.id)} />
        )}
        {adding === type
          ? <VehicleForm type={type} onSave={(p) => add(type, p)} onCancel={() => setAdding(null)} />
          : !full && (
            <button className="add-slot" onClick={() => { setEditing(null); setAdding(type); }}>
              + Add {type === "car" ? "car" : "two-wheeler"}
            </button>
          )}
      </div>
    );
  };

  return (
    <div className="flat-card">
      <div className="flat-head">
        <div>
          <div className="flat-id">Tower {tower} · {flatNo}</div>
          <div className="flat-sub">{mine.length} vehicle{mine.length !== 1 ? "s" : ""} registered</div>
        </div>
        <button className="flat-change" onClick={onChange}>Change flat</button>
      </div>
      <Slot title="Car" type="car" list={cars} max={MAX_CARS} />
      <Slot title="Two-wheelers" type="two_wheeler" list={twos} max={MAX_TWO} />
    </div>
  );
}

/* ---------- flat picker ---------- */
function FlatPicker({ onOpen }) {
  const [tower, setTower] = useState(null);
  const [flatNo, setFlatNo] = useState("");
  const ready = tower && flatNo.trim();
  return (
    <div>
      <div className="section-eyebrow">Find your flat</div>
      <div className="towers">
        {TOWERS.map((t) => (
          <button key={t} className={"tower" + (tower === t ? " on" : "")} onClick={() => setTower(t)}>
            {t}<span>Tower</span>
          </button>
        ))}
      </div>
      <div className="field-row" style={{ flexDirection: "column" }}>
        <label className="label" style={{ marginTop: 6 }}>Flat number</label>
        <input className="input" value={flatNo} onChange={(e) => setFlatNo(e.target.value)}
          placeholder="e.g. 1204" inputMode="numeric" />
      </div>
      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }}
        disabled={!ready}
        onClick={() => onOpen(tower, flatNo.trim())}>
        Open my flat
      </button>
    </div>
  );
}

/* ---------- gate lookup ---------- */
function GateLookup({ index }) {
  const [q, setQ] = useState("");
  const norm = (s) => (s || "").toUpperCase().replace(/\s/g, "");
  const query = norm(q);
  const results = query.length < 2 ? [] : index.filter((v) =>
    norm(v.plate).includes(query) ||
    norm(v.flatKey).includes(query) ||
    (v.tower + v.flatNo).toUpperCase().includes(query));

  return (
    <div>
      <div className="section-eyebrow">Gate lookup</div>
      <input className="input" value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search plate or flat — e.g. GJ01 or A 1204" />
      <div className="search-results">
        {query.length < 2 ? (
          <div className="empty">
            <div className="empty-big">Look up any vehicle</div>
            Type part of a number plate or a flat to verify a vehicle at the gate.
          </div>
        ) : results.length === 0 ? (
          <div className="empty">
            <div className="empty-big">No match</div>
            No registered vehicle matches “{q}”.
          </div>
        ) : results.map((v) => (
          <div className="veh" key={v.id}>
            <PhotoThumb id={v.id} hasPhoto={v.hasPhoto} className="veh-photo" />
            <div className="veh-body">
              <span className="badge">{v.type === "car" ? "Car" : "Two-wheeler"}</span>
              <div className="veh-name" style={{ marginTop: 5 }}>{v.make}</div>
              <div className="veh-color">{v.color}</div>
              <Plate value={v.plate} />
              <div className="res-flat">Tower {v.tower} · Flat {v.flatNo}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- app ---------- */
export default function App() {
  const [tab, setTab] = useState("flat");
  const [index, setIndex] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flat, setFlat] = useState(null); // {tower, flatNo, flatKey}

  const refresh = useCallback(async () => {
    setIndex(await loadIndex());
  }, []);

  useEffect(() => { (async () => { setIndex(await loadIndex()); setLoading(false); })(); }, []);

  const registeredFlats = new Set(index.map((v) => v.flatKey)).size;

  return (
    <div className="app">
      <style>{styles}</style>
      <header className="hdr">
        <div className="hdr-eyebrow">Vehicle Registry</div>
        <div className="hdr-title">{SOCIETY_NAME}</div>
        <div className="hdr-sub">Vaishnodevi Circle, Ahmedabad · 4 towers · {TOTAL_FLATS} flats</div>
        <div className="stats">
          <div className="stat"><div className="stat-n">{registeredFlats}<span style={{fontSize:13,opacity:.6}}> / {TOTAL_FLATS}</span></div><div className="stat-l">Flats registered</div></div>
          <div className="stat"><div className="stat-n">{index.filter(v=>v.type==='car').length}</div><div className="stat-l">Cars</div></div>
          <div className="stat"><div className="stat-n">{index.filter(v=>v.type==='two_wheeler').length}</div><div className="stat-l">Two-wheelers</div></div>
        </div>
      </header>

      <div className="tabs">
        <button className={"tab" + (tab === "flat" ? " on" : "")} onClick={() => setTab("flat")}>My flat</button>
        <button className={"tab" + (tab === "gate" ? " on" : "")} onClick={() => setTab("gate")}>Gate lookup</button>
      </div>

      <div className="wrap">
        {loading ? <div className="spinner">Loading registry…</div>
          : tab === "flat" ? (
            flat
              ? <FlatView {...flat} index={index} refresh={refresh} onChange={() => setFlat(null)} />
              : <FlatPicker onOpen={(tower, flatNo) =>
                  setFlat({ tower, flatNo, flatKey: tower + "-" + flatNo })} />
          ) : <GateLookup index={index} />}

        <div className="foot">
          Prototype · Each flat may register 1 car and 2 two-wheelers.<br/>
          Entries are shared across everyone who opens this registry.
        </div>
      </div>
    </div>
  );
}
