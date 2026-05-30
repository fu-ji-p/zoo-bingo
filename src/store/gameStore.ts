import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, BingoSize, GridSize, Animal, BingoCell } from '../types';
import { shuffleArray } from '../utils/shuffle';
import { countCompletedLines } from '../utils/bingo';

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'SELECT_SIZE',
      bingoSize: null,
      gridSize: null,
      selectedAnimals: [],
      cells: [],
      completedLines: 0,
      lastNewLine: null,

      setSize: (size: BingoSize) => {
        const gridSize = Math.sqrt(size) as GridSize;
        set({ bingoSize: size, gridSize, phase: 'SELECT_ANIMALS' });
      },

      confirmAnimals: (animals: Animal[]) => {
        const shuffled = shuffleArray(animals);
        const cells: BingoCell[] = shuffled.map(animal => ({
          animal,
          isFound: false,
        }));
        set({ selectedAnimals: shuffled, cells, phase: 'PLAYING' });
      },

      markFound: (animalId: string) => {
        const { cells, gridSize, completedLines } = get();
        const newCells = cells.map(cell =>
          cell.animal.id === animalId ? { ...cell, isFound: true } : cell
        );
        const newLineCount = countCompletedLines(newCells, gridSize!);
        const lastNewLine = newLineCount > completedLines ? newLineCount : null;
        const allFound = newCells.every(c => c.isFound);
        set({
          cells: newCells,
          completedLines: newLineCount,
          lastNewLine,
          phase: allFound ? 'FINISHED' : 'PLAYING',
        });
      },

      finishGame: () => set({ phase: 'FINISHED' }),

      resetGame: () => set({
        phase: 'SELECT_SIZE',
        bingoSize: null,
        gridSize: null,
        selectedAnimals: [],
        cells: [],
        completedLines: 0,
        lastNewLine: null,
      }),
    }),
    {
      name: 'zoo-bingo-state',
      version: 1,
    }
  )
);
