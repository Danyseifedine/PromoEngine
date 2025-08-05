import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  showFooter?: boolean;
  className?: string;
}

export function AdminLayout({ 
  children, 
  title,
  showFooter = false,
  className = ""
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex min-h-0 flex-1 flex-col border-r border-border bg-background">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="relative z-10 flex h-14 flex-shrink-0 border-b border-border bg-background">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open sidebar</span>
            </Button>

            {/* Header Content */}
            <div className="flex flex-1">
              <Header 
                title={title}
                showSearch={true}
                showNotifications={true}
              />
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto focus:outline-none">
            <div className="relative">
              <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                  {children}
                </div>
              </div>
            </div>
          </main>

          {/* Footer (optional) */}
          {showFooter && (
            <Footer 
              showSocial={false}
              showCompanyInfo={false}
              className="border-t"
            />
          )}
        </div>
      </div>
    </div>
  );
}