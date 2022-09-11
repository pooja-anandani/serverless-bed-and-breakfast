import React from 'react';
import ReactDOM from 'react-dom/client';
import Notification from './home/Notification';
import './index.css';
import RoutingConfig from './RoutingConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Notification />
    <RoutingConfig />
  </React.StrictMode>
);