// SF Parks data with placeholder stats
// Stats can be updated with real data later

export const PARKS = {
  "alamo-square": {
    id: "alamo-square",
    name: "Alamo Square",
    seed: 1,
    image: "/park_pictures/alamo_square.png",
    stats: {
      acreage: 13,
      yearEstablished: 1856,
      neighborhood: "Alamo Square",
    },
    description: "Embedded in the historic Alamo Square neighborhood, this park provides great (some might even say \"iconic\") views of San Francisco. Perhaps the most photogenic park, it is no wonder that tourists and film/TV crews alike flock to the park to capture that San Francisco-style (hello, Full House!). But while the views might knock you over, so could the wind. Sitting pretty up on Alamo Hill both provides great views… and makes the park especially prone to a stiff breeze. Can Alamo Square breeze through the competition, or will this shortcoming be its downfall?",
  },
  "golden-gate": {
    id: "golden-gate",
    name: "Golden Gate Park",
    seed: 2,
    image: "/park_pictures/ggp.jpg",
    stats: {
      acreage: 1017,
      yearEstablished: 1870,
      neighborhood: "Sunset/Richmond",
    },
    description: "Stretching about half the length of the city, Golden Gate Park is a clear heavyweight when it comes to city parks. Larger than NYC's Central Park, Golden Gate is famous, not just for its size, but for its variety of attractions. From the Conservatory of Flowers, California Academy of Sciences, DeYoung art museum, Japanese Tea Garden, Botanical Gardens, JFK promenade, and famous annual music festivals, including Outside Lands, Golden Gate Park has shown itself to be a fierce competitor. But is the comparison to other parks fair? Should GGP be in a league of its own or even be judged more harshly considering the advantage of its size? We'll see where voters land on this contentious issue…",
  },
  "mission-dolores": {
    id: "mission-dolores",
    name: "Mission Dolores",
    seed: 3,
    image: "/park_pictures/dolores_park.jpg",
    stats: {
      acreage: 16,
      yearEstablished: 1905,
      neighborhood: "Mission",
    },
    description: "Favored among sunshine-lovers, Mission Dolores is the sunniest park in San Francisco. While the park is most popularly known for providing respite from the fog, its uses have been incredibly versatile over its long history. The land was once a freshwater lake, a Jewish cemetery, and a refugee camp following the 1906 earthquake. Its versatility is impressive, but its reputation for drug use is also well-known. With this park's propensity for drug use, does Mission Dolores have the fortitude to push through the competition? Experts argue this reputation might work in the park's favor if voters enjoy a fat blunt on a Sunday afternoon.",
  },
  "corona-heights": {
    id: "corona-heights",
    name: "Corona Heights Park",
    seed: 4,
    image: "/park_pictures/corona_heights.jpg",
    stats: {
      acreage: 15,
      yearEstablished: 1941,
      neighborhood: "Castro/Corona Heights",
    },
    description: "Corona Heights may be a beautiful park, but its humble origins make this young upstart all the more impressive. Originally a quarry and brick factory, Corona Heights rose from the rubble to become what it is today. Residents taunted Corona Heights in its youth, naming it \"Rocky Hill\" and \"Rock Hill\", tossing rocks at it jeeringly (we assume). But this diminished existence did not last forever… in 1928 the Recreation and Parks department proposed the area should be for recreation, purchasing the park in 1941. The park is now known for its views, animal and plant life, and popular Randall Museum.",
  },
  "the-panhandle": {
    id: "the-panhandle",
    name: "The Panhandle",
    seed: 5,
    image: "/park_pictures/panhandle.jpg",
    stats: {
      acreage: 24,
      yearEstablished: 1870,
      neighborhood: "Nopa/Haight-Ashbury",
    },
    description: "Technically an extension of Golden Gate Park, the Panhandle has developed a unique reputation among San Franciscans as a truly embedded city park, providing easily accessible green space and pedestrian walkways to the Haight-Asbury and Nopa neighborhoods. Its proximity to the Haight-Ashbury neighborhood has also made the Panhandle a prime spot for protests in the late 20th century, including protests that protected the park from becoming a freeway, even converting some existing freeway on the Panhandle into meadows — a proto-Sunset Dunes, perhaps? Today, the park is popular among runners, bikers, and hippies, alike. Can the Panhandle outpace its reputation as a little sibling of Golden Gate Park, or will its fervent fanbase carry it through the competition?",
  },
  "buena-vista-park": {
    id: "buena-vista-park",
    name: "Buena Vista Park",
    seed: 6,
    image: "/park_pictures/buena_vista.jpg",
    stats: {
      acreage: 36,
      yearEstablished: 1867,
      neighborhood: "Haight-Ashbury/Buena Vista",
    },
    description: "Named after the original \"Buena Vista\" city that preceded San Francisco, as well as its good views, patrons of the park historically have seen more than they might have expected while visiting this park. Starting around the 1967 \"Summer of Love\", encampments filled the park and it developed a reputation for casual public sex. Since then, two neighborhood associations have worked to revitalize the park, including garbage cleanup, improved lighting, and landscape redesigns. Now considered more \"family-friendly\" (at least during the day), Buena Vista is beloved by its neighboring residents, but could its scandalous history come back to bite it?",
  },
  "twin-peaks": {
    id: "twin-peaks",
    name: "Twin Peaks",
    seed: 7,
    image: "/park_pictures/twin_peaks.jpg",
    stats: {
      acreage: 64,
      neighborhood: "Twin Peaks",
    },
    description: "Known for its views, Twin Peaks boasts the second and third highest points in the city, beaten by Mount Davidson by only three feet (so close!). While the honor of highest point may have been snatched from them at the last minute, Twin Peaks' position in the city makes it a strong contender for best view, with visibility stretching all the way to the East Bay (on a good day). It's also known as a team player, as its peaks block the east side of SF from fog and wind. Nice assist! Without Mount Davidson to compete with, can Twin Peak come up from behind and sweep the competition? Or will the peaks be second (and third) best once again?",
  },
  "lake-merced": {
    id: "lake-merced",
    name: "Lake Merced",
    seed: 8,
    image: "/park_pictures/lake_merced.jpg",
    stats: {
      acreage: 614,
      yearEstablished: 1950,
      neighborhood: "Lakeshore/Park Merced",
    },
    description: "This park is home to the largest lake in San Francisco, but it perhaps should also be known for its trigger-happy history. Lake Merced was the site of \"the last notable American duel\" between US Senator David Broderick and ex-Chief Justice David Terry, ending in Broderick's death in 1859. Yikes! The park carried on this legacy of being the preeminent location to wield firearms by hosting the Pacific Rod and Gun Club until 2015. Nowadays, visitors might appreciate the reverent tranquility of the freshwater lake, at least until a crew team pulls through. It is popular among fishers, rowboaters, crew clubs, paddle boarders, and people that just like looking at water. Who doesn't love a lake?",
  },
  "duboce-park": {
    id: "duboce-park",
    name: "Duboce Park",
    seed: 9,
    image: "/park_pictures/duboce_park.jpg",
    stats: {
      acreage: 4,
      yearEstablished: 1900,
      neighborhood: "Duboce Triangle/Lower Haight",
    },
    description: "While you may see dogs at every San Francisco Park, Duboce may be best known for its pet visitors. The smallest park on this bracket, Duboce packs a punch with its great views, easy access to the N-train, and, of course, countless dogs. But Duboce has faced many challenges in its path to becoming the unofficial dog park of San Francisco. Dog walkers faced criticism from residents for letting their dogs run free throughout the park. The conflict was resolved when the city established a Multi-Use Zone that allowed for off-leash play. Allegedly, residents complained that this off-leash zone was the majority of the park. That's 1-0 for the dogs! But will this pup of a park be able to fetch a win when facing down its much bigger competitors? Duboce will have to rely on its charm and paw-sitive attitude to pull out a win.",
  },
  "alta-plaza": {
    id: "alta-plaza",
    name: "Alta Plaza",
    seed: 10,
    image: "/park_pictures/alta_plaza.jpg",
    stats: {
      acreage: 12,
      yearEstablished: 1888,
      neighborhood: "Pacific Heights",
    },
    description: "Walking up the grand, and seemingly neverending, stairs to the top of Alta Plaza, it's hard not to feel like Rocky Balboa. Once a quarry, later a refuge during the 1906 earthquake, and now a bustling park for residents and dogs, Alta Plaza has lived many lives. The views from the top are hard to beat, with the shining Bay on full display from the north end, and a panoramic birds-eye view of the city on the south. The views will take your breath away, but will they be enough to make you forget how out of breath you were after making the trek to get there?",
  },
  "washington-square": {
    id: "washington-square",
    name: "Washington Square Park",
    seed: 11,
    image: "/park_pictures/Washington.jpg",
    stats: {
      acreage: 2.8,
      yearEstablished: 1847,
      neighborhood: "North Beach",
    },
    description: "A sweet oasis in North Beach surrounded by plenty of pasteries and pasta shops for you to find in San Francisco's \"Little Italy\". Come visit for public movie showings, live music, and local artist cafts at events hosted in and around this space! It seems to be one of the places to be for late-night eats after a night out - we'll see if that's enough to win over voters to make it in this competition! ",
  },
  "marina-green": {
    id: "marina-green",
    name: "Marina Green",
    seed: 12,
    image: "/park_pictures/marina_green.jpg",
    stats: {
      acreage: 74,
      yearEstablished: 1915,
      neighborhood: "Marina",
    },
    description: "While this park is primarily a promenade and large lawn with views of the water, it has a reputation that may make it more favorable to some - its sex appeal. A favorite among 24-year-old ex-sorority girls, one resident confidently proclaimed that the Marina Green is the \"sluttiest\" park on the west coast. Not only is the promenade a great place to walk a dog and show off your meticulously-planned workout outfit, but it is also notorious for being a place to find a date. But can sex appeal alone carry the Marina Green? Perhaps this park has more to show of itself… innuendo intended.",
  },
  "stern-grove": {
    id: "stern-grove",
    name: "Sigmund Stern Recreation Grove",
    seed: 13,
    image: "/park_pictures/stern_grove.jpg",
    stats: {
      acreage: 33,
      yearEstablished: 1931,
      neighborhood: "Parkside District",
    },
    description: "Stern Grove is home to the city's longest-running free concert series. The founder, Rosalie M. Stern noticed the park's natural acoustics and established it as a public performance venue. While it's a niche pick, Stern Grove's natural advantages and historical performance venue make this park a favorite among music lovers.",
  },
  "sunset-dunes": {
    id: "sunset-dunes",
    name: "Sunset Dunes",
    seed: 14,
    image: "/park_pictures/sunset_dunes.jpg",
    stats: {
      acreage: 50,
      yearEstablished: 2025,
      neighborhood: "Outer Sunset",
    },
    description: "This newcomer may be a controversial pick for some, but its charm has won many over many. Sunset Dunes has been the subject of much debate after being converted from the Great Highway, a move that cost Sunset Supervisor Joel Engardio his seat in an upset recall election. While the park has many critics among commuters, others have grown to appreciate increased pedestrian and biker access, public art, and sweeping views of Ocean Beach. With less than a year under its belt and many San Franciscans cheering for its downfall, will Sunset Dunes be able to stand up to the heat?",
  },
  "presidio": {
    id: "presidio",
    name: "Presidio",
    seed: 15,
    image: "/park_pictures/presidio.jpg",
    stats: {
      acreage: 1491,
      yearEstablished: 1994,
      neighborhood: "Presidio",
    },
    description: "A veteran of the San Francisco parks, the Presidio served as a U.S. army post before its conversion to a national park in 1994. Originally a fortress for Spain, Mexico, and finally the U.S., the Presidio's previous military presence can still be seen in the converted military barracks, point fort (now a museum), and the National Cemetery (one of the few remaining cemeteries in San Francisco). While the Presidio was once appreciated for its tactical advantages, it is now appreciated for its lush nature, views of the Golden Gate Bridge, and San Francisco's premier nude beach (Baker Beach).",
  },
  "john-mclaren": {
    id: "john-mclaren",
    name: "John McLaren",
    seed: 16,
    image: "/park_pictures/john_mclaren.jpg",
    stats: {
      acreage: 313,
      yearEstablished: 1927,
      neighborhood: "Visitacion Valley",
    },
    description: "On mile 2.5 of the famous crosstown trial, the slope to the top of John McLaren park is the first of many hills that crosstown trekkers will endure. Although it's the first, it is definitely not one to be forgotten. The views of downtown San Francisco, the Easy Bay and San Bruno Mountain from the top are expansive. John McLaren is the second largest park in San Francisco, and boasts impressive amenities including six playgrounds, five picnic areas, an amphitheater, baseball diamonds, and walking trails. Despite its long list of activities, many San Franciscans haven't visited this john-of-all-trades. Will its impressive resume carry it to the top, or will its limited name recognition leave it in the rubble?",
  },
};

// Initial bracket seeding - matchups for round of 16
export const INITIAL_BRACKET = {
  round16: [
    { id: "r16-1", parkA: "golden-gate", parkB: "sunset-dunes", winner: null },
    { id: "r16-2", parkA: "corona-heights", parkB: "the-panhandle", winner: null },
    { id: "r16-3", parkA: "alamo-square", parkB: "alta-plaza", winner: null },
    { id: "r16-4", parkA: "buena-vista-park", parkB: "stern-grove", winner: null },
    { id: "r16-5", parkA: "presidio", parkB: "washington-square", winner: null },
    { id: "r16-6", parkA: "twin-peaks", parkB: "marina-green", winner: null },
    { id: "r16-7", parkA: "mission-dolores", parkB: "duboce-park", winner: null },
    { id: "r16-8", parkA: "lake-merced", parkB: "john-mclaren", winner: null },
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
