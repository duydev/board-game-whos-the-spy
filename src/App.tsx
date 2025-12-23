import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from '@/presentation/contexts/GameContext';
import { Layout } from '@/components/Layout';
import { Setup } from '@/pages/Setup';
import { Rules } from '@/pages/Rules';
import { EnterNames } from '@/pages/EnterNames';
import { Discussion } from '@/pages/Discussion';
import { Voting } from '@/pages/Voting';
import { GameResult } from '@/pages/GameResult';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Setup />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/enter-names" element={<EnterNames />} />
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/result" element={<GameResult />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
