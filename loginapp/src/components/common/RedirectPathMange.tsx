
function storeUserData({
  isLogin = true,
  userData,
  id,
  token,
  name,
  email,
  image,
}: {
  isLogin?: boolean;
  userData: any;
  id: string;
  token: string;
  name: string;
  email: string;
  image?: string;
}) {
  localStorage.setItem("AAisLogin", String(isLogin));
  localStorage.setItem("AAuserData", JSON.stringify(userData));
  localStorage.setItem("AAid", id);
  localStorage.setItem("AAtoken", token);
  localStorage.setItem("AAname", name);
  localStorage.setItem("AAemail", email);
  localStorage.setItem("AAimage", image || "");
}

// Function for redirecting to login page
export function loginRedirectCall(): void {
  clearAllStorage();
  window.location.replace('http://localhost:3002/admin/login');
}

// Function for redirecting to home page
export function homeRedirectCall(): void {
  const loginResponse = sessionStorage.getItem('loginResponse');
  if (loginResponse) {
    localStorage.setItem('cross_port_login_data', loginResponse);
  }
  window.location.replace('http://localhost:3002/');
}

// Function to clear all storage except customStyle
function clearAllStorage(): void {
  try {
    const itemsToClear = [
      "AAisLogin", "AAuserData", "AAid", "AAtoken", 
      "AAname", "AAemail", "AAimage", "temp_login_response",
      "cross_port_login_data", "microsoft", "MicroAcc",
      "ALoginMethod", "loginResponse"
    ];
    itemsToClear.forEach(item => {
      localStorage.removeItem(item);
      sessionStorage.removeItem(item);
    });
    sessionStorage.clear();
    if (window.indexedDB) {
      indexedDB.deleteDatabase("yourDBName");
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

// Logout and redirect to login page
export function logOutRedirectCall(): void {
  clearAllStorage();
  window.addEventListener('beforeunload', clearAllStorage);
  try {
    fetch('http://localhost:3002/admin/login', { method: 'GET' })
      .finally(() => {
        clearAllStorage();
        window.location.replace('http://localhost:3002/admin/login');
      });
  } catch (error) {
    console.error('Error during logout:', error);
    clearAllStorage();
    window.location.replace('http://localhost:3002/admin/login');
  }
}

// Store user data after login and redirect to home
export function loginRedirectCallWithDataStore(data: any): void {
  storeUserData({
    userData: data.data,
    id: data.data.userDetails.id,
    token: data.data.token,
    name: `${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`,
    email: data.data.userDetails.email,
    image: data.profile_image,
  });
  homeRedirectCall();
}

// Microsoft login handler
export function microsoftLoginwithdata(data: any): void {
  storeUserData({
    userData: data.account,
    id: data.uniqueId,
    token: data.accessToken,
    name: data.account.name,
    email: data.account.username,
    image: data.profile_image,
  });
  homeRedirectCall();
}

// Google login handler
export function googleLoginWithData(data: any): void {
  storeUserData({
    userData: data,
    id: data.id,
    token: data.accessToken || '',
    name: data.name,
    email: data.email,
    image: data.picture,
  });
  homeRedirectCall();
}