"use client";
import Link from "next/link";

const Footer = () => {
  // Using constants for l33t speak text to avoid parsing issues
  const WORK_TOGETHER = "l3t's w0rk t0g3th3r?";
  const EMAIL = "h3ll0@aegntic.c0m";
  const HOME = "h0m3";
  const ABOUT = "ab0ut";
  const CONTACT = "c0ntact";
  const SERVICES = "s3rv1c3s";
  const BLOG = "bl0g";
  const CREATED_BY = "cr3at3d by";

  return (
    <footer className="bg-[#f3f3f3] border-t border-[#e0e0e0]">
      <div className="container max-w-full px-0 mx-auto">
        {/* Say Hi Section */}
        <div className="py-16 md:py-24 text-center">
          <div className="max-w-2xl mx-auto px-5">
            <div className="mb-5">
              <p className="text-sm font-plus-jakarta text-[#666] mb-5">{WORK_TOGETHER}</p>
            </div>
            <div className="flex items-center justify-center space-x-2 mb-8">
              <h2 className="text-5xl md:text-7xl font-humane font-medium">$@¥</h2>
              <div className="w-16 h-20 md:w-24 md:h-28 bg-[#f8f8f8] border border-[#e0e0e0] flex items-center justify-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full overflow-hidden shadow-sm">
                  <img
                    src="/images/gears-image.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-5xl md:text-7xl font-humane font-medium tracking-wide">h1!</h2>
            </div>

            <div className="mb-8">
              <Link
                href="/contact"
                className="text-lg font-plus-jakarta hover:underline"
              >
                {EMAIL}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#e0e0e0] py-5">
          <div className="flex flex-col md:flex-row items-center justify-between px-5">
            {/* Footer Navigation */}
            <nav className="flex items-center justify-center md:justify-start space-x-6 mb-5 md:mb-0">
              <Link
                href="/"
                className="text-xs font-plus-jakarta text-[#666] hover:text-black transition-colors"
              >
                {HOME}
              </Link>
              <Link
                href="/about"
                className="text-xs font-plus-jakarta text-[#666] hover:text-black transition-colors"
              >
                {ABOUT}
              </Link>
              <Link
                href="/contact"
                className="text-xs font-plus-jakarta text-[#666] hover:text-black transition-colors"
              >
                {CONTACT}
              </Link>
              <Link
                href="/services"
                className="text-xs font-plus-jakarta text-[#666] hover:text-black transition-colors"
              >
                {SERVICES}
              </Link>
              <Link
                href="/blog"
                className="text-xs font-plus-jakarta text-[#666] hover:text-black transition-colors"
              >
                {BLOG}
              </Link>
            </nav>

            {/* Copyright */}
            <div className="text-xs font-plus-jakarta text-[#666]">
              <span className="mr-2">{CREATED_BY}</span>
              <span className="font-medium">ӕӔ™</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
