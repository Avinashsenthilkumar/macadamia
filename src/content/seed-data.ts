// Initial content shared by the database seed (prisma/seed.ts) and by the website's
// built-in fallbacks, so pages are never empty even before the database is seeded.
import type { GalleryCategoryKey } from "../lib/labels";

export const seedGallery: { url: string; alt: string; caption: string; category: GalleryCategoryKey; isCompanyPhoto: boolean }[] = [
  { url: "/images/gallery/macadamia-sapling-nursery.webp", alt: "Macadamia sapling growing in a black grow bag under shade net", caption: "Macadamia sapling in the nursery", category: "SAPLINGS", isCompanyPhoto: true },
  { url: "/images/gallery/macadamia-sapling-handover.webp", alt: "Macadamia sapling held in its grow bag at a shade-net nursery", caption: "Macadamia sapling ready for planting", category: "SAPLINGS", isCompanyPhoto: true },
  { url: "/images/gallery/macadamia-sapling-visit.webp", alt: "Two people holding a macadamia sapling at a shade-net nursery", caption: "Macadamia sapling at a shade-net nursery", category: "SAPLINGS", isCompanyPhoto: true },
  { url: "/images/gallery/macadamia-nuts-cracked.webp", alt: "Cracked macadamia shells showing cream-coloured kernels", caption: "Macadamia nuts — shell and kernel", category: "NUTS", isCompanyPhoto: false },
  { url: "/images/gallery/macadamia-nuts-board.webp", alt: "Macadamia nuts in shell and shelled kernels on a wooden spoon", caption: "Macadamia nuts in shell and kernels", category: "NUTS", isCompanyPhoto: false },
  { url: "/images/gallery/nursery-bed-saplings.webp", alt: "Rows of young saplings in nursery bags", caption: "Saplings growing in nursery beds", category: "NURSERY", isCompanyPhoto: true },
  { url: "/images/gallery/nursery-sapling-inspection.webp", alt: "A nursery team member checking a young sapling", caption: "Checking sapling health", category: "NURSERY", isCompanyPhoto: true },
  { url: "/images/gallery/nursery-field-care.webp", alt: "A worker tending young plants in a nursery field", caption: "Caring for young plants", category: "NURSERY", isCompanyPhoto: true },
  { url: "/images/gallery/rootstock-roots.webp", alt: "A grower holding healthy plant roots", caption: "Healthy root systems", category: "NURSERY", isCompanyPhoto: true },
  { url: "/images/gallery/sapling-packing.webp", alt: "Saplings being wrapped in mesh for transport", caption: "Packing saplings for transport", category: "FARM_ACTIVITIES", isCompanyPhoto: true },
  { url: "/images/gallery/sapling-dispatch-crates.webp", alt: "Wrapped saplings packed in crates", caption: "Saplings packed for dispatch", category: "FARM_ACTIVITIES", isCompanyPhoto: true },
  { url: "/images/gallery/sapling-dispatch-truck.webp", alt: "Saplings in grow bags loaded on a truck", caption: "Saplings loaded for delivery", category: "FARM_ACTIVITIES", isCompanyPhoto: true },
  { url: "/images/gallery/field-planting-pond.webp", alt: "Farmers planting a sapling beside a farm pond", caption: "Field planting", category: "PLANTATION", isCompanyPhoto: true },
  { url: "/images/gallery/nursery-tall-sapling.webp", alt: "A tall sapling established at a plantation site", caption: "Established plantation sapling", category: "PLANTATION", isCompanyPhoto: true },
  { url: "/images/gallery/plantation-young-tree.webp", alt: "A young tree growing in a plantation field", caption: "Young plantation tree", category: "PLANTATION", isCompanyPhoto: true },
  { url: "/images/gallery/mother-tree-grove.webp", alt: "A tall mature tree in a grove", caption: "Mature trees — the source of selected seed", category: "PLANTATION", isCompanyPhoto: true },
];

export const seedOrchard: { url: string; alt: string; caption: string; category: GalleryCategoryKey; isCompanyPhoto: boolean }[] = [
  { url: "/images/orchard/macadamia-tree-orchard.webp", alt: "A mature macadamia tree in an orchard", caption: "Mature macadamia tree", category: "TREES", isCompanyPhoto: false },
  { url: "/images/orchard/macadamia-orchard-rows.webp", alt: "Rows of macadamia trees in an orchard", caption: "Macadamia orchard rows", category: "TREES", isCompanyPhoto: false },
  { url: "/images/orchard/orchard-young-tree.webp", alt: "A young macadamia tree in a planted orchard", caption: "Young macadamia tree", category: "TREES", isCompanyPhoto: false },
  { url: "/images/orchard/macadamia-flowers.webp", alt: "Cream macadamia flower racemes", caption: "Macadamia flowering", category: "TREES", isCompanyPhoto: false },
  { url: "/images/orchard/macadamia-nuts-on-tree.webp", alt: "Green macadamia nuts in husks on the tree", caption: "Nuts developing on the tree", category: "NUTS", isCompanyPhoto: false },
  { url: "/images/orchard/macadamia-flower-racemes.webp", alt: "Close-up of macadamia flower racemes", caption: "Macadamia flowers up close", category: "TREES", isCompanyPhoto: false },
  { url: "/images/orchard/orchard-seedling.webp", alt: "A macadamia seedling in prepared soil", caption: "Seedling stage", category: "SAPLINGS", isCompanyPhoto: false },
  { url: "/images/orchard/orchard-sprout.webp", alt: "A macadamia seedling emerging from the soil", caption: "A new sprout", category: "SAPLINGS", isCompanyPhoto: false },
];

