import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import { AppProvider } from './hooks/useApp';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import SosActive from './pages/SosActive';
import LocationPage from './pages/LocationPage';
import ContactsPage from './pages/ContactsPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AppProvider><BrowserRouter><Routes><Route element={<Layout />}>
    <Route index element={<Dashboard />} /><Route path="sos" element={<SosActive />} /><Route path="location" element={<LocationPage />} />
    <Route path="contacts" element={<ContactsPage />} /><Route path="history" element={<HistoryPage />} /><Route path="profile" element={<ProfilePage />} />
    <Route path="*" element={<Dashboard />} />
  </Route></Routes></BrowserRouter></AppProvider></React.StrictMode>);
