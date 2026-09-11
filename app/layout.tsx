'use client'; // Pastikan pakai 'client' agar state pemutar musiknya stabil
import { useState } from 'react';
import MusicPlayer from '@/components/MusicPlayer';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoId = 'oa2iNq630nM'; // Link lagu utama kamu
  const songTitle = 'Lagu Kenangan Utama ✨';

  return (
    <html lang="id">
      <body className="bg-[#020617] text-slate-100 antialiased">
        {/* Iframe YouTube Tersembunyi (Abadi di layout utama, tidak akan mati saat nambah foto) */}
        <div className="hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&enablejsapi=1`}
            allow="autoplay"
            title="Persistent YouTube Audio Player"
          />
        </div>

        {/* Konten Halaman Website */}
        {children}

        {/* Widget Pemutar Musik Melayang */}
        <MusicPlayer 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying} 
          songTitle={songTitle} 
        />
      </body>
    </html>
  );
}