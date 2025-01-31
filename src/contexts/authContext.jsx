import React, { createContext, useReducer, useEffect } from 'react';
import auth, { initialState } from '../store/accountReducer';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auth, {
    ...initialState,
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });

  useEffect(() => {
    if (state.isLoggedIn) {
      if (state.token) {
        localStorage.setItem('token', state.token);
      }
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
