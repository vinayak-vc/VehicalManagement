import React, { useState, useEffect } from "react";
import { loadPhoto } from "../storage/registry";

export default function PhotoThumb({ id, hasPhoto, className }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    let on = true;
    if (hasPhoto) loadPhoto(id).then((d) => { if (on) setSrc(d); });
    return () => { on = false; };
  }, [id, hasPhoto]);

  if (src) return <img src={src} className={className} alt="vehicle" />;
  return <div className={className + " empty"}>{hasPhoto ? "…" : "No photo"}</div>;
}
