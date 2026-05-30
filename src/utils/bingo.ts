import type { BingoCell } from '../types';

export function countCompletedLines(cells: BingoCell[], gridSize: number): number {
  let count = 0;
  const grid = Array.from({ length: gridSize }, (_, row) =>
    cells.slice(row * gridSize, (row + 1) * gridSize)
  );

  for (let r = 0; r < gridSize; r++) {
    if (grid[r].every(c => c.isFound)) count++;
  }
  for (let col = 0; col < gridSize; col++) {
    if (grid.every(row => row[col].isFound)) count++;
  }
  if (grid.every((row, i) => row[i].isFound)) count++;
  if (grid.every((row, i) => row[gridSize - 1 - i].isFound)) count++;

  return count;
}

export function getCompletedLineIndices(cells: BingoCell[], gridSize: number): Set<number> {
  const indices = new Set<number>();
  const grid = Array.from({ length: gridSize }, (_, row) =>
    cells.slice(row * gridSize, (row + 1) * gridSize).map((_, col) => row * gridSize + col)
  );

  for (let r = 0; r < gridSize; r++) {
    const row = grid[r];
    if (row.every(i => cells[i].isFound)) row.forEach(i => indices.add(i));
  }
  for (let col = 0; col < gridSize; col++) {
    const colIdx = grid.map(row => row[col]);
    if (colIdx.every(i => cells[i].isFound)) colIdx.forEach(i => indices.add(i));
  }
  const diagMain = grid.map((row, i) => row[i]);
  if (diagMain.every(i => cells[i].isFound)) diagMain.forEach(i => indices.add(i));
  const diagAnti = grid.map((row, i) => row[gridSize - 1 - i]);
  if (diagAnti.every(i => cells[i].isFound)) diagAnti.forEach(i => indices.add(i));

  return indices;
}
