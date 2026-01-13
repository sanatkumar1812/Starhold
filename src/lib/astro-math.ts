/**
 * Astronomical math utilities for Starhold
 */

// Julian Date calculation
export const getJulianDate = (date: Date = new Date()): number => {
    return (date.getTime() / 86400000) + 2440587.5;
};

// Greenwich Mean Sidereal Time (GMST) in degrees
export const getGMST = (date: Date = new Date()): number => {
    const jd = getJulianDate(date);
    const d = jd - 2451545.0; // Days from J2000.0
    // GMST = 280.46061837 + 360.98564736629 * d
    let gmst = (280.46061837 + 360.98564736629 * d) % 360;
    if (gmst < 0) gmst += 360;
    return gmst;
};

// Local Sidereal Time (LST) in degrees
export const getLST = (date: Date, lng: number): number => {
    const gmst = getGMST(date);
    let lst = (gmst + lng) % 360;
    if (lst < 0) lst += 360;
    return lst;
};

// Convert RA/Dec to Horizon Coordinates (Azimuth, Altitude)
// lat, lng in degrees. ra in degrees, dec in degrees.
export const celestialToHorizon = (date: Date, lat: number, lng: number, ra: number, dec: number) => {
    const lst = getLST(date, lng);
    const ha = (lst - ra + 360) % 360; // Hour Angle

    const latRad = (lat * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const haRad = (ha * Math.PI) / 180;

    // Altitude (sin alt = sin dec sin lat + cos dec cos lat cos ha)
    const sinAlt = Math.sin(decRad) * Math.sin(latRad) + Math.cos(decRad) * Math.cos(latRad) * Math.cos(haRad);
    const alt = Math.asin(sinAlt);

    // Azimuth (cos az = (sin dec - sin alt sin lat) / (cos alt cos lat))
    const cosAz = (Math.sin(decRad) - Math.sin(alt) * Math.sin(latRad)) / (Math.cos(alt) * Math.cos(latRad));
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));

    if (Math.sin(haRad) > 0) {
        az = 2 * Math.PI - az;
    }

    return {
        azimuth: (az * 180) / Math.PI,
        altitude: (alt * 180) / Math.PI
    };
};

// Format RA in degrees to HH:MM:SS
export const formatRA = (raDeg: number): string => {
    const h = raDeg / 15;
    const hours = Math.floor(h);
    const m = (h - hours) * 60;
    const minutes = Math.floor(m);
    const s = (m - minutes) * 60;
    return `${hours}h ${minutes}m ${s.toFixed(1)}s`;
};

// Format Dec in degrees to DD:MM:SS
export const formatDec = (decDeg: number): string => {
    const absDec = Math.abs(decDeg);
    const degrees = Math.floor(absDec);
    const m = (absDec - degrees) * 60;
    const minutes = Math.floor(m);
    const s = (m - minutes) * 60;
    const sign = decDeg >= 0 ? '+' : '-';
    return `${sign}${degrees}° ${minutes}' ${s.toFixed(0)}"`;
};

// --- SOLAR SYSTEM CALCULATIONS (Simplified J2000) ---

const degToRad = (d: number) => (d * Math.PI) / 180;
const radToDeg = (r: number) => (r * 180) / Math.PI;

export const getSunPosition = (date: Date) => {
    const jd = getJulianDate(date);
    const d = jd - 2451545.0; // Days from J2000.0

    // Mean longitude of the Sun
    let L = (280.460 + 0.9856474 * d) % 360;
    // Mean anomaly
    let g = (357.528 + 0.9856003 * d) % 360;
    if (L < 0) L += 360;
    if (g < 0) g += 360;

    // Ecliptic longitude
    const lambda = L + 1.915 * Math.sin(degToRad(g)) + 0.020 * Math.sin(degToRad(2 * g));
    const epsilon = 23.439 - 0.0000004 * d; // Obliquity of the ecliptic

    const ra = radToDeg(Math.atan2(Math.cos(degToRad(epsilon)) * Math.sin(degToRad(lambda)), Math.cos(degToRad(lambda))));
    const dec = radToDeg(Math.asin(Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))));

    return { ra: (ra + 360) % 360, dec };
};

