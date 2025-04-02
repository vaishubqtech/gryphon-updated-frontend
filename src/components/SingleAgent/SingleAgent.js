import React, { useEffect, useState } from 'react'
import "./singleAgent.css"
import { useNavigate, useParams } from "react-router-dom";
import { getEllipsisTxt } from '../../utils/formatter';
import { MdOutlineContentCopy } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaExternalLinkAlt, FaTimes, FaGithub, FaPaperPlane } from "react-icons/fa";
import CandlestickChart from '../CandlestickChart/CandlestickChart';
import { TiInfoOutline } from "react-icons/ti";
import { Tooltip } from 'antd';
import Avatar from "../../assets/images/Frame 1394.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { amountOutValue, buyApprove, buyTrade, getTokenBalance, sellApprove, sellTrade } from '../../services/gryphon-web3';
import config from '../../config';
import Web3 from 'web3';
import { getAgentById } from '../../services/APIManager';

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
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTradeTab, setActiveTradeTab] = useState("buy")
    const [amountToTrade, setAmountToTrade] = useState()
    const [estimatedAmount, setEstimatedAmount] = useState()
    const [buyHashValue, setBuyHashValue] = useState()
    const [sellHashValue, setSellHashValue] = useState()
    const [gryphonMaxBalance, setGryphonMaxBalance] = useState()

    useEffect(() => {
        if (id) {

            fetchAgent();
        }
    }, [id]);
    useEffect(()=>{
        getGryphonBalance()
    },[buyHashValue,sellHashValue])
    const handleCopy = async () => {
        toast.success("ERC20Address copied!", {
            position: "top-right",
            className: "copy-toast-message",
        });
    }
    const fetchAgent = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await getAgentById(id, token);
            console.log("fetchAgent", response)
            if (response.success) {
                setAgent(response.data);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to fetch agent details");
            console.log("error in fetchAgent", err)
            return;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (amountToTrade) {
            estimatedAmountOut();
        }
    }, [amountToTrade, activeTradeTab])

    const estimatedAmountOut = async () => {
        console.log("amountToTrade", Web3.utils.toWei(amountToTrade, "ether"))
        try {
            let GryphonAddrOrZerothAddr;
            if (activeTradeTab === "buy") {
                GryphonAddrOrZerothAddr = config.gryphon_token_address;
            } else {
                GryphonAddrOrZerothAddr = "0x0000000000000000000000000000000000000000";
            }
            const estimatedAmtResult = await amountOutValue("0xfB41E5ea0d324A83a59633E94997B34f0DCA3213", GryphonAddrOrZerothAddr, Web3.utils.toWei(amountToTrade, "ether"), walletAddress)
            console.log("----estimatedAmtResult----", estimatedAmtResult);
            if (estimatedAmtResult) {
                setEstimatedAmount(estimatedAmtResult.toString())
            }
        } catch (err) {
            console.log("error in estimatedAmountOut", err)
            return
        }
    }

    const buy_approve = async () => {
        const toastId = toast.info("Approving your contract...", {
            position: "top-right",
            autoClose: false,
        });
        try {
            if (!amountToTrade) {
                toast.dismiss(toastId);
                toast.error("Please enter valid GRYPHON amount", {
                    position: "top-right",
                });
                return;
            }
            const approve_res = await buyApprove(Web3.utils.toWei(amountToTrade, "ether"), walletAddress)
            console.log("approve_res", approve_res)
            if (approve_res) {
                toast.dismiss(toastId);
                await buy_trade()
            }
        } catch (e) {
            console.log("error in approve buyTradeResult", e)
            return
        }
    }
    const buy_trade = async () => {
        const loadingToast = toast.loading("Placing Buy Trade");

        try {
            const buyTradeResult = await buyTrade(Web3.utils.toWei(amountToTrade, "ether"), "0xfB41E5ea0d324A83a59633E94997B34f0DCA3213", walletAddress)
            console.log("----buyTradeResult----", buyTradeResult);
            if (buyTradeResult?.status) {
                setBuyHashValue(buyTradeResult?.transactionHash)
                toast.update(loadingToast, {
                    render: "Bought the desired Token!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                toast.update(loadingToast, {
                    render: "Error in placing BUY Trade",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.log("error in buyTradeResult", err)
            return
        }
    }
    const sell_approve = async () => {
        const toastId = toast.info("Approving your contract...", {
            position: "top-right",
            autoClose: false,
        });
        try {
            if (!amountToTrade) {
                toast.dismiss(toastId);
                toast.error("Please enter valid TICKER amount", {
                    position: "top-right",
                });
                return;
            }
            const approve_res = await sellApprove(Web3.utils.toWei(amountToTrade, "ether"), walletAddress)
            console.log("approve_res", approve_res)
            if (approve_res) {
                toast.dismiss(toastId);
                await sell_trade()
            }
        } catch (e) {
            console.log("error in approve buyTradeResult", e)
            return
        }
    }

    const sell_trade = async () => {
        const loadingToast = toast.loading("Placing Sell Trade");
        try {

            const sellTradeResult = await sellTrade(Web3.utils.toWei(amountToTrade, "ether"), walletAddress)
            console.log("----sellTradeResult----", sellTradeResult);
            if (sellTradeResult?.status) {
                setSellHashValue(sellTradeResult?.transactionHash)
                toast.update(loadingToast, {
                    render: "SOLD the desired Token!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            } else {
                toast.update(loadingToast, {
                    render: "Error in placing SELL Trade",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        } catch (err) {
            console.log("error in sellTradeResult", err)
            return
        }
    }

    const getGryphonBalance = async() =>{
        try{
            const GBalance_res = await getTokenBalance(walletAddress);
            console.log("GBalance_res", GBalance_res);
            let balanceInEth = parseFloat(Web3.utils.fromWei(GBalance_res, "ether"));
            let formattedBalance = balanceInEth % 1 === 0 ? balanceInEth.toFixed(0) : balanceInEth.toFixed(4);
            setGryphonMaxBalance(formattedBalance.toString())
        }catch(e){
            console.log("error in gryphon balance", e)
        }
    }

    const transactionRoutingBuy = () => {
        const url = `https://testnet.bscscan.com/tx/${buyHashValue}`;
        window.open(url, "_blank");
    }
    const transactionRoutingSell = () => {
        const url = `https://testnet.bscscan.com/tx/${sellHashValue}`;
        window.open(url, "_blank");
    }

    return (
        <>
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

                                            <IconContext.Provider value={{ size: '1em', color: "#6B7897" }} >
                                                <div style={{ marginLeft: 7, cursor: "pointer" }}>
                                                    <MdOutlineContentCopy />
                                                </div>
                                            </IconContext.Provider>
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
                                    <p className="balance-text">{activeTradeTab === "buy" ? `${gryphonMaxBalance?gryphonMaxBalance:'0'} GRYPHON` : "0 AGENT "}</p>
                                    <input
                                        type="number"
                                        className="input-box"
                                        placeholder={activeTradeTab === "buy" ? "Enter the amount of GRYPHON" : "Enter the amount of AGENT"}
                                        onChange={(e) => { setAmountToTrade(e.target.value); setBuyHashValue(); setSellHashValue() }}
                                    />
                                </div>

                                {activeTradeTab === "buy" && buyHashValue ? <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10 }}>🔗<div className='tx-route' onClick={transactionRoutingBuy}> View Transaction </div></div> : <></>}
                                {activeTradeTab === "sell" && sellHashValue ? <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10 }}>🔗<div className='tx-route' onClick={transactionRoutingSell}> View Transaction </div> </div> : <></>}

                                {amountToTrade && !buyHashValue && <p className='est-amt'>You will receive<span style={{ color: '#f85d4f' }}> {estimatedAmount ? parseFloat(Web3.utils.fromWei(estimatedAmount, "ether")).toFixed(8) : '0'} {activeTradeTab === "buy" ? "TICKER" : "GRYPHON"}</span>   </p>}
                                <div className="amount-buttons">
                                    <button className="amount-button"><div>25%</div> </button>
                                    <button className="amount-button"><div>50%</div> </button>
                                    <button className="amount-button"><div>100%</div> </button>
                                </div>

                                <div className="trading-fee"><p> Trading Fee</p>
                                    <IconContext.Provider value={{ size: '1.2em', color: "#707979" }} >
                                        <div style={{ marginLeft: 4, cursor: "pointer", marginBottom: -4 }}>
                                            <Tooltip placement="right" color='#666' title="Trading fees earned will be used to cover inference charges. Once the fees are fully utilized, inferences will fail until more fees are accrued.">
                                                <TiInfoOutline />
                                            </Tooltip>
                                        </div>
                                    </IconContext.Provider>
                                </div>
                                {activeTradeTab === "buy" ?
                                    <button className="place-trade-button" onClick={buy_approve} >
                                        BUY
                                    </button> : <button className="place-trade-button" onClick={sell_approve}>
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

            <ToastContainer />
        </>
    )
}

export default SingleAgent
