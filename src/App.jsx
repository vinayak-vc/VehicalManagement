import React, { useState, useEffect, useCallback } from "react";
import { SOCIETY_NAME, TOTAL_FLATS, TOWERS, RERA_NO, RERA_URL } from "./constants";
import { loadIndex, loadAllFlatInfo } from "./storage/registry";
import FlatPicker from "./components/FlatPicker";
import FlatView from "./components/FlatView";
import GateLookup from "./components/GateLookup";

export default function App() {
  const [tab, setTab] = useState("flat");
  const [index, setIndex] = useState([]);
  const [flatInfo, setFlatInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [flat, setFlat] = useState(null); // { tower, flatNo, flatKey }
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const refresh = useCallback(async () => {
    setIndex(await loadIndex());
  }, []);

  const refreshFlatInfo = useCallback(async () => {
    setFlatInfo(await loadAllFlatInfo());
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [vehicles, info] = await Promise.all([loadIndex(), loadAllFlatInfo()]);
        setIndex(vehicles);
        setFlatInfo(info);
      } catch (e) {
        console.error("Firebase load failed:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const registeredFlats = new Set(index.map((v) => v.flatKey)).size;

  return (
    <div className="app">
      <header className="hdr">
        <div className="hdr-top">
          <div className="hdr-eyebrow">Vehicle Registry</div>
          <button className="theme-toggle" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
        <div className="hdr-title">{SOCIETY_NAME}</div>
        <div className="hdr-sub">Vaishnodevi Circle, Ahmedabad · {TOWERS.length} towers · {TOTAL_FLATS} flats</div>
        <div className="stats">
          <div className="stat">
            <div className="stat-n">
              {registeredFlats}<span style={{ fontSize: 13, opacity: .6 }}> / {TOTAL_FLATS}</span>
            </div>
            <div className="stat-l">Flats registered</div>
          </div>
          <div className="stat">
            <div className="stat-n">{index.filter((v) => v.type === "car").length}</div>
            <div className="stat-l">Cars</div>
          </div>
          <div className="stat">
            <div className="stat-n">{index.filter((v) => v.type === "two_wheeler").length}</div>
            <div className="stat-l">Two-wheelers</div>
          </div>
        </div>
      </header>

      <div className="tabs">
        <button className={"tab" + (tab === "flat" ? " on" : "")} onClick={() => setTab("flat")}>My flat</button>
        <button className={"tab" + (tab === "gate" ? " on" : "")} onClick={() => setTab("gate")}>Gate lookup</button>
      </div>

      <div className="wrap">
        {loading
          ? <div className="spinner">Loading registry…</div>
          : tab === "flat"
            ? flat
              ? <FlatView
                  {...flat}
                  index={index}
                  flatInfo={flatInfo}
                  refresh={refresh}
                  refreshFlatInfo={refreshFlatInfo}
                  onChange={() => setFlat(null)}
                />
              : <FlatPicker onOpen={(tower, flatNo) =>
                  setFlat({ tower, flatNo, flatKey: tower + "-" + flatNo })} />
            : <GateLookup index={index} flatInfo={flatInfo} />}

        <div className="foot">
          Prototype · Each flat may register 1 car and 2 two-wheelers.<br />
          Entries are shared across everyone who opens this registry.<br />
          <a href={RERA_URL} target="_blank" rel="noopener noreferrer"
            style={{ color: "var(--teal)", fontWeight: 600, textDecoration: "none" }}>
            RERA Reg. {RERA_NO}
          </a>
        </div>
      </div>
    </div>
  );
}
