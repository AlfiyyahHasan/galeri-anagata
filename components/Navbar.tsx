import Link from 'next/link';
import { Camera, PlusCircle, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-lg text-white group">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Camera size={20} />
          </div>
          <span className="tracking-tight flex items-center gap-1.5">
            MagangSpace <Sparkles size={14} className="text-blue-400" />
          </span>
        </Link>
        
        <Link href="/upload" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4.5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
          <PlusCircle size={18} />
          <span>Upload Foto</span>
        </Link>
      </div>
    </header>
  );
}