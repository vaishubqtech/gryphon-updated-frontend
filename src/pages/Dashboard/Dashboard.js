import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar/Navbar'
import DashStatistic from '../../components/DashStatistic/DashStatistic'
import AgentList from '../../components/AgentList/AgentList'
import Footer from '../../components/Footer/Footer'

const Dashboard = () => {
  return (
    <div className='dash-section'>
      <DashStatistic/>
      <AgentList/>
    </div>
  )
}

export default Dashboard
