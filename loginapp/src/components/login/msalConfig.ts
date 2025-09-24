import { LogLevel } from "@azure/msal-browser";


export const msalConfig = {
  auth: {
    // clientId: '355c352a-e216-4b50-b68a-0ce2d1b099c9', // Your Azure AD app's client ID
    clientId: '513a0229-6c54-4d80-b8c4-b01ce0943b7f', // Your Azure AD app's client ID
    // authority: 'https://login.microsoftonline.com/6193f9a8-8c95-4d6c-ac0b-daf94dd95160', // Your tenant ID or common for multi-tenant apps
    authority: 'https://login.microsoftonline.com/common', // Your tenant ID or common for multi-tenant apps
    redirectUri: 'https://portal4all.com/AppLauncher', // Your redirect URL after /
    // redirectUri: 'https://localhost:7170', // Your redirect URL after /
  },
  cache: {
    cacheLocation: 'sessionStorage', // Can be 'localStorage' or 'sessionStorage'
    storeAuthStateInCookie: false, // Set to true for IE11 or Edge
  },
  system: {	
    loggerOptions: {	
        loggerCallback: (level: any, message: any, containsPii: any) => {	
            if (containsPii) {		
                return;		
            }		
            switch (level) {
                case LogLevel.Error:
                    return;
                case LogLevel.Info:
                    return;
                case LogLevel.Verbose:
                    return;
                case LogLevel.Warning:
                    return;
                default:
                    return;
            }	
        }	
    }	
}
};

export const loginRequest = {
  scopes: ["User.Read"], // Define the required scopes for authentication
  prompt: 'select_account'
};