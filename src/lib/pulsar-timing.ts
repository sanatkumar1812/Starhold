import { getJulianDate } from './astro-math';

/**
 * Pulsar Timing Script for 4D Autonomous Navigation
 * Calculates "Universal Time" and "Galactic Pulse Counts" based on real astronomical models.
 */

export interface PulsarData {
    id: string;
    name: string;
    period: number; // in seconds
    tau?: number;    // cumulative pulse count from J2000
    ra: number;
    dec: number;
    parallax: number;
}

// J2000 Epoch in Julian Days
const J2000_JD = 2451545.0;

/**
 * Calculates the Galactic Pulse Count (tau) for a pulsar since J2000 epoch.
 * tau = (t - t0) / P
 */
export const calculateGalacticPulseCount = (period: number, date: Date = new Date()): number => {
    const currentJD = getJulianDate(date);
    const diffSeconds = (currentJD - J2000_JD) * 86400;
    return diffSeconds / period;
};

/**
 * Simulates the Solar System's displacement in the Galactocentric frame.
 * The Sun orbits the Galactic Center at ~230 km/s.
 * We return a simplified 3D vector [x, y, z] in light-seconds.
 */
export const getSunGalacticPosition = (date: Date = new Date()): [number, number, number] => {
    const currentJD = getJulianDate(date);
    const diffDays = currentJD - J2000_JD;

    // Galactic rotation period ~230 million years. 
    // For simulation, we scale up the motion to be visible.
    const angularVelocity = (2 * Math.PI) / (230e6 * 365.25); // radians per day
    const radius = 26000 * 3.154e7; // ~26k light-years in light-seconds

    const angle = diffDays * angularVelocity * 1e8; // Scale up 10^8 for visibility

    return [
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        Math.sin(angle * 0.5) * 1000 // Slight vertical oscillation
    ];
};

export const getPulsarFrequency = (period: number): number => {
    return 1 / period;
};

// Primary MSPs will be loaded from the JSON file now
