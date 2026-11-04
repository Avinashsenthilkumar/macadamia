/**
 * Central image map so every card / section on the site has a real photograph.
 * "/images/gallery/*" = Ganesh Nursery photographs.
 * "/images/orchard/*" = stills from the supplied macadamia growth video (illustrative).
 */
export type Pic = { src: string; alt: string };

const g = (name: string, alt: string): Pic => ({ src: `/images/gallery/${name}.webp`, alt });
const o = (name: string, alt: string): Pic => ({ src: `/images/orchard/${name}.webp`, alt });

export const pics = {
  orchardRows: o("macadamia-orchard-rows", "Rows of macadamia trees in an orchard"),
  matureTree: o("macadamia-tree-orchard", "A mature macadamia tree"),
  youngTree: o("orchard-young-tree", "A young macadamia tree in a planted orchard"),
  seedling: o("orchard-seedling", "A macadamia seedling in prepared soil"),
  soil: o("orchard-soil", "Loose, well-prepared soil"),
  sprout: o("orchard-sprout", "A seedling emerging from the soil"),
  flowers: o("macadamia-flowers", "Cream macadamia flower racemes"),
  racemes: o("macadamia-flower-racemes", "Close-up of macadamia flowers"),
  nutsOnTree: o("macadamia-nuts-on-tree", "Green macadamia nuts on the tree"),
  nutsBoard: g("macadamia-nuts-board", "Macadamia nuts in shell and kernels"),
  nutsCracked: g("macadamia-nuts-cracked", "Cracked macadamia shells showing kernels"),
  saplingNursery: g("macadamia-sapling-nursery", "Macadamia sapling in a nursery grow bag"),
  saplingHandover: g("macadamia-sapling-handover", "Macadamia sapling held in its grow bag"),
  saplingVisit: g("macadamia-sapling-visit", "Macadamia sapling at a shade-net nursery"),
  nurseryBeds: g("nursery-bed-saplings", "Young saplings growing in nursery bags"),
  inspection: g("nursery-sapling-inspection", "Checking a young sapling"),
  fieldCare: g("nursery-field-care", "Tending young plants in the field"),
  roots: g("rootstock-roots", "Healthy plant roots"),
  packing: g("sapling-packing", "Wrapping saplings for transport"),
  crates: g("sapling-dispatch-crates", "Saplings packed in crates for dispatch"),
  truck: g("sapling-dispatch-truck", "Saplings loaded on a truck for delivery"),
  pondPlanting: g("field-planting-pond", "Planting a sapling beside a farm pond"),
  tallSapling: g("nursery-tall-sapling", "A tall sapling at a plantation site"),
  plantationTree: g("plantation-young-tree", "A young tree in a plantation"),
  motherTree: g("mother-tree-grove", "A tall mature tree in a grove"),
} satisfies Record<string, Pic>;

/** Cultivation guide section → image */
export const guideImages: Record<string, Pic> = {
  climate: pics.orchardRows,
  temperature: pics.matureTree,
  "rainfall-irrigation": pics.pondPlanting,
  "soil-type": pics.soil,
  drainage: pics.fieldCare,
  "soil-ph": pics.roots,
  "land-preparation": pics.seedling,
  "sapling-selection": pics.saplingNursery,
  "grafted-vs-seedling": pics.saplingHandover,
  planting: pics.plantationTree,
  spacing: pics.orchardRows,
  pollination: pics.flowers,
  fertilizer: pics.youngTree,
  pruning: pics.tallSapling,
  "pest-disease": pics.racemes,
  harvesting: pics.nutsOnTree,
  "post-harvest": pics.nutsBoard,
};

/** Plantation service slug → image (falls back by position) */
const serviceBySlug: Record<string, Pic> = {
  "bulk-sapling-supply": pics.truck,
  "sapling-selection-guidance": pics.nurseryBeds,
  "plantation-support-guidance": pics.pondPlanting,
  "delivery-assistance": pics.crates,
  "plantation-consultation": pics.saplingVisit,
  "spacing-layout-guidance": pics.orchardRows,
  "soil-irrigation-guidance": pics.roots,
  "planting-assistance": pics.plantationTree,
  "maintenance-guidance": pics.inspection,
};
const serviceFallbacks = [pics.saplingNursery, pics.fieldCare, pics.youngTree, pics.packing, pics.tallSapling, pics.matureTree];
export function serviceImage(slug: string, index: number): Pic {
  return serviceBySlug[slug] ?? serviceFallbacks[index % serviceFallbacks.length]!;
}
