import constellationLines from './data/constellations.lines.json';
import starsData from './data/stars.6.json';
import starNames from './data/starnames.json';
import milkyWay from './data/mw.json';

// Types
export interface StarProperties {
    name?: string;
    magnitude: number;
    constellation?: string; // 3-letter code or full name
    distance?: string;
    spectralType?: string;
    designation?: string;
    description?: string;
    bv?: number; // Color index
    hipId?: number;
}

export interface StarFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number]; // [RA (degrees), Dec (degrees)]
    };
    properties: StarProperties;
}

export interface ConstellationLineFeature {
    type: 'Feature';
    id?: string;
    geometry: {
        type: 'MultiLineString';
        coordinates: number[][][];
    };
    properties: {
        name: string;
        meaning?: string;
        description?: string;
        rank?: number | string;
    };
}

// Helper to convert BV color index to spectral class/color description
const getSpectralType = (bv: number): string => {
    if (bv < 0) return 'Blue (O/B)';
    if (bv < 0.5) return 'Blue-White (A)';
    if (bv < 0.6) return 'White (F)';
    if (bv < 0.8) return 'Yellow-White (G)';
    if (bv < 1.4) return 'Orange (K)';
    return 'Red (M)';
};

// Map of 3-letter IAU codes to full names and metadata
const CONSTELLATION_METADATA: Record<string, { name: string; meaning?: string; description?: string }> = {
    And: { name: 'Andromeda', meaning: 'The Chained Maiden', description: 'Princess of Ethiopia, chained to a rock as a sacrifice (Greek mythology).' },
    Ant: { name: 'Antlia', meaning: 'The Air Pump' },
    Aps: { name: 'Apus', meaning: 'The Bird of Paradise' },
    Aqr: { name: 'Aquarius', meaning: 'The Water Bearer', description: 'A Zodiac constellation representing Ganymede pouring nectar.' },
    Aql: { name: 'Aquila', meaning: 'The Eagle', description: 'The eagle that carried Zeus\'s thunderbolts.' },
    Ara: { name: 'Ara', meaning: 'The Altar' },
    Ari: { name: 'Aries', meaning: 'The Ram', description: 'The first sign of the Zodiac, representing the Golden Fleece.' },
    Aur: { name: 'Auriga', meaning: 'The Charioteer' },
    Boo: { name: 'Boötes', meaning: 'The Herdsman' },
    Cae: { name: 'Caelum', meaning: 'The Chisel' },
    Cam: { name: 'Camelopardalis', meaning: 'The Giraffe' },
    Cnc: { name: 'Cancer', meaning: 'The Crab', description: 'A faint Zodiac constellation associated with Hercules.' },
    CVn: { name: 'Canes Venatici', meaning: 'The Hunting Dogs' },
    CMa: { name: 'Canis Major', meaning: 'The Great Dog', description: 'Contains Sirius, the brightest star in the night sky.' },
    CMi: { name: 'Canis Minor', meaning: 'The Little Dog' },
    Cap: { name: 'Capricornus', meaning: 'The Sea Goat', description: 'A Zodiac constellation, half goat, half fish.' },
    Car: { name: 'Carina', meaning: 'The Keel' },
    Cas: { name: 'Cassiopeia', meaning: 'The Queen', description: 'Distinctive "W" shape, representing the vain queen.' },
    Cen: { name: 'Centaurus', meaning: 'The Centaur' },
    Cep: { name: 'Cepheus', meaning: 'The King' },
    Cet: { name: 'Cetus', meaning: 'The Sea Monster' },
    Cha: { name: 'Chamaeleon', meaning: 'The Chameleon' },
    Cir: { name: 'Circinus', meaning: 'The Compass' },
    Col: { name: 'Columba', meaning: 'The Dove' },
    Com: { name: 'Coma Berenices', meaning: 'Berenice\'s Hair' },
    CrA: { name: 'Corona Australis', meaning: 'The Southern Crown' },
    CrB: { name: 'Corona Borealis', meaning: 'The Northern Crown' },
    Crv: { name: 'Corvus', meaning: 'The Crow' },
    Crt: { name: 'Crater', meaning: 'The Cup' },
    Cru: { name: 'Crux', meaning: 'The Southern Cross', description: 'The smallest constellation, vital for southern navigation.' },
    Cyg: { name: 'Cygnus', meaning: 'The Swan', description: 'Contains the Northern Cross asterism.' },
    Del: { name: 'Delphinus', meaning: 'The Dolphin' },
    Dor: { name: 'Dorado', meaning: 'The Swordfish' },
    Dra: { name: 'Draco', meaning: 'The Dragon' },
    Equ: { name: 'Equuleus', meaning: 'The Little Horse' },
    Eri: { name: 'Eridanus', meaning: 'The River' },
    For: { name: 'Fornax', meaning: 'The Furnace' },
    Gem: { name: 'Gemini', meaning: 'The Twins', description: 'Contains Castor and Pollux.' },
    Gru: { name: 'Grus', meaning: 'The Crane' },
    Her: { name: 'Hercules', meaning: 'The Hero' },
    Hor: { name: 'Horologium', meaning: 'The Clock' },
    Hya: { name: 'Hydra', meaning: 'The Female Water Snake', description: 'The largest constellation.' },
    Hyi: { name: 'Hydrus', meaning: 'The Male Water Snake' },
    Ind: { name: 'Indus', meaning: 'The Indian' },
    Lac: { name: 'Lacerta', meaning: 'The Lizard' },
    Leo: { name: 'Leo', meaning: 'The Lion', description: 'Represents the Nemean Lion slain by Hercules.' },
    LMi: { name: 'Leo Minor', meaning: 'The Little Lion' },
    Lep: { name: 'Lepus', meaning: 'The Hare' },
    Lib: { name: 'Libra', meaning: 'The Scales', description: 'The only inanimate object in the Zodiac.' },
    Lup: { name: 'Lupus', meaning: 'The Wolf' },
    Lyn: { name: 'Lynx', meaning: 'The Lynx' },
    Lyr: { name: 'Lyra', meaning: 'The Lyre', description: 'Musical instrument of Orpheus, contains Vega.' },
    Men: { name: 'Mensa', meaning: 'The Table Mountain' },
    Mic: { name: 'Microscopium', meaning: 'The Microscope' },
    Mon: { name: 'Monoceros', meaning: 'The Unicorn' },
    Mus: { name: 'Musca', meaning: 'The Fly' },
    Nor: { name: 'Norma', meaning: 'The Carpenter\'s Level' },
    Oct: { name: 'Octans', meaning: 'The Octant' },
    Oph: { name: 'Ophiuchus', meaning: 'The Serpent Bearer', description: 'The 13th sign of the Zodiac (astronomically).' },
    Ori: { name: 'Orion', meaning: 'The Hunter', description: 'Dominates the winter sky with his belt and sword.' },
    Pav: { name: 'Pavo', meaning: 'The Peacock' },
    Peg: { name: 'Pegasus', meaning: 'The Winged Horse', description: 'Famous for the Great Square.' },
    Per: { name: 'Perseus', meaning: 'The Hero', description: 'Slayer of Medusa, rescuer of Andromeda.' },
    Phe: { name: 'Phoenix', meaning: 'The Phoenix' },
    Pic: { name: 'Pictor', meaning: 'The Painter\'s Easel' },
    Psc: { name: 'Pisces', meaning: 'The Fishes', description: 'Two fish tied together by a cord.' },
    PsA: { name: 'Piscis Austrinus', meaning: 'The Southern Fish' },
    Pup: { name: 'Puppis', meaning: 'The Stern' },
    Pyx: { name: 'Pyxis', meaning: 'The Mariner\'s Compass' },
    Ret: { name: 'Reticulum', meaning: 'The Reticle' },
    Sge: { name: 'Sagitta', meaning: 'The Arrow' },
    Sgr: { name: 'Sagittarius', meaning: 'The Archer', description: 'Contains the center of the Milky Way.' },
    Sco: { name: 'Scorpius', meaning: 'The Scorpion', description: 'One of the oldest constellations.' },
    Scl: { name: 'Sculptor', meaning: 'The Sculptor' },
    Sct: { name: 'Scutum', meaning: 'The Shield' },
    Ser: { name: 'Serpens', meaning: 'The Serpent' },
    Sex: { name: 'Sextans', meaning: 'The Sextant' },
    Tau: { name: 'Taurus', meaning: 'The Bull', description: 'Contains the Pleiades and Hyades clusters.' },
    Tel: { name: 'Telescopium', meaning: 'The Telescope' },
    Tri: { name: 'Triangulum', meaning: 'The Triangle' },
    TrA: { name: 'Triangulum Australe', meaning: 'The Southern Triangle' },
    Tuc: { name: 'Tucana', meaning: 'The Toucan' },
    UMa: { name: 'Ursa Major', meaning: 'The Great Bear', description: 'Contains the Big Dipper.' },
    UMi: { name: 'Ursa Minor', meaning: 'The Little Bear', description: 'Home of Polaris, the North Star.' },
    Vel: { name: 'Vela', meaning: 'The Sails' },
    Vir: { name: 'Virgo', meaning: 'The Virgin', description: 'Associated with harvest and fertility.' },
    Vol: { name: 'Volans', meaning: 'The Flying Fish' },
    Vul: { name: 'Vulpecula', meaning: 'The Fox' }
};


