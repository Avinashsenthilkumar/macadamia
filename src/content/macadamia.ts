/**
 * Long-form educational content for the Why Macadamia and Cultivation Guide pages.
 *
 * All figures are GENERAL reference values drawn from the sources listed in `references`.
 * They are not locally validated recommendations for any specific district in India.
 */

export type GuideSection = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { caption: string; head: string[]; rows: string[][] };
  callout?: string;
};

export const cultivationDisclaimer =
  "Macadamia cultivation suitability depends on local climate, soil, water availability, planting material and orchard management. Consult an agricultural expert and evaluate your land before establishing a commercial plantation.";

export const references = [
  {
    label: "World Agroforestry (ICRAF) — Agroforestree Database: Macadamia integrifolia",
    url: "https://apps.worldagroforestry.org/treedb2/speciesprofile.php?Spid=1091",
  },
  {
    label: "USDA Agriculture Handbook 66 — Macadamia (storage and post-harvest)",
    url: "https://webarchive.library.unt.edu/eot2008/20090305020046/http:/www.ba.ars.usda.gov/hb66/159macadamia.pdf",
  },
  {
    label: "Howell et al. (2018), Acta Horticulturae 1205 — Nut set under different pollination methods",
    url: "https://doi.org/10.17660/ActaHortic.2018.1205.76",
  },
  {
    label: "Herbert, Walton & Wallace (2019), Scientia Horticulturae 251 — Pollen-parent effects on yield and nut size",
    url: "https://doi.org/10.1016/j.scienta.2019.03.006",
  },
  {
    label: "Hort Innovation pollination research, reported in Good Fruit & Vegetables",
    url: "https://www.goodfruitandvegetables.com.au/story/6941424/cross-pollination-drives-macadamias-productivity/",
  },
];

export const quickFacts = [
  { label: "Origin", value: "Subtropical rainforest fringes of eastern Australia" },
  { label: "Family", value: "Proteaceae" },
  { label: "Edible species", value: "M. integrifolia, M. tetraphylla and their hybrids" },
  { label: "Growth habit", value: "Evergreen tree with brittle wood — needs wind shelter" },
  { label: "Soil pH (general)", value: "≈ 5.0 – 6.5" },
  { label: "Climate", value: "Mild, frost-free, subtropical" },
];

export const cultivationHighlights = [
  { icon: "sun", title: "Climate", text: "Mild, frost-free subtropical conditions with shelter from strong winds." },
  { icon: "mountain", title: "Soil", text: "Deep, well-drained loams; avoid heavy clay and waterlogged sites." },
  { icon: "droplets", title: "Irrigation", text: "Consistent moisture for young trees, flowering and nut fill — never waterlogging." },
  { icon: "shovel", title: "Planting", text: "Plant at nursery depth, water in well and mulch around the base." },
  { icon: "ruler", title: "Spacing", text: "Depends on variety vigour and pruning — commonly 4–6 m within rows." },
  { icon: "flower", title: "Pollination", text: "Cross-pollination between compatible varieties improves nut set." },
  { icon: "scissors", title: "Maintenance", text: "Formative pruning, soil-test-led nutrition and regular scouting." },
] as const;

