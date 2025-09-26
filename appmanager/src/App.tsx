import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../src/output.css';
import { ApplicationManagerList } from './pages/application-manager/application-table';

const App = () => {

  return (
    <> 
      <Routes>
          <Route path="/*" element={<ApplicationManagerList applications={[]} onEdit={() => {}} onDelete={() => {}} onToggleEnabled={() => {}} onToggleVisibility={() => {}} />} />
      </Routes>
    </>
  );
};

export default App;
