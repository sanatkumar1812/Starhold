export const CONSTELLATION_ART: Record<string, string> = {
    'Orion': '/constellations/orion.png',
    'Leo': '/constellations/leo.png',
    'Scorpius': '/constellations/scorpius.png',
    'Ursa Major': '/constellations/ursa_major.png',
    'Cygnus': '/constellations/cygnus.png',
    'Pegasus': '/constellations/pegasus.png',
    // Famous Zodiacs often requested
    'Taurus': '/constellations/taurus.png',
    'Gemini': '/constellations/gemini.png',
    'Cancer': '/constellations/cancer.png',
    'Virgo': '/constellations/virgo.png',
    'Libra': '/constellations/libra.png',
    'Sagittarius': '/constellations/sagittarius.png',
    'Capricornus': '/constellations/capricorn.png',
    'Aquarius': '/constellations/aquarius.png',
    'Pisces': '/constellations/pisces.png',
    'Aries': '/constellations/aries.png',
};

export const getConstellationArt = (name: string): string | null => {
    // Try exact match
    if (CONSTELLATION_ART[name]) return CONSTELLATION_ART[name];

    // Try case-insensitive search
    const key = Object.keys(CONSTELLATION_ART).find(
        k => k.toLowerCase() === name.toLowerCase()
    );

    return key ? CONSTELLATION_ART[key] : null;
};
