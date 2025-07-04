import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddPropertyForm from './pages/property-add';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties/add" element={<AddPropertyForm />} />
      </Routes>
    </Router>
  );
}

export default App;