/**
 * Astronomical math utilities for Starhold
 */

// Julian Date calculation
export const getJulianDate = (date: Date = new Date()): number => {
    return (date.getTime() / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
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
