import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 bg-brand-surface border-t border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Holistic Dental Logo" width={40} height={40} className="w-10 h-10" />
          <span className="font-serif text-lg text-brand-primary">
            <span className="font-bold">HOLISTIC</span> <span className="italic text-brand-accent">SPECIALTY</span>
          </span>
        </div>

        <div className="text-xs text-gray-400 max-w-xs text-center md:text-right"
             data-en={`© ${new Date().getFullYear()} Holistic Specialty Dental. Designed for Clinical Serenity.`}
             data-am={`© ${new Date().getFullYear()} Holistic Specialty Dental. ክሊኒካዊ በሆነ ጸጥታ የተነደፈ።`}>
          &copy; {new Date().getFullYear()} Holistic Specialty Dental. Designed for Clinical Serenity.
        </div>

        {/* Staff Portal — subtle, tucked in footer corner */}
        <Link
          href="/staff"
          className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors tracking-widest uppercase"
        >
          Staff Portal
        </Link>
      </div>
    </footer>
  );
}
