import React, {createContext, useCallback, useState} from 'react';
// Required types
import {AppState, Credentials, Graph} from './types';

// Optional defaults
const appDefaults: AppState = {
  signedIn: false,
  bookmarks: [],
  searchResults: [],
  setBookmarks: () => {},
  setSearchResults: () => {},
  validateSignIn: () => false,
};

// Begins
export const AppProviderContext = createContext(appDefaults);

export const AppProvider: React.FC = ({children}) => {
  // All userState hooks
  const [signedIn, setSignedIn] = useState<Boolean>(false);
  const [searchResults, setSearchResults] = useState<Graph[]>([]);
  const [bookmarks, setBookmarks] = useState<Graph[]>([]);
  // Secret credentials
  const access_cred: Credentials = {
    email: 'hello@jordan.com',
    password: 'develop80',
  };

  // Validation method for signIn
  const validateSignIn = useCallback(
    creds => {
      if (creds.email.toLowerCase() === access_cred.email) {
        if (creds.password === access_cred.password) {
          // Set's signedIn value
          setSignedIn(true);

          // "true" means signIn passed, "false" means signIn failed.
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    [access_cred.password, access_cred.email],
  );

  return (
    <AppProviderContext.Provider
      value={{
        signedIn,
        bookmarks,
        searchResults,
        setBookmarks,
        setSearchResults,
        validateSignIn,
      }}>
      {children}
    </AppProviderContext.Provider>
  );
};
