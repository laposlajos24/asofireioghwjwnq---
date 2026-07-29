import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Sparkles, Image, Heart, FolderOpen } from 'lucide-react';
import { SaveSlotModal } from '../ui/SaveSlotModal';

export const MainMenuView = () => {
  const { setCurrentView } = useGame();
  const [modalMode, setModalMode] = useState(null); // 'new' | 'continue' | null

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0f0f1a] text-white px-4 overflow-hidden select-none">
      {/* Dynamic Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[120px] -top-20 -left-20 pointer-events-none animate-pulse" />
      <div className="absolute w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-[120px] -bottom-20 -right-20 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Title Container */}
      <div className="z-10 text-center mb-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide mb-6 backdrop-blur-sm">
          <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          <span>Anthromorphic Dating Sim Engine</span>
        </div>

        <h1 className="text-6xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-fuchsia-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
          AnthroDate
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xs sm:max-w-md font-medium">
          Swipe, chat, date, and survive. Choose wisely.
        </p>
      </div>

      {/* Menu Actions */}
      <div className="z-10 flex flex-col gap-3.5 w-full max-w-xs">
        <button
          onClick={() => setModalMode('new')}
          className="group relative flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-950/50 transition-all duration-200 active:scale-95 border border-fuchsia-400/30"
        >
          <Play className="w-5 h-5 fill-white" />
          <span className="text-base tracking-wide">New Game</span>
          <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-fuchsia-200 absolute right-4" />
        </button>

        <button
          onClick={() => setModalMode('continue')}
          className="flex items-center justify-center gap-3 w-full py-3.5 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 font-semibold rounded-2xl border border-slate-700/60 transition-all duration-200 active:scale-95 backdrop-blur-sm"
        >
          <FolderOpen className="w-5 h-5 text-fuchsia-400" />
          <span className="text-base tracking-wide">Continue</span>
        </button>

        <button
          onClick={() => setCurrentView('gallery')}
          className="flex items-center justify-center gap-3 w-full py-3.5 bg-slate-900/80 hover:bg-slate-800/90 text-slate-200 font-semibold rounded-2xl border border-slate-700/60 transition-all duration-200 active:scale-95 backdrop-blur-sm"
        >
          <Image className="w-5 h-5 text-purple-400" />
          <span className="text-base tracking-wide">Gallery</span>
        </button>
      </div>

      {/* Save Slot Selection Modal */}
      <SaveSlotModal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        mode={modalMode}
      />

      {/* Version Tag */}
      <div className="absolute bottom-6 text-xs text-slate-600 font-mono">
        AnthroDate v0.1.0 • Dev Build
      </div>
    </div>
  );
};