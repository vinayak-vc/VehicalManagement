import React from "react";

export default function Plate({ value }) {
  return (
    <div className="plate">
      <div className="plate-ind">
        <b>IND</b>
        <i />
      </div>
      <div className="plate-num">{(value || "—").toUpperCase()}</div>
    </div>
  );
}
