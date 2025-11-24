"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Facebook, Copyright } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-12 lg:px-20 bg-background border-t border-border w-full max-w-full overflow-x-hidden">
      <div>
        <div className="space-y-10">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Left Side - Logo and Description */}
            <div className="w-full lg:max-w-md space-y-4">
              <div className="flex items-center">
                <Logo
                  width={200}
                  height={60}
                  className="w-[200px] h-[60px] object-contain"
                />
              </div>

              <p className="text-muted-foreground text-base leading-relaxed">
                Unlock the potential of your subscription ecommerce business
                with our cutting-edge analytics tool, designed to drive growth,
                optimize operations, and boost your bottom line.
              </p>

              {/* Social Media Icons */}
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-6 h-6 text-primary hover:text-primary/80 transition-colors"
                >
                  <Linkedin className="w-full h-full" />
                </Link>
                <Link
                  href="#"
                  className="w-6 h-6 text-primary hover:text-primary/80 transition-colors"
                >
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="w-6 h-6 text-primary hover:text-primary/80 transition-colors"
                >
                  <Facebook className="w-full h-full" />
                </Link>
              </div>
            </div>

            {/* Right Side - Navigation Links */}
            <div className="flex flex-col sm:flex-row gap-12 w-full lg:w-auto lg:ml-auto">
              {/* Product Column */}
              <div className="space-y-4 w-full sm:w-auto">
                <h3 className="text-primary text-base font-medium">Product</h3>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-primary transition-colors"
                  >
                    Integrations
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-primary transition-colors"
                  >
                    APL
                  </Link>
                </div>
              </div>

              {/* Company Column */}
              <div className="space-y-4 w-full sm:w-auto">
                <h3 className="text-accent text-base font-medium">Company</h3>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-accent transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-accent transition-colors"
                  >
                    Careers
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-accent transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-accent transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Legal Column */}
              <div className="space-y-4 w-full sm:w-auto">
                <h3 className="text-[#FF91C2] text-base font-medium">Legal</h3>
                <div className="space-y-3">
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-[#FF91C2] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-[#FF91C2] transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-[#FF91C2] transition-colors"
                  >
                    Security
                  </Link>
                  <Link
                    href="#"
                    className="block text-muted-foreground text-base hover:text-[#FF91C2] transition-colors"
                  >
                    Compliance
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-border pt-10">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <Copyright className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent" />
                <span className="text-base sm:text-lg bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] bg-clip-text text-transparent">
                  2025 info@Atraiva.ai All rights reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
