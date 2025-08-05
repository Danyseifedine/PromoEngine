import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "./components/Footer";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  className?: string;
}

export function AuthLayout({ 
  children, 
  title,
  subtitle,
  showBackButton = false,
  backTo = "/",
  className = ""
}: AuthLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 md:p-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Home className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">PromoEngine</span>
        </Link>

        {/* Back Button */}
        {showBackButton && (
          <Button variant="ghost" asChild>
            <Link to={backTo} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
          </Button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Title and Subtitle */}
          {(title || subtitle) && (
            <div className="text-center">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form Content */}
          <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-6">
            {children}
          </div>

          {/* Additional Links or Info */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link 
                to="/terms" 
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link 
                to="/privacy" 
                className="text-primary hover:text-primary/80 underline underline-offset-4"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer 
        showSocial={false}
        showCompanyInfo={false}
      />
    </div>
  );
}