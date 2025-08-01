import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { UserProvider } from './context/UserContext';
import { EventProvider } from './context/EventContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <EventProvider>
          <App />
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#8C1515',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </EventProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);