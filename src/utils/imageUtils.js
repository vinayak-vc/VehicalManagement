const TARGET_BYTES = 200 * 1024; // 200 KB
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

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width: w, height: h } = img;

        // Scale down to MAX_DIM on the longest side
        const scale = Math.min(1, MAX_DIM / Math.max(w, h));
        w *= scale;
        h *= scale;

        // Pass 1: reduce quality (0.85 → 0.15, step 0.1)
        let quality = 0.85;
        let dataUrl = encode(img, w, h, quality);
        while (dataUrlBytes(dataUrl) > TARGET_BYTES && quality > 0.15) {
          quality = Math.round((quality - 0.1) * 100) / 100;
          dataUrl = encode(img, w, h, quality);
        }

        // Pass 2: if still over, shrink dimensions (80% each step)
        while (dataUrlBytes(dataUrl) > TARGET_BYTES && Math.max(w, h) > 200) {
          w *= 0.8;
          h *= 0.8;
          dataUrl = encode(img, w, h, quality);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
