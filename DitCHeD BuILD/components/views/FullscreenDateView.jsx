import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { initialCharacters } from '../../data/characters';

// The single, canonical full-screen date/scene player.
// Reads everything it needs from GameContext — no props required.
//
// Scene shape supported:
// {
//   background / image: string   // image overlay wins if both present
//   speaker: string              // defaults to the character's name
//   dialogue: string             // narration + character lines, prose-style
//   choices: [{
//     text, nextScene,
//     affectionChange?: number,  // added to characterStates[id].relationship
//     minAffection?: number      // choice hidden unless relationship >= this
//   }]
//   autoNext?: string            // scene has no choice, shows a single
//                                // "Continue" button leading to this scene
//   branch?: [{ minAffection, nextScene }, { nextScene }]
//                                // evaluated automatically on scene entry,
//                                // first matching entry wins (omit
//                                // minAffection on the last one as a default)
//   isEnding?: boolean
//   endingId?: string            // stable id for unlockedEndings tracking
//   endingTitle?: string
//   endingType?: 'good' | 'bad'
// }
export const FullscreenDateView = () => {
  const { activeCharacterId, activeDateId, finishDate, setCurrentView, characterStates, updateCharacterState } = useGame();

  const currentCharacter = initialCharacters.find((c) => c.id === activeCharacterId);

  const activeDate =
    currentCharacter?.dates?.find((d) =>
      typeof d === 'object' ? d.id === activeDateId : d === activeDateId
    ) || currentCharacter?.dates?.[0];

  // Hooks must run unconditionally on every render, before any early return.
  const [currentSceneId, setCurrentSceneId] = useState(activeDate?.initialSceneId || 'start');

  useEffect(() => {
    setCurrentSceneId(activeDate?.initialSceneId || 'start');
  }, [activeDate?.id]);

  const charState = currentCharacter ? characterStates[currentCharacter.id] : null;
  const relationship = charState?.relationship ?? 0;

  const currentScene = activeDate?.scenes ? activeDate.scenes[currentSceneId] : null;

  // Auto-branch: scenes with no choices/autoNext but a `branch` array pick
  // their next scene automatically based on the current affection level.
  useEffect(() => {
    if (!currentScene || !currentCharacter) return;
    if (currentScene.choices || currentScene.autoNext || currentScene.isEnding) return;
    if (!currentScene.branch) return;

    const match = currentScene.branch.find(
      (b) => b.minAffection === undefined || relationship >= b.minAffection
    );
    if (match?.nextScene) {
      setCurrentSceneId(match.nextScene);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSceneId, currentScene, relationship]);

  if (!currentCharacter || !activeDate) {
    return (
      <div className="p-8 text-white text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-fuchsia-400 mb-2">No Active Date</h2>
        <p className="text-slate-400 mb-4">Select a date from a character's chat to begin.</p>
        <button
          onClick={() => setCurrentView('chat')}
          className="bg-fuchsia-600 px-4 py-2 rounded-xl text-white font-medium hover:bg-fuchsia-500 transition"
        >
          Back to Chat
        </button>
      </div>
    );
  }

  if (!currentScene) {
    return (
      <div className="p-8 text-white text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error: Scene Not Found</h2>
        <p className="text-slate-500 text-xs mb-4">
          Missing scene "{currentSceneId}" in date "{activeDate.id}".
        </p>
        <button
          onClick={() => setCurrentView('chat')}
          className="mt-2 bg-slate-700 px-4 py-2 rounded-xl text-white"
        >
          Back to Chat
        </button>
      </div>
    );
  }

  const handleChoiceClick = (choice) => {
    if (!choice.nextScene || !activeDate.scenes[choice.nextScene]) return;

    if (choice.affectionChange) {
      updateCharacterState(currentCharacter.id, (prev) => ({
        ...prev,
        relationship: (prev.relationship ?? 0) + choice.affectionChange,
      }));
    }
    setCurrentSceneId(choice.nextScene);
  };

  const handleAutoNext = () => {
    if (currentScene.autoNext && activeDate.scenes[currentScene.autoNext]) {
      setCurrentSceneId(currentScene.autoNext);
    }
  };

  const handleFinishDate = (isEndingSuccess = true) => {
    const endingId = currentScene.endingId || (currentScene.endingTitle ? `${activeDate.id}_complete` : null);
    finishDate({
      charId: currentCharacter.id,
      dateId: activeDate.id,
      endingId,
      isFailure: !isEndingSuccess,
    });
  };

  const visibleChoices = (currentScene.choices || []).filter(
    (c) => c.minAffection === undefined || relationship >= c.minAffection
  );

  const bgImage = currentScene.image || currentScene.background || currentCharacter.avatar;

  return (
    <div
      className="absolute inset-0 bg-cover bg-center flex flex-col justify-between p-6 text-white z-50 select-none animate-in fade-in duration-300"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Top Bar */}
      <div className="relative z-10 flex justify-between items-center bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-lg">
        <span className="font-bold text-lg text-fuchsia-300">
          ☕ {currentCharacter.name} — {activeDate.title}
        </span>
        <button
          onClick={() => handleFinishDate(false)}
          className="bg-red-500/80 hover:bg-red-600 px-4 py-1.5 rounded-xl text-sm font-semibold transition"
        >
          End Date
        </button>
      </div>

      {/* Bottom Dialogue / Choice Box */}
      <div className="relative z-10 mb-4 bg-slate-900/85 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl max-w-2xl mx-auto w-full">
        <h3 className="text-fuchsia-400 font-semibold mb-1 text-sm tracking-wide uppercase">
          {currentScene.speaker || currentCharacter.name}
        </h3>
        <p className="text-lg mb-6 leading-relaxed text-slate-100 font-medium whitespace-pre-line">
          {currentScene.dialogue}
        </p>

        {currentScene.isEnding ? (
          <div className="text-center py-2">
            <h4
              className={`text-xl font-bold mb-4 ${
                currentScene.endingType === 'good' ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              ✨ {currentScene.endingTitle || 'Date Completed'} ✨
            </h4>
            <button
              onClick={() => handleFinishDate(true)}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 px-6 py-2.5 rounded-xl font-semibold transition shadow-lg text-white"
            >
              Return to Chat
            </button>
          </div>
        ) : currentScene.autoNext ? (
          <div className="flex justify-end">
            <button
              onClick={handleAutoNext}
              className="bg-white/10 hover:bg-white/20 border border-white/15 px-6 py-2.5 rounded-2xl font-medium text-slate-100 hover:border-fuchsia-400/50 transition"
            >
              Continue →
            </button>
          </div>
        ) : currentScene.branch ? (
          <div className="text-center text-xs text-slate-500 italic py-2">...</div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {visibleChoices.map((choice, index) => (
              <button
                key={index}
                onClick={() => handleChoiceClick(choice)}
                className="text-left bg-white/10 hover:bg-white/20 border border-white/15 p-3.5 rounded-2xl transition duration-200 font-medium text-slate-100 hover:border-fuchsia-400/50"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
