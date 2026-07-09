const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateDeliveryPrice(params: {
  distanceKm: number;
  pricePerKm: number;
  baseFare: number;
  minimumFare: number;
  weightSurcharge: number;
}): number {
  const { distanceKm, pricePerKm, baseFare, minimumFare, weightSurcharge } = params;
  const raw = baseFare + Math.ceil(distanceKm * pricePerKm) + weightSurcharge;
  return Math.max(raw, minimumFare);
}

export function derivePricePerKm(params: {
  fuelPricePerLiter: number;
  fuelConsumptionKmpl: number;
  markupPercent: number;
}): number {
  const { fuelPricePerLiter, fuelConsumptionKmpl, markupPercent } = params;
  if (fuelConsumptionKmpl <= 0) return 0;
  const costPerKm = fuelPricePerLiter / fuelConsumptionKmpl;
  return Math.ceil(costPerKm * (1 + markupPercent / 100));
}
