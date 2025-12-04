import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/services" element={<ServiceTable />} />
          <Route path="/create" element={<ServiceForm />} />
          <Route path="/edit/:id" element={<ServiceForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
