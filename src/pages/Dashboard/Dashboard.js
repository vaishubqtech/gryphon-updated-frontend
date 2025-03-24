import React from 'react'
import "./dashboard.css"
import Navbar from '../../components/Navbar/Navbar'
import DashStatistic from '../../components/DashStatistic/DashStatistic'

const Dashboard = () => {
  return (
    <div className='dash-section'>
      <Navbar/>
      <DashStatistic/>
    </div>
  )
}

export default Dashboard
