export function parseLatitude(lat: string | null) {
  if (!lat) return null;
  const num = parseFloat(lat);
  return !isNaN(num) && num >= -90 && num <= 90 ? num : null;
}

export function parseLongitude(lng: string | null) {
  if (!lng) return null;
  const num = parseFloat(lng);
  return !isNaN(num) && num >= -180 && num <= 180 ? num : null;
}
