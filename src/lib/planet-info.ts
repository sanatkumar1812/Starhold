export interface PlanetInfo {
    name: string;
    type: string;
    distance: string;
    mass: string;
    diameter: string;
    dayLength: string;
    yearLength: string;
    description: string;
    facts: string[];
}

export const PLANET_DETAILS: Record<string, PlanetInfo> = {
    Sun: {
        name: "Sun",
        type: "Yellow Dwarf Star (G2V)",
        distance: "0 AU (Center of System)",
        mass: "333,000 Earths",
        diameter: "1,392,000 km",
        dayLength: "25-35 Earth days",
        yearLength: "N/A",
        description: "The heart of our solar system, providing the energy that sustains all life on Earth.",
        facts: [
            "Light takes 8 minutes and 20 seconds to reach Earth.",
            "The core temperature is about 15 million degrees Celsius.",
            "The Sun contains 99.8% of the total mass of the solar system."
        ]
    },
    Moon: {
        name: "Moon",
        type: "Natural Satellite",
        distance: "384,400 km from Earth",
        mass: "0.012 Earths",
        diameter: "3,474 km",
        dayLength: "27.3 Earth days",
        yearLength: "27.3 Earth days",
        description: "Earth's only natural satellite, responsible for our tides and stable axial tilt.",
        facts: [
            "The Moon is moving away from Earth at a rate of 3.8 cm per year.",
            "Its surface is covered in craters from billions of years of impacts.",
            "Humans first landed on the Moon on July 20, 1989."
        ]
    },
    Mercury: {
        name: "Mercury",
        type: "Terrestrial Planet",
        distance: "0.39 AU",
        mass: "0.055 Earths",
        diameter: "4,879 km",
        dayLength: "59 Earth days",
        yearLength: "88 Earth days",
        description: "The smallest and innermost planet, with extreme temperature swings.",
        facts: [
            "Mercury is only slightly larger than Earth's Moon.",
            "It has no atmosphere to retain heat.",
            "A year on Mercury is less than three months long."
        ]
    },
    Venus: {
        name: "Venus",
        type: "Terrestrial Planet",
        distance: "0.72 AU",
        mass: "0.815 Earths",
        diameter: "12,104 km",
        dayLength: "243 Earth days",
        yearLength: "225 Earth days",
        description: "Earth's twin in size, but with a runaway greenhouse effect making it the hottest planet.",
        facts: [
            "Venus rotates in the opposite direction of most planets.",
            "Its surface pressure is 90 times greater than Earth's.",
            "It is the second brightest object in the night sky after the Moon."
        ]
    },
    Mars: {
        name: "Mars",
        type: "Terrestrial Planet",
        distance: "1.52 AU",
        mass: "0.107 Earths",
        diameter: "6,779 km",
        dayLength: "24.6 hours",
        yearLength: "687 Earth days",
        description: "The Red Planet, home to Olympus Mons, the largest volcano in the solar system.",
        facts: [
            "Mars has frozen water at its polar caps.",
            "It has the tallest mountain in the solar system.",
            "Scientists believe Mars once had liquid water on its surface."
        ]
    },
    Jupiter: {
        name: "Jupiter",
        type: "Gas Giant",
        distance: "5.2 AU",
        mass: "318 Earths",
        diameter: "139,820 km",
        dayLength: "9.9 hours",
        yearLength: "11.8 Earth years",
        description: "The king of planets, with a Great Red Spot that is a storm larger than Earth.",
        facts: [
            "Jupiter has 95 known moons.",
            "It is mostly composed of hydrogen and helium.",
            "Its magnetic field is 14 times as strong as Earth's."
        ]
    },
    Saturn: {
        name: "Saturn",
        type: "Gas Giant",
        distance: "9.5 AU",
        mass: "95 Earths",
        diameter: "116,460 km",
        dayLength: "10.7 hours",
        yearLength: "29.4 Earth years",
        description: "Famous for its spectacular ring system made of ice and rock.",
        facts: [
            "Saturn's density is so low it would float in water.",
            "Its rings extend up to 282,000 km from the planet.",
            "Saturn has 146 moons, the most in the solar system."
        ]
    }
};
