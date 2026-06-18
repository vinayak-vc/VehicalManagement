import heic2any from "heic2any";

const TARGET_BYTES = 200 * 1024;
const MAX_DIM = 1200;

function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function encode(img, w, h, quality) {
  const c = document.createElement("canvas");
  c.width = Math.round(w);
  c.height = Math.round(h);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", quality);
}

async function normalizeToBlob(file) {
  const type = file.type.toLowerCase();
  const name = (file.name || "").toLowerCase();
  const isHeic = type === "image/heic" || type === "image/heif"
    || name.endsWith(".heic") || name.endsWith(".heif");
  if (isHeic) {
    const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
    return Array.isArray(result) ? result[0] : result;
  }
  return file;
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function compressImage(file) {
  const blob = await normalizeToBlob(file);
  const img = await loadImage(blob);

  let { width: w, height: h } = img;
  const scale = Math.min(1, MAX_DIM / Math.max(w, h));
  w *= scale;
  h *= scale;

  // Pass 1: reduce quality
  let quality = 0.85;
  let dataUrl = encode(img, w, h, quality);
  while (dataUrlBytes(dataUrl) > TARGET_BYTES && quality > 0.15) {
    quality = Math.round((quality - 0.1) * 100) / 100;
    dataUrl = encode(img, w, h, quality);
  }

  // Pass 2: reduce dimensions
  while (dataUrlBytes(dataUrl) > TARGET_BYTES && Math.max(w, h) > 200) {
    w *= 0.8;
    h *= 0.8;
    dataUrl = encode(img, w, h, quality);
  }

  return dataUrl;
}
