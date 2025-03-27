import React, { useEffect, useState } from 'react'
import "./singleAgent.css"
import { useNavigate, useParams } from "react-router-dom";
import { getEllipsisTxt } from '../../utils/formatter';
import { MdOutlineContentCopy } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaExternalLinkAlt, FaTimes, FaGithub, FaPaperPlane } from "react-icons/fa";
import CandlestickChart from '../CandlestickChart/CandlestickChart';
import GRYLogo from "../../assets/images/logo-white.png"
import { TiInfoOutline } from "react-icons/ti";
import { Tooltip } from 'antd';
import Avatar from "../../assets/images/Frame 1394.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const agent = [{
    id: 1,
    profileImage: Avatar,
    name: 'Agent 1',
    ticker: "$AGT1",
    erc20Address: "0x25Bb8D9eB53eEe8b899ff9E8c9c78674Ce8b9937",
    bio: "Evolutionary DeFi AI for Advanced Portfolio Strategies. Degen Futures Yield AI is led by Degen Freak Yeets.",

}]
const capabilitesFeed = ["Post Twitter", "Search Internet", "Search Twitters", "Intuitive Guidance", "Confidence Boosting", "Behavioral Awareness", "Emotional Clarity", "Community Engagement"]

const SingleAgent = () => {
    const [activeSortTab, setActiveSortTab] = useState(0);
    const walletAddress = localStorage.getItem("publicAddress")
    const navigate = useNavigate()
    const { id } = useParams();
    const [activeTradeTab, setActiveTradeTab] = useState("buy")
    const [amountToTrade, setAmountToTrade] = useState()


    const handleCopy = async () => {
        toast.success("ERC20Address copied!", {
            position: "top-right",
            className: "copy-toast-message",
        });
    }




    return (
        <div className="ds-container">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='ds-flex'>

                    <div className='flex-column-left'>
                        <div className="left-section">
                            <div className="profile">
                                <img
                                    src={agent?.profileImage ? agent?.profileImage : "https://s3.ap-southeast-1.amazonaws.com/virtualprotocolcdn/name_ccf503ff79.jpeg"}
                                    alt="Profile"
                                    className="profile-img"
                                />
                                <div>
                                    <div style={{ display: 'flex', marginTop: 4 }}>
                                        <h2 className="profile-name">{agent?.name ? agent?.name : "Agent Name"}</h2>
                                        <p className="profile-symbol">${agent?.ticker ? agent?.ticker : "AGT"}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, zIndex: 9 }} onClick={handleCopy}>

                                        <div className='erc20-token'>{getEllipsisTxt("0x25Bb8D9eB53eEe8b899ff9E8c9c78674Ce8b9937", 6)}</div>

                                        <IconContext.Provider value={{ size: '1em', color: "#404849" }} >
                                            <div style={{ marginLeft: 7, cursor: "pointer" }}>
                                                <MdOutlineContentCopy />
                                            </div>
                                        </IconContext.Provider>
                                        <ToastContainer />
                                    </div>
                                </div>
                            </div>
                            {/* <TradingViewChart /> */}
                            <CandlestickChart />
                        </div>
                        <div className="ascension-progress">
                            <div className='statistic-values'>
                                <div className="agentic-container">
                                    <div className="agentic-header">
                                        <span className="agentic-title">Agentic Level</span>
                                        {/* <FaInfoCircle className="info-icon" /> */}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="agentic-level">Level 1</span>
                                        <div className="progress-bar">
                                            <div className="progress-fill"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="metric-statistic">
                                    <span>Mindshare</span>
                                    <span>477.89k</span>
                                </div>
                                <div className="metric-statistic">
                                    <span>Impressions</span>
                                    <span>559.51k</span>
                                </div>
                                <div className="metric-statistic">
                                    <span>Engagement</span>
                                    <span>477.89k</span>
                                </div>
                                <div className="metric-statistic">
                                    <span>Followers</span>
                                    <span>55.51k</span>
                                </div>

                            </div>
                            <div className="agent-tab">
                                <div
                                    className={activeSortTab === 0 ? "sort-tab-active" : "sort-tab"}
                                    onClick={() => setActiveSortTab(0)}
                                >
                                    Summary
                                </div>
                                <div
                                    className={activeSortTab === 1 ? "sort-tab-active" : "sort-tab"}
                                    onClick={() => setActiveSortTab(1)}
                                >
                                    Terminal
                                </div>
                                <div
                                    className={activeSortTab === 2 ? "sort-tab-active" : "sort-tab"}
                                    onClick={() => setActiveSortTab(2)}
                                >
                                    Trades
                                </div>
                                <div
                                    className={activeSortTab === 3 ? "sort-tab-active" : "sort-tab"}
                                    onClick={() => setActiveSortTab(3)}
                                >
                                    Holders
                                </div>
                            </div>
                            <div style={{ marginTop: 28 }} />
                            <h2 className='summary-head'>About Agent Summary</h2>
                            <p className='bio'>{agent?.bio ? agent?.bio : "Iona, the dynamic leader and main vocalist of AI-DOL, stands out with her striking pink braids and an athletic build, embodying a fusion of strength, elegance, and creativity. Assertive and deeply compassionate, she guides the group with strategic insight..."}</p>

                            <h2 className='summary-head'>Framework</h2>
                            <p className='bio'>Others</p>
                            <h2 className='summary-head'>Capabilities</h2>
                            <div className='cap-flex'>
                                {capabilitesFeed?.map((item, index) => {
                                    return (
                                        <div className='cap-tag'> {item}</div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='flex-column-right'>
                        <div className="right-section">
                            <div className="swap-buttons">
                                <button className={activeTradeTab === "buy" ? "active-button" : "tab-button"} onClick={() => setActiveTradeTab("buy")}>Buy</button>
                                <button className={activeTradeTab === "sell" ? "active-button" : "tab-button"} onClick={() => setActiveTradeTab("sell")}>Sell</button>
                            </div>

                            <div className="input-section">
                                <p className="balance-text">0 GRYPHON</p>
                                <input
                                    type="text"
                                    className="input-box"
                                    placeholder={activeTradeTab === "buy" ? "Enter the amount of GRYPHON" : "Enter the amount of TICKER"}
                                    onChange={(e) => setAmountToTrade(e.target.value)}
                                />
                            </div>
                            {amountToTrade && <p className='est-amt'>You will receive<span style={{ color: '#f85d4f' }}> 0.09864 {activeTradeTab === "buy" ? "TICKER" : "GRYPHON"}</span>   </p>}
                                <div className="amount-buttons">
                                    <button className="amount-button"><div>25%</div><img src={GRYLogo} alt="" className='amt-logo' /> </button>
                                    <button className="amount-button"><div>50%</div><img src={GRYLogo} alt="" className='amt-logo' /> </button>
                                    <button className="amount-button"><div>100%</div><img src={GRYLogo} alt="" className='amt-logo' /> </button>
                                </div>
                            
                            <div className="trading-fee"><p> Trading Fee</p>
                                <IconContext.Provider value={{ size: '1.2em', color: "#707979" }} >
                                    <div style={{ marginLeft: 4, cursor: "pointer", marginBottom: -4 }}>
                                        <Tooltip placement="right" color='#666' title="Trade fee description here!">
                                            <TiInfoOutline />
                                        </Tooltip>
                                    </div>
                                </IconContext.Provider>
                            </div>
                            {activeTradeTab === "buy" ?
                                <button className="place-trade-button" >
                                   BUY
                                </button> : <button className="place-trade-button">
                        SELL
                                </button>}
                        </div>

                        <div className="stats-container-agent">
                            <div className="price">$0.000474</div>
                            <div className="metrics">
                                <div className="metric">
                                    <span>Market Cap</span>
                                    <span>$477.89k</span>
                                </div>
                                <div className="metric">
                                    <span>Liquidity</span>
                                    <span>$559.51k</span>
                                </div>
                            </div>
                            <div className="metrics">
                                <div className="metric">
                                    <span>Holders</span>
                                    <span>99,949</span>
                                </div>
                                <div className="metric">
                                    <span>24h Volume</span>
                                    <span>$1.9k</span>
                                </div>
                            </div>
                            <div className="top-10">
                                <span>Top 10</span>
                                <span>76.78%</span>
                            </div>
                            <div className="time-frames">
                                <div className="time-frame">
                                    <span>1h</span>
                                    <span>0.00%</span>
                                </div>
                                <div className="time-frame">
                                    <span>24h</span>
                                    <span>0.00%</span>
                                </div>
                                <div className="time-frame">
                                    <span>7d</span>
                                    <span>-8.63%</span>
                                </div>
                            </div>
                            <div className="volume">
                                <span>Volume</span>
                                <span>$1.9k</span>
                            </div>
                        </div>
                        <div className="profile-card-ds">
                            <div className="header">
                                <h2>Developer</h2>
                            </div>
                            <div className="profile-info">
                                <div className='img-data'>
                                    <img
                                        src="https://www.gravatar.com/avatar/?d=retro"
                                        alt="Avatar"
                                        className="avatar"
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="wallet-address">{agent?.creatorId ? getEllipsisTxt(agent?.creatorId, 6) : "Contract Address here"}</span>
                                        <a href="#" className="view-profile" onClick={() => navigate("/profile")}>View Profile</a>

                                    </div>
                                </div>
                                <a href="#" className="profile-link">
                                    <FaExternalLinkAlt />
                                </a>
                            </div>
                            <div className="actions">
                                <FaTimes className="icon" />
                                <FaGithub className="icon" />
                                <FaPaperPlane className="icon" />
                            </div>
                            <div className="bio">
                                <h3>Biography</h3>
                                <p>Just a chill joker who's been in web3 since the ICO days circa.2017.</p>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default SingleAgent
