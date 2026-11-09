import React from 'react';
import { AddaMood } from '../../data/dialogues';
import { Sparkles, HeartCrack, BookOpen, Coffee } from 'lucide-react';

interface AddaMoodSelectorProps {
  currentMood: AddaMood;
  onSelectMood: (mood: AddaMood) => void;
}

export const AddaMoodSelector: React.FC<AddaMoodSelectorProps> = ({
  currentMood,
  onSelectMood
}) => {
  const moods: { id: AddaMood; label: string; shortLabel: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'general',
      label: 'ক্যাম্পাস আড্ডা',
      shortLabel: 'আড্ডা',
      icon: <Sparkles size={13} className="text-amber-400" />,
      color: 'hover:border-amber-400'
    },
    {
      id: 'heartbreak',
      label: 'ছ্যাঁকা ও ক্রাশ 💔',
      shortLabel: 'ছ্যাঁকা',
      icon: <HeartCrack size={13} className="text-rose-400" />,
      color: 'hover:border-rose-400'
    },
    {
      id: 'exams',
      label: 'পরীক্ষা ও রিটেক 📚',
      shortLabel: 'পরীক্ষা',
      icon: <BookOpen size={13} className="text-blue-400" />,
      color: 'hover:border-blue-400'
    },
    {
      id: 'canteen',
      label: 'ক্যান্টিন ও ট্যুর ☕',
      shortLabel: 'ক্যান্টিন',
      icon: <Coffee size={13} className="text-emerald-400" />,
      color: 'hover:border-emerald-400'
    }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-2 mb-2 flex items-center justify-center">
      <div className="flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md overflow-x-auto max-w-full touch-manipulation">
        <span className="text-[10px] text-slate-400 font-semibold px-2 shrink-0 hidden xs:inline">
          টপিক:
        </span>
        {moods.map((m) => {
          const isActive = currentMood === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-medium transition shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : `bg-slate-800/80 text-slate-300 hover:text-white border border-transparent ${m.color}`
              }`}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
              <span className="inline sm:hidden">{m.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
