import React, { useState } from "react";
import { TOWERS } from "../constants";
import { validateFlatNo } from "../utils/flatUtils";

export default function FlatPicker({ onOpen }) {
  const [tower, setTower] = useState(null);
  const [flatNo, setFlatNo] = useState("");
  const [err, setErr] = useState("");

  function handleTowerChange(t) {
    setTower(t);
    setErr("");
    if (flatNo.trim()) {
      setErr(validateFlatNo(flatNo.trim(), t) || "");
    }
  }

  function handleFlatChange(e) {
    const val = e.target.value;
    setFlatNo(val);
    setErr("");
  }

  function handleOpen() {
    const error = validateFlatNo(flatNo.trim(), tower);
    if (error) { setErr(error); return; }
    onOpen(tower, flatNo.trim());
  }

  const placeholder = tower === "E" ? "e.g. 601 or 602" : "e.g. 601 – 604";

  return (
    <div>
      <div className="section-eyebrow">Find your flat</div>
      <div className="towers">
        {TOWERS.map((t) => (
          <button key={t} className={"tower" + (tower === t ? " on" : "")} onClick={() => handleTowerChange(t)}>
            {t}<span>Tower</span>
          </button>
        ))}
      </div>

      {tower && (
        <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
          {tower === "E"
            ? "Tower E · Units 01–02 per floor · Floor 14 units 01–02"
            : "Towers A–D · Units 01–04 per floor · Floor 14 units 01–02"}
        </div>
      )}

      <div className="field-row" style={{ flexDirection: "column" }}>
        <label className="label" style={{ marginTop: 6 }}>Flat number</label>
        <input
          className="input"
          value={flatNo}
          onChange={handleFlatChange}
          placeholder={placeholder}
          inputMode="numeric"
        />
        {err && <div className="err">{err}</div>}
      </div>

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 16 }}
        disabled={!tower || !flatNo.trim()}
        onClick={handleOpen}
      >
        Open my flat
      </button>
    </div>
  );
}
