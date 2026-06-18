import React, { useState } from "react";
import {
  loadIndex, addVehicle, updateVehicle, removeVehicle,
  savePhoto, deletePhoto,
} from "../storage/registry";
import { MAX_CARS, MAX_TWO } from "../constants";
import VehicleForm from "./VehicleForm";
import VehicleCard from "./VehicleCard";

function Slot({ title, type, list, max, adding, setAdding, setEditing, onAdd, onUpdate, onRemove, editing }) {
  const full = list.length >= max;
  return (
    <div className="slot-group">
      <div className="slot-title">
        <span>{title}</span>
        <span className={"slot-quota " + (full ? "quota-full" : "quota-open")}>
          {list.length} / {max} used
        </span>
      </div>
      {list.map((v) =>
        editing === v.id
          ? <VehicleForm key={v.id} type={type} initial={v}
              onSave={(p) => onUpdate(v.id, p)} onCancel={() => setEditing(null)} />
          : <VehicleCard key={v.id} v={v} onEdit={() => setEditing(v.id)} onDelete={() => onRemove(v.id)} />
      )}
      {adding === type
        ? <VehicleForm type={type} onSave={(p) => onAdd(type, p)} onCancel={() => setAdding(null)} />
        : !full && (
          <button className="add-slot" onClick={() => { setEditing(null); setAdding(type); }}>
            + Add {type === "car" ? "car" : "two-wheeler"}
          </button>
        )}
    </div>
  );
}

export default function FlatView({ flatKey, tower, flatNo, index, onChange, refresh }) {
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
      <Slot title="Car" type="car" list={cars} max={MAX_CARS} {...slotProps} />
      <Slot title="Two-wheelers" type="two_wheeler" list={twos} max={MAX_TWO} {...slotProps} />
    </div>
  );
}
