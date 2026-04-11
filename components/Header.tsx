"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    
    requestAnimationFrame(() => {
      setHash(window.location.hash);
    });
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' && !hash;
    }
    if (path.startsWith('/#')) {
      return pathname === '/' && hash === path.substring(1);
    }
    return pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    if (isActive(path)) {
      return "pb-1 border-b-2 text-brand-text border-brand-primary font-medium";
    }
    return "pb-1 border-b-2 transition-colors text-gray-500 border-transparent hover:text-brand-text hover:border-gray-300";
  };

  if (pathname?.startsWith('/staff') || pathname?.startsWith('/booking')) {
    return null;
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-[72px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Holistic Dental Logo" width={44} height={44} className="w-[44px] h-[44px]" />
          <span data-no-translate className="font-[family-name:var(--font-playfair)] text-[1.15rem] md:text-[1.35rem] tracking-tight text-brand-primary leading-tight">
            <span className="font-bold">HOLISTIC</span> <span className="italic text-brand-accent">SPECIALTY</span>
          </span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 text-[13px]">
          <Link href="/" className={getLinkClass('/')} data-en="Home" data-am="መነሻ">Home</Link>
          <Link href="/services" className={getLinkClass('/services')} data-en="Services" data-am="አገልግሎቶች">Services</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/booking"
            className="inline-flex items-center justify-center px-5.5 py-2.25 bg-brand-primary text-white text-[13px] font-medium rounded-full hover:bg-brand-primary/90 transition-colors"
            data-en="Book Your Appointment"
            data-am="ቀጠሮ ይያዙ"
          >
            Book Your Appointment
          </Link>
          <button 
            id="lang-toggle"
            onClick={() => (window as any).swapLanguage && (window as any).swapLanguage()}
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-brand-primary transition-colors"
            suppressHydrationWarning
            aria-label="Switch to Amharic"
            data-current-lang="en"
          >
            <Globe className="w-[18px] h-[18px]" />
            <span>AM</span>
          </button>
        </div>
      </div>
    </header>
  );
}
