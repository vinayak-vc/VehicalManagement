import React, { useState } from "react";
import Plate from "./Plate";
import { compressImage } from "../utils/imageUtils";

export default function VehicleForm({ type, initial, onSave, onCancel }) {
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
    try {
      setDataUrl(await compressImage(f));
    } catch {
      setErr("Could not read that image.");
    }
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
        <label className="label">Make &amp; model</label>
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
          placeholder="GJ 01 AB 1234"
          style={{ fontFamily: "'Oswald',sans-serif", letterSpacing: ".05em" }} />
        <div style={{ marginTop: 10 }}><Plate value={plate} /></div>
      </div>

      <div className="form-field">
        <label className="label">Photo</label>
        <label className={"photo-pick" + (dataUrl ? " has" : "")}>
          {dataUrl
            ? <img src={dataUrl} className="photo-preview" alt="preview" />
            : <>
                <div className="photo-hint">{busy ? "Processing…" : "Take or choose a photo"}</div>
                <div className="photo-sub">Show the vehicle with its number plate</div>
              </>}
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
