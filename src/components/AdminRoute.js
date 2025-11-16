import React from 'react';

export default function AdminRoute({ children }) {
  // Allow access without authentication
  return children;
}
