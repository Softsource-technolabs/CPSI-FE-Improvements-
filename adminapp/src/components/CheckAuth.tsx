import { useEffect } from 'react';

const CheckAuth = () => {
 useEffect(() => {
  const isLoggedIn = !!localStorage.getItem('loginResponse');
  console.log('Sending message to parent:', isLoggedIn ? 'loggedIn' : 'loggedOut');
  window.parent.postMessage(isLoggedIn ? 'loggedIn' : 'loggedOut', 'http://localhost:3002/admin/login');
}, []);

  return <div>Loading...</div>;
};

export default CheckAuth;