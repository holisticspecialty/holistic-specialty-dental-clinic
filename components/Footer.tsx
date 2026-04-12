import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 bg-brand-surface border-t border-gray-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        {/* Left: Brand/Logo */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <Image src="/logo.svg" alt="Holistic Dental Logo" width={32} height={32} className="w-8 h-8" />
          <span data-no-translate className="font-[family-name:var(--font-playfair)] text-base text-brand-primary">
            <span className="font-bold">HOLISTIC</span> <span className="italic text-brand-accent">SPECIALTY</span>
          </span>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center gap-6 justify-center">
          <a
            href="https://www.facebook.com/people/Holistic-Specialty-Dental-Clinic/61565308895023/#"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          <a
            href="https://www.instagram.com/holistic.dental.clinic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://www.tiktok.com/@holistic.dental.clinic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-primary transition-colors"
            aria-label="TikTok"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
          </a>
        </div>

        {/* Right: Staff Portal & Copyright */}
        <div className="flex flex-col items-center md:items-end gap-1.5">
          <Link
            href="/staff"
            className="text-[9px] text-gray-300 hover:text-gray-500 transition-colors tracking-widest uppercase"
          >
            Staff Portal
          </Link>

          <div
            className="text-[10px] text-gray-400 whitespace-nowrap"
            data-en={`© ${new Date().getFullYear()} Holistic Specialty Dental. Designed for Clinical Serenity.`}
            data-am={`© ${new Date().getFullYear()} Holistic Specialty Dental. ክሊኒካዊ በሆነ ጸጥታ የተነደፈ።`}
          >
            &copy; {new Date().getFullYear()} Holistic Specialty Dental. Designed for Clinical Serenity.
          </div>
        </div>
      </div>
    </footer>
  );
}
