import React from 'react'
import "./stats.css"
import { LineChart, Line, ResponsiveContainer } from "recharts";

const DashStatistic = () => {

    const data = [
        { value: 10 },
        { value: 15 },
        { value: 7 },
        { value: 20 },
        { value: 13 },
        { value: 18 },
    ];
    return (
        <div className='stats-dash'>
            <div className='stats-head'>Market Overview</div>
            <div className='stats-flex'>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='cont-left-text'>Total Value Locked</div>
                        <div className='cont-right-value'>+6.4%</div>
                    </div>
                    <div className='stats-main-data'>$24,242,1236</div>
                </div>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='cont-left-text'>Market Cap</div>
                        <div className='cont-right-value'>+8.6%</div>
                    </div>
                    <div className='stats-main-data'>$306.28K</div>
                </div>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='cont-left-text' style={{paddingBottom:15}}>24h Volume</div>
                        <ResponsiveContainer width={70} height={40}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#00C896" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className='stats-main-data' style={{paddingTop:0}}>$81.9K</div>
                </div>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='cont-left-text'>24h Change</div>
                    </div>
                    <div className='stats-main-data-24'>+5.23%</div>
                </div>
            </div>
        </div>
    )
}

export default DashStatistic
