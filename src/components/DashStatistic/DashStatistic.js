import React, { useEffect, useState } from 'react'
import "./stats.css"
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getMarketOverview } from '../../services/APIManager';
import Web3 from 'web3';

const DashStatistic = () => {
    const [marketValue, setMarketValue] = useState()

    const data = [
        { value: 10 },
        { value: 15 },
        { value: 7 },
        { value: 20 },
        { value: 13 },
        { value: 18 },
    ];

    useEffect(() => {
        marketOverViewStats()
    }, [])

    const marketOverViewStats = async () => {
        try {
            const statsRes = await getMarketOverview();
            console.log("statsRes", statsRes?.data)
            setMarketValue(statsRes?.data)
        } catch (e) {
            console.log("error in marketOverViewStats", e)
        }
    }

    function formatNumberStr(numStr) {
        const num = parseFloat(numStr);
        return Number.isInteger(num) ? num : Number(num.toFixed(0));
      }


    return (
        <div className='stats-dash'>
            <div className='stats-head'>Market Overview</div>
            <div className='stats-flex'>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='cont-left-text'>Total Value Locked</div>
                        {/* <div className='cont-right-value'>0%</div> */}
                    </div>
                    <div className='stats-main-data'>{formatNumberStr(marketValue?.tvl ).toLocaleString()|| 0}</div>
                </div>
                <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='cont-left-text'>Market Cap</div>
                        {/* <div className='cont-right-value'>0%</div> */}
                    </div>
                    <div className='stats-main-data'>{marketValue?.marketCap || "0"}</div>
                </div>
                <div className='stats-container' style={{padding:'18px 15px'}}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className='cont-left-text' style={{ paddingBottom: 15 }}>24h Change</div>
                
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    <div className='stats-main-data' style={{ paddingTop: 0, color:'#00E4A1CC' }}>{marketValue?.change24h || 0}%</div>
                    <ResponsiveContainer width={70} height={40}>
                            <LineChart data={data}>
                                <Line type="monotone" dataKey="value" stroke="#00C896" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                </div>
                {/* <div className='stats-container'>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='cont-left-text'>24h Change</div>
                    </div>
                    <div className='stats-main-data-24'>{marketValue?.change24h || 0}%</div>
                </div> */}
            </div>
        </div>
    )
}

export default DashStatistic
