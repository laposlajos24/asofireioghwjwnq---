import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { NavigationBar } from './components/ui/NavigationBar';
import { MainMenuView } from './components/views/MainMenuView';
import { GalleryView } from './components/views/GalleryView';
import { SwiperView } from './components/views/SwiperView';
import { ChatView } from './components/views/ChatView';
import { MediaView } from './components/views/MediaView';
import { FullscreenDateView } from './components/views/FullscreenDateView';

const AppContent = () => {
  const { currentView } = useGame();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-slate-100 flex flex-col font-sans">
      <NavigationBar />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {currentView === 'main_menu' && <MainMenuView />}
        {currentView === 'swiper' && <SwiperView />}
        {currentView === 'chat' && <ChatView />}
        {currentView === 'media' && <MediaView />}
        {currentView === 'date' && <FullscreenDateView />}
        {currentView === 'gallery' && <GalleryView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