export const guideSections: GuideSection[] = [
  {
    id: "climate",
    title: "Climate requirements",
    icon: "sun",
    summary: "A mild, frost-free subtropical climate with shelter from wind.",
    paragraphs: [
      "Macadamia occurs naturally on the fringes of subtropical rainforests in eastern Australia. It prefers a mild, frost-free climate and benefits from shelter, because its wood is brittle and branches can break in strong winds.",
      "Temperature is described as the major climatic factor that determines macadamia growth and productivity, so climate assessment should be the first step in evaluating any site.",
    ],
    bullets: [
      "Choose sites protected from strong prevailing winds, or plan windbreaks before planting.",
      "Avoid frost pockets and very hot, exposed locations.",
      "Compare long-term local weather records with the general ranges in this guide before investing.",
    ],
  },
  {
    id: "temperature",
    title: "Temperature",
    icon: "thermometer",
    summary: "Growth is commonly reported to be best around 25 °C during the growing season.",
    paragraphs: [
      "Reference material for Macadamia integrifolia reports an optimum of around 25 °C during the growing season and a mean annual temperature range of roughly 15–25 °C across the places it is grown.",
      "Flower initiation is associated with cooler conditions (an optimum near 18 °C is reported). Sustained high temperatures can reduce production and kernel quality, and frost can kill young trees.",
    ],
    table: {
      caption: "General temperature reference points (not local recommendations)",
      head: ["Factor", "Commonly cited reference"],
      rows: [
        ["Optimum during growing season", "≈ 25 °C"],
        ["Mean annual temperature (where grown)", "≈ 15 – 25 °C"],
        ["Flower initiation", "Favoured by cooler conditions (≈ 18 °C)"],
        ["Frost", "Damaging — frost-free sites are preferred"],
      ],
    },
    callout:
      "Much of the Tamil Nadu plains is hotter than these reference values. Elevation, micro-climate and management matter greatly — evaluate your specific site with an expert.",
  },
  {
    id: "rainfall-irrigation",
    title: "Rainfall and irrigation",
    icon: "droplets",
    summary: "Well-distributed rainfall, supplemented by irrigation where rainfall is irregular.",
    paragraphs: [
      "Reference material describes a preference for well-distributed annual rainfall of at least about 1,200 mm. Where rainfall is seasonal or unreliable — as in much of India — irrigation becomes essential.",
      "Young trees need regular watering while they establish. Mature trees are especially sensitive to moisture stress during flowering and nut development. Drip irrigation helps deliver water evenly without waterlogging the root zone.",
    ],
    bullets: [
      "Confirm a reliable year-round water source before planting.",
      "Mulch around trees to conserve soil moisture.",
      "Schedule irrigation using local weather, soil type and tree age — ideally with guidance from an agronomist.",
    ],
  },
  {
    id: "soil-type",
    title: "Soil type",
    icon: "mountain",
    summary: "Deep, well-drained loams and sandy loams with good organic matter.",
    paragraphs: [
      "Macadamia is most suited to deep, well-drained loams and sandy loams with good organic matter content. Heavy clay soils that hold water should be avoided.",
      "A professional soil test before planting shows texture, depth, nutrient status and pH, and is the foundation for every later decision about land preparation and nutrition.",
    ],
  },
  {
    id: "drainage",
    title: "Soil drainage",
    icon: "waves",
    summary: "Good drainage is critical — waterlogging damages roots.",
    paragraphs: [
      "Waterlogged soil starves roots of oxygen and favours root diseases. Drainage is one of the most important site factors for macadamia.",
      "On sites with slow drainage, raised beds or mounds, contour planting and drainage channels may be needed. Observe how the land behaves during heavy rain before deciding.",
    ],
  },
  {
    id: "soil-ph",
    title: "Soil pH",
    icon: "flask",
    summary: "A slightly acidic soil, around pH 5.0–6.5, is a commonly cited general range.",
    paragraphs: [
      "A soil pH of approximately 5.0–6.5 is a commonly cited general reference range for macadamia. Some sources give a narrower range, so treat these numbers as a guide rather than a rule.",
      "If your soil test shows a pH outside this range, discuss correction options and timing with a soil scientist or agricultural officer before planting.",
    ],
  },
  {
    id: "land-preparation",
    title: "Land preparation",
    icon: "tractor",
    summary: "Soil testing, layout, drainage and windbreaks before the first tree goes in.",
    paragraphs: [
      "Good land preparation reduces problems for the life of the orchard, which can be several decades.",
    ],
    bullets: [
      "Test soil and water, and map wet areas and slopes.",
      "Clear weeds and debris; incorporate well-decomposed organic matter where advised.",
      "Plan row direction, spacing and access paths for future machinery and harvest.",
      "Establish windbreaks early if the site is exposed.",
      "Install irrigation mainlines before planting.",
    ],
  },
  {
    id: "sapling-selection",
    title: "Sapling selection",
    icon: "sprout",
    summary: "Healthy, true-to-type planting material from a known source.",
    paragraphs: [
      "The planting material you choose shapes the orchard for decades. Ask your nursery for the propagation method, the source of the planting material and, for grafted plants, the variety.",
    ],
    bullets: [
      "Choose vigorous plants with healthy, dark-green foliage and no signs of pests or disease.",
      "Check that roots are not badly coiled or pot-bound.",
      "For grafted plants, the graft union should be clean and well healed.",
      "Plan for compatible varieties to support cross-pollination.",
    ],
  },
  {
    id: "grafted-vs-seedling",
    title: "Grafted versus seed-grown plants",
    icon: "git-branch",
    summary: "Commercial production relies mainly on grafted trees of known varieties.",
    paragraphs: [
      "Macadamia can be raised from seed, but seedlings vary from tree to tree and can take many years to begin bearing. Commercial production relies almost entirely on grafted trees of known varieties, which are more uniform.",
      "Seed-grown plants still have uses — for example as rootstocks — but growers planning a commercial orchard usually prioritise grafted, named varieties suited to their conditions.",
    ],
    table: {
      caption: "General comparison",
      head: ["", "Grafted plants", "Seed-grown plants"],
      rows: [
        ["Uniformity", "True to the grafted variety", "Variable between trees"],
        ["Time to bearing", "Generally earlier", "Generally later — can be many years"],
        ["Typical use", "Commercial orchards", "Rootstocks, trials, home gardens"],
        ["What to ask the nursery", "Variety name and rootstock", "Seed source / mother tree"],
      ],
    },
  },
  {
    id: "planting",
    title: "Planting procedure",
    icon: "shovel",
    summary: "Plant at nursery depth, water thoroughly and mulch.",
    paragraphs: [
      "Plant at the start of the rains or when irrigation is ready, so young trees never dry out while establishing.",
    ],
    bullets: [
      "Dig a planting hole wider than the root ball and loosen the surrounding soil.",
      "Remove the grow bag carefully without breaking the root ball.",
      "Plant at the same depth the tree grew in the nursery — keep the graft union above soil level.",
      "Backfill, firm gently and water thoroughly.",
      "Mulch around the base (keeping mulch away from the stem) and stake the tree in windy sites.",
    ],
  },
  {
    id: "spacing",
    title: "Tree spacing",
    icon: "ruler",
    summary: "Spacing depends on variety vigour, pruning plans and machinery.",
    paragraphs: [
      "Reference material describes inter-row spacing of around 10 m as common (closer, around 7 m, where mechanical pruning is used), with 4–6 m between trees in a row depending on variety and growing conditions. Higher-density hedgerow systems aim for earlier yields but need more intensive canopy management.",
      "Use the formula below to estimate tree numbers for any layout. Confirm the final layout with your adviser, considering the vigour of the chosen varieties.",
    ],
    table: {
      caption: "Trees per area = 10,000 m² ÷ (row spacing × tree spacing). 1 acre ≈ 4,047 m².",
      head: ["Layout (row × tree)", "Trees per hectare", "Trees per acre (approx.)"],
      rows: [
        ["10 m × 5 m", "200", "81"],
        ["8 m × 5 m", "250", "101"],
        ["7.5 m × 7.5 m", "178", "72"],
        ["7 m × 4 m", "357", "144"],
      ],
    },
  },
  {
    id: "pollination",
    title: "Pollination",
    icon: "flower",
    summary: "Cross-pollination between compatible varieties improves nut set.",
    paragraphs: [
      "Macadamia flowers are borne on long hanging racemes. Research on elite selections found supplementary cross-pollination to be the most efficient method for nut set, while self-pollination produced low nut set in many genotypes (some selections were self-fertile).",
      "Industry research in Australia reported that the large majority of nuts tested in orchards came from cross-pollination, and studies show the pollen parent can also influence nut and kernel size.",
    ],
    bullets: [
      "Plan more than one compatible variety, inter-planted closely (for example in alternating rows or small blocks).",
      "Support bees and other pollinators; avoid spraying during flowering unless advised.",
      "Ask your nursery or adviser which varieties are compatible pollinisers for each other.",
    ],
  },
  {
    id: "fertilizer",
    title: "Fertilizer management",
    icon: "leaf",
    summary: "Base nutrition on soil and leaf analysis, little and often.",
    paragraphs: [
      "Nutrient needs depend on soil, tree age, crop load and climate. Base your programme on soil and leaf analysis rather than fixed recipes, and apply nutrients in smaller split doses.",
      "Macadamia belongs to the Proteaceae family, many of whose members are sensitive to high phosphorus. Avoid heavy phosphorus applications unless a soil test and an agronomist specifically recommend them.",
    ],
  },
  {
    id: "pruning",
    title: "Pruning",
    icon: "scissors",
    summary: "Formative pruning builds a strong frame; later pruning manages light.",
    paragraphs: [
      "In the early years, formative pruning helps build a strong central structure with well-spaced branches — important because macadamia wood is brittle.",
      "As trees mature, canopy management keeps light reaching the inner canopy and maintains access between rows.",
    ],
  },
  {
    id: "pest-disease",
    title: "Pest and disease monitoring",
    icon: "bug",
    summary: "Regular scouting and early expert advice.",
    paragraphs: [
      "Pests such as nut borers, mites and aphids, and diseases including root rots associated with poor drainage, have been reported on macadamia. Which problems matter depends on the region.",
      "Walk the orchard regularly, keep records, and consult local plant-protection experts or the agriculture department before using any control product. This guide does not recommend specific chemicals.",
    ],
  },
  {
    id: "harvesting",
    title: "Harvesting",
    icon: "hand",
    summary: "Mature nuts fall naturally — collect them often.",
    paragraphs: [
      "Mature macadamia nuts generally drop to the ground in their husks. Keep the area beneath trees clear and collect fallen nuts frequently.",
      "Research shows that leaving nuts on the ground for long periods between harvest rounds can reduce kernel quality, so frequent collection matters more than the choice of dehusking equipment.",
    ],
  },
  {
    id: "post-harvest",
    title: "Post-harvest handling",
    icon: "package",
    summary: "Dehusk promptly and dry carefully to protect kernel quality.",
    paragraphs: [
      "USDA post-harvest guidance advises husking macadamia nuts within 24 hours of harvest, because delays can lead to mould and fermentation.",
      "Nuts are then dried in stages, with temperature increased gradually as moisture falls, until the kernel reaches about 1.5% moisture — a level at which mould and bacteria cannot grow. High-quality kernels are reported to contain roughly 72–78% oil.",
    ],
    table: {
      caption: "Post-harvest reference points (USDA Agriculture Handbook 66)",
      head: ["Stage", "General guidance"],
      rows: [
        ["Husking", "Within 24 hours of harvest"],
        ["Drying", "Gradual, staged temperature increase"],
        ["Target kernel moisture", "≈ 1.5%"],
        ["High-quality kernel oil content", "≈ 72 – 78%"],
      ],
    },
  },
];

