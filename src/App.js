import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Map from './components/Map';
import Admin from './components/Admin';
import AddLocation from './components/AddLocation'
import EditLocation from './components/EditLocation'
import Login from './components/Login';
import './App.css';
import { isAuthenticated } from './utils/auth';

function App() {
  return (
    <Router>
      <div className='container'>
        <div className='app_content'>
          <Routes>
            <Route path="/map" element={<Map />} />
            <Route path="/" element={<Map />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/location" element={ isAuthenticated() ? <Admin /> : <Navigate to="/login" /> }  />
            <Route path="/admin/location/add" element={ isAuthenticated() ? <AddLocation /> : <Navigate to="/login" /> } />
            <Route path="/admin/location/edit/:geoId" element={ isAuthenticated() ? <EditLocation /> : <Navigate to="/login" /> } />
          </Routes>
        </div>
      </div>
    </Router>
    
  );
}

export default App;