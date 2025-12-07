import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter } from 'react-router-dom';
import './index.css';

import { Signup, Login, Verify, Home } from './components/index.js';
import Layout from './components/layout.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route index element={<Home/>} />
      <Route path='login' element={<Login/>} />
      <Route path='signup' element={<Signup/>} />
      <Route path='verify' element={<Verify />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
