import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Journal from './pages/Journal';
import Awareness from './pages/Awareness';
import Inventory from './pages/Inventory';
import Knitting from './pages/Knitting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="goals" element={<Goals />} />
          <Route path="journal" element={<Journal />} />
          <Route path="awareness" element={<Awareness />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="knitting" element={<Knitting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
