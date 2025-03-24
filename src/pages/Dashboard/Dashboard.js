import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar/Navbar'
import DashStatistic from '../../components/DashStatistic/DashStatistic'
import AgentList from '../../components/AgentList/AgentList'

const Dashboard = () => {
  return (
    <div className='dash-section'>
      <Navbar/>
      <DashStatistic/>
      <AgentList/>
    </div>
  )
}

export default Dashboard
