import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import {
  ref, uploadString, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";

const VEHICLES_COL = "vehicles";
const FLATS_COL = "flats";

// ── Vehicles ──────────────────────────────────────────────

export async function loadIndex() {
  const snap = await getDocs(collection(db, VEHICLES_COL));
  return snap.docs.map((d) => d.data());
}

export async function addVehicle(id, record) {
  await setDoc(doc(db, VEHICLES_COL, id), record);
}

export async function updateVehicle(id, updates) {
  await updateDoc(doc(db, VEHICLES_COL, id), updates);
}

export async function removeVehicle(id) {
  await deleteDoc(doc(db, VEHICLES_COL, id));
}

// ── Photos ────────────────────────────────────────────────

export async function savePhoto(id, dataUrl) {
  await uploadString(ref(storage, `photos/${id}`), dataUrl, "data_url");
}

export async function loadPhoto(id) {
  try {
    return await getDownloadURL(ref(storage, `photos/${id}`));
  } catch {
    return null;
  }
}

export async function deletePhoto(id) {
  try {
    await deleteObject(ref(storage, `photos/${id}`));
  } catch {}
}

// ── Flat resident info ────────────────────────────────────

export async function loadAllFlatInfo() {
  const snap = await getDocs(collection(db, FLATS_COL));
  const map = {};
  snap.docs.forEach((d) => { map[d.id] = d.data(); });
  return map;
}

export async function saveFlatInfo(flatKey, data) {
  await setDoc(doc(db, FLATS_COL, flatKey), { ...data, updatedAt: Date.now() }, { merge: true });
}
