import { ReactNode } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartSidebar } from "@/components/cart/CartSidebar";

interface GuestLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function GuestLayout({ 
  children, 
  showFooter = true,
  className = ""
}: GuestLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && (
        <Footer 
          showSocial={true}
          showCompanyInfo={true}
        />
      )}
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
}