/**
 * Floor = all digits except last two. Unit = last two digits.
 * e.g. "601" → floor 6, unit 01
 *      "1402" → floor 14, unit 02
 */
export function validateFlatNo(flatNo, tower) {
  const clean = flatNo.replace(/\s/g, "");
  if (!/^\d+$/.test(clean) || clean.length < 3) {
    return "Enter flat number (e.g. 601)";
  }
  const floor = parseInt(clean.slice(0, -2), 10);
  const unit = parseInt(clean.slice(-2), 10);

  if (floor < 1 || floor > 14) return "Floor must be 1–14";

  const isTopFloor = floor === 14;
  const isTowerE = tower === "E";
  const maxUnit = isTopFloor || isTowerE ? 2 : 4;

  if (unit < 1 || unit > maxUnit) {
    if (isTowerE) return "Tower E: only units 01–02 per floor (e.g. 601, 602)";
    if (isTopFloor) return "Floor 14: only units 01–02 (e.g. 1401, 1402)";
    return "Units 01–04 only (e.g. 601, 602, 603, 604)";
  }

  return null; // valid
}
