import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LeadsDashboard from './pages/Leads/LeadsDashboard';
import Dashboard from './pages/Dashboard/Dashboard';
import LeadDetails from './pages/LeadDetails/LeadDetails';
import EditLead from './pages/EditLead/EditLead';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<LeadsDashboard />} />
        <Route path="leads/new" element={<EditLead />} />
        <Route path="leads/:id" element={<LeadDetails />} />
        <Route path="leads/:id/edit" element={<EditLead />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
