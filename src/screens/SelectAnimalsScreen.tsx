import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { ALL_ANIMALS } from '../data/animals';
import type { Animal } from '../types';

export function SelectAnimalsScreen() {
  const { bingoSize, setSize, confirmAnimals } = useGameStore(s => ({
    bingoSize: s.bingoSize,
    setSize: s.setSize,
    confirmAnimals: s.confirmAnimals,
  }));
  const need = bingoSize ?? 9;
  const [selected, setSelected] = useState<Animal[]>([]);

  const toggle = (animal: Animal) => {
    setSelected(prev => {
      if (prev.find(a => a.id === animal.id)) {
        return prev.filter(a => a.id !== animal.id);
      }
      if (prev.length >= need) return prev;
      return [...prev, animal];
    });
  };

  const isSelected = (id: string) => selected.some(a => a.id === id);
  const selIdx = (id: string) => selected.findIndex(a => a.id === id) + 1;
  const full = selected.length >= need;
  const remaining = need - selected.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3 }}
      className="min-h-svh flex flex-col"
      style={{ background: '#FFF9F0' }}
    >
      {/* ヘッダー固定 */}
      <div className="sticky top-0 z-10 px-4 py-3 flex items-center gap-3 shadow-sm"
        style={{ background: '#FFF9F0' }}>
        <button
          onClick={() => setSize(bingoSize!)}
          className="text-zoo-primary text-sm font-bold px-3 py-1 rounded-full border border-zoo-primary/40 active:scale-95 transition-transform"
        >
          ‹ もどる
        </button>
        <div className="flex-1 text-center">
          <span className="text-lg font-bold text-zoo-text">どうぶつをえらぼう！</span>
        </div>
        <div className={`text-sm font-bold px-3 py-1 rounded-full ${full ? 'bg-zoo-primary text-white' : 'bg-zoo-secondary/20 text-zoo-secondary'}`}>
          {full ? 'かんりょう！' : `あと${remaining}ひき`}
        </div>
      </div>

      {/* 動物グリッド */}
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-28">
        <div className="grid grid-cols-3 gap-2">
          {ALL_ANIMALS.map((animal) => {
            const sel = isSelected(animal.id);
            const idx = selIdx(animal.id);
            const dimmed = full && !sel;
            return (
              <motion.button
                key={animal.id}
                whileTap={{ scale: 0.9 }}
                animate={sel ? { scale: [1, 1.15, 1.0] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                onClick={() => toggle(animal)}
                aria-label={`${animal.name}を${sel ? '解除' : '選択'}`}
                className={`
                  relative rounded-2xl p-2 flex flex-col items-center shadow-md border-2
                  transition-all duration-150 select-none
                  min-h-[80px] justify-center
                  ${sel
                    ? 'border-zoo-primary bg-zoo-found/30 shadow-zoo-primary/30'
                    : `border-transparent ${animal.color}`}
                  ${dimmed ? 'opacity-40' : 'opacity-100'}
                `}
              >
                {sel && (
                  <div className="absolute top-1 right-1 bg-zoo-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {idx}
                  </div>
                )}
                <span className="text-3xl leading-none">{animal.emoji}</span>
                <span className="mt-1 text-xs font-bold text-zoo-text text-center leading-tight">
                  <ruby>{animal.name}<rt style={{ fontSize: '0.55em', color: '#999' }}>{animal.reading}</rt></ruby>
                </span>
                {sel && (
                  <span className="text-green-600 text-xs font-bold mt-0.5">✓</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 下部固定バー */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]"
        style={{ background: '#FFF9F0' }}>
        <motion.button
          whileTap={full ? { scale: 0.95 } : {}}
          disabled={!full}
          onClick={() => full && confirmAnimals(selected)}
          className={`
            w-full py-4 rounded-3xl text-lg font-black shadow-lg
            transition-all duration-200
            ${full
              ? 'bg-zoo-secondary text-white active:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {full ? 'けっていする！🎉' : `あと${remaining}ひき えらんでね`}
        </motion.button>
      </div>
    </motion.div>
  );
}
