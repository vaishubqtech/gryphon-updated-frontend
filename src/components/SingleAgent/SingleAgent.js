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
import { amountOutValue, buyApprove, buyTrade, getAgentTokenBalance, getTokenBalance, sellApprove, sellTrade, tokenInfo } from '../../services/gryphon-web3';
import config from '../../config';
import Web3 from 'web3';
import { getAgentById, updateTokenInfo } from '../../services/APIManager';
import { useActiveAccount } from "thirdweb/react";
import Cookies from "js-cookie";
const agent = [{
    id: 1,
    profileImage: Avatar,
    name: 'Agent 1',
    ticker: "$AGT1",
    erc20Address: "0x25Bb8D9eB53eEe8b899ff9E8c9c78674Ce8b9937",
    bio: "Evolutionary DeFi AI for Advanced Portfolio Strategies. Degen Futures Yield AI is led by Degen Freak Yeets.",

}]
// const capabilitesFeed = ["Post Twitter", "Search Internet", "Search Twitters", "Intuitive Guidance", "Confidence Boosting", "Behavioral Awareness", "Emotional Clarity", "Community Engagement"]
const capabilitesFeed = ["Post Twitter", "Search Internet", "Search Twitters", "Community Engagement"]

const SingleAgent = () => {
    const account = useActiveAccount();
    const walletAddress = account?.address
    const [activeSortTab, setActiveSortTab] = useState(0);
    // const walletAddress = localStorage.getItem("publicAddress")
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
    const [agentMaxBalance, setAgentMaxBalance] = useState()
    const [tokenInfoRes, setTokenInfoRes] = useState()
    const [priceChange1h, set1hPriceChange] = useState()
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id) {

            fetchAgent();

        }
    }, [id]);


    useEffect(() => {
        getTokenInfo()
        getGryphonBalance()
        getAgentBalance()
    }, [agent?.erc20Address])

    const handleCopy = async (textToCopy) => {
        try {
            toast.success("ERC20Address copied!", {
                position: "top-right",
                className: "copy-toast-message",
            });
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy!", err);
        }

    }
    const fetchAgent = async () => {
        try {
            const token = Cookies.get("authToken");
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
            const estimatedAmtResult = await amountOutValue(agent.erc20Address, GryphonAddrOrZerothAddr, Web3.utils.toWei(amountToTrade, "ether"), walletAddress)
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
            if (amountToTrade > estimatedAmount) {
                toast.dismiss(toastId);
                toast.error("Amount exceeds balance. Try again!", {
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
            const buyTradeResult = await buyTrade(Web3.utils.toWei(amountToTrade, "ether"), agent?.erc20Address, walletAddress)
            console.log("----buyTradeResult----", buyTradeResult);
            if (buyTradeResult?.status) {
                setBuyHashValue(buyTradeResult?.transactionHash)
                await tokenInfoAPI()
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
                toast.error("Please enter valid amount", {
                    position: "top-right",
                });
                return;
            }
            if (amountToTrade > estimatedAmount) {
                toast.dismiss(toastId);
                toast.error("Amount exceeds balance. Try again!", {
                    position: "top-right",
                });
                return;
            }
            const approve_res = await sellApprove(Web3.utils.toWei(amountToTrade, "ether"), agent?.erc20Address, walletAddress)
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

            const sellTradeResult = await sellTrade(Web3.utils.toWei(amountToTrade, "ether"), agent?.erc20Address, walletAddress)
            console.log("----sellTradeResult----", sellTradeResult);
            if (sellTradeResult?.status) {
                setSellHashValue(sellTradeResult?.transactionHash)
                await tokenInfoAPI()
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

    const getGryphonBalance = async () => {
        try {
            const GBalance_res = await getTokenBalance(walletAddress);
            console.log("GBalance_res", GBalance_res);

            let balanceInEth = parseFloat(Web3.utils.fromWei(GBalance_res, "ether"));
            let formattedBalance = balanceInEth % 1 === 0 ? balanceInEth.toString() : balanceInEth.toFixed(4).replace(/\.?0+$/, "");

            setGryphonMaxBalance(formattedBalance);
        } catch (e) {
            console.log("error in gryphon balance", e)
        }
    }
    const getAgentBalance = async () => {
        try {
            console.log("--agent?.erc20Address--", agent?.erc20Address)
            const AGTBalance_res = await getAgentTokenBalance(agent?.erc20Address, walletAddress);
            console.log("AGTBalance_res", AGTBalance_res);

            let balanceInEth = parseFloat(Web3.utils.fromWei(AGTBalance_res, "ether"));
            let formattedBalance = balanceInEth % 1 === 0 ? balanceInEth.toString() : balanceInEth.toFixed(4).replace(/\.?0+$/, "");

            setAgentMaxBalance(formattedBalance);
        } catch (e) {
            console.log("error in agent balance", e)
        }
    }


    const getTokenInfo = async () => {
        try {
            const infoRes = await tokenInfo(agent?.erc20Address)
            console.log("infoRes", infoRes)
            setTokenInfoRes(infoRes)

        } catch (e) {
            console.log("error in getTokenInfo", e)
            return
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


    const viewContractAddress = () => {
        const url = `https://testnet.bscscan.com/address/${agent?.erc20Address}`;
        window.open(url, "_blank");
    }
    const percentage25 = () => {
        let resValue;
        if (activeTradeTab === "buy") {
            resValue = (25 / 100) * gryphonMaxBalance;
        } else {
            resValue = (25 / 100) * agentMaxBalance;

        }
        setAmountToTrade(resValue)

    }
    const percentage50 = () => {
        let resValue;
        if (activeTradeTab === "buy") {
            resValue = (50 / 100) * gryphonMaxBalance;
        } else {
            resValue = (50 / 100) * agentMaxBalance;

        }
        setAmountToTrade(resValue)
    }
    const percentage100 = () => {
        let resValue;
        if (activeTradeTab === "buy") {
            resValue = gryphonMaxBalance;
        } else {
            resValue = agentMaxBalance;

        }
        setAmountToTrade(resValue)
    }


    const tokenInfoAPI = async () => {
        try {
            const infoRes = await updateTokenInfo(agent?.erc20Address, activeTradeTab === "buy" ? "BUY" : "SELL", Web3.utils.fromWei(tokenInfoRes?.data?.volume, "ether"));
            console.log("tokenInfoAPI", infoRes)
            // setTokenInfoRes(infoRes)


        } catch (e) {
            console.log("error in tokenInfo", e)
            return;
        }
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
                                        src={agent?.profileImage ? agent?.profileImage : "https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg"}
                                        alt="Profile"
                                        className="profile-img"
                                    />
                                    <div>
                                        <div style={{ display: 'flex', marginTop: 4 }}>
                                            <h2 className="profile-name">{agent?.name}</h2>
                                            <p className="profile-symbol">${agent?.ticker}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, zIndex: 9 }} onClick={() => handleCopy(agent?.erc20Address)}>

                                            <div className='erc20-token'>{getEllipsisTxt(agent?.erc20Address, 6)}</div>

                                            <IconContext.Provider value={{ size: '1em', color: "#6B7897" }} >
                                                <div style={{ marginLeft: 7, cursor: "pointer" }}>
                                                    <MdOutlineContentCopy />
                                                </div>
                                            </IconContext.Provider>
                                        </div>
                                    </div>
                                </div>
                                {/* <TradingViewChart /> */}
                                {agent?.agentId && 
                                <CandlestickChart  agentID={agent?.agentId}/> }
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
                                        <span>-</span>
                                    </div>
                                    <div className="metric-statistic">
                                        <span>Impressions</span>
                                        <span>-</span>
                                    </div>
                                    <div className="metric-statistic">
                                        <span>Engagement</span>
                                        <span>-</span>
                                    </div>
                                    <div className="metric-statistic">
                                        <span>Followers</span>
                                        <span>-</span>
                                    </div>

                                </div>
                                <div className="agent-tab">
                                    <div
                                        className={activeSortTab === 0 ? "sort-tab-active" : "sort-tab"}
                                        onClick={() => setActiveSortTab(0)}
                                    >
                                        Summary
                                    </div>
                                    <Tooltip placement='right' title="Coming Soon !">
                                        <div
                                            className={activeSortTab === 1 ? "sort-tab-active" : "sort-tab"}
                                            onClick={() => setActiveSortTab(1)}
                                        >
                                            Terminal
                                        </div>
                                    </Tooltip>
                                    <Tooltip placement='right' title="Coming Soon !">
                                        <div
                                            className={activeSortTab === 2 ? "sort-tab-active" : "sort-tab"}
                                            onClick={() => setActiveSortTab(2)}
                                        >
                                            Trades
                                        </div>
                                    </Tooltip>
                                    <Tooltip placement='right' title="Coming Soon !">
                                        <div
                                            className={activeSortTab === 3 ? "sort-tab-active" : "sort-tab"}
                                            onClick={() => setActiveSortTab(3)}
                                        >
                                            Holders
                                        </div>
                                    </Tooltip>
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
                                    <p className="balance-text">{activeTradeTab === "buy" ? `${gryphonMaxBalance ? gryphonMaxBalance : '0'} GRYPHON` : `${agentMaxBalance ? agentMaxBalance : "0"} ${agent?.ticker} `}</p>
                                    <input
                                        type="number"
                                        className="input-box"
                                        placeholder={activeTradeTab === "buy" ? "Enter the amount of GRYPHON" : "Enter the amount of AGENT"}
                                        value={amountToTrade}
                                        onChange={(e) => { setAmountToTrade(e.target.value); setBuyHashValue(); setSellHashValue() }}
                                    />
                                </div>

                                {activeTradeTab === "buy" && buyHashValue ? <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10 }}>🔗<div className='tx-route' onClick={transactionRoutingBuy}> View Transaction </div></div> : <></>}
                                {activeTradeTab === "sell" && sellHashValue ? <div style={{ display: 'flex', alignItems: 'center', paddingTop: 10 }}>🔗<div className='tx-route' onClick={transactionRoutingSell}> View Transaction </div> </div> : <></>}

                                {amountToTrade && !buyHashValue && <p className='est-amt'>You will receive<span style={{ color: '#f85d4f' }}> {estimatedAmount ? parseFloat(Web3.utils.fromWei(estimatedAmount, "ether")).toFixed(8) : '0'} {activeTradeTab === "buy" ? agent?.ticker : "GRYPHON"}</span>   </p>}
                                <div className="amount-buttons">
                                    <button className="amount-button" onClick={percentage25}><div>25%</div> </button>
                                    <button className="amount-button" onClick={percentage50}><div>50%</div> </button>
                                    <button className="amount-button" onClick={percentage100}><div>100%</div> </button>
                                </div>

                                <div className="trading-fee"><p> Trading Fee</p>
                                    <IconContext.Provider value={{ size: '1.2em', color: "#6B7897" }} >
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
                                {/* <div className="price">${agent?.price || 0}</div> */}
                                <div className="price">${tokenInfoRes?.data[5] || 0}</div>
                                <div className="metrics">
                                    <div className="metric">
                                        <span>Market Cap</span>
                                        {/* <span>${agent?.marketCap? parseFloat(Web3.utils.fromWei(agent?.marketCap, "ether"))   :  0}k</span> */}
                                        <span>${tokenInfoRes?.data ? parseFloat(Web3.utils.fromWei(tokenInfoRes?.data[6], "ether")).toFixed(3) : 0}k</span>
                                    </div>
                                    <div className="metric">
                                        <span>Liquidity</span>
                                        <span>${tokenInfoRes?.data[7] ? parseFloat(Web3.utils.fromWei(tokenInfoRes?.data[7], "ether")).toFixed(3) : 0}k</span>
                                    </div>
                                </div>
                                <div className="metrics">
                                    <div className="metric">
                                        <span>Holders</span>
                                        <span>-</span>
                                    </div>
                                    <div className="metric">
                                        <span>24h Volume</span>
                                        <span>${agent?.volume24h ? parseFloat(Web3.utils.fromWei(agent?.volume24h, "ether")) : 0}k</span>
                                    </div>
                                </div>
                                <div className="top-10">
                                    <span>Supply</span>
                                    <span>{tokenInfoRes?.data?.supply ? parseFloat(Web3.utils.fromWei(tokenInfoRes?.data?.supply, "ether")) : 0}</span>
                                </div>
                                <div className="time-frames">
                                    <div className="time-frame">
                                        <span>1h</span>
                                        <span>{priceChange1h ? priceChange1h : '-'}</span>
                                    </div>
                                    <div className="time-frame">
                                        <span>24h</span>
                                        {/* <span>{agent?.priceChange24h ? parseFloat(Web3.utils.fromWei(agent?.priceChange24h, "ether"))  : 0}%</span> */}
                                        <span>{tokenInfoRes?.data?.volume24H ? parseFloat(Web3.utils.fromWei(tokenInfoRes?.data?.volume24H, "ether")).toFixed(3) : 0}%</span>
                                    </div>
                                    <div className="time-frame">
                                        <span>7d</span>
                                        <span>-</span>
                                    </div>
                                </div>
                                <div className="volume">
                                    <span>Volume</span>
                                    {/* <span>{agent?.supply ? parseFloat(Web3.utils.fromWei(agent?.supply, "ether"))  : 0}</span> */}
                                    <span>{tokenInfoRes?.data?.volume ? parseFloat(Web3.utils.fromWei(tokenInfoRes?.data?.volume, "ether")).toFixed(3) : 0}</span>
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
                                            <span className="wallet-address">{agent?.erc20Address ? getEllipsisTxt(agent?.erc20Address, 6) : "Contract Address here"}</span>
                                            <div className="view-profile" onClick={() => navigate("/")}>View Profile</div>

                                        </div>
                                    </div>
                                    <div style={{ cursor: "pointer" }} className="profile-link" onClick={viewContractAddress}>
                                        <FaExternalLinkAlt />
                                    </div>
                                </div>
                                <div className="actions">
                                    <FaTimes className="icon" />
                                    <FaGithub className="icon" />
                                    <FaPaperPlane className="icon" />
                                </div>
                                <div className="bio">
                                    <h3>Biography</h3>
                                    <p>Gryphon User Bio; Will update soon...</p>
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
