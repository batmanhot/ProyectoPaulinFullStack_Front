import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
// import ComplianceTable from './components/ComplianceTable';
// import ComplianceForm from './components/ComplianceForm';
import ComplianceTableD from './components/ComplianceTable-D';
import ComplianceFormD from './components/ComplianceForm-D';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServiceTable />} />
          <Route path="/create" element={<ServiceForm />} />
          <Route path="/edit/:id" element={<ServiceForm />} />

          {/* <Route path="/compliance" element={<ComplianceTable />} />
          <Route path="/compliance/:id" element={<ComplianceForm />} /> */}

          <Route path="/relacioncotizaciones" element={<ComplianceTableD />} />
          <Route path="/detallecotizacion/:id" element={<ComplianceFormD />} />
        </Routes>
      </Layout>
    </Router>
  );
}


export default App;
