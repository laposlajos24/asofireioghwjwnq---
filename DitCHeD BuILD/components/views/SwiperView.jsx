import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { initialCharacters } from '../../data/characters';
import { Heart, X, Sparkles, MessageSquare } from 'lucide-react';

export const SwiperView = () => {
  const { characterStates, handleMatch, setCurrentView, setActiveCharacterId } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simple banner notification state instead of a blocking modal
  const [matchBannerChar, setMatchBannerChar] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [animatingOut, setAnimatingOut] = useState(null);

  const availableCharacters = initialCharacters.filter((char) => {
    const status = characterStates[char.id]?.status;
    return !status || status === 'unmatched';
  });
  
  const currentChar = availableCharacters[currentIndex];

  const triggerSwipe = (matched) => {
    if (!currentChar || animatingOut) return;

    setAnimatingOut(matched ? 'right' : 'left');

    setTimeout(() => {
      if (matched) {
        handleMatch(currentChar.id);
        // Show match notification banner
        setMatchBannerChar(currentChar);
      }
      setAnimatingOut(null);
      setCurrentX(0);
      
      if (!matched) {
        advanceCard();
      }
    }, 200);
  };

  const advanceCard = () => {
    if (currentIndex < availableCharacters.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleOpenChatFromBanner = (char) => {
    setMatchBannerChar(null);
    setCurrentIndex(0);
    if (setActiveCharacterId) setActiveCharacterId(char.id);
    setCurrentView('chat');
  };

  const handleDismissBanner = () => {
    setMatchBannerChar(null);
    setCurrentIndex(0);
  };

  const handleDragStart = (clientX) => {
    if (animatingOut || matchBannerChar) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX) => {
    if (!isDragging || animatingOut || matchBannerChar) return;
    setCurrentX(clientX - startX);
  };

  const handleDragEnd = () => {
    if (!isDragging || animatingOut) return;
    setIsDragging(false);

    if (currentX > 80) {
      triggerSwipe(true);
    } else if (currentX < -80) {
      triggerSwipe(false);
    } else {
      setCurrentX(0);
    }
  };

  if (!currentChar || availableCharacters.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 text-center select-none my-auto">
        <div className="w-20 h-20 bg-purple-950/60 border border-purple-500/30 rounded-full flex items-center justify-center mb-4 text-fuchsia-400 shadow-xl">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No More Profiles</h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xs mb-6">
          You've checked everyone out! Head over to your chats to talk with your matches.
        </p>
        <button
          onClick={() => setCurrentView('chat')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg transition active:scale-95 cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Open Chats</span>
        </button>
      </div>
    );
  }

  const rotation = currentX * 0.05;
  const opacityOverlay = Math.min(Math.abs(currentX) / 120, 1);

  let transformStyle = `translateX(${currentX}px) rotate(${rotation}deg)`;
  if (animatingOut === 'right') transformStyle = `translateX(500px) rotate(30deg)`;
  if (animatingOut === 'left') transformStyle = `translateX(-500px) rotate(-30deg)`;

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4 select-none my-auto overflow-hidden relative">
      
      {/* MATCH BANNER NOTIFICATION (Replaces the broken modal) */}
      {matchBannerChar && (
        <div className="absolute top-4 z-50 w-full max-w-sm px-4 animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-fuchsia-950 border border-fuchsia-500/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={matchBannerChar.avatar} alt={matchBannerChar.name} className="w-12 h-12 rounded-full object-cover border border-fuchsia-400/50 shrink-0" />
              <div className="min-w-0">
                <h4 className="text-xs font-black text-fuchsia-300 uppercase tracking-wider">It's a Match!</h4>
                <p className="text-xs text-white font-bold truncate">You & {matchBannerChar.name} liked each other</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenChatFromBanner(matchBannerChar)}
                className="px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold rounded-xl shadow transition cursor-pointer"
              >
                Chat
              </button>
              <button
                onClick={handleDismissBanner}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swipe Card Container */}
      <div
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        style={{
          transform: transformStyle,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        className="relative w-full max-w-sm h-[500px] bg-slate-900 border border-purple-900/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing touch-none"
      >
        <div
          style={{ opacity: currentX > 20 ? opacityOverlay : 0 }}
          className="absolute top-8 left-8 z-20 border-4 border-emerald-400 text-emerald-400 font-black text-3xl px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none uppercase tracking-widest bg-slate-950/40 backdrop-blur-sm"
        >
          Like
        </div>
        <div
          style={{ opacity: currentX < -20 ? opacityOverlay : 0 }}
          className="absolute top-8 right-8 z-20 border-4 border-red-500 text-red-500 font-black text-3xl px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none uppercase tracking-widest bg-slate-950/40 backdrop-blur-sm"
        >
          Pass
        </div>

        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center pointer-events-none">
          <img
            src={currentChar.avatar}
            alt={currentChar.name}
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        <div className="relative z-10 p-4 flex justify-between items-center pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-slate-800 text-xs font-semibold text-fuchsia-300">
            Profile {currentIndex + 1} of {availableCharacters.length}
          </span>
        </div>

        <div className="relative z-10 p-6 flex flex-col justify-end">
          <div className="mb-4 pointer-events-none">
            <div className="flex items-baseline gap-2">
              <h2 className="text-3xl font-black text-white">{currentChar.name}</h2>
              <span className="text-xl font-bold text-purple-300">{currentChar.age}</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 line-clamp-3 bg-slate-950/60 backdrop-blur-md p-3 rounded-2xl border border-slate-800/80">
              {currentChar.bio}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                triggerSwipe(false);
              }}
              className="w-14 h-14 rounded-full bg-slate-950/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 flex items-center justify-center text-slate-400 hover:text-red-400 shadow-xl transition active:scale-90 cursor-pointer pointer-events-auto"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                triggerSwipe(true);
              }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 border border-fuchsia-400/40 flex items-center justify-center text-white shadow-xl shadow-purple-950/60 transition active:scale-90 cursor-pointer pointer-events-auto"
            >
              <Heart className="w-7 h-7 fill-white" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};