import {
  Home,
  Users,
  TrendingUp,
  GraduationCap,
  Wallet,
  Target,
  Landmark,
  ShieldCheck,
  CreditCard,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shown in the mobile bottom bar. */
  inBottomNav: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: Home, inBottomNav: true },
  { href: "/community", label: "Community", icon: Users, inBottomNav: true },
  { href: "/investments", label: "Invest", icon: TrendingUp, inBottomNav: true },
  { href: "/learn", label: "Learn", icon: GraduationCap, inBottomNav: true },
  // Reachable from the desktop sidebar / home; not a bottom tab.
  { href: "/expenses", label: "Tracker", icon: Wallet, inBottomNav: false },
  { href: "/goals", label: "Goals", icon: Target, inBottomNav: false },
  { href: "/cpf", label: "CPF", icon: Landmark, inBottomNav: false },
  { href: "/insurance", label: "Insurance", icon: ShieldCheck, inBottomNav: false },
  { href: "/credit-cards", label: "Cards", icon: CreditCard, inBottomNav: false },
  { href: "/profile", label: "Profile", icon: UserRound, inBottomNav: false },
];
