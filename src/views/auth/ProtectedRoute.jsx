import { AuthContext } from 'contexts/authContext';
import React, { useContext } from 'react';
import Unauthorised from 'components/Unauthorised';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { state } = useContext(AuthContext);
  const { isLoggedIn, user } = state;
  if (!isLoggedIn) {
    console.log("Not logged in, redirecting to login.");
    return <Navigate to="/login" replace />;
  }


  const userRoles = user?.roles || [];
  if (!userRoles.length || !allowedRoles.some(role => userRoles.includes(role))) {
    console.log("User not authorized, rendering Unauthorised page.");
    return <Unauthorised />;
  }

  return children; 
};

export default ProtectedRoute;
