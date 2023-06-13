import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Components/Login'
import Home from './Components/Home'
import ErrorPage from './Components/ErrorPage';
import './styles.css';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    Error: <ErrorPage />
  },
  {
    path:'home',
    element: <Home />,
  }
]);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);