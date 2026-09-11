'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, ImagePlus, CheckCircle2, CloudUpload, X } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Fungsi konversi file asli dari perangkat/folder ke base64
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Waduh, itu bukan file gambar! Harap pilih file foto (JPG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !imagePreview) {
      alert('Mohon lengkapi Judul, Inisial/Nama, dan pilih Fotonya terlebih dahulu ya! ✨');
      return;
    }

    const newPhoto = {
      id: Date.now().toString(),
      title,
      image: imagePreview,
      author,
      description,
      likes: 0,
      isLiked: false,
      comments: []
    };

    const existing = localStorage.getItem('galeri_ppapp_photos');
    const parsed = existing ? JSON.parse(existing) : [];
    localStorage.setItem('galeri_ppapp_photos', JSON.stringify([newPhoto, ...parsed]));

    alert('Yeay! Kenangan berhasil diunggah ke galeri utama! 🎉');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-16 px-4 sm:px-6 relative overflow-hidden flex items-center justify-center">
      {/* Background Neon Glow Effects yang Super Wah */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/15 blur-[160px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 mb-8 transition-all bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 backdrop-blur-md"
        >
          <ArrowLeft size={16} />
          <span>Kembali ke Beranda Galeri</span>
        </Link>

        {/* Kotak Utama dengan Efek Kaca Futuristik */}
        <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] border border-slate-700/80 p-8 sm:p-10 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
          
          {/* Header Card */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 text-white p-4 rounded-3xl shadow-xl shadow-indigo-600/30">
              <CloudUpload size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Unggah Kenangan ✨
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Pilih foto dari folder perangkatmu atau seret langsung ke sini.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Area Drag and Drop / Pilih Folder File Asli */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                File Foto Perangkat / Folder 📂
              </label>
              
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                  isDragging 
                    ? 'border-indigo-400 bg-indigo-500/20 scale-[1.01]' 
                    : 'border-slate-700 hover:border-indigo-500 bg-slate-950/70 shadow-inner'
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl group/img">
                    <img src={imagePreview} alt="Pratinjau Foto" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all duration-300 gap-2">
                      <span className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg">
                        Ganti dengan Foto Lain
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 space-y-3 pointer-events-none">
                    <div className="w-18 h-18 rounded-3xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-300">
                      <ImagePlus size={32} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-200">
                        Klik untuk pilih file dari folder perangkat
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        atau *drag and drop* gambar ke dalam kotak ini
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/80 text-[11px] font-medium text-slate-300 border border-slate-700">
                      <CheckCircle2 size={13} className="text-indigo-400" />
                      Mendukung JPG, PNG, WEBP
                    </div>
                  </div>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                />
              </div>
            </div>

            {/* Input Fields Lainnya */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  Judul Momen / Kegiatan 📌
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Keseruan hari terakhir magang bareng tim 😭" 
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  Nama atau Inisial Pengirim (Contoh: AS) ✍️
                </label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Contoh: AS & Geng Magang" 
                  required
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  Cerita di Balik Foto (Opsional) 💬
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Tulis cerita seru, pesan, atau kenangan lucu di sini..." 
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white transition-all resize-none shadow-inner"
                ></textarea>
              </div>
            </div>

            {/* Tombol Submit Wah */}
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-400 text-white font-black py-4.5 rounded-2xl text-sm transition-all shadow-xl shadow-indigo-600/40 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer tracking-wide uppercase border border-indigo-400/30"
            >
              <Sparkles size={18} className="animate-spin" />
              <span>Publikasikan ke Galeri Utama</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}