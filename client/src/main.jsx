import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromElements, RouterProvider, Route, createBrowserRouter } from 'react-router-dom';
import './index.css';

import Layout from './components/layout.jsx';
import {Signup,Login} from './components';
import Home from './components/home/Home.jsx';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
