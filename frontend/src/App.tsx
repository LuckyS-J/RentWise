import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddPropertyForm from './pages/property-add';
import EditProperty from './pages/property-edit';
import AddLeaseForm from './pages/AddLeaseForm'
import EditLeaseForm from './pages/EditLeaseForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/properties/add" element={<AddPropertyForm />} />
        <Route path="/properties/:id/edit" element={<EditProperty />} />
        <Route path="/leases/add" element={<AddLeaseForm />} />
        <Route path="/leases/:id/edit" element={<EditLeaseForm />} />
      </Routes>
    </Router>
  );
}

export default App;