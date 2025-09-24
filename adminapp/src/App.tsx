import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';

const LoginApp = React.lazy(() => import('../../loginapp/src/App'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<div>Loading LoginApp...</div>}>
              <LoginApp />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;