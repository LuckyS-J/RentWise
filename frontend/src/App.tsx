import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddPropertyForm from './pages/property-add';
import EditProperty from './pages/property-edit';
import AddLeaseForm from './pages/AddLeaseForm';
import EditLeaseForm from './pages/EditLeaseForm';
import AddPaymentForm from './pages/AddPaymentForm';
import EditPaymenForm from './pages/EditPaymentForm';
import LeaseDetail from './pages/LeaseDetail';
import RequireAuth from './components/requireAuth';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/properties/add" element={<RequireAuth><AddPropertyForm /></RequireAuth>} />
        <Route path="/properties/:id/edit" element={<RequireAuth><EditProperty /></RequireAuth>} />
        <Route path="/leases/add" element={<RequireAuth><AddLeaseForm /></RequireAuth>} />
        <Route path="/leases/:id/edit" element={<RequireAuth><EditLeaseForm /></RequireAuth>} />
        <Route path="/payments/add" element={<RequireAuth><AddPaymentForm /></RequireAuth>} />
        <Route path="/payments/:id/edit" element={<RequireAuth><EditPaymenForm /></RequireAuth>} />
        <Route path="/leases/:id" element={<RequireAuth><LeaseDetail /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;