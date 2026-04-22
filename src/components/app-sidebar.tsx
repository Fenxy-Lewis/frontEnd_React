import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings2,
  SquareTerminal,
  Component,
  ShoppingCart,
  UserCircle,
  House,
  QrCode,
  LogOut,
  ChevronLeft,
  Timer,
  type LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// ─── Navigation Data ───
type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Main",
    items: [
      { title: "Home", url: "/admin/home", icon: House },
      { title: "Products", url: "/admin/product", icon: SquareTerminal },
      { title: "Categories", url: "/admin/category", icon: Component },
      { title: "Customers", url: "/admin/customer", icon: ShoppingCart },
      { title: "Users", url: "/admin/user", icon: UserCircle },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "POS System", url: "/admin/pos", icon: QrCode },
      { title: "Expiry Control", url: "/admin/product-expire", icon: Timer },
      { title: "Settings", url: "/settings/general", icon: Settings2 },
    ],
  },
];

const user = {
  name: "Fenxy",
  email: "lunsereyvorth@gmail.com",
  avatar: "/public/img/photo_2024-11-28_08-45-41.jpg",
};

// ─── Sidebar Context ───
type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarCtx = React.createContext<SidebarContextType>({
  expanded: true,
  setExpanded: () => {},
});

// ─── NavItem Component ───
function NavLink({ item, expanded }: { item: NavItem; expanded: boolean }) {
  const { pathname } = useLocation();
  const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

  const linkContent = (
    <Link
      to={item.url}
      className={cn(
        "group/nav-link relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-700 shadow-sm shadow-emerald-500/5 dark:text-emerald-400"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gradient-to-b from-emerald-500 to-teal-600" />
      )}

      <item.icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
          isActive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-gray-400 group-hover/nav-link:text-gray-600 dark:text-gray-500",
        )}
      />

      {expanded && <span className="truncate">{item.title}</span>}

      {expanded && item.badge && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-100 px-1.5 text-[10px] font-bold text-emerald-700">
          {item.badge}
        </span>
      )}
    </Link>
  );

  if (!expanded) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}

// ─── Main Sidebar Component ───
export function AppSidebar() {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <TooltipProvider>
      <SidebarCtx.Provider value={{ expanded, setExpanded }}>
        <aside
          className={cn(
            "group/sidebar sticky top-0 flex h-screen flex-col border-r border-gray-200/80 bg-white transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950",
            expanded ? "w-[260px]" : "w-[72px]",
          )}
        >
          {/* ── Header / Brand ── */}
          <div
            className={cn(
              "flex items-center border-b border-gray-100 dark:border-gray-800/60",
              expanded
                ? "justify-between px-5 py-4"
                : "justify-center px-2 py-4",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <ShoppingCart className="h-4.5 w-4.5 text-white" />
              </div>
              {expanded && (
                <div className="overflow-hidden">
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight dark:text-white">
                    SALA POS
                  </h2>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Admin Panel
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-6">
            {navSections.map((section) => (
              <div key={section.label}>
                {expanded && (
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {section.label}
                  </p>
                )}
                {!expanded && section.label !== navSections[0].label && (
                  <Separator className="mb-3 mx-auto w-6" />
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavLink key={item.url} item={item} expanded={expanded} />
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* ── Footer / User ── */}
          {/* Collapse Toggle */}
          <div
            className={cn(
              "flex items-center border-t border-gray-100 dark:border-gray-800/60",
              expanded ? "justify-end px-4 py-2" : "justify-center py-2",
            )}
          >
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  !expanded && "rotate-180",
                )}
              />
            </button>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800/60">
            {/* User Profile */}
            <div
              className={cn(
                "flex items-center gap-3 p-3 mx-2 my-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer",
                !expanded && "justify-center mx-0 px-0",
              )}
            >
              <Avatar className="h-8 w-8 shrink-0 ring-2 ring-gray-100 dark:ring-gray-800">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-bold">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {expanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              )}
              {expanded && (
                <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </aside>
      </SidebarCtx.Provider>
    </TooltipProvider>
  );
}
