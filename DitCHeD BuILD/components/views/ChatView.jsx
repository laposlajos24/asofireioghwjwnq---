import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { initialCharacters } from '../../data/characters';
import { MessageSquare, Calendar, ArrowLeft, Camera, X, Sparkles } from 'lucide-react';

export const ChatView = () => {
  const { characterStates, activeCharacterId, setActiveCharacterId, startDate, updateCharacterState } = useGame();
  const [isTyping, setIsTyping] = useState(false);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null); // Lightbox state for chat images

  const matchedCharacters = initialCharacters.filter((char) => {
    const status = characterStates[char.id]?.status;
    return status === 'matched' || status === 'dating' || status === 'married';
  });

  const activeChar = initialCharacters.find((c) => c.id === activeCharacterId);
  const charState = activeCharacterId ? characterStates[activeCharacterId] : null;

  const handleSelectChoice = (choice) => {
    if (!activeCharacterId || !charState) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: choice.text, type: 'text' };
    const nextStep = choice.nextStep !== undefined ? choice.nextStep : charState.currentDialogueStep;

    updateCharacterState(activeCharacterId, (prevChar) => ({
      ...prevChar,
      currentDialogueStep: nextStep,
      chatHistory: [...prevChar.chatHistory, newUserMsg]
    }));

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);

      if (choice.rewardPhoto) {
        setIsTakingPhoto(true);
        setTimeout(() => {
          setIsTakingPhoto(false);
          const newCharMsg = {
            id: Date.now() + 1,
            sender: 'character',
            text: choice.response,
            type: 'image',
            imageUrl: choice.rewardPhoto,
          };
          // Also update the character's gallery unlock list in GameContext state!
          updateCharacterState(activeCharacterId, (prevChar) => {
            const existingGallery = prevChar.unlockedGallery || [];
            // Add the photo if it isn't already in their gallery array
            const updatedGallery = existingGallery.includes(choice.rewardPhoto)
              ? existingGallery
              : [...existingGallery, choice.rewardPhoto];

            return {
              ...prevChar,
              unlockedGallery: updatedGallery,
              chatHistory: [...prevChar.chatHistory, newCharMsg]
            };
          });
        }, 1500);
      } else if (choice.response) {
        const newCharMsg = {
          id: Date.now() + 1,
          sender: 'character',
          text: choice.response,
          type: 'text',
        };
        updateCharacterState(activeCharacterId, (prevChar) => ({
          ...prevChar,
          chatHistory: [...prevChar.chatHistory, newCharMsg]
        }));
      }
    }, 1500);
  };

  if (!activeCharacterId || !activeChar) {
    return (
      <div className="flex flex-col flex-1 p-6 max-w-2xl mx-auto w-full select-none">
        <h1 className="text-3xl font-black text-white mb-2">Your Matches</h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-6">Select a match to open the messenger.</p>

        {matchedCharacters.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 p-8 text-center bg-slate-900/60 border border-slate-800 rounded-3xl">
            <MessageSquare className="w-12 h-12 text-slate-600 mb-3" />
            <h2 className="text-lg font-bold text-slate-300">No Matches Yet</h2>
            <p className="text-slate-500 text-xs max-w-xs mt-1">Like some profiles in the Swiper view first!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matchedCharacters.map((char) => {
              const state = characterStates[char.id] || {};
              const history = state.chatHistory || [];
              const lastMessage = history[history.length - 1]?.text || 'Matched successfully!';

              return (
                <div
                  key={char.id}
                  onClick={() => setActiveCharacterId(char.id)}
                  className="flex items-center gap-4 p-4 bg-slate-900/80 hover:bg-slate-800/90 border border-purple-900/30 hover:border-purple-500/50 rounded-2xl cursor-pointer transition shadow-lg"
                >
                  <img src={char.avatar} alt={char.name} className="w-14 h-14 rounded-full object-cover border border-purple-500/30" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-base font-bold text-white truncate">{char.name}</h2>
                      <span className="text-[10px] font-semibold text-fuchsia-400 bg-purple-950/80 px-2 py-0.5 rounded-full border border-purple-500/30 uppercase">
                        {state.status || 'Matched'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const chatHistory = charState?.chatHistory || [];
  const currentStepIndex = charState?.currentDialogueStep || 0;
  const dialogueNodes = activeChar.dialogueTree || [];
  const currentNode = dialogueNodes[currentStepIndex];

  const handleTriggerDate = () => {
    const firstDate = activeChar.dates?.[0];
    const targetDateId = (typeof firstDate === 'object' ? firstDate?.id : firstDate) || 'cafe_date';
    startDate(activeChar.id, targetDateId, false);
  };

  return (
    <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full h-[calc(100vh-65px)] select-none relative">
      <div className="flex items-center justify-between p-4 bg-slate-950/40 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveCharacterId(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src={activeChar.avatar} alt={activeChar.name} className="w-10 h-10 rounded-full object-cover border border-purple-500/30" />
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">{activeChar.name}</h2>
            <span className="text-[10px] text-emerald-400 font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chatHistory.map((msg) => {
          const isUser = msg.sender === 'user';
          const imgUrl = msg.imageUrl || msg.image;

          return (
            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-xs sm:text-sm shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-purple-900/30 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg.type === 'image' || imgUrl ? (
                  <div className="flex flex-col gap-2">
                    <img
                      src={imgUrl}
                      alt="Shared attachment"
                      onClick={() => setLightboxImage({ url: imgUrl, text: msg.text, character: activeChar })}
                      className="rounded-xl w-full object-cover max-h-48 cursor-pointer hover:opacity-90 transition hover:scale-[1.01]"
                      title="Click to zoom"
                    />
                    {msg.text && <span>{msg.text}</span>}
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          );
        })}

        {isTakingPhoto && (
          <div className="flex items-center gap-2 bg-slate-900/80 border border-purple-900/30 w-fit px-4 py-2.5 rounded-2xl rounded-bl-none text-xs text-fuchsia-300 animate-pulse">
            <Camera className="w-4 h-4" />
            <span>Taking picture...</span>
          </div>
        )}
        {isTyping && !isTakingPhoto && (
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-purple-900/30 w-fit px-4 py-3 rounded-2xl rounded-bl-none text-xs text-slate-400">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-950/80 border-t border-slate-800 backdrop-blur-md">
        {currentStepIndex >= dialogueNodes.length ? (
          <div className="flex items-center justify-between p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Ready for a Date?</h4>
                <p className="text-[10px] text-slate-400">Take your relationship to the next level.</p>
              </div>
            </div>
            <button
              onClick={handleTriggerDate}
              className="px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
            >
              Start Date
            </button>
          </div>
        ) : currentNode && !isTyping && !isTakingPhoto ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1">Choose a reply:</p>
            {currentNode.choices?.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectChoice(choice)}
                className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-purple-950/40 border border-purple-900/40 hover:border-purple-500/50 rounded-xl text-xs sm:text-sm text-slate-200 transition shadow-md cursor-pointer active:scale-[0.99]"
              >
                {choice.text}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-500 italic">
            {isTyping || isTakingPhoto ? `${activeChar.name} is responding...` : 'Conversation complete.'}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Chat Images */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-slate-900 border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-300 rounded-full shadow-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden p-2">
              <img
                src={lightboxImage.url}
                alt="Enlarged chat attachment"
                className="w-full h-full object-contain max-h-[70vh] rounded-xl"
              />
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={lightboxImage.character.avatar}
                  alt={lightboxImage.character.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-500/40"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{lightboxImage.character.name}</h3>
                  <p className="text-xs text-fuchsia-400">{lightboxImage.text || 'Shared photo'}</p>
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