'use client';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, Trash2, Camera, ImagePlus } from "lucide-react";

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    const savedPhotos = localStorage.getItem('galeri_ppapp_photos');
    if (savedPhotos) {
      try {
        setPhotos(JSON.parse(savedPhotos));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLikeCard = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); 
    const updated = photos.map(p => {
      if (p.id === id) {
        const newIsLiked = !p.isLiked;
        return {
          ...p,
          isLiked: newIsLiked,
          likes: newIsLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    });
    setPhotos(updated);
    localStorage.setItem('galeri_ppapp_photos', JSON.stringify(updated));
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Yakin mau hapus kenangan ini dari galeri?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      localStorage.setItem('galeri_ppapp_photos', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white pb-32">
      <Navbar />
      
      {/* Hero Header Super Mewah */}
      <div className="relative overflow-hidden pt-20 pb-24 px-4 text-center border-b border-slate-800/60 bg-gradient-to-b from-[#0a0f1d] via-[#050b14] to-[#030712]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wider uppercase shadow-inner backdrop-blur-md">
            <Sparkles size={14} className="animate-spin" />
            <span>Exclusive Internship Memories Space</span>
          </div>
          
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
            Galeri Kenangan Kita ✨
          </h1>
          
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
            Arsip digital penuh canda tawa, cerita perjuangan lembur, dan momen berharga masa magang yang terekam abadi.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link href="/upload" className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <ImagePlus size={18} />
              <span>Unggah Kenangan Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Galeri */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        {photos.length === 0 ? (
          <div className="text-center py-28 bg-slate-900/40 border border-slate-800/80 rounded-3xl max-w-lg mx-auto backdrop-blur-xl shadow-2xl">
            <div className="bg-indigo-500/10 text-indigo-400 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20 shadow-inner">
              <Camera size={34} />
            </div>
            <h3 className="text-white font-extrabold text-lg">Belum Ada Kenangan Tersimpan</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Galeri ini masih kosong. Jadilah yang pertama mengabadikan foto seru kalian di sini!
            </p>
            <Link href="/upload" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all">
              Mulai Unggah Foto 🚀
            </Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {photos.map((item) => (
              <div 
                key={item.id} 
                className="relative break-inside-avoid bg-slate-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 shadow-2xl transition-all duration-500 group hover:-translate-y-1"
              >
                {/* Tombol Hapus Mengambang */}
                <button 
                  onClick={(e) => handleDeletePost(item.id, e)}
                  title="Hapus Postingan"
                  className="absolute top-3.5 right-3.5 z-20 bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white p-3 rounded-full backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl border border-slate-700/50 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>

                <Link href={`/posts/${item.id}`} className="block">
                  <div className="relative overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-auto">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700 max-h-[440px]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                      <span className="text-xs text-slate-200 font-semibold bg-indigo-600/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-indigo-400/30 shadow-xl">
                        Buka Detail & Diskusi 💬
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="font-bold text-slate-100 text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      Oleh: {item.author}
                    </p>
                    
                    <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold">
                      <button 
                        onClick={(e) => handleLikeCard(item.id, e)}
                        className={`flex items-center gap-2 transition-all ${item.isLiked ? 'text-rose-500 scale-105 font-bold' : 'text-slate-400 hover:text-rose-500'}`}
                      >
                        <Heart size={18} className={item.isLiked ? 'fill-rose-500' : ''} />
                        <span>{item.likes || 0} Suka</span>
                      </button>
                      <div className="flex items-center gap-2 text-slate-400">
                        <MessageCircle size={18} />
                        <span>{item.comments?.length || 0} Komentar</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}