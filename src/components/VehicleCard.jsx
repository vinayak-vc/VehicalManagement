import React from "react";
import PhotoThumb from "./PhotoThumb";
import Plate from "./Plate";

export default function VehicleCard({ v, onEdit, onDelete }) {
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
