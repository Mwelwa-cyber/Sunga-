import {
  Utensils,
  Bus,
  GraduationCap,
  ShieldPlus,
  MoreHorizontal,
  Home as HomeIcon,
  Car,
  Smartphone,
  ShoppingBag,
  HeartPulse,
  Landmark,
  Wallet,
  Users,
  Gift,
  Sprout,
  Briefcase,
  Hammer,
  CircleDollarSign,
  Target,
  LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  bus: Bus,
  "graduation-cap": GraduationCap,
  shield: ShieldPlus,
  dots: MoreHorizontal,
  home: HomeIcon,
  car: Car,
  phone: Smartphone,
  bag: ShoppingBag,
  health: HeartPulse,
  bank: Landmark,
  wallet: Wallet,
  family: Users,
  gift: Gift,
  farming: Sprout,
  business: Briefcase,
  piecework: Hammer,
  salary: CircleDollarSign,
  target: Target,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Target;
}

export function IconGlyph({
  name,
  size = 18,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  // ICONS is a fixed module-level map, so this always resolves to the same
  // stable component reference per name — safe despite the dynamic lookup.
  const Icon = getIcon(name);
  // eslint-disable-next-line react-hooks/static-components
  return <Icon size={size} className={className} />;
}

export const EXPENSE_CATEGORY_ICONS: Record<string, string> = {
  Food: "utensils",
  Transport: "bus",
  Bills: "home",
  Airtime: "phone",
  Shopping: "bag",
  Health: "health",
  Other: "dots",
};

export const GOAL_PURPOSE_ICONS: { label: string; icon: string }[] = [
  { label: "TV", icon: "target" },
  { label: "Vehicle", icon: "car" },
  { label: "House", icon: "home" },
  { label: "School fees", icon: "graduation-cap" },
  { label: "Business", icon: "business" },
  { label: "Emergency fund", icon: "shield" },
  { label: "Other", icon: "target" },
];

export const INCOME_SOURCE_ICONS: Record<string, string> = {
  salary: "salary",
  business: "business",
  piecework: "piecework",
  farming: "farming",
  gift: "gift",
  rental: "home",
  other: "dots",
};
