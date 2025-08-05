import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  Tag,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Home,
  ShoppingBag,
  Percent,
  PlusCircle,
  List,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";

interface SidebarItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: SidebarItem[];
  roles?: ('admin' | 'customer')[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ['admin', 'customer'],
  },
  {
    title: "Products",
    icon: Package,
    roles: ['admin'],
    children: [
      {
        title: "All Products",
        href: "/products",
        icon: List,
        roles: ['admin'],
      },
      {
        title: "Add Product",
        href: "/products/create",
        icon: PlusCircle,
        roles: ['admin'],
      },
      {
        title: "Categories",
        href: "/categories",
        icon: Tag,
        roles: ['admin'],
      },
    ],
  },
  {
    title: "Promotions",
    icon: Percent,
    roles: ['admin'],
    children: [
      {
        title: "All Promotions",
        href: "/promotions",
        icon: List,
        roles: ['admin'],
      },
      {
        title: "Create Promotion",
        href: "/promotions/create",
        icon: PlusCircle,
        roles: ['admin'],
      },
      {
        title: "Rules Engine",
        href: "/promotions/rules",
        icon: Settings,
        roles: ['admin'],
      },
    ],
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
    roles: ['admin'],
    badge: "New",
  },
  {
    title: "Shop",
    href: "/shop",
    icon: ShoppingBag,
    roles: ['customer'],
  },
  {
    title: "My Orders",
    href: "/orders",
    icon: Package,
    roles: ['customer'],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ['customer'],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ['admin'],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ['admin', 'customer'],
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { isAdmin, isCustomer } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isItemVisible = (item: SidebarItem) => {
    if (!item.roles) return true;
    return item.roles.some(role => {
      if (role === 'admin') return isAdmin();
      if (role === 'customer') return isCustomer();
      return false;
    });
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isParentActive = (children: SidebarItem[]) => {
    return children.some(child => child.href && isActive(child.href));
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    if (!isItemVisible(item)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.title);
    const itemIsActive = item.href ? isActive(item.href) : false;
    const parentIsActive = hasChildren ? isParentActive(item.children!) : false;

    if (hasChildren) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-9",
              level > 0 && "ml-6",
              (parentIsActive || isExpanded) && "bg-accent text-accent-foreground"
            )}
            onClick={() => toggleExpanded(item.title)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-2 h-5 text-xs">
                {item.badge}
              </Badge>
            )}
            {isExpanded ? (
              <ChevronDown className="ml-2 h-4 w-4" />
            ) : (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
          {isExpanded && (
            <div className="mt-1 space-y-1">
              {item.children!.map(child => renderSidebarItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={cn(
          "w-full justify-start h-9",
          level > 0 && "ml-6",
          itemIsActive && "bg-accent text-accent-foreground"
        )}
        asChild
      >
        <Link to={item.href!}>
          <item.icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{item.title}</span>
          {item.badge && (
            <Badge variant="secondary" className="ml-2 h-5 text-xs">
              {item.badge}
            </Badge>
          )}
        </Link>
      </Button>
    );
  };

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Logo */}
        <div className="px-3 py-2">
          <Link to="/" className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <h2 className="ml-2 text-lg font-semibold">PromoEngine</h2>
          </Link>
        </div>

        {/* Navigation */}
        <div className="px-3">
          <div className="space-y-1">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </div>
        </div>

        <Separator className="mx-3" />

        {/* Additional actions or info */}
        <div className="px-3">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-1">
              Use Ctrl+K to quickly search through your promotions and products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}