export const getBrightStars = (): StarFeature[] => {
    try {
        // 1. Convert raw features
        // Safety check: handle if it's a FeatureCollection (standard) or Array (rare)
        const data: any = starsData;
        if (!data) {
            console.error("Celestial Data Error: starsData is missing.");
            return [];
        }

        const rawFeatures = (Array.isArray(data) ? data : data.features) as Array<{
            id: number;
            properties: { mag: number; bv?: number };
            geometry: { coordinates: [number, number] };
        }>;

        if (!rawFeatures) {
            console.error("Celestial Data Error: No features found in starsData.");
            return [];
        }

        // 2. Map and enrich
        const enrichedStars = rawFeatures
            .map(f => {
                const idStr = f.id.toString();
                const nameData = (starNames as any)[idStr];
                const coords = f.geometry.coordinates;
                const isBright = f.properties.mag < 3.5;
                const hasName = nameData && nameData.name;

                if (!isBright && !hasName) return null;

                return {
                    type: 'Feature' as const,
                    geometry: {
                        type: 'Point' as const,
                        coordinates: coords
                    },
                    properties: {
                        name: (nameData && nameData.name) ? nameData.name : undefined,
                        magnitude: f.properties.mag,
                        constellation: (nameData && nameData.c) ? CONSTELLATION_METADATA[nameData.c]?.name : undefined,
                        spectralType: getSpectralType(f.properties.bv || 0),
                        designation: (nameData && nameData.desig) ? nameData.desig : undefined,
                        hipId: f.id,
                        description: (nameData && nameData.name) ?
                            `A magnitude ${f.properties.mag} star in ${CONSTELLATION_METADATA[nameData?.c]?.name || 'the sky'}.`
                            : undefined
                    }
                } as StarFeature;
            })
            .filter((s): s is StarFeature => s !== null);

        // 3. Sort by brightness
        enrichedStars.sort((a, b) => a.properties.magnitude - b.properties.magnitude);
        return enrichedStars;

    } catch (err) {
        console.error("Celestial Data Crash (Stars):", err);
        return [];
    }
};

export const getConstellationLines = (): ConstellationLineFeature[] => {
    try {
        const data: any = constellationLines;
        if (!data) return [];

        const rawLines = (Array.isArray(data) ? data : data.features) as any[];
        if (!rawLines) return [];

        return rawLines.map(f => {
            const id = f.id;
            const meta = CONSTELLATION_METADATA[id] || { name: id, meaning: undefined, description: undefined };
            return {
                type: 'Feature',
                id: id,
                geometry: f.geometry,
                properties: {
                    name: meta.name,
                    meaning: meta.meaning,
                    description: meta.description,
                    rank: f.properties.rank
                }
            };
        });
    } catch (err) {
        console.error("Celestial Data Crash (Constellations):", err);
        return [];
    }
};

export const getMilkyWayFeature = () => {
    return milkyWay as any; // Returns FeatureCollection
};

// Kept for compatibility / utils
export const raToDeg = (h: number, m: number, s: number = 0) => (h + m / 60 + s / 3600) * 15;
export const decToDeg = (d: number, m: number, s: number = 0) => (d >= 0 ? 1 : -1) * (Math.abs(d) + m / 60 + s / 3600);
