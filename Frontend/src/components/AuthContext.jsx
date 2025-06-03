import { createContext, useState } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [cUser, setCUser] = useState({})
  
  return (
    <AuthContext.Provider value={{ cUser, setCUser }}>
      {children}
    </AuthContext.Provider>
  );
};