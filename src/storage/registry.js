import {
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import {
  ref, uploadString, getDownloadURL, deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";

const COL = "vehicles";

export async function loadIndex() {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map((d) => d.data());
}

export async function addVehicle(id, record) {
  await setDoc(doc(db, COL, id), record);
}

export async function updateVehicle(id, updates) {
  await updateDoc(doc(db, COL, id), updates);
}

export async function removeVehicle(id) {
  await deleteDoc(doc(db, COL, id));
}

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
