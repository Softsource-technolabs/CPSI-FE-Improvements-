import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppProfileForm from './pages/app-profile-form';
import './output.css';

const App = () => {

  return (
      <Routes>
          <Route path="/*" element={<AppProfileForm />} />
      </Routes>
  );
};

export default App;
