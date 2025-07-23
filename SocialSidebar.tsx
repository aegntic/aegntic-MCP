"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const SocialSidebar = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const percentage = Math.floor((scrollTop / trackLength) * 100);
      setScrollPercentage(percentage);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Init on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Left Scroll Indicator */}
      <div className="fixed top-1/2 left-5 -translate-y-1/2 z-40 hidden md:flex flex-col items-center">
        <div className="w-0.5 h-20 bg-[#e0e0e0] rounded-full overflow-hidden">
          <div
            className="w-full bg-black transition-all duration-200 ease-out rounded-full"
            style={{ height: `${scrollPercentage}%` }}
          />
        </div>
        <span className="uppercase text-[10px] tracking-wider font-plus-jakarta mt-2 rotate-90 origin-center translate-y-6">
          $©r0ll
        </span>
      </div>

      {/* Right Social Links */}
      <div className="fixed top-1/2 right-5 -translate-y-1/2 z-40 hidden md:flex flex-col items-center space-y-5">
        <Link
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black/70 transition-colors"
          aria-label="Twitter"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.55 2H14.7L9.97 7.5L15.5 14H11.3L7.86 10.06L3.92 14H1.76L6.83 8.11L1.5 2H5.81L8.92 5.56L12.55 2ZM11.77 12.8H12.9L5.31 3.16H4.11L11.77 12.8Z" fill="currentColor"/>
          </svg>
        </Link>
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black/70 transition-colors"
          aria-label="Instagram"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1.44144C10.1366 1.44144 10.3894 1.44144 11.1914 1.48807C13.1673 1.56466 14.4353 2.8327 14.5119 4.80856C14.5586 5.6106 14.5586 5.8634 14.5586 8.00001C14.5586 10.1367 14.5586 10.3895 14.5119 11.1915C14.4353 13.1674 13.1673 14.4354 11.1914 14.512C10.3894 14.5586 10.1366 14.5586 8 14.5586C5.86338 14.5586 5.61058 14.5586 4.80854 14.512C2.8327 14.4354 1.56466 13.1674 1.48807 11.1915C1.44144 10.3895 1.44144 10.1367 1.44144 8.00001C1.44144 5.8634 1.44144 5.6106 1.48807 4.80856C1.56466 2.8327 2.8327 1.56466 4.80854 1.48807C5.61058 1.44144 5.86338 1.44144 8 1.44144ZM8 0C5.82772 0 5.55485 0 4.76682 0.046636C1.84038 0.14658 0.14658 1.84038 0.046636 4.76682C0 5.55486 0 5.82772 0 8C0 10.1723 0 10.4452 0.046636 11.2332C0.14658 14.1596 1.84038 15.8534 4.76682 15.9534C5.55485 16 5.82772 16 8 16C10.1723 16 10.4451 16 11.2332 15.9534C14.1596 15.8534 15.8534 14.1596 15.9534 11.2332C16 10.4452 16 10.1723 16 8C16 5.82772 16 5.55486 15.9534 4.76682C15.8534 1.84038 14.1596 0.14658 11.2332 0.046636C10.4451 0 10.1723 0 8 0ZM8 3.89194C5.73111 3.89194 3.89194 5.73111 3.89194 8C3.89194 10.2689 5.73111 12.1081 8 12.1081C10.2689 12.1081 12.1081 10.2689 12.1081 8C12.1081 5.73111 10.2689 3.89194 8 3.89194ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM12.2705 3.72954C12.2705 4.25982 11.8403 4.68991 11.3101 4.68991C10.7798 4.68991 10.3497 4.25982 10.3497 3.72954C10.3497 3.19926 10.7798 2.76917 11.3101 2.76917C11.8403 2.76917 12.2705 3.19926 12.2705 3.72954Z" fill="currentColor"/>
          </svg>
        </Link>
        <Link
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black/70 transition-colors"
          aria-label="LinkedIn"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.8189 0H1.18111C0.529111 0 0 0.517333 0 1.15378V14.8462C0 15.4827 0.529111 16 1.18111 16H14.8189C15.4709 16 16 15.4827 16 14.8462V1.15378C16 0.517333 15.4709 0 14.8189 0ZM4.74844 13.6324H2.37156V5.99911H4.74844V13.6324ZM3.56 4.95467C2.8 4.95467 2.18311 4.33244 2.18311 3.57733C2.18311 2.82222 2.8 2.2 3.56 2.2C4.32 2.2 4.93689 2.82222 4.93689 3.57733C4.93689 4.33244 4.32 4.95467 3.56 4.95467ZM13.6324 13.6324H11.2596V9.92C11.2596 9.03689 11.2418 7.89778 10.0204 7.89778C8.78133 7.89778 8.59289 8.85689 8.59289 9.85244V13.6324H6.22311V5.99911H8.50133V7.04356H8.53689C8.85689 6.44267 9.63644 5.81333 10.7876 5.81333C13.1893 5.81333 13.6324 7.39022 13.6324 9.44889V13.6324Z" fill="currentColor"/>
          </svg>
        </Link>
        <Link
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-black/70 transition-colors"
          aria-label="Facebook"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z" fill="currentColor"/>
          </svg>
        </Link>
      </div>
    </>
  );
};

export default SocialSidebar;
