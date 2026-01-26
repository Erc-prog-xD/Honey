import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Menu from './pages/Menu.jsx';
import Dashboard from "./pages/Dashboard";
import HiveRegistration from './pages/HiveRegistration';
import ApiaryRegistration from './pages/ApiaryRegistration';
import ProductionRegistration from './pages/ProductionRegistration';
import SalesRegistration from './pages/SalesRegistration';
import LossRegistration from './pages/LossRegistration';
import HiveDeactivation from './pages/HiveDeactivation';
import SalesReport from './pages/SalesReport';
import ApiaryPerformance from './pages/ApiaryPerformance';
import ApiaryDetails from './pages/ApiaryDetails';
import LossReport from './pages/LossReport';
import UserProfile from './pages/UserProfile';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

import './assets/css/global.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rotas Protegidas */}
        <Route path="/menu" element={<ProtectedRoute><Menu /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/cadastro-colmeia" element={<ProtectedRoute><HiveRegistration /></ProtectedRoute>} />
        <Route path="/cadastro-apiario" element={<ProtectedRoute><ApiaryRegistration /></ProtectedRoute>} />
        <Route path="/registro-producao" element={<ProtectedRoute><ProductionRegistration /></ProtectedRoute>} />
        <Route path="/registro-vendas" element={<ProtectedRoute><SalesRegistration /></ProtectedRoute>} />
        <Route path="/registro-perdas" element={<ProtectedRoute><LossRegistration /></ProtectedRoute>} />
        <Route path="/desativar-colmeia" element={<ProtectedRoute><HiveDeactivation /></ProtectedRoute>} />
        <Route path="/relatorio-vendas" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
        <Route path="/relatorio-perdas" element={<ProtectedRoute><LossReport /></ProtectedRoute>} />
        <Route path="/desempenho-apiario" element={<ProtectedRoute><ApiaryPerformance /></ProtectedRoute>} />
        <Route path="/apiario/:id" element={<ProtectedRoute><ApiaryDetails /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;