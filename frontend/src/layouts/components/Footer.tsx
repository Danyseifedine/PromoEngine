import { Heart, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FooterProps {
  showSocial?: boolean;
  showCompanyInfo?: boolean;
  className?: string;
}

export function Footer({ 
  showSocial = true, 
  showCompanyInfo = true,
  className = ""
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`w-full border-t bg-background ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between space-y-4 py-6 md:h-20 md:flex-row md:py-0 md:space-y-0">
        {/* Company Info */}
        {showCompanyInfo && (
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with{" "}
              <Heart className="inline h-4 w-4 text-red-500" />{" "}
              by PromoEngine Team
            </p>
            <Separator orientation="vertical" className="hidden h-4 md:block" />
            <p className="text-center text-sm text-muted-foreground md:text-left">
              � {currentYear} PromoEngine. All rights reserved.
            </p>
          </div>
        )}

        {/* Social Links */}
        {showSocial && (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>

      {/* Simple Footer variant for auth pages */}
      {!showCompanyInfo && !showSocial && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-center">
          <p className="text-center text-sm text-muted-foreground">
            � {currentYear} PromoEngine
          </p>
        </div>
      )}
    </footer>
  );
}