import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar/Navbar'
import DashStatistic from '../../components/DashStatistic/DashStatistic'
import AgentList from '../../components/AgentList/AgentList'
import Footer from '../../components/Footer/Footer'

const Dashboard = ({ searchQuery }) => {
  return (
    <div className='dash-section'>
      <DashStatistic/>
      <AgentList searchQuery={searchQuery}/>
    </div>
  )
}

export default Dashboard
