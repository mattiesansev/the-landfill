// SF Parks data with placeholder stats
// Stats can be updated with real data later

export const PARKS = {
  "golden-gate": {
    id: "golden-gate",
    name: "Golden Gate Park",
    seed: 1,
    image: "/park_pictures/ggp.jpg",
    stats: {
      acreage: 1017,
      amenities: ["Japanese Tea Garden", "Conservatory of Flowers", "De Young Museum", "California Academy of Sciences", "Bison Paddock"],
      yearEstablished: 1870,
      playgrounds: 7,
      sportsFields: 12,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "San Francisco's largest urban park, spanning over 1,000 acres from the Haight to the Pacific Ocean.",
    funFact: "Golden Gate Park is 20% larger than Central Park in New York City."
  },
  "dolores-park": {
    id: "dolores-park",
    name: "Dolores Park",
    seed: 2,
    image: "https://placehold.co/200x200/8ac4d4/white?text=DP",
    stats: {
      acreage: 16,
      amenities: ["Tennis Courts", "Basketball Courts", "Soccer Field", "Playground", "Off-leash Dog Area"],
      yearEstablished: 1905,
      playgrounds: 2,
      sportsFields: 3,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "A beloved Mission District park known for its sunny microclimate and stunning views of downtown SF.",
    funFact: "Dolores Park was a Jewish cemetery until 1894 and served as a refugee camp after the 1906 earthquake."
  },
  "presidio-tunnel-tops": {
    id: "presidio-tunnel-tops",
    name: "Presidio Tunnel Tops",
    seed: 3,
    image: "https://placehold.co/200x200/48bb78/white?text=PT",
    stats: {
      acreage: 14,
      amenities: ["Outpost Playground", "Campfire Circle", "Field Station", "Picnic Meadow", "Crissy Marsh Overlook"],
      yearEstablished: 2022,
      playgrounds: 1,
      sportsFields: 0,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "San Francisco's newest park, built atop the Presidio Parkway tunnels with stunning Golden Gate Bridge views.",
    funFact: "The Tunnel Tops took over 10 years to plan and build, opening in July 2022."
  },
  "alamo-square": {
    id: "alamo-square",
    name: "Alamo Square",
    seed: 4,
    image: "https://placehold.co/200x200/f59e0b/white?text=AS",
    stats: {
      acreage: 12.7,
      amenities: ["Dog Play Area", "Tennis Court", "Playground", "Picnic Areas"],
      yearEstablished: 1857,
      playgrounds: 1,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "Famous for its 'Painted Ladies' Victorian homes backdrop, this hilltop park offers panoramic city views.",
    funFact: "The Painted Ladies at Alamo Square appeared in over 70 movies and TV shows, including Full House."
  },
  "buena-vista-park": {
    id: "buena-vista-park",
    name: "Buena Vista Park",
    seed: 5,
    image: "https://placehold.co/200x200/6366f1/white?text=BV",
    stats: {
      acreage: 36.5,
      amenities: ["Hiking Trails", "Tennis Courts", "Off-leash Dog Area", "Historic Trees"],
      yearEstablished: 1867,
      playgrounds: 1,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "San Francisco's oldest official park, featuring steep trails through native coastal forest.",
    funFact: "Buena Vista is SF's oldest park and has trees over 150 years old."
  },
  "twin-peaks": {
    id: "twin-peaks",
    name: "Twin Peaks",
    seed: 6,
    image: "https://placehold.co/200x200/ec4899/white?text=TP",
    stats: {
      acreage: 64,
      amenities: ["Hiking Trails", "Observation Point", "Wildlife Viewing"],
      yearEstablished: 1922,
      playgrounds: 0,
      sportsFields: 0,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "Two prominent hills offering 360-degree panoramic views of the entire Bay Area.",
    funFact: "The Spanish called Twin Peaks 'Los Pechos de la Chola' (The Breasts of the Maiden)."
  },
  "lake-merced": {
    id: "lake-merced",
    name: "Lake Merced",
    seed: 7,
    image: "https://placehold.co/200x200/14b8a6/white?text=LM",
    stats: {
      acreage: 614,
      amenities: ["Fishing", "Boating", "Golf Course", "Running Trail", "Archery Range"],
      yearEstablished: 1950,
      playgrounds: 1,
      sportsFields: 2,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A freshwater lake park in southwest SF with a 4.5-mile loop trail and various recreational activities.",
    funFact: "Lake Merced was the site of California's last legal duel in 1859."
  },
  "corona-heights": {
    id: "corona-heights",
    name: "Corona Heights Park",
    seed: 8,
    image: "https://placehold.co/200x200/ef4444/white?text=CH",
    stats: {
      acreage: 15,
      amenities: ["Randall Museum", "Off-leash Dog Area", "Hiking Trails", "Rock Outcroppings"],
      yearEstablished: 1928,
      playgrounds: 0,
      sportsFields: 0,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A rocky hilltop park with exposed red chert rock and spectacular city views.",
    funFact: "The red rocks at Corona Heights are 200 million year old chert, formed from ancient sea creatures."
  },
  "the-panhandle": {
    id: "the-panhandle",
    name: "The Panhandle",
    seed: 9,
    image: "https://placehold.co/200x200/84cc16/white?text=PH",
    stats: {
      acreage: 29,
      amenities: ["Cycling Path", "Running Trail", "Playground", "Basketball Courts", "Historic Trees"],
      yearEstablished: 1870,
      playgrounds: 1,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "A narrow, eight-block linear park extending from Golden Gate Park into the Haight-Ashbury.",
    funFact: "The Panhandle hosted the first free concerts in the 1960s, launching the Summer of Love."
  },
  "marina-green": {
    id: "marina-green",
    name: "Marina Green",
    seed: 10,
    image: "https://placehold.co/200x200/0ea5e9/white?text=MG",
    stats: {
      acreage: 74,
      amenities: ["Kite Flying", "Jogging Path", "Yacht Harbor Views", "Fitness Course", "Great Meadow"],
      yearEstablished: 1915,
      playgrounds: 0,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A long, flat waterfront park perfect for kite flying with views of the Golden Gate Bridge.",
    funFact: "Marina Green was built on rubble from the 1906 earthquake and debris from the 1915 World's Fair."
  },
  "ocean-beach": {
    id: "ocean-beach",
    name: "Ocean Beach",
    seed: 11,
    image: "https://placehold.co/200x200/06b6d4/white?text=OB",
    stats: {
      acreage: 120,
      amenities: ["Beach Access", "Surfing", "Fire Pits", "Running Path", "Sunset Views"],
      yearEstablished: 1895,
      playgrounds: 0,
      sportsFields: 0,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A 3.5-mile beach along SF's western edge, popular for surfing, bonfires, and sunset watching.",
    funFact: "Ocean Beach has some of the most dangerous surf in California due to powerful rip currents."
  },
  "stern-grove": {
    id: "stern-grove",
    name: "Sigmund Stern Recreation Grove",
    seed: 12,
    image: "https://placehold.co/200x200/22c55e/white?text=SG",
    stats: {
      acreage: 33,
      amenities: ["Amphitheater", "Concert Meadow", "Dog Play Area", "Hiking Trails", "Croquet Lawn"],
      yearEstablished: 1931,
      playgrounds: 1,
      sportsFields: 0,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A eucalyptus-shaded canyon park famous for its free summer concert series since 1938.",
    funFact: "Stern Grove's free summer concerts are the oldest continuously-running free summer arts festival in the US."
  },
  "alta-plaza": {
    id: "alta-plaza",
    name: "Alta Plaza",
    seed: 13,
    image: "https://placehold.co/200x200/a855f7/white?text=AP",
    stats: {
      acreage: 11.8,
      amenities: ["Tennis Courts", "Playground", "Dog Play Area", "Terraced Steps"],
      yearEstablished: 1888,
      playgrounds: 1,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "An elegant Pacific Heights park with terraced lawns and views of the Bay and Marin Headlands.",
    funFact: "The south-side staircase appeared in the movie 'What's Up, Doc?' starring Barbra Streisand."
  },
  "balboa-park": {
    id: "balboa-park",
    name: "Balboa Park",
    seed: 14,
    image: "https://placehold.co/200x200/f97316/white?text=BP",
    stats: {
      acreage: 17,
      amenities: ["Pool", "Soccer Fields", "Baseball Diamond", "Playground", "Community Garden"],
      yearEstablished: 1927,
      playgrounds: 1,
      sportsFields: 4,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: true,
    },
    description: "A neighborhood park in the Outer Mission with extensive sports facilities and a public pool.",
    funFact: "Balboa Pool was where many SF Olympians trained, including some 1984 Olympic swimmers."
  },
  "duboce-park": {
    id: "duboce-park",
    name: "Duboce Park",
    seed: 15,
    image: "https://placehold.co/200x200/eab308/white?text=DB",
    stats: {
      acreage: 4.4,
      amenities: ["Off-leash Dog Area", "Playground", "Basketball Court", "N-Judah Mural"],
      yearEstablished: 1900,
      playgrounds: 1,
      sportsFields: 1,
      dogFriendly: true,
      hasRestrooms: true,
      hasParking: false,
    },
    description: "A popular Duboce Triangle park known for its active dog community and Muni train views.",
    funFact: "Duboce Park's dog area is one of the most social in SF, with an active neighborhood group."
  },
  "sunset-dunes": {
    id: "sunset-dunes",
    name: "Sunset Dunes",
    seed: 16,
    image: "https://placehold.co/200x200/78716c/white?text=SD",
    stats: {
      acreage: 8,
      amenities: ["Native Dune Habitat", "Walking Paths", "Wildlife Viewing", "Beach Access"],
      yearEstablished: 2020,
      playgrounds: 0,
      sportsFields: 0,
      dogFriendly: false,
      hasRestrooms: false,
      hasParking: true,
    },
    description: "A restored native dune ecosystem near Ocean Beach, showcasing SF's original landscape.",
    funFact: "Sunset Dunes is home to the endangered San Francisco lessingia flower found nowhere else on Earth."
  }
};

// Initial bracket seeding - matchups for round of 16
export const INITIAL_BRACKET = {
  round16: [
    { id: "r16-1", parkA: "golden-gate", parkB: "sunset-dunes", winner: null },
    { id: "r16-2", parkA: "corona-heights", parkB: "the-panhandle", winner: null },
    { id: "r16-3", parkA: "alamo-square", parkB: "alta-plaza", winner: null },
    { id: "r16-4", parkA: "buena-vista-park", parkB: "stern-grove", winner: null },
    { id: "r16-5", parkA: "presidio-tunnel-tops", parkB: "balboa-park", winner: null },
    { id: "r16-6", parkA: "twin-peaks", parkB: "marina-green", winner: null },
    { id: "r16-7", parkA: "dolores-park", parkB: "duboce-park", winner: null },
    { id: "r16-8", parkA: "lake-merced", parkB: "ocean-beach", winner: null },
  ],
  quarterfinals: [
    { id: "qf-1", parkA: null, parkB: null, winner: null },
    { id: "qf-2", parkA: null, parkB: null, winner: null },
    { id: "qf-3", parkA: null, parkB: null, winner: null },
    { id: "qf-4", parkA: null, parkB: null, winner: null },
  ],
  semifinals: [
    { id: "sf-1", parkA: null, parkB: null, winner: null },
    { id: "sf-2", parkA: null, parkB: null, winner: null },
  ],
  finals: { id: "f-1", parkA: null, parkB: null, winner: null },
  champion: null,
};

// Mapping for bracket progression - which matchup feeds into which next round slot
export const BRACKET_PROGRESSION = {
  "r16-1": { nextRound: "qf-1", slot: "parkA" },
  "r16-2": { nextRound: "qf-1", slot: "parkB" },
  "r16-3": { nextRound: "qf-2", slot: "parkA" },
  "r16-4": { nextRound: "qf-2", slot: "parkB" },
  "r16-5": { nextRound: "qf-3", slot: "parkA" },
  "r16-6": { nextRound: "qf-3", slot: "parkB" },
  "r16-7": { nextRound: "qf-4", slot: "parkA" },
  "r16-8": { nextRound: "qf-4", slot: "parkB" },
  "qf-1": { nextRound: "sf-1", slot: "parkA" },
  "qf-2": { nextRound: "sf-1", slot: "parkB" },
  "qf-3": { nextRound: "sf-2", slot: "parkA" },
  "qf-4": { nextRound: "sf-2", slot: "parkB" },
  "sf-1": { nextRound: "f-1", slot: "parkA" },
  "sf-2": { nextRound: "f-1", slot: "parkB" },
};

// Helper to find a matchup by ID across all rounds
export function findMatchup(matchupId, bracket) {
  if (matchupId === "f-1") return bracket.finals;

  for (const roundKey of ["round16", "quarterfinals", "semifinals"]) {
    const found = bracket[roundKey].find((m) => m.id === matchupId);
    if (found) return found;
  }
  return null;
}

// Helper to get round name from matchup ID
export function getRoundName(matchupId) {
  if (matchupId.startsWith("r16")) return "Round of 16";
  if (matchupId.startsWith("qf")) return "Quarterfinals";
  if (matchupId.startsWith("sf")) return "Semifinals";
  if (matchupId === "f-1") return "Finals";
  return "";
}
