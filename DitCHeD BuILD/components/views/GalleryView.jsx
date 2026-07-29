import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { initialCharacters } from '../../data/characters';
import { Sparkles, ArrowLeft, Calendar, Award, Camera, Lock, X } from 'lucide-react';

export const GalleryView = () => {
  const { characterStates } = useGame();
  const [selectedCharId, setSelectedCharId] = useState(null);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState(null);

  const activeChar = initialCharacters.find((c) => c.id === selectedCharId);
  const charState = selectedCharId ? characterStates[selectedCharId] : null;

  // Aggregate photos for this specific character from chat history or unlockedGallery
  const getCharacterPhotos = (char, state) => {
    const photos = [];
    if (!state) return photos;

    // 1. Check chat history for images
    state.chatHistory?.forEach((msg) => {
      const imgUrl = msg.imageUrl || msg.image;
      if (imgUrl) {
        photos.push({
          id: `chat-${msg.id}`,
          url: imgUrl,
          source: 'Chat Reward',
          title: msg.text || 'Chat Memory'
        });
      }
    });

    // 2. Check explicit unlockedGallery array if used
    state.unlockedGallery?.forEach((url, idx) => {
      if (!photos.some((p) => p.url === url)) {
        photos.push({
          id: `gallery-${idx}`,
          url: url,
          source: 'Special Memory',
          title: 'Unlocked Item'
        });
      }
    });

    return photos;
  };

  return (
    <div className="flex flex-col flex-1 p-6 max-w-4xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-fuchsia-400" />
            <span>Character Gallery</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Review your relationships, unlocked memories, and achievements.
          </p>
        </div>
      </div>

      {!selectedCharId ? (
        /* Step 1: Character Card Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pb-6">
          {initialCharacters.map((char) => {
            const state = characterStates[char.id] || {};
            const photos = getCharacterPhotos(char, state);
            const isMet = state.status && state.status !== 'locked';

            return (
              <div
                key={char.id}
                onClick={() => setSelectedCharId(char.id)}
                className="group relative bg-slate-900 border border-purple-900/30 hover:border-purple-500/60 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition aspect-[3/4] flex flex-col items-center justify-end p-4 text-center"
              >
                <img
                  src={char.avatar}
                  alt={char.name}
                  className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300 ${
                    !isMet ? 'grayscale brightness-50' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-95 transition" />

                <div className="relative z-10 w-full flex flex-col items-center">
                  <h3 className="text-sm font-bold text-white truncate w-full">{char.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-fuchsia-300 font-medium">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" /> {photos.length}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{state.status || 'Locked'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Step 2: Individual Character Showcase */
        <div className="flex flex-col flex-1 gap-6 overflow-y-auto pb-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between bg-slate-900/80 border border-purple-900/40 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCharId(null)}
                className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-xl transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img src={activeChar.avatar} alt={activeChar.name} className="w-12 h-12 rounded-full object-cover border border-purple-500/40" />
              <div>
                <h2 className="text-base font-bold text-white">{activeChar.name}'s Collection</h2>
                <span className="text-xs text-fuchsia-400 capitalize">Status: {charState?.status || 'Locked'}</span>
              </div>
            </div>
          </div>

          {/* Unlocked Photos Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-fuchsia-400" />
              <span>Unlocked Photos</span>
            </h3>
            {getCharacterPhotos(activeChar, charState).length === 0 ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center text-xs text-slate-500">
                No photos unlocked with this character yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {getCharacterPhotos(activeChar, charState).map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedLightboxImage(photo)}
                    className="group relative bg-slate-900 border border-purple-900/30 hover:border-purple-500/50 rounded-xl overflow-hidden aspect-[4/3] cursor-pointer shadow-md"
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                      <span className="text-[10px] text-white font-medium truncate">{photo.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unlocked Dates Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Completed Dates</span>
            </h3>
            {(!charState?.completedDates || charState.completedDates.length === 0) ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center text-xs text-slate-500">
                No dates completed with this character yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {charState.completedDates.map((dateId, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 capitalize">{dateId.replace('_', ' ')}</span>
                    <span className="text-emerald-400 font-medium">Completed ✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Endings Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Achieved Endings</span>
            </h3>
            {(!charState?.endings || charState.endings.length === 0) ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center text-xs text-slate-500">
                No story endings unlocked yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {charState.endings.map((ending, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">{ending}</span>
                    <span className="text-amber-400 font-medium">Unlocked ✨</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          onClick={() => setSelectedLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedLightboxImage(null)}
                className="p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 rounded-full shadow-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedLightboxImage.url}
                alt="Enlarged view"
                className="w-full h-full object-contain max-h-[70vh] rounded-xl"
              />
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{activeChar?.name}</h3>
                <p className="text-xs text-fuchsia-400">{selectedLightboxImage.title}</p>
              </div>
              <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};