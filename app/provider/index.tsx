import React, {createContext, useCallback, useState} from 'react';
import {Credentials, Graph} from './types';

interface AppState {
  signedIn: Boolean;
  bookmarks: Graph[];
  searchResults: Graph[];
  setBookmarks: (value: Graph[]) => void;
  setSearchResults: (value: Graph[]) => void;
  validateSignIn: (cred: Credentials) => boolean;
}

const appDefaults: AppState = {
  signedIn: false,
  bookmarks: [],
  searchResults: [],
  setBookmarks: () => {},
  setSearchResults: () => {},
  validateSignIn: () => false,
};

export const AppProviderContext = createContext(appDefaults);

export const AppProvider: React.FC = ({children}) => {
  const [signedIn, setSignedIn] = useState<Boolean>(false);
  const [searchResults, setSearchResults] = useState<Graph[]>([]);
  const [bookmarks, setBookmarks] = useState<Graph[]>([]);
  const access_cred: Credentials = {
    email: 'hello@jordan.com',
    password: 'develop80',
  };

  const validateSignIn = useCallback(
    creds => {
      if (creds.email.toLowerCase() === access_cred.email) {
        if (creds.password === access_cred.password) {
          setSignedIn(true);
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
