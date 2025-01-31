import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/authContext';

const PrivateRoute = ({ children }) => {
  const { state } = useContext(AuthContext);

  // Wait for initialization
  if (!state.isInitialized) {
    return <div>Loading...</div>; // You can replace this with a loader
  }

  // Check login status
  if (!state.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content
  return children;
};

export default PrivateRoute;
