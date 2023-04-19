import React from 'react';
import ReactDOM from 'react-dom/client';
import './globalStyle.css'
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { dynamicFavicon } from 'assets/js/dynamicFavicon';

const root = ReactDOM.createRoot(document.getElementById('root'));

dynamicFavicon()

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
