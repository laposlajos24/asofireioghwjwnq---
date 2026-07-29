import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Play, RotateCcw, Save, Trash2, Check, AlertCircle } from 'lucide-react';

export const SaveSlotModal = ({ isOpen, onClose, mode }) => {
  const { startNewGame, loadGame, isSlotUsed, activeSlot, deleteSaveSlot } = useGame();
  const [slotToDelete, setSlotToDelete] = useState(null);

  if (!isOpen) return null;

  const slots = [1, 2, 3];

  const handleSelectSlot = (slot) => {
    if (slotToDelete) return; // Prevent selection while confirming deletion

    if (mode === 'new') {
      startNewGame(slot);
    } else {
      loadGame(slot);
    }
    onClose();
  };

  const handleDeleteConfirm = (slot) => {
    deleteSaveSlot(slot);
    setSlotToDelete(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-slate-900 border border-purple-900/40 rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">
              {mode === 'new' ? 'Select Save Slot' : 'Continue Game'}
            </h2>
          </div>
          <button
            onClick={() => {
              setSlotToDelete(null);
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slot List */}
        <div className="flex flex-col gap-3">
          {slots.map((slot) => {
            const used = isSlotUsed(slot);
            const isActive = activeSlot === slot;
            const isDeletingThis = slotToDelete === slot;

            return (
              <div
                key={slot}
                className={`relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                  used
                    ? 'bg-slate-800/80 border-purple-500/30'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                {/* Delete Confirmation Overlay */}
                {isDeletingThis ? (
                  <div className="flex items-center justify-between w-full bg-red-950/90 border border-red-500/50 rounded-xl px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 text-red-200 font-semibold">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>Delete Slot {slot}?</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteConfirm(slot)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Yes
                      </button>
                      <button
                        onClick={() => setSlotToDelete(null)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Main Slot Info & Click Area */}
                    <div
                      onClick={() => (used || mode === 'new') && handleSelectSlot(slot)}
                      className={`flex-1 flex flex-col ${
                        used || mode === 'new' ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span className="text-sm font-bold text-fuchsia-400">
                        SLOT {slot}{' '}
                        {isActive && used && (
                          <span className="text-xs text-purple-300 font-normal ml-2">
                            (Active)
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 mt-1">
                        {used ? 'Progress Saved' : 'Empty Save File'}
                      </span>
                    </div>

                    {/* Actions Area */}
                    <div className="flex items-center gap-2">
                      {used && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSlotToDelete(slot);
                          }}
                          title="Delete save file"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-xl border border-transparent hover:border-red-900/50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => (used || mode === 'new') && handleSelectSlot(slot)}
                        disabled={!used && mode === 'continue'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                          !used && mode === 'continue'
                            ? 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                            : 'bg-purple-600/20 text-fuchsia-300 border border-fuchsia-500/30 hover:bg-fuchsia-600 hover:text-white cursor-pointer'
                        }`}
                      >
                        {mode === 'new' ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{used ? 'Overwrite' : 'Start'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Load</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};