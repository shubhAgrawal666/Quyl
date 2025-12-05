import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter } from 'react-router-dom';
import './index.css';

// Import all components from central index.js
import { Signup, Login, Verify, Home } from './components/index.js';
import Layout from './components/layout.jsx';

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
    <RouterProvider router={router} />
  </StrictMode>,
);
