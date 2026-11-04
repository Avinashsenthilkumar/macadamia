import {
  Bug,
  ClipboardList,
  Compass,
  Droplets,
  FlaskConical,
  Flower2,
  GitBranch,
  Hand,
  HeartHandshake,
  Leaf,
  Mountain,
  Package,
  Ruler,
  Scissors,
  ShieldCheck,
  Shovel,
  Sprout,
  Sun,
  Thermometer,
  Tractor,
  TreePine,
  Truck,
  Users,
  Waves,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const iconMap = {
  bug: Bug,
  clipboard: ClipboardList,
  compass: Compass,
  droplets: Droplets,
  flask: FlaskConical,
  flower: Flower2,
  "git-branch": GitBranch,
  hand: Hand,
  handshake: HeartHandshake,
  leaf: Leaf,
  mountain: Mountain,
  package: Package,
  ruler: Ruler,
  scissors: Scissors,
  shield: ShieldCheck,
  shovel: Shovel,
  sprout: Sprout,
  sun: Sun,
  thermometer: Thermometer,
  tractor: Tractor,
  tree: TreePine,
  truck: Truck,
  users: Users,
  waves: Waves,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;
export const iconNames = Object.keys(iconMap) as IconName[];

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (iconMap as Record<string, LucideIcon>)[name] ?? Sprout;
  return <Cmp className={className} aria-hidden />;
}
