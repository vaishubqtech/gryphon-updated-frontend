import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AgentDetailScreen from './pages/AgentDetail/AgentDetailScreen';
import ScrollToTop from './container/ScrollToTop/ScrollToTop';

function App() {
  return (
    <div className='app-css'>
        <Navbar/>
        <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/detail-screen/:id" element={<AgentDetailScreen />} />
        </Routes>
        <Footer/>
    </div>
  );
}

export default App;
