import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ChakraProvider, createSystem, defaultConfig, Toaster } from '@chakra-ui/react';
import { toaster } from './utils/toaster.js';
import { Web3Provider } from './context/Web3Context.jsx';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Testimonials from './pages/Testimonials';
import Hero from './pages/Hero';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import Qrcode from './pages/Qrcode';
import Chatbit from './pages/Chatbit';
import Footer from './components/Footer';
import Ticketsell from './pages/Ticketsell';
import MintNFT from './pages/MintNFT';
import Ticket from './pages/Ticket';
import Teams from './pages/Teams';
import Layout from './Layout';
import Myevent from './pages/Myevent';
import './index.css';
import WaitlistPage from './pages/WaitingList';
import QuantumTicketResale from './pages/QuantamTicketResale';
import EventManager from './components/events/EventManager';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><Home /></Layout>,
  },
  // {
  //   path: "discover",
  //   element: <Layout><Discover /></Layout>,
  // },
  {
    path: "testimonials",
    element: <Layout><Testimonials /></Layout>,
  },
  {
    path: "qrcode",
    element: <Layout><Qrcode /></Layout>,
  },
  {
    path: "ticket",
    element: <Layout><Ticket /></Layout>,
  },
  {
    path: "teams",
    element: <Layout><Teams /></Layout>,
  },

  {
    path: "hero",
    element: <Layout><Hero /></Layout>,
  },
  {
    path: "events",
    element: <Layout><EventList /></Layout>,
  },
  {
    path: "mint",
    element: <Layout><MintNFT /></Layout>,
  },
  
  {
    path: "event-details",
    element: <Layout><EventDetails /></Layout>,
  },
  {
    path: "Myevent",
    element: <Layout><Myevent /></Layout>,
  },
  {
    path: "chatbit",
    element: <Chatbit />,
  },

  {
    path: "waiting",
    element: <Layout><WaitlistPage /></Layout>
  },

  {
    path: "resell",
    element: <Layout><QuantumTicketResale /></Layout>
  },
  {
    path: "manage-events",
    element: <Layout><EventManager /></Layout>
  },
  {
    path: "*",
    element: <Footer />,
  },
]);

// Create system with custom global styles
const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: 'gray.50',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <Web3Provider>
        <RouterProvider router={router} />
        <Toaster toaster={toaster} />
      </Web3Provider>
    </ChakraProvider>
  </React.StrictMode>
);