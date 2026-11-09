import React, { useState } from 'react';
import { X, MessageSquareHeart, Heart, Send } from 'lucide-react';
import { Confession } from '../../hooks/usePresenceAndConfessions';

interface ConfessionModalProps {
  isOpen: boolean;
  confessions: Confession[];
  onAddConfession: (author: string, dept: string, text: string) => void;
  onLikeConfession: (id: string) => void;
  onClose: () => void;
}

export const ConfessionModal: React.FC<ConfessionModalProps> = ({
  isOpen,
  confessions,
  onAddConfession,
  onLikeConfession,
  onClose
}) => {
  const [author, setAuthor] = useState('');
  const [dept, setDept] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    onAddConfession(author, dept, text);
    setText('');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <MessageSquareHeart size={20} />
            <span>ক্যাম্পাস স্মৃতি ও কনফেশন বোর্ড 💬</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Confession Submission Box */}
        <form onSubmit={handleSubmit} className="mb-5 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              placeholder="আপনার নাম / ছদ্মনাম (ঐচ্ছিক)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="ডিপার্টমেন্ট / ব্যাচ (যেমন: CSE 52nd)"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <textarea
            rows={2}
            placeholder="আপনার ক্যাম্পাসের কোনো মজার স্মৃতি বা অনুভূতির কথা লিখুন..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none mb-2"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold px-4 py-1.5 rounded-xl text-xs transition"
            >
              <Send size={13} />
              <span>জমা দিন</span>
            </button>
          </div>
        </form>

        {/* Confessions List */}
        <div className="overflow-y-auto space-y-3 flex-1 pr-1 no-scrollbar touch-pan-y">
          {confessions.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-800/40 border border-slate-700/50 rounded-2xl hover:border-slate-600 transition"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <span>{item.author}</span>
                  {item.dept && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-slate-700/80 rounded text-slate-300">
                      {item.dept}
                    </span>
                  )}
                </div>
                <span>{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed mb-2">
                "{item.text}"
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => onLikeConfession(item.id)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 transition"
                >
                  <Heart size={13} className="text-red-500 fill-red-500/30" />
                  <span>{item.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