export const whyMacadamiaSections = [
  {
    id: "what-is-macadamia",
    title: "What is macadamia?",
    body: [
      "Macadamia is an evergreen nut tree in the Proteaceae family. Its seed — the macadamia nut — is prized for its creamy, buttery flavour and is enjoyed around the world as a snack and an ingredient.",
      "Two species produce the edible nuts grown commercially: Macadamia integrifolia (smooth-shelled) and Macadamia tetraphylla (rough-shelled), along with hybrids between them.",
    ],
  },
  {
    id: "origin",
    title: "Origin and background",
    body: [
      "Macadamia is native to the subtropical rainforest fringes of eastern Australia. From there it was developed as an orchard crop and is now grown commercially in several countries with suitable climates.",
      "In India, macadamia has been planted in a limited number of orchards — often on a trial basis — in states including Kerala, Karnataka, Tamil Nadu and Odisha. Local, long-term performance data is still limited, which is why careful site evaluation matters.",
    ],
  },
  {
    id: "tree",
    title: "Tree characteristics",
    body: [
      "Macadamia is a long-lived evergreen tree with glossy, leathery leaves. Flowers hang in long racemes, and the wood is brittle — so trees need shelter from strong winds and good formative pruning.",
      "Trees grown from seed vary and can take many years to bear; grafted trees of known varieties are more uniform and are the basis of commercial orchards.",
    ],
  },
  {
    id: "applications",
    title: "Macadamia nut applications",
    body: [
      "Macadamia kernels are eaten raw or roasted and used in confectionery, bakery products, spreads and plant-based foods. Macadamia oil is used in cooking and in personal-care products.",
      "By-products also have uses — for example, decomposed husk is used in potting mixes.",
    ],
  },
  {
    id: "kernel-shell",
    title: "Kernel and shell overview",
    body: [
      "Each nut sits inside a green, fibrous husk. Beneath the husk is a very hard, woody shell that needs specialised equipment to crack, and inside that is the cream-coloured kernel.",
      "Kernel quality depends on maturity, prompt husking and careful drying; high-quality kernels are rich in oil.",
    ],
  },
  {
    id: "considerations",
    title: "Cultivation considerations",
    body: [
      "Macadamia is a long-term investment of time and effort. Climate, soil drainage, water availability, variety choice, pollination planning and orchard management all influence results.",
      "We do not promise yields, prices or returns. We encourage every grower to evaluate their land, speak to agricultural experts and start with a plan that suits their conditions.",
    ],
  },
  {
    id: "planning",
    title: "Plantation planning",
    body: [
      "A good plan covers site assessment, water, layout and spacing, variety and polliniser selection, sourcing quality planting material and a care calendar for the first years.",
      "Our team can talk through your requirements and help you understand the questions to ask before you plant.",
    ],
  },
];
