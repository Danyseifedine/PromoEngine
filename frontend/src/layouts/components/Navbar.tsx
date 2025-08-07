import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, ShoppingBag, Info, ShoppingCart, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Welcome to PromoEngine",
    icon: Home,
  },
  {
    title: "Shop",
    href: "/shop",
    description: "Browse our products",
    icon: ShoppingBag,
    requiresAuth: true,
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about us",
    icon: Info,
  },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user, isLoading } = useAuthStore();
  const { cart, toggleCart, getCart } = useCartStore();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getCart();
    }
  }, [isAuthenticated, getCart]);

  const cartItemCount = cart?.cart_items?.length || 0;

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-gray-200/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80", className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-8 flex">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 group-hover:bg-purple-700 transition-all duration-300 group-hover:scale-110">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-black text-xl text-gray-900 sm:inline-block group-hover:text-purple-600 transition-colors duration-300">PromoEngine</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between">
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isShop = item.title === "Shop";
              const isDisabled = item.requiresAuth && !isAuthenticated;
              return (
                <Link
                  key={item.href}
                  to={isDisabled ? "#" : item.href}
                  tabIndex={isDisabled ? -1 : 0}
                  aria-disabled={isDisabled}
                  className={
                    cn(
                      "group inline-flex h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5",
                      isDisabled
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-gray-700 hover:text-purple-600 hover:bg-purple-50/80"
                    )
                  }
                  onClick={e => {
                    if (isDisabled) e.preventDefault();
                  }}
                >
                  {item.icon && <item.icon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />}
                  {item.title}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon - Only show when authenticated */}
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative hidden md:inline-flex text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 font-semibold transition-all duration-300 hover:-translate-y-0.5 h-10 w-10"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative hidden md:inline-flex text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 transition-all duration-300 hover:-translate-y-0.5 h-10 w-10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {user?.type === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    disabled={isLoading}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                asChild
                className="hidden md:inline-flex text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            {!isAuthenticated && (
              <Button
                asChild
                className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
              >
                <Link to="/register">Get Started</Link>
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="md:hidden p-2 hover:bg-purple-50/80 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Menu className="h-6 w-6 text-gray-700" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/20">
                <div className="flex items-center space-x-3 pb-8 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-black text-xl text-gray-900">PromoEngine</span>
                </div>
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const isShop = item.title === "Shop";
                    const isDisabled = item.requiresAuth && !isAuthenticated;
                    return (
                      <Link
                        key={item.href}
                        to={isDisabled ? "#" : item.href}
                        tabIndex={isDisabled ? -1 : 0}
                        aria-disabled={isDisabled}
                        onClick={e => {
                          if (isDisabled) {
                            e.preventDefault();
                          } else {
                            setIsOpen(false);
                          }
                        }}
                        className={
                          cn(
                            "flex items-center space-x-3 px-4 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 group",
                            isDisabled
                              ? "text-gray-400 cursor-not-allowed bg-gray-100"
                              : "text-gray-700 hover:text-purple-600 hover:bg-purple-50/80"
                          )
                        }
                      >
                        {item.icon && <item.icon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />}
                        <span>{item.title}</span>
                      </Link>
                    );
                  })}
                  <div className="flex flex-col space-y-3 pt-8 border-t border-gray-200/50 mt-6">
                    <Button
                      variant="ghost"
                      asChild
                      className="justify-start h-12 text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 font-semibold transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="justify-start h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
                    >
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}