export const getMoonPosition = (date: Date) => {
    const jd = getJulianDate(date);
    const d = jd - 2451545.0;

    // Simplified lunar theory
    const L = (218.316 + 13.176396 * d) % 360; // Mean longitude
    const M = (134.963 + 13.064993 * d) % 360; // Mean anomaly
    const F = (93.272 + 13.229350 * d) % 360; // Mean distance from node

    const lambda = L + 6.289 * Math.sin(degToRad(M));
    const beta = 5.128 * Math.sin(degToRad(F));

    const epsilon = 23.439;

    // Ecliptic to Equatorial
    const ra = radToDeg(Math.atan2(Math.sin(degToRad(lambda)) * Math.cos(degToRad(epsilon)) - Math.tan(degToRad(beta)) * Math.sin(degToRad(epsilon)), Math.cos(degToRad(lambda))));
    const dec = radToDeg(Math.asin(Math.sin(degToRad(beta)) * Math.cos(degToRad(epsilon)) + Math.cos(degToRad(beta)) * Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))));

    return { ra: (ra + 360) % 360, dec };
};

// Planets (Keplerian Elements)
const PLANET_DATA = {
    Mercury: { a: 0.387098, e: 0.205630, i: 7.0047, L: 252.2503, p: 77.4577, n: 48.3307, v: 4.09233 },
    Venus: { a: 0.723330, e: 0.006773, i: 3.3946, L: 181.9791, p: 131.5637, n: 76.6806, v: 1.60213 },
    Mars: { a: 1.523662, e: 0.093412, i: 1.8506, L: 355.4533, p: 336.0408, n: 49.5785, v: 0.52402 },
    Jupiter: { a: 5.203363, e: 0.048393, i: 1.3053, L: 34.4044, p: 14.7539, n: 100.5562, v: 0.08308 },
    Saturn: { a: 9.537070, e: 0.054151, i: 2.4845, L: 49.9443, p: 92.4319, n: 113.7150, v: 0.03346 }
};

export const getPlanetPosition = (planet: keyof typeof PLANET_DATA, date: Date) => {
    const jd = getJulianDate(date);
    const d = jd - 2451545.0;
    const p = PLANET_DATA[planet];

    const M = (p.L - p.p + p.v * d) % 360; // Mean anomaly
    const lambda = (p.L + p.v * d + 2 * p.e * radToDeg(Math.sin(degToRad(M)))) % 360; // Simplified longitude

    // Very simplified RA/Dec for visualization
    const epsilon = 23.439;
    const ra = radToDeg(Math.atan2(Math.cos(degToRad(epsilon)) * Math.sin(degToRad(lambda)), Math.cos(degToRad(lambda))));
    const dec = radToDeg(Math.asin(Math.sin(degToRad(epsilon)) * Math.sin(degToRad(lambda))));

    return { ra: (ra + 360) % 360, dec };
};

// Convert Horizon (Az, Alt) to Equatorial (RA, Dec)
export const horizonToCelestial = (date: Date, lat: number, lng: number, az: number, alt: number) => {
    const latRad = (lat * Math.PI) / 180;
    const azRad = (az * Math.PI) / 180;
    const altRad = (alt * Math.PI) / 180;

    const decRad = Math.asin(Math.sin(altRad) * Math.sin(latRad) + Math.cos(altRad) * Math.cos(latRad) * Math.cos(azRad));
    let haRad = Math.acos((Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad)));

    if (Math.sin(azRad) > 0) {
        haRad = 2 * Math.PI - haRad;
    }

    const ha = (haRad * 180) / Math.PI;
    const lst = getLST(date, lng);
    const ra = (lst - ha + 360) % 360;

    return { ra, dec: (decRad * 180) / Math.PI };
};

// Parallactic Angle (q)
// The angle between the celestial pole (North) and the zenith (Vertical) at a given point (HA, Dec).
// Used to rotate the field of view so that Zenith is "Up" in Planar/Alt-Az mode.
export const getParallacticAngle = (date: Date, lat: number, lng: number, ra: number, dec: number): number => {
    const lst = getLST(date, lng);
    const ha = (lst - ra + 360) % 360;

    // Convert to radians
    const latRad = (lat * Math.PI) / 180;
    const haRad = (ha * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;

    // Formula: tan q = sin(H) / (tan(phi)cos(delta) - sin(delta)cos(H))
    const numerator = Math.sin(haRad);
    const denominator = Math.tan(latRad) * Math.cos(decRad) - Math.sin(decRad) * Math.cos(haRad);

    const qRad = Math.atan2(numerator, denominator);
    const qDeg = (qRad * 180) / Math.PI;

    return qDeg;
};
