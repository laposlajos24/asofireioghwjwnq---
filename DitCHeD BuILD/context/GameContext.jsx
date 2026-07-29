import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCharacters } from '../data/characters';

const GameContext = createContext();

const generateDefaultCharacterStates = () => {
  const states = {};
  initialCharacters.forEach((char) => {
    states[char.id] = {
      status: 'unmatched', // 'unmatched' | 'matched' | 'dating' | 'married' | 'rejected'
      relationship: 0,
      currentDateIndex: 0,
      currentDialogueStep: 0,
      completedDates: [],
      unlockedEndings: [],
      chatHistory: char.initialChatHistory ? [...char.initialChatHistory] : [
        { id: 1, sender: 'them', text: `Hey! Thanks for matching. 🌿`, type: 'text' }
      ]
    };
  });
  return states;
};

export const GameProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('main_menu');
  const [activeSlot, setActiveSlot] = useState(1);
  const [characterStates, setCharacterStates] = useState(generateDefaultCharacterStates);

  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [activeDateId, setActiveDateId] = useState(null);
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [preDateChatSnapshot, setPreDateChatSnapshot] = useState(null);

  // Load slot data whenever activeSlot changes with strict deep cloning
  useEffect(() => {
    const savedData = localStorage.getItem(`anthrodate_slot_${activeSlot}`);
    const defaults = generateDefaultCharacterStates();
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const merged = {};
        Object.keys(defaults).forEach((id) => {
          merged[id] = parsed[id] ? JSON.parse(JSON.stringify(parsed[id])) : JSON.parse(JSON.stringify(defaults[id]));
        });
        setCharacterStates(merged);
      } catch (e) {
        console.error("Failed to parse save data", e);
        setCharacterStates(JSON.parse(JSON.stringify(defaults)));
      }
    } else {
      setCharacterStates(JSON.parse(JSON.stringify(defaults)));
    }
  }, [activeSlot]);

  const saveToSlot = (slotNumber, stateToSave) => {
    const data = stateToSave || characterStates;
    localStorage.setItem(`anthrodate_slot_${slotNumber}`, JSON.stringify(data));
  };

  const startNewGame = (slotNumber) => {
    const freshState = JSON.parse(JSON.stringify(generateDefaultCharacterStates()));
    setActiveSlot(slotNumber);
    setCharacterStates(freshState);
    saveToSlot(slotNumber, freshState);
    setActiveCharacterId(null);
    setCurrentView('swiper');
  };

  const loadGame = (slotNumber) => {
    setActiveSlot(slotNumber);
    const savedData = localStorage.getItem(`anthrodate_slot_${slotNumber}`);
    const defaults = generateDefaultCharacterStates();
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const merged = {};
        Object.keys(defaults).forEach((id) => {
          merged[id] = parsed[id] ? JSON.parse(JSON.stringify(parsed[id])) : JSON.parse(JSON.stringify(defaults[id]));
        });
        setCharacterStates(merged);
      } catch (e) {
        setCharacterStates(JSON.parse(JSON.stringify(defaults)));
      }
    } else {
      setCharacterStates(JSON.parse(JSON.stringify(defaults)));
    }
    setCurrentView('swiper');
  };

  const deleteSaveSlot = (slotNumber) => {
    localStorage.removeItem(`anthrodate_slot_${slotNumber}`);
    if (activeSlot === slotNumber) {
      setCharacterStates(JSON.parse(JSON.stringify(generateDefaultCharacterStates())));
    }
  };

  const isSlotUsed = (slotNumber) => {
    return !!localStorage.getItem(`anthrodate_slot_${slotNumber}`);
  };

  // Swipe Action - properly immutable
  const handleMatch = (charId) => {
    setCharacterStates((prev) => {
      const updated = {
        ...prev,
        [charId]: {
          ...prev[charId],
          status: 'matched'
        }
      };
      saveToSlot(activeSlot, updated);
      return updated;
    });
  };

  // Helper for components to update specific character state immutably
  const updateCharacterState = (charId, updaterFn) => {
    setCharacterStates((prev) => {
      const charState = prev[charId] || {};
      const updatedCharState = updaterFn(charState);
      const updated = {
        ...prev,
        [charId]: updatedCharState
      };
      saveToSlot(activeSlot, updated);
      return updated;
    });
  };

  const startDate = (charId, dateId, replay = false) => {
    if (!replay) {
      setPreDateChatSnapshot(characterStates[charId]?.chatHistory ? JSON.parse(JSON.stringify(characterStates[charId].chatHistory)) : []);
    }
    setActiveCharacterId(charId);
    setActiveDateId(dateId);
    setIsReplayMode(replay);
    setCurrentView('date');
  };

  const finishDate = ({ charId, dateId, endingId, isFailure }) => {
    setCharacterStates((prev) => {
      const char = prev[charId];
      const endingAlreadyUnlocked = char.unlockedEndings.includes(endingId);
      const updatedEndings = endingAlreadyUnlocked 
        ? char.unlockedEndings 
        : [...char.unlockedEndings, endingId];

      let updatedState;
      if (isFailure) {
        updatedState = {
          ...prev,
          [charId]: {
            ...char,
            unlockedEndings: updatedEndings,
            chatHistory: preDateChatSnapshot ? JSON.parse(JSON.stringify(preDateChatSnapshot)) : char.chatHistory
          }
        };
      } else {
        const dateAlreadyCompleted = char.completedDates.includes(dateId);
        const updatedCompleted = dateAlreadyCompleted
          ? char.completedDates
          : [...char.completedDates, dateId];

        updatedState = {
          ...prev,
          [charId]: {
            ...char,
            currentDateIndex: char.currentDateIndex + 1,
            completedDates: updatedCompleted,
            unlockedEndings: updatedEndings
          }
        };
      }

      saveToSlot(activeSlot, updatedState);
      return updatedState;
    });

    setCurrentView(isReplayMode ? 'gallery' : 'chat');
    setIsReplayMode(false);
  };

  return (
    <GameContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeSlot,
        characterStates,
        activeCharacterId,
        setActiveCharacterId,
        activeDateId,
        handleMatch,
        updateCharacterState,
        startDate,
        finishDate,
        startNewGame,
        loadGame,
        deleteSaveSlot,
        isSlotUsed
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);