// ClientSideRouter.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

const ClientSideRouter = ({ children }) => {
  if (typeof window === 'undefined') {
    return null; // Ensure this component renders only on the client side
  }

  return (
    <Router>
      {children}
    </Router>
  );
};

export default ClientSideRouter;
