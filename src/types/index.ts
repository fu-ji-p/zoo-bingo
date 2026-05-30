export type BingoSize = 9 | 16 | 25;
export type GridSize = 3 | 4 | 5;

export interface Animal {
  id: string;
  name: string;
  reading: string;
  emoji: string;
  color: string;
}

export interface BingoCell {
  animal: Animal;
  isFound: boolean;
}

export type GamePhase =
  | 'SELECT_SIZE'
  | 'SELECT_ANIMALS'
  | 'PLAYING'
  | 'FINISHED';

export interface GameState {
  phase: GamePhase;
  bingoSize: BingoSize | null;
  gridSize: GridSize | null;
  selectedAnimals: Animal[];
  cells: BingoCell[];
  completedLines: number;
  lastNewLine: number | null;

  setSize: (size: BingoSize) => void;
  confirmAnimals: (animals: Animal[]) => void;
  markFound: (animalId: string) => void;
  finishGame: () => void;
  resetGame: () => void;
}
