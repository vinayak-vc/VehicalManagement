import React, { useState } from "react";
import {
  addVehicle, updateVehicle, removeVehicle,
  savePhoto, deletePhoto, saveFlatInfo,
} from "../storage/registry";
import { MAX_CARS, MAX_TWO } from "../constants";
import VehicleForm from "./VehicleForm";
import VehicleCard from "./VehicleCard";

function Slot({ title, type, list, max, adding, setAdding, setEditing, onAdd, onUpdate, onRemove, editing }) {
  const over = list.length > max;
  const atLimit = list.length === max;
  const quotaClass = over ? "quota-warn" : atLimit ? "quota-full" : "quota-open";
  const quotaLabel = over
    ? `${list.length} / ${max} — exceeds limit`
    : `${list.length} / ${max} used`;

  return (
    <div className="slot-group">
      <div className="slot-title">
        <span>{title}</span>
        <span className={"slot-quota " + quotaClass}>{quotaLabel}</span>
      </div>
      {over && (
        <div className="quota-warning">
          Society limit is {max} {type === "car" ? "car" : "two-wheeler"}{max !== 1 ? "s" : ""} per flat.
        </div>
      )}
      {list.map((v) =>
        editing === v.id
          ? <VehicleForm key={v.id} type={type} initial={v}
              onSave={(p) => onUpdate(v.id, p)} onCancel={() => setEditing(null)} />
          : <VehicleCard key={v.id} v={v} onEdit={() => setEditing(v.id)} onDelete={() => onRemove(v.id)} />
      )}
      {adding === type
        ? <VehicleForm type={type} onSave={(p) => onAdd(type, p)} onCancel={() => setAdding(null)} />
        : (
          <button className="add-slot" onClick={() => { setEditing(null); setAdding(type); }}>
            + Add {type === "car" ? "car" : "two-wheeler"}
          </button>
        )}
    </div>
  );
}

function ResidentInfo({ flatKey, info, onSaved }) {
  const hasInfo = info?.residentName || info?.contact;
  const [editing, setEditing] = useState(!hasInfo);
  const [name, setName] = useState(info?.residentName || "");
  const [contact, setContact] = useState(info?.contact || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await saveFlatInfo(flatKey, { residentName: name.trim(), contact: contact.trim() });
    setSaving(false);
    setEditing(false);
    onSaved();
  }

  function handleEdit() {
    setName(info?.residentName || "");
    setContact(info?.contact || "");
    setEditing(true);
  }

  if (editing) {
    return (
      <div className="resident-info editing">
        <div className="form-field" style={{ marginBottom: 10 }}>
          <label className="label">Resident name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma" />
        </div>
        <div className="form-field" style={{ marginBottom: 10 }}>
          <label className="label">Contact number</label>
          <input className="input" value={contact} onChange={(e) => setContact(e.target.value)}
            placeholder="e.g. 9876543210" inputMode="tel" />
        </div>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          <button className="btn btn-primary btn-block" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save info"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="resident-info">
      <div className="info-row">
        <div>
          <div className="info-name">{info?.residentName || <span className="info-empty">No resident name</span>}</div>
          <div className="info-contact">{info?.contact || <span className="info-empty">No contact</span>}</div>
        </div>
        <button className="flat-change" onClick={handleEdit}>
          {hasInfo ? "Edit info" : "+ Add info"}
        </button>
      </div>
    </div>
  );
}

export default function FlatView({ flatKey, tower, flatNo, index, flatInfo, onChange, refresh, refreshFlatInfo }) {
  const [adding, setAdding] = useState(null);
  const [editing, setEditing] = useState(null);

  const mine = index.filter((v) => v.flatKey === flatKey);
  const cars = mine.filter((v) => v.type === "car");
  const twos = mine.filter((v) => v.type === "two_wheeler");

  async function handleAdd(type, payload) {
    const id = "v" + Date.now() + Math.floor(Math.random() * 1000);
    if (payload.dataUrl) await savePhoto(id, payload.dataUrl);
    await addVehicle(id, {
      id, flatKey, tower, flatNo, type,
      make: payload.make, color: payload.color, plate: payload.plate,
      hasPhoto: !!payload.dataUrl, createdAt: Date.now(),
    });
    setAdding(null);
    refresh();
  }

  async function handleUpdate(id, payload) {
    if (payload.dataUrl) await savePhoto(id, payload.dataUrl);
    await updateVehicle(id, {
      make: payload.make,
      color: payload.color,
      plate: payload.plate,
      ...(payload.dataUrl ? { hasPhoto: true } : {}),
    });
    setEditing(null);
    refresh();
  }

  async function handleRemove(id) {
    await deletePhoto(id);
    await removeVehicle(id);
    refresh();
  }

  const slotProps = {
    adding, setAdding, editing, setEditing,
    onAdd: handleAdd, onUpdate: handleUpdate, onRemove: handleRemove,
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

      <ResidentInfo
        flatKey={flatKey}
        info={flatInfo[flatKey]}
        onSaved={refreshFlatInfo}
      />

      <Slot title="Car" type="car" list={cars} max={MAX_CARS} {...slotProps} />
      <Slot title="Two-wheelers" type="two_wheeler" list={twos} max={MAX_TWO} {...slotProps} />
    </div>
  );
}
