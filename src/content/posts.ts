// Initial knowledge-centre articles. Written from the references listed in each article.
// Please have them reviewed by the nursery team / an agronomist before relying on them commercially.

export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  content: string;
};

const refs = `
## References

- World Agroforestry (ICRAF), *Agroforestree Database: Macadamia integrifolia* — [link](https://apps.worldagroforestry.org/treedb2/speciesprofile.php?Spid=1091)
- USDA Agriculture Handbook 66, *Macadamia* — [link](https://webarchive.library.unt.edu/eot2008/20090305020046/http:/www.ba.ars.usda.gov/hb66/159macadamia.pdf)
`;

const disclaimer = `
> Macadamia cultivation suitability depends on local climate, soil, water availability, planting material and orchard management. Consult an agricultural expert and evaluate your land before establishing a commercial plantation.
`;

export const seedPosts: SeedPost[] = [
  {
    slug: "introduction-to-macadamia-nut-farming",
    title: "Introduction to Macadamia Nut Farming",
    excerpt: "What macadamia is, where it comes from and the big questions to answer before you consider planting an orchard.",
    category: "Getting started",
    coverImage: "/images/gallery/macadamia-nuts-board.webp",
    coverAlt: "Macadamia nuts in shell with shelled kernels (illustrative)",
    content: `Macadamia is an evergreen nut tree in the **Proteaceae** family. It is native to the subtropical rainforest fringes of eastern Australia and is grown today for its creamy, buttery kernel.

## The two edible species

Commercial macadamia comes from two species and their hybrids:

- **Macadamia integrifolia** — smooth-shelled nuts.
- **Macadamia tetraphylla** — rough-shelled nuts.

## A long-term crop

Macadamia is a long-lived tree. Seed-grown trees vary and can take many years to start bearing, which is why commercial orchards rely mainly on **grafted trees of known varieties**. Whatever you plant, think in terms of decades, not seasons.

## Questions to answer first

1. **Climate** — macadamia prefers mild, frost-free, subtropical conditions and shelter from strong winds.
2. **Water** — is there a reliable year-round source for irrigation?
3. **Soil** — is your soil deep and well drained?
4. **Planting material** — can you source healthy, true-to-type plants, and compatible varieties for pollination?
5. **Patience and management** — are you prepared for years of care before meaningful harvests?

## Where macadamia stands in India

In India, macadamia has been planted in a limited number of orchards — often on a trial basis — in states including Kerala, Karnataka, Tamil Nadu and Odisha. Long-term local performance data is still limited, so careful site evaluation and expert advice are essential.

Continue with our [cultivation guide](/cultivation-guide) for the details.
${disclaimer}${refs}`,
  },
  {
    slug: "how-to-select-macadamia-planting-material",
    title: "How to Select Macadamia Planting Material",
    excerpt: "A practical checklist for choosing healthy macadamia saplings — and the questions to ask your nursery.",
    category: "Planting material",
    coverImage: "/images/gallery/macadamia-sapling-nursery.webp",
    coverAlt: "A young macadamia sapling in a nursery grow bag",
    content: `The plants you put in the ground shape your orchard for decades. A few minutes of checking at the nursery can save years of disappointment.

## Questions to ask the nursery

- How was this plant propagated — **grafted or seed-grown**?
- If grafted, **which variety**, and on what rootstock?
- Where did the seed or budwood come from?
- How old is the plant, and how long has it been in this container?
- Which varieties do you recommend planting **together for cross-pollination**?

A good nursery will tell you clearly what it can and cannot confirm.

## What to look for in the plant

- **Healthy foliage** — glossy, dark-green leaves without spots, curling or heavy pest damage.
- **Vigour** — a sturdy, upright stem rather than a weak, stretched one.
- **Roots** — not badly coiled or circling at the bottom of the bag. Severely pot-bound roots can struggle to establish.
- **Graft union** (for grafted plants) — clean and well healed, with no cracks or rot.

## Plan for pollination

Macadamia benefits from cross-pollination between compatible varieties. Plan your variety mix **before** you buy, so your orchard layout supports it. See [Importance of Pollination in Macadamia](/blog/importance-of-pollination-in-macadamia).

## Transport and handling

Keep plants shaded and watered while they wait to be planted, handle them by the bag rather than the stem, and plant as soon as your site and irrigation are ready.
${disclaimer}`,
  },
  {
    slug: "grafted-vs-seed-grown-macadamia-plants",
    title: "Grafted vs Seed-Grown Macadamia Plants",
    excerpt: "Why commercial macadamia orchards rely on grafted trees — and where seedlings still have a role.",
    category: "Planting material",
    coverImage: "/images/gallery/macadamia-sapling-handover.webp",
    coverAlt: "A macadamia sapling held in its grow bag",
    content: `Macadamia can be grown from seed or propagated by grafting. The choice has a big effect on how uniform your orchard is and how long you wait for nuts.

## Seed-grown plants

A seedling is genetically different from its parent tree. In practice this means:

- Trees vary in vigour, shape, nut quality and productivity.
- Seedlings can take many years to begin bearing.
- They are useful as **rootstocks**, for trials and for home gardens.

## Grafted plants

A grafted plant joins a shoot (scion) from a known variety onto a seedling rootstock. The resulting tree is true to the chosen variety. Reference material on macadamia notes that commercial production relies almost entirely on grafted trees of known varieties.

## Side-by-side

| | Grafted | Seed-grown |
|---|---|---|
| Uniformity | True to the variety | Variable |
| Time to bearing | Generally earlier | Generally later |
| Typical use | Commercial orchards | Rootstocks, trials, gardens |
| Ask the nursery | Variety and rootstock | Seed source / mother tree |

## Which should you choose?

For a commercial orchard, most growers prioritise grafted plants of varieties suited to their conditions, planted with compatible pollinisers. Ask your nursery what propagation method each plant uses, and get advice on which varieties suit your area.
${disclaimer}${refs}`,
  },
  {
    slug: "understanding-macadamia-soil-requirements",
    title: "Understanding Macadamia Soil Requirements",
    excerpt: "Drainage, depth and pH — the soil factors that matter most for macadamia, and how to check them.",
    category: "Cultivation",
    coverImage: "/images/gallery/rootstock-roots.webp",
    coverAlt: "A grower holding healthy plant roots",
    content: `Soil is the one thing you cannot easily change after planting. Understanding it first is the best investment you can make.

## Drainage comes first

Macadamia does not tolerate waterlogging. Saturated soil starves roots of oxygen and encourages root disease. Watch how your land behaves during heavy rain: where does water collect, and how quickly does it drain away?

## Depth and texture

Reference material describes macadamia as most suited to **deep, well-drained loams and sandy loams** with good organic matter. Heavy clays that hold water should be avoided.

## Soil pH

A soil pH of approximately **5.0–6.5** is a commonly cited general range. Some sources give a narrower band, so treat this as a guide. If your soil is outside the range, discuss correction options with a soil scientist before planting.

## Get a soil test

A laboratory soil test tells you texture, pH, organic carbon and nutrient levels. Many State Agriculture Departments and Krishi Vigyan Kendras can help with testing and interpreting results.

## Improving marginal sites

On slow-draining land, options such as raised beds or mounds, drainage channels and contour planting can help — but they add cost and do not turn an unsuitable site into an ideal one. Get local expert advice.
${disclaimer}${refs}`,
  },
  {
    slug: "irrigation-management-for-young-macadamia-trees",
    title: "Irrigation Management for Young Macadamia Trees",
    excerpt: "How to keep young macadamia trees evenly moist without waterlogging — principles to discuss with your adviser.",
    category: "Cultivation",
    coverImage: "/images/gallery/field-planting-pond.webp",
    coverAlt: "Farmers planting a sapling beside a farm pond",
    content: `Reference material describes macadamia as preferring well-distributed annual rainfall of at least about 1,200 mm. In much of India rainfall is seasonal, so **irrigation is usually essential**.

## Principles for young trees

- **Consistency matters.** Young trees establishing their roots should not be allowed to dry out.
- **Avoid waterlogging.** More water is not better — saturated soil damages roots.
- **Water the root zone.** Drip irrigation delivers water evenly where roots are and reduces waste.
- **Mulch.** A layer of organic mulch (kept away from the stem) conserves moisture and moderates soil temperature.

## Adjust for your conditions

How much and how often depends on soil type, weather, tree age and season. Sandy soils drain fast and need more frequent, smaller applications; heavier soils hold water longer.

A simple practice is to check soil moisture at root depth before irrigating rather than following a fixed calendar.

## Flowering and nut development

As trees mature, moisture stress during flowering and nut development is particularly undesirable. Plan your water supply for the driest months before you plant.

## Get local guidance

Ask your agriculture department, a drip-irrigation supplier or an agronomist to help design a schedule for your specific site.
${disclaimer}${refs}`,
  },
  {
    slug: "macadamia-plantation-planning-in-india",
    title: "Macadamia Plantation Planning in India",
    excerpt: "A step-by-step planning checklist — from site assessment to layout — before you plant your first macadamia tree.",
    category: "Getting started",
    coverImage: "/images/gallery/plantation-young-tree.webp",
    coverAlt: "A young tree established in a plantation field",
    content: `Macadamia is a long-term commitment. Planning carefully before you buy plants will save time and money.

## 1. Assess the site honestly

- Long-term temperature and rainfall records for your area.
- Exposure to strong winds (macadamia wood is brittle).
- Soil depth, drainage and pH from a laboratory test.
- A reliable year-round water source.

## 2. Talk to experts

Your State Agriculture or Horticulture Department, a Krishi Vigyan Kendra, or a university extension service can help assess whether macadamia is suitable for your land.

## 3. Choose planting material

Decide on grafted plants of known varieties where possible, and plan **compatible varieties for cross-pollination**. Ask the nursery to confirm propagation method and variety.

## 4. Design the layout

Spacing depends on variety vigour and how you plan to manage the canopy. Reference material describes inter-row spacing of around 10 m as common (closer where mechanical pruning is used) with 4–6 m between trees.

Trees per hectare = 10,000 ÷ (row spacing × tree spacing). For example, 8 m × 5 m gives 250 trees per hectare (about 101 per acre).

## 5. Prepare the land

Clear and prepare the site, install irrigation and windbreaks, and mark planting positions before your plants arrive.

## 6. Plan the first years

Budget for irrigation, nutrition based on soil and leaf tests, formative pruning and regular monitoring for pests and diseases.

## A note on expectations

We do not promise yields, prices or returns. Results depend on climate, soil, water, planting material and management.
${disclaimer}${refs}`,
  },
  {
    slug: "importance-of-pollination-in-macadamia",
    title: "Importance of Pollination in Macadamia",
    excerpt: "Why cross-pollination between compatible varieties matters for macadamia nut set — and how to plan for it.",
    category: "Cultivation",
    coverImage: "/images/gallery/nursery-bed-saplings.webp",
    coverAlt: "Young saplings growing in nursery bags",
    content: `Macadamia flowers hang in long racemes, each carrying many small flowers. Only a small share of those flowers go on to become mature nuts — and pollination plays a big part.

## What the research says

- A study of elite macadamia selections in Australia found **supplementary cross-pollination** to be the most efficient method for nut set, while self-pollination gave low nut set in many genotypes (a few selections were self-fertile).
- Australian industry research using DNA paternity testing reported that the large majority of nuts sampled in orchards came from cross-pollination.
- Other work found that the pollen parent can influence nut and kernel size.

## What this means for planting

- **Plant more than one compatible variety.** Ask your nursery or adviser which varieties pollinate each other well.
- **Inter-plant closely.** Alternating rows or small blocks help bees move pollen between varieties.
- **Support pollinators.** Bees are important; avoid spraying during flowering unless your adviser recommends it.

## References

- Howell, Russell, Alam & Topp (2018). *Acta Horticulturae* 1205 — [doi.org/10.17660/ActaHortic.2018.1205.76](https://doi.org/10.17660/ActaHortic.2018.1205.76)
- Herbert, Walton & Wallace (2019). *Scientia Horticulturae* 251 — [doi.org/10.1016/j.scienta.2019.03.006](https://doi.org/10.1016/j.scienta.2019.03.006)
- Hort Innovation pollination research — [Good Fruit & Vegetables](https://www.goodfruitandvegetables.com.au/story/6941424/cross-pollination-drives-macadamias-productivity/)
${disclaimer}`,
  },
  {
    slug: "common-macadamia-cultivation-challenges",
    title: "Common Macadamia Cultivation Challenges",
    excerpt: "Heat, wind, drainage, slow establishment and pests — the challenges growers should plan for, and how to reduce the risk.",
    category: "Cultivation",
    coverImage: "/images/gallery/nursery-field-care.webp",
    coverAlt: "A worker tending young plants in a field",
    content: `Every crop has its challenges. Knowing macadamia's in advance helps you decide whether it suits your land and how to manage the risks.

## Climate mismatch

Macadamia is a subtropical tree. Reference material reports a growing-season optimum around 25 °C, and sustained high temperatures can reduce production and kernel quality. Hot, exposed sites need careful evaluation.

## Wind damage

Macadamia wood is brittle. Strong winds can break branches. Windbreaks and good formative pruning help.

## Poor drainage

Waterlogged soils damage roots and favour root diseases. Drainage is one of the most important things to check before planting.

## Slow establishment

Macadamia is not a quick crop. Seed-grown trees in particular can take many years to bear. Grafted plants of known varieties are more uniform.

## Pollination gaps

Planting a single variety can limit nut set. Plan compatible varieties for cross-pollination.

## Pests and diseases

Pests such as nut borers, mites and aphids, and diseases such as root rots, have been reported on macadamia. Which problems matter depends on the region. Scout regularly and consult plant-protection experts before using any product.

## Post-harvest quality

Nuts left on the ground too long lose quality. USDA guidance advises husking within 24 hours of harvest and careful drying to about 1.5% kernel moisture.
${disclaimer}${refs}`,
  },
];
