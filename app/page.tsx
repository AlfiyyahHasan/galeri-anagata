'use client';
import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { Heart, MessageCircle, Sparkles, Trash2, Camera, ImagePlus, Loader2 } from "lucide-react";

export default function Home() {
  // Ambil data awal dari localStorage jika ada agar langsung tampil tanpa menunggu
  const [photos, setPhotos] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cache_photos');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(photos.length === 0);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        if (result.success && result.data) {
          setPhotos(result.data);
          // Simpan ke localStorage agar instan saat refresh berikutnya
          localStorage.setItem('cache_photos', JSON.stringify(result.data));
        }
      } catch (error) {
        console.error('Terjadi kesalahan saat memuat foto:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  const handleLikeCard = async (id: number, e: React.MouseEvent) => {
    e.preventDefault(); 
    const photo = photos.find(p => p.id === id);
    if (!photo) return;

    const newIsLiked = !photo.is_liked;
    const newLikes = newIsLiked ? (photo.likes || 0) + 1 : Math.max(0, (photo.likes || 0) - 1);

    const updatedPhotos = photos.map(p => p.id === id ? { ...p, is_liked: newIsLiked, likes: newLikes } : p);
    setPhotos(updatedPhotos);
    localStorage.setItem('cache_photos', JSON.stringify(updatedPhotos));

    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_liked: newIsLiked, likes: newLikes }),
      });
    } catch (error) {
      console.error('Gagal memperbarui like:', error);
    }
  };

  const handleDeletePost = async (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Yakin mau hapus kenangan ini dari galeri?')) {
      try {
        const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if (result.success) {
          const filtered = photos.filter(p => p.id !== id);
          setPhotos(filtered);
          localStorage.setItem('cache_photos', JSON.stringify(filtered));
        } else {
          alert('Gagal menghapus postingan');
        }
      } catch (error) {
        console.error('Gagal menghapus foto:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-indigo-500 selection:text-white pb-32 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Header Responsif */}
      <div className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 text-center border-b border-slate-800/60 bg-gradient-to-b from-[#0a0f1d] via-[#050b14] to-[#030712]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[200px] sm:h-[350px] bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 blur-[120px] sm:blur-[160px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] sm:text-xs font-semibold tracking-wider uppercase shadow-inner backdrop-blur-md">
            <Sparkles size={14} className="animate-spin flex-shrink-0" />
            <span>Exclusive Internship Memories Space</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm px-2">
            Galeri Kenangan Kita ✨
          </h1>
          
          <p className="text-slate-400 text-xs sm:text-base max-w-xl mx-auto font-normal leading-relaxed px-4">
            Arsip digital penuh canda tawa, cerita perjuangan lembur, dan momen berharga masa magang yang terekam abadi.
          </p>

          <div className="pt-2 sm:pt-4 flex justify-center">
            <Link href="/upload" className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
              <ImagePlus size={18} />
              <span>Unggah Kenangan Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Galeri yang Dioptimalkan */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-10 sm:pt-16">
        {isLoading ? (
          <div className="text-center py-28 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              Menarik kenangan indah dari server... Sebentar ya! ✨
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 sm:py-28 bg-slate-900/40 border border-slate-800/80 rounded-3xl max-w-lg mx-auto backdrop-blur-xl shadow-2xl px-6">
            <div className="bg-indigo-500/10 text-indigo-400 w-16 sm:w-20 h-16 sm:h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-indigo-500/20 shadow-inner">
              <Camera size={30} />
            </div>
            <h3 className="text-white font-extrabold text-base sm:text-lg">Belum Ada Kenangan Tersimpan</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Galeri ini masih kosong. Jadilah yang pertama mengabadikan foto seru kalian di sini!
            </p>
            <Link href="/upload" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all">
              Mulai Unggah Foto 🚀
            </Link>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 lg:gap-8 [column-fill:_balance]">
            {photos.map((item) => (
              <div 
                key={item.id} 
                className="relative break-inside-avoid mb-4 sm:mb-6 lg:mb-8 bg-slate-900/80 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 shadow-2xl transition-all duration-500 group"
              >
                {/* Tombol Hapus Mengambang */}
                <button 
                  onClick={(e) => handleDeletePost(item.id, e)}
                  title="Hapus Postingan"
                  className="absolute top-3.5 right-3.5 z-20 bg-slate-950/80 sm:opacity-0 group-hover:opacity-100 hover:bg-rose-600 text-slate-300 hover:text-white p-2.5 sm:p-3 rounded-full backdrop-blur-xl transition-all duration-300 shadow-xl border border-slate-700/50 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>

                <Link href={`/posts/${item.id}`} className="block">
                  <div className="relative overflow-hidden bg-slate-950 w-full">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 max-h-[500px]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5">
                      <span className="text-xs text-slate-200 font-semibold bg-indigo-600/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-indigo-400/30 shadow-xl">
                        Buka Detail & Diskusi 💬
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <h2 className="font-bold text-slate-100 text-base sm:text-lg group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse flex-shrink-0"></span>
                      <span className="truncate">Oleh: {item.author}</span>
                    </p>
                    
                    <div className="flex items-center justify-between sm:justify-start sm:gap-6 mt-4 sm:mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold">
                      <button 
                        onClick={(e) => handleLikeCard(item.id, e)}
                        className={`flex items-center gap-1.5 sm:gap-2 transition-all ${item.is_liked ? 'text-rose-500 scale-105 font-bold' : 'text-slate-400 hover:text-rose-500'}`}
                      >
                        <Heart size={18} className={item.is_liked ? 'fill-rose-500 flex-shrink-0' : 'flex-shrink-0'} />
                        <span>{item.likes || 0} Suka</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                        <MessageCircle size={18} className="flex-shrink-0" />
                        <span>{item.commentCount || 0} Komentar</span>
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