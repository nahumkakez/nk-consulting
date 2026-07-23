import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated()) return children;
  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <AppLayout><Dashboard /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/clients" element={
        <PrivateRoute>
          <AppLayout><Clients /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/products" element={
        <PrivateRoute>
          <AppLayout><Products /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/invoices" element={
        <PrivateRoute>
          <AppLayout><Invoices /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/create-invoice" element={
        <PrivateRoute>
          <AppLayout><CreateInvoice /></AppLayout>
        </PrivateRoute>
      } />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;