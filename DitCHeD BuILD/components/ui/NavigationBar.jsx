import React from 'react';
import { useGame } from '../../context/GameContext';
import { Flame, MessageSquare, Camera, ArrowLeft } from 'lucide-react';

export const NavigationBar = () => {
  const { currentView, setCurrentView } = useGame();

  // Hide header on Main Menu and full-screen Date interface
  if (currentView === 'main_menu' || currentView === 'date') {
    return null;
  }

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-purple-900/40 backdrop-blur-md sticky top-0 z-50 text-slate-200 select-none">
      <button 
        onClick={() => setCurrentView('main_menu')}
        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Menu
      </button>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => setCurrentView('swiper')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
            currentView === 'swiper' 
              ? 'bg-purple-600/30 text-fuchsia-400 border border-fuchsia-500/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Swipe</span>
        </button>

        <button
          onClick={() => setCurrentView('chat')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
            currentView === 'chat' 
              ? 'bg-purple-600/30 text-fuchsia-400 border border-fuchsia-500/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chats</span>
        </button>

        <button
          onClick={() => setCurrentView('media')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
            currentView === 'media' 
              ? 'bg-purple-600/30 text-fuchsia-400 border border-fuchsia-500/50' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Photos</span>
        </button>
      </div>
    </nav>
  );
};