// isAvailable = true only where the business background already states it
export const seedServices = [
  { title: "Bulk Sapling Supply", icon: "package", isAvailable: true, isPublished: true, summary: "Planting material for larger plantations, quoted to your requirement.", description: "Share your land area and the number of plants you need. Our team will confirm current availability and send a quotation." },
  { title: "Sapling Selection Guidance", icon: "sprout", isAvailable: true, isPublished: true, summary: "Help choosing suitable planting material for your plans.", description: "We explain the planting material we can offer — including propagation method and what we can confirm about it — so you can choose with confidence." },
  { title: "Plantation Support & Guidance", icon: "handshake", isAvailable: true, isPublished: true, summary: "Practical guidance as you plan and establish your plantation.", description: "Talk through site, water, layout and early care with our team, and get pointers on what to ask your local agricultural experts." },
  { title: "Delivery Assistance", icon: "truck", isAvailable: true, isPublished: true, summary: "Help arranging delivery of plants to your site, where available.", description: "Delivery availability and charges depend on your location and order size. Ask us when you enquire." },
  { title: "Plantation Consultation", icon: "users", isAvailable: false, isPublished: false, summary: "A one-to-one discussion of your macadamia plantation plans.", description: "CONFIRM WITH GANESH NURSERY before publishing: scope, format (phone / site visit) and any charges." },
  { title: "Spacing & Layout Guidance", icon: "ruler", isAvailable: false, isPublished: false, summary: "Guidance on row and tree spacing for your site.", description: "CONFIRM WITH GANESH NURSERY before publishing." },
  { title: "Soil & Irrigation Guidance", icon: "droplets", isAvailable: false, isPublished: false, summary: "Help interpreting soil test results and planning irrigation.", description: "CONFIRM WITH GANESH NURSERY before publishing." },
  { title: "Planting Assistance", icon: "shovel", isAvailable: false, isPublished: false, summary: "On-site help with planting.", description: "CONFIRM WITH GANESH NURSERY before publishing: coverage area, team availability and charges." },
  { title: "Maintenance Guidance", icon: "scissors", isAvailable: false, isPublished: false, summary: "Guidance on pruning, nutrition and monitoring in the early years.", description: "CONFIRM WITH GANESH NURSERY before publishing." },
];

export const seedFaqs: { category: string; question: string; answer: string }[] = [
  { category: "Macadamia basics", question: "What is macadamia?", answer: "Macadamia is an evergreen nut tree from the Proteaceae family, native to the subtropical rainforest fringes of eastern Australia. It is grown for its creamy, buttery kernels. Edible macadamia comes from Macadamia integrifolia, Macadamia tetraphylla and their hybrids." },
  { category: "Macadamia basics", question: "What are macadamia plants?", answer: "Macadamia plants (saplings) are young macadamia trees raised in a nursery for planting out. They may be seed-grown or grafted. Commercial orchards rely mainly on grafted trees of known varieties because they are more uniform." },
  { category: "Macadamia basics", question: "Is macadamia suitable for my land?", answer: "It depends on your local climate, soil drainage and depth, soil pH and water availability. Macadamia prefers mild, frost-free subtropical conditions, well-drained soil and shelter from strong winds. Please evaluate your land with an agricultural expert — and share your details with us so we can discuss it." },
  { category: "Plants & orders", question: "Which macadamia varieties are available?", answer: "Available varieties change with nursery stock. Please contact us for current availability — we will tell you clearly what we can confirm about each plant." },
  { category: "Plants & orders", question: "Are grafted plants available?", answer: "Availability of grafted macadamia plants varies. Please enquire and our team will confirm the propagation method of the plants currently available." },
  { category: "Plants & orders", question: "What is the minimum order quantity?", answer: "Please contact us with your requirement and we will let you know the current terms for your order." },
  { category: "Plants & orders", question: "What is the plant price?", answer: "Prices depend on the type of plant, its size and the quantity ordered. Send us an enquiry or WhatsApp message and we will share a quotation." },
  { category: "Plants & orders", question: "Do you provide bulk supply?", answer: "Yes, bulk plant supply is part of our nursery business. Share your land area and plant count and we will confirm availability and send a quotation." },
  { category: "Plants & orders", question: "Is delivery available?", answer: "We assist with delivery where available. Charges and availability depend on your location and order size — please ask when you enquire." },
  { category: "Plantation", question: "Can you help plan a plantation?", answer: "We offer plantation guidance and support. Tell us about your land, water source and goals, and we will explain how we can help and which questions to raise with your local agricultural experts." },
  { category: "Cultivation", question: "What soil is suitable for macadamia?", answer: "Deep, well-drained loams and sandy loams with good organic matter are generally preferred, with a soil pH of roughly 5.0–6.5 often cited as a general reference. Avoid heavy clay and waterlogged sites. A soil test is the best starting point." },
  { category: "Cultivation", question: "How much irrigation is needed?", answer: "It depends on rainfall, soil type, season and tree age. Young trees need consistent moisture without waterlogging, and drip irrigation is commonly used. Ask a local agronomist to help design a schedule for your site." },
];
