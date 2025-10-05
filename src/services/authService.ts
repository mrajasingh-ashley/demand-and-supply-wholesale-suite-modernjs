import { LogLevel, PublicClientApplication } from '@azure/msal-browser';

// This is the main MSAL configuration object.
export const msalConfig = {
  auth: {
    // These are the credentials you just provided.
    clientId: 'e1682a9e-f23c-40ac-8a47-ae90826c4cb0',
    authority:
      'https://login.microsoftonline.com/5a9d9cfd-c32e-4ac1-a9ed-fe83df4f9e4d',

    // This MUST match one of the Redirect URIs you configured in the Azure portal.
    // We will set this to the current window's location to handle both localhost and deployed environments.
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage', // Use session storage. User must log in again when browser closes.
    storeAuthStateInCookie: false, // Set to true for IE11 support
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean,
      ) => {
        if (containsPii) {
          return;
        }
        // Basic logging for debugging authentication issues.
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

// Create an instance of the MSAL PublicClientApplication.
// This object will be used by our React components to handle login, logout, and token acquisition.
export const msalInstance = new PublicClientApplication(msalConfig);
