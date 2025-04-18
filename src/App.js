import React, { useState } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AgentDetailScreen from './pages/AgentDetail/AgentDetailScreen';
import ScrollToTop from './container/ScrollToTop/ScrollToTop';
import Liquidity from './TestFile/Liquidity';

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className='app-css'>
        <Navbar onSearch={setSearchQuery}/>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
          <Route path="/liq" element={<Liquidity />} />
          <Route path="/detail-screen/:id" element={<AgentDetailScreen />} />
        </Routes>
        <Footer/>
    </div>
  );
}

export default App;
