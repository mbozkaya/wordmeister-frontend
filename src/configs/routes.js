import React from 'react';
import { Navigate } from 'react-router-dom';
import Home from '../views/home';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Dashboard from '../views/dashboard/dashboard';
import { DashboardLayout } from '../views/layout/DashboardLayout/index';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: '*', element: <Navigate to="/404" /> }
    ],
  },
  {
    path: '/',
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/Signup', element: <Signup /> },
      { path: '*', element: <Navigate to="/404" /> }
    ],
  }
];

export { routes };
