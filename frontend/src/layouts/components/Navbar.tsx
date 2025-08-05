import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Home, ShoppingBag, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
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
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about us",
    icon: Info,
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch",
    icon: Mail,
  },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="group inline-flex h-10 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 transition-all duration-300 hover:-translate-y-0.5"
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />}
                {item.title}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              asChild 
              className="hidden md:inline-flex text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Link to="/login">Sign In</Link>
            </Button>
            <Button 
              asChild 
              className="hidden md:inline-flex bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
            >
              <Link to="/register">Get Started</Link>
            </Button>

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
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-base font-semibold text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 rounded-xl transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                      {item.icon && <item.icon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />}
                      <span>{item.title}</span>
                    </Link>
                  ))}
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