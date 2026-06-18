import React, { useState } from "react";
import PhotoThumb from "./PhotoThumb";
import Plate from "./Plate";

function FlatGroup({ group, info }) {
  const resident = info || {};
  return (
    <div className="gate-flat-group">
      <div className="gate-flat-hdr">
        <div>
          <div className="flat-id" style={{ fontSize: 17 }}>Tower {group.tower} · {group.flatNo}</div>
          {(resident.residentName || resident.contact) && (
            <div className="gate-resident">
              {resident.residentName && <span>{resident.residentName}</span>}
              {resident.residentName && resident.contact && <span className="gate-sep">·</span>}
              {resident.contact && (
                <a href={"tel:" + resident.contact} className="gate-contact">{resident.contact}</a>
              )}
            </div>
          )}
        </div>
        <span className="badge">{group.vehicles.length} vehicle{group.vehicles.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="gate-vehicles">
        {group.vehicles.map((v) => (
          <div className="veh" key={v.id}>
            <PhotoThumb id={v.id} hasPhoto={v.hasPhoto} className="veh-photo" />
            <div className="veh-body">
              <span className="badge">{v.type === "car" ? "Car" : "Two-wheeler"}</span>
              <div className="veh-name" style={{ marginTop: 5 }}>{v.make}</div>
              <div className="veh-color">{v.color}</div>
              <Plate value={v.plate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GateLookup({ index, flatInfo }) {
  const [q, setQ] = useState("");
  const norm = (s) => (s || "").toUpperCase().replace(/\s/g, "");
  const query = norm(q);

  const matched = query.length < 2 ? [] : index.filter((v) => {
    const info = flatInfo[v.flatKey] || {};
    return (
      norm(v.plate).includes(query) ||
      norm(v.flatKey).includes(query) ||
      (v.tower + v.flatNo).toUpperCase().includes(query) ||
      norm(info.residentName).includes(query) ||
      norm(info.contact).includes(query)
    );
  });

  // Group by flat
  const groupMap = {};
  matched.forEach((v) => {
    if (!groupMap[v.flatKey]) {
      groupMap[v.flatKey] = { tower: v.tower, flatNo: v.flatNo, flatKey: v.flatKey, vehicles: [] };
    }
    groupMap[v.flatKey].vehicles.push(v);
  });
  const groups = Object.values(groupMap);

  return (
    <div>
      <div className="section-eyebrow">Gate lookup</div>
      <input
        className="input"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Plate, flat, or resident name — e.g. GJ01 / A601 / Sharma"
      />

      <div className="search-results">
        {query.length < 2 ? (
          <div className="empty">
            <div className="empty-big">Look up any vehicle</div>
            Search by plate, flat number, or resident name.
          </div>
        ) : groups.length === 0 ? (
          <div className="empty">
            <div className="empty-big">No match</div>
            Nothing registered matches "{q}".
          </div>
        ) : (
          groups.map((g) => (
            <FlatGroup key={g.flatKey} group={g} info={flatInfo[g.flatKey]} />
          ))
        )}
      </div>
    </div>
  );
}
