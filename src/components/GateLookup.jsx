import React, { useState } from "react";
import PhotoThumb from "./PhotoThumb";
import Plate from "./Plate";

export default function GateLookup({ index }) {
  const [q, setQ] = useState("");
  const norm = (s) => (s || "").toUpperCase().replace(/\s/g, "");
  const query = norm(q);
  const results = query.length < 2 ? [] : index.filter((v) =>
    norm(v.plate).includes(query) ||
    norm(v.flatKey).includes(query) ||
    (v.tower + v.flatNo).toUpperCase().includes(query)
  );

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
            No registered vehicle matches "{q}".
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
