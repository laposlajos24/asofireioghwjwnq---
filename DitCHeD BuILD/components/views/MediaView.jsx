import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { initialCharacters } from '../../data/characters';
import { Camera, Lock, Sparkles, Image as ImageIcon, X } from 'lucide-react';

export const MediaView = () => {
  const { characterStates } = useGame();
  const [selectedImage, setSelectedImage] = useState(null);

  // Collect all photos unlocked across all characters from chat histories and completed dates
  const unlockedPhotos = [];

  initialCharacters.forEach((char) => {
    const charState = characterStates[char.id];
    if (!charState) return;

    // 1. Grab photos from chat history
    charState.chatHistory?.forEach((msg) => {
      if (msg.type === 'image' && msg.imageUrl) {
        unlockedPhotos.push({
          id: `${char.id}-chat-${msg.id}`,
          characterName: char.name,
          characterAvatar: char.avatar,
          url: msg.imageUrl,
          source: 'Chat Reward',
          timestamp: msg.id
        });
      }
    });

    // 2. You can also map unlocked endings or date reward photos here if stored in state
  });

  return (
    <div className="flex flex-col flex-1 p-6 max-w-4xl mx-auto w-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Camera className="w-8 h-8 text-fuchsia-400" />
            <span>Photo Album</span>
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Memories, rewards, and secret pictures unlocked through your relationships.
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-2xl text-xs font-bold text-fuchsia-300 shadow-inner">
          Unlocked: {unlockedPhotos.length}
        </div>
      </div>

      {/* Photo Grid */}
      {unlockedPhotos.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl my-auto">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600 shadow-xl">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-300 mb-1">No Photos Unlocked Yet</h2>
          <p className="text-slate-500 text-xs max-w-sm">
            Keep chatting with your matches and going on dates to unlock special pictures and memories!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 overflow-y-auto pb-6">
          {unlockedPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedImage(photo)}
              className="group relative bg-slate-900 border border-purple-900/30 hover:border-purple-500/60 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition aspect-[3/4] flex flex-col"
            >
              <img
                src={photo.url}
                alt={photo.characterName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition" />
              
              <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-2">
                <img
                  src={photo.characterAvatar}
                  alt={photo.characterName}
                  className="w-7 h-7 rounded-full object-cover border border-purple-400/50 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{photo.characterName}</h4>
                  <span className="text-[10px] text-fuchsia-300 block truncate">{photo.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 rounded-full shadow-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.url}
                alt={selectedImage.characterName}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedImage.characterAvatar}
                  alt={selectedImage.characterName}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedImage.characterName}</h3>
                  <p className="text-xs text-fuchsia-400">{selectedImage.source}</p>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};