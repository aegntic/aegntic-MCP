"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/90 backdrop-blur-sm shadow-sm" : "bg-transparent"
    }`}>
      <div className="container max-w-full px-0 mx-auto">
        <div className="flex items-center justify-between border-b border-[#e0e0e0]">
          <div className="p-5 border-r border-[#e0e0e0]">
            <Link href="/" className="block">
              <span className="font-humane font-medium text-3xl">/ӕӔ/</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <Link
              href="/"
              className="relative px-6 py-4 font-plus-jakarta text-sm hover:text-black/70 transition-colors group"
            >
              <span className="block">Home</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent group-hover:bg-black transition-colors duration-300" />
            </Link>
            <Link
              href="/about"
              className="relative px-6 py-4 font-plus-jakarta text-sm hover:text-black/70 transition-colors group"
            >
              <span className="block">About</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent group-hover:bg-black transition-colors duration-300" />
            </Link>
            <Link
              href="/work"
              className="relative px-6 py-4 font-plus-jakarta text-sm hover:text-black/70 transition-colors group"
            >
              <span className="block">Work</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent group-hover:bg-black transition-colors duration-300" />
            </Link>
            <Link
              href="/contact"
              className="relative px-6 py-4 font-plus-jakarta text-sm hover:text-black/70 transition-colors group"
            >
              <span className="block">Contact</span>
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-transparent group-hover:bg-black transition-colors duration-300" />
            </Link>
          </nav>

          {/* Contact Button */}
          <div className="hidden md:block border-l border-[#e0e0e0]">
            <Link
              href="/contact"
              className="block px-6 py-4 uppercase text-xs font-semibold tracking-wider font-plus-jakarta hover:bg-black hover:text-white transition-colors duration-300"
            >
              Get in touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden border-l border-[#e0e0e0]">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-5 focus:outline-none"
                  aria-label="Open Menu"
                >
                  <span className="font-humane text-2xl">/ӕ/</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-full max-w-full">
                <div className="flex flex-col h-full bg-[#f3f3f3]">
                  <div className="p-5 border-b border-[#e0e0e0] flex justify-between items-center">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                      <span className="font-humane font-medium text-3xl">/ӕӔ/</span>
                    </Link>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2"
                      aria-label="Close Menu"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <nav className="flex flex-col p-5 space-y-4">
                    <Link
                      href="/"
                      className="py-3 border-b border-[#e0e0e0] text-2xl font-humane hover:opacity-70 transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      |-|0/v\∃
                    </Link>
                    <Link
                      href="/about"
                      className="py-3 border-b border-[#e0e0e0] text-2xl font-humane hover:opacity-70 transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      @ß0|_|†
                    </Link>
                    <Link
                      href="/work"
                      className="py-3 border-b border-[#e0e0e0] text-2xl font-humane hover:opacity-70 transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      \/\/0®|&lt;
                    </Link>
                    <Link
                      href="/contact"
                      className="py-3 border-b border-[#e0e0e0] text-2xl font-humane hover:opacity-70 transition-opacity"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ©0|\†@©†
                    </Link>
                  </nav>
                  <div className="mt-auto p-5 border-t border-[#e0e0e0]">
                    <Link
                      href="/contact"
                      className="block py-3 px-5 text-center bg-black text-white transition-opacity hover:opacity-90 font-plus-jakarta"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      6∑† !∏ †0µ©|-|
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
