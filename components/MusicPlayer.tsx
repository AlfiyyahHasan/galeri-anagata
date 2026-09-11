'use client';
import { useState } from 'react';
import { Play, Pause, Music, Volume2, X } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  songTitle: string;
}

export default function MusicPlayer({ isPlaying, setIsPlaying, songTitle }: MusicPlayerProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isPanelOpen ? (
        <div className="bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(79,70,229,0.2)] w-80 sm:w-96 text-slate-100 transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Music size={18} className="animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Pemutar Musik Galeri</h4>
                <p className="text-xs text-slate-300 font-medium truncate max-w-[180px]">{songTitle}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </button>
              <div>
                <p className="text-xs font-bold text-white">{isPlaying ? 'Sedang Memutar...' : 'Musik Dijeda'}</p>
                <p className="text-[10px] text-slate-400">Lagu Utama Galeri Kita</p>
              </div>
            </div>
            <Volume2 size={18} className="text-indigo-400 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Jeda Musik" : "Putar Musik"}
            className="w-12 h-12 rounded-full bg-slate-900/90 border border-indigo-500/40 text-indigo-400 hover:text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>

          <button 
            onClick={() => setIsPanelOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-4.5 py-3 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center gap-2.5 text-xs font-bold backdrop-blur-md border border-indigo-400/30 transition-all hover:scale-105 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <Music size={14} className="animate-spin" />
            </div>
            <span>Musik Kenangan 🎶</span>
          </button>
        </div>
      )}
    </div>
  );
}