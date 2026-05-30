import { AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { SelectSizeScreen } from './screens/SelectSizeScreen';
import { SelectAnimalsScreen } from './screens/SelectAnimalsScreen';
import { BingoScreen } from './screens/BingoScreen';
import { ResultScreen } from './screens/ResultScreen';

export default function App() {
  const phase = useGameStore(s => s.phase);

  return (
    <div className="font-maru" style={{ userSelect: 'none' }}>
      <AnimatePresence mode="wait">
        {phase === 'SELECT_SIZE' && <SelectSizeScreen key="select-size" />}
        {phase === 'SELECT_ANIMALS' && <SelectAnimalsScreen key="select-animals" />}
        {phase === 'PLAYING' && <BingoScreen key="playing" />}
        {phase === 'FINISHED' && <ResultScreen key="finished" />}
      </AnimatePresence>
    </div>
  );
}
