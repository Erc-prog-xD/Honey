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
import SalesReport from './pages/SalesReport';
import ApiaryPerformance from './pages/ApiaryPerformance';
import ApiaryDetails from './pages/ApiaryDetails';

import './assets/css/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro-colmeia" element={<HiveRegistration />} />
        <Route path="/cadastro-apiario" element={<ApiaryRegistration />} />
        <Route path="/registro-producao" element={<ProductionRegistration />} />
        <Route path="/registro-vendas" element={<SalesRegistration />} />
        <Route path="/registro-perdas" element={<LossRegistration />} />
        <Route path="/relatorio-vendas" element={<SalesReport />} />
        <Route path="/desempenho-apiario" element={<ApiaryPerformance />} />
        <Route path="/apiario/:id" element={<ApiaryDetails />} />
      </Routes>
    </Router>
  );
}

export default App;