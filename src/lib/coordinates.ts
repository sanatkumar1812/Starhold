// Generate unique celestial coordinates based on input data
// These coordinates map to real observable regions of the sky

export interface CelestialCoordinate {
  ra: number;  // Right Ascension in degrees (0-360)
  dec: number; // Declination in degrees (-90 to 90)
  constellation: string;
}

// Major constellations visible to JWST/Hubble with their coordinate ranges
const constellations = [
  { name: 'Orion', raMin: 75, raMax: 95, decMin: -10, decMax: 20 },
  { name: 'Andromeda', raMin: 0, raMax: 30, decMin: 25, decMax: 50 },
  { name: 'Sagittarius', raMin: 260, raMax: 290, decMin: -35, decMax: -15 },
  { name: 'Cygnus', raMin: 285, raMax: 330, decMin: 25, decMax: 55 },
  { name: 'Leo', raMin: 135, raMax: 180, decMin: 0, decMax: 30 },
  { name: 'Scorpius', raMin: 240, raMax: 270, decMin: -45, decMax: -20 },
  { name: 'Ursa Major', raMin: 150, raMax: 210, decMin: 45, decMax: 70 },
  { name: 'Pegasus', raMin: 320, raMax: 360, decMin: 5, decMax: 35 },
  { name: 'Centaurus', raMin: 180, raMax: 225, decMin: -60, decMax: -30 },
  { name: 'Cassiopeia', raMin: 345, raMax: 45, decMin: 50, decMax: 65 },
  { name: 'Lyra', raMin: 275, raMax: 295, decMin: 25, decMax: 45 },
  { name: 'Aquila', raMin: 285, raMax: 305, decMin: -5, decMax: 15 },
];

// Simple hash function to generate deterministic but seemingly random values
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate coordinates based on message content and unlock date
export const generateCoordinates = (
  message: string,
  unlockDate: Date,
  recipientName: string,
  senderId?: string
): CelestialCoordinate => {
  // Create a unique seed from the inputs
  // Including senderId ensures different users get different stars for same message
  const seed = `${message.slice(0, 50)}-${unlockDate.getTime()}-${recipientName}-${senderId || ''}`;
  const hash = hashString(seed);

  // Select constellation based on hash
  const constellationIndex = hash % constellations.length;
  const constellation = constellations[constellationIndex];

  // Generate precise coordinates within the constellation
  const raRange = constellation.raMax - constellation.raMin;
  const decRange = constellation.decMax - constellation.decMin;

  // Use different parts of the hash for RA and Dec
  const raSeed = hashString(seed + 'ra');
  const decSeed = hashString(seed + 'dec');

  // High precision coordinates (to arc-second level)
  const raOffset = (raSeed % 100000) / 100000;
  const decOffset = (decSeed % 100000) / 100000;

  let ra = constellation.raMin + raOffset * raRange;
  // Handle wrap-around for constellations that cross 0°
  if (constellation.raMax < constellation.raMin) {
    ra = (constellation.raMin + raOffset * (360 - constellation.raMin + constellation.raMax)) % 360;
  }
  const dec = constellation.decMin + decOffset * decRange;

  return {
    ra: Number(ra.toFixed(6)),
    dec: Number(dec.toFixed(6)),
    constellation: constellation.name,
  };
};

// Format RA as hours, minutes, seconds
export const formatRA = (ra: number): string => {
  const hours = Math.floor(ra / 15);
  const minutes = Math.floor((ra / 15 - hours) * 60);
  const seconds = ((ra / 15 - hours) * 60 - minutes) * 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toFixed(2)}s`;
};

// Format Dec as degrees, arcminutes, arcseconds
export const formatDec = (dec: number): string => {
  const sign = dec >= 0 ? '+' : '-';
  const absDec = Math.abs(dec);
  const degrees = Math.floor(absDec);
  const arcminutes = Math.floor((absDec - degrees) * 60);
  const arcseconds = ((absDec - degrees) * 60 - arcminutes) * 60;
  return `${sign}${degrees.toString().padStart(2, '0')}° ${arcminutes.toString().padStart(2, '0')}' ${arcseconds.toFixed(2)}"`;
};

// Calculate time until unlock
export const getTimeUntilUnlock = (unlockDate: Date): {
  years: number;
  months: number;
  days: number;
  hours: number;
  isPast: boolean;
} => {
  const now = new Date();
  const diff = unlockDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { years: 0, months: 0, days: 0, hours: 0, isPast: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  return {
    years,
    months: months % 12,
    days: days % 30,
    hours: hours % 24,
    isPast: false,
  };
};
