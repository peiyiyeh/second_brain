import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Journal from './pages/Journal';
import Awareness from './pages/Awareness';
import Inventory from './pages/Inventory';
import Knitting from './pages/Knitting';
import InvestDashboard from './pages/invest/InvestDashboard';
import Portfolio from './pages/invest/Portfolio';
import InvestJournal from './pages/invest/InvestJournal';

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
          <Route path="invest" element={<InvestDashboard />} />
          <Route path="invest/portfolio" element={<Portfolio />} />
          <Route path="invest/journal" element={<InvestJournal />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
