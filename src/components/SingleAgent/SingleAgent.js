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
import { amountOutValue, buyApprove, buyTrade, getAgentTokenBalance, getGradThreshold, getPairFunction, getReserveFunction, getTokenBalance, getTokenTransferAmount, sellApprove, sellTrade, tokenInfo } from '../../services/gryphon-web3';
import config from '../../config';
import Web3 from 'web3';
import { getAgentById, getVolumeInfo, updateTokenInfo } from '../../services/APIManager';
import { useActiveAccount } from "thirdweb/react";
import Cookies from "js-cookie";
import BN from 'bn.js';
import { amountOutPancake, getPairPancake } from '../../services/pancake-swap';

const capabilitesFeed = ["Post Twitter", "Search Internet", "Search Twitters", "Community Engagement"]

const SingleAgent = () => {
    const account = useActiveAccount();
    // const walletAddress = account?.address
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
    const [agentMaxBalance, setAgentMaxBalance] = useState()
    const [tokenInfoRes, setTokenInfoRes] = useState()
    const [priceChange1h, set1hPriceChange] = useState()
    const [copied, setCopied] = useState(false);
    const [volume1Hour, setVolume1Hour] = useState();
    const [volume24Hour, setVolume24Hour] = useState();
    const [volume7Days, setVolume7Days] = useState();
    const [swapAgentData, setSwapAgentData] = useState();
    const [swapGryphonData, setSwapGryphonData] = useState();
    const [reserve1Amt, setReserve1Amt] = useState();
    const [progressBarData, setProgressBarData] = useState();
    const [progressBarDataBonded, setProgressBarDataBonded] = useState(false);


    useEffect(() => {
        if (id) {

            fetchAgent();

        }
    }, [id]);


    useEffect(() => {
        getTokenInfo()
        gryphonPair()
        getGryphonBalance()
        getAgentBalance()
    }, [agent?.erc20Address])

    function formatNumberStr(numStr) {
        const num = parseFloat(numStr);
        const rounded = Number.isInteger(num) ? num : Number(num.toFixed(0));

        if (rounded >= 1_000_000_000) {
            return `$${(rounded / 1_000_000_000).toFixed(1)}B`;
        } else if (rounded >= 1_000_000) {
            return `$${(rounded / 1_000_000).toFixed(1)}M`;
        } else if (rounded >= 1_000) {
            return `$${(rounded / 1_000).toFixed(0)}K`;
        }

        return `$${rounded}`;
    }


    function getFormattedValue(rawValueInWei) {
        // Only convert if it's actually in Wei (big integer string)
        if (!rawValueInWei || isNaN(rawValueInWei)) return "$0";

        try {
            // If it's already a small number (e.g. < 1e18), just use it directly
            const value =
                Number(rawValueInWei) > 1e18
                    ? Web3.utils.fromWei(rawValueInWei.toString(), "ether")
                    : rawValueInWei;

            return formatNumberStr(value);
        } catch (err) {
            console.error("Error formatting value:", err);
            return "$0";
        }
    }

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
            console.log("Backend fetchAgent", response)
            if (response.success) {
                setAgent(response.data);
                await volumeInfo(response?.data?.agentId)

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

            if (Number(amountToTrade) > Number(gryphonMaxBalance)) {
                console.log(Number(amountToTrade) > Number(gryphonMaxBalance))
                console.log("amountToTrade > estimatedAmount", amountToTrade, gryphonMaxBalance)
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
                if (buyTradeResult?.transactionHash) {
                    await fetchTokenAmount(buyTradeResult?.transactionHash);

                }
                toast.update(loadingToast, {
                    render: "Bought the desired Token!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                await fetchAgent();
                await volumeInfo(agent?.agentId)
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

            if (Number(amountToTrade) > Number(agentMaxBalance)) {
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
                if (sellTradeResult?.transactionHash) {
                    await fetchTokenAmount(sellTradeResult?.transactionHash);

                }
                toast.update(loadingToast, {
                    render: "SOLD the desired Token!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                let tokenInfoRes = await getTokenInfo();
                await tokenInfoAPI(tokenInfoRes?.data?.volume, sellTradeResult?.transactionHash)
                await fetchAgent();
                await volumeInfo(agent?.agentId)

            } else {
                toast.update(loadingToast, {
                    render: "Error in Selling the token!",
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
            // console.log("GBalance_res", GBalance_res);

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
            // console.log("AGTBalance_res", AGTBalance_res);

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
            setTokenInfoRes(infoRes)
            return infoRes;
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
        const url = `https://testnet.bscscan.com/address/${agent?.blockchainData?.creator}`;
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


    const tokenInfoAPI = async (volume, transactionHash) => {
        try {
            const infoRes = await updateTokenInfo(agent?.erc20Address, activeTradeTab === "buy" ? "BUY" : "SELL", volume, transactionHash);
            console.log("tokenInfoAPI", infoRes)
            // setTokenInfoRes(infoRes)

        } catch (e) {
            console.log("error in tokenInfo", e)
            return;
        }
    }
    const volumeInfo = async (id) => {
        try {
            const volRes1h = await getVolumeInfo(id);
            setVolume1Hour(volRes1h?.data?.['1h'])
            setVolume24Hour(volRes1h?.data?.['24h'])
            setVolume7Days(volRes1h?.data?.['7d'])

        } catch (e) {
            console.log("error in tokenInfo", e)
            return;
        }
    }

    //   useEffect(()=>{          fetchTokenAmount();     },[]) 
    const fetchTokenAmount = async (txHash) => {
        const targetAddress = walletAddress;
        try {
            const amount = await getTokenTransferAmount(txHash, targetAddress);
            console.log(`##############  Amount received by ${targetAddress}: ${amount}`);
            let toFixedAmount = Number(amount).toFixed(4)
            await tokenInfoAPI(toFixedAmount.toString(), txHash)

        } catch (error) {
            console.error("############# Error while fetching token transfer amount:", error);
        }
    };
    useEffect(() => {
        if (!tokenInfoRes?.trading && tokenInfoRes?.tradingOnUniswap) {
            pancakeGetPairAddress()
        }
    }, [tokenInfoRes?.trading, tokenInfoRes?.tradingOnUniswap])

    const pancakeGetPairAddress = async () => {
        try {
            const pairRes = await getPairPancake(agent?.erc20Address, config.gryphon_token_address);
            console.log("pairRes", pairRes)
        } catch (e) {
            console.log("error in pancakeGetPairAddress", e)
        }
    }
    const gryphonPair = async () => {
        try {
            const gryphonPairRes = await getPairFunction(config.gryphon_token_address, agent?.erc20Address);
            console.log("gryphonPairRes", gryphonPairRes)
            await gryphonReserve(gryphonPairRes)
        } catch (e) {
            console.log("error in gryphonPairRes", e)
        }
    }
    const gryphonReserve = async (contract_address) => {
        try {
            const gryphonReserveRes = await getReserveFunction(contract_address);
            console.log("gryphonReserveRes", Web3.utils.fromWei(gryphonReserveRes[0], "ether"))
            setReserve1Amt(Web3.utils.fromWei(gryphonReserveRes[0], "ether"))
            await gradThresholdFunction(Web3.utils.fromWei(gryphonReserveRes[0], "ether"));

        } catch (e) {
            console.log("error in gryphonReserveRes", e)
        }
    }
    const gradThresholdFunction = async (reserve1) => {
        try {
            const gradThresholdFunctionRes = await getGradThreshold();
            console.log("gradThresholdFunctionRes", Web3.utils.fromWei(gradThresholdFunctionRes, "ether"))
            let gradThresValue = (Web3.utils.fromWei(gradThresholdFunctionRes, "ether"))
            let remaining_progress = ((Number(gradThresValue) - Number(reserve1)) / Number(gradThresValue)) * 100
            console.log("colored_value", (100 - Number(remaining_progress)) / 100)
            let colored_value = (100 - Number(remaining_progress)) / 100
            console.log("---remaining value" , 100 - Number(colored_value))
            setProgressBarData(colored_value)
            if (colored_value >= 1) {
                setProgressBarDataBonded(false)

            } else {
                setProgressBarDataBonded(true)
            }
        } catch (e) {
            console.log("error in gradThresholdFunctionRes", e)
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
                                {agent?.agentId &&
                                    <CandlestickChart agentID={agent?.agentId} />}
                            </div>
                            <div className="ascension-progress">
                                <div className='statistic-values'>
                                    <div className="agentic-container">
                                        <div className="agentic-header">
                                            <span className="agentic-title">Progress Bar</span>
                                        </div>
                                        <div className='progress-bar-flex'>
                                            {progressBarDataBonded ? <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${100}%` }}
                                                ></div>
                                                <span className="progress-text">{100}%</span>
                                            </div> :
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${progressBarData}%` }}
                                                    ></div>
                                                    <span className="progress-text">{parseFloat(progressBarData).toFixed(2)}%</span>
                                                </div>}
                                            <div className='prgs-txt'>Graduate this coin at ${(6075.90).toLocaleString()} market cap.There is 1 BNB in the bonding curve.</div>
                                        </div>
                                    </div>
                                    {/* <div className="metric-statistic">
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
                                    </div> */}

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
                            {tokenInfoRes?.trading && !tokenInfoRes?.tradingOnUniswap ?

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

                                    {amountToTrade && !buyHashValue && <p className='est-amt'>You will receive approx.<span style={{ color: '#f85d4f' }}> {estimatedAmount ? parseFloat(Web3.utils.fromWei(estimatedAmount, "ether")).toFixed(3) : '0'} {activeTradeTab === "buy" ? agent?.ticker : "GRYPHON"}</span>   </p>}
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
                                :
                                <div className="right-section">
                                    <div className='r-s-swap-heading'> Swap </div>

                                    <div className="input-section">
                                        <input
                                            type="number"
                                            className="input-box"
                                            placeholder="Enter the amount of GRYPHON"
                                            value={swapGryphonData}
                                            onChange={(e) => { setSwapGryphonData(e.target.value) }}
                                        />
                                        <p className="balance-text" style={{ marginTop: 10, cursor: 'pointer' }} onClick={() => setSwapGryphonData(gryphonMaxBalance)}>Max GRYPHON</p>
                                        {/*{` ${gryphonMaxBalance ? Number(gryphonMaxBalance).toFixed(0) : '0'}`} */}

                                    </div>

                                    <div className="">
                                        <input
                                            type="number"
                                            className="input-box"
                                            placeholder="Enter the amount of AGENT"
                                            value={swapAgentData}
                                            onChange={(e) => { setSwapAgentData(e.target.value) }}
                                        />
                                        <p className="balance-text" style={{ marginTop: 10, cursor: 'pointer' }} onClick={() => setSwapAgentData(agentMaxBalance)} >Max {agent?.ticker} </p>
                                        {/* { `${agentMaxBalance ? Number(agentMaxBalance).toFixed(0) : "0"} ${agent?.ticker} `} */}

                                    </div>



                                    <div className="trading-fee" style={{ marginTop: 20 }}><p> Trading Fee</p>
                                        <IconContext.Provider value={{ size: '1.2em', color: "#6B7897" }} >
                                            <div style={{ marginLeft: 4, cursor: "pointer", marginBottom: -4 }}>
                                                <Tooltip placement="right" color='#666' title="Trading fees earned will be used to cover inference charges. Once the fees are fully utilized, inferences will fail until more fees are accrued.">
                                                    <TiInfoOutline />
                                                </Tooltip>
                                            </div>
                                        </IconContext.Provider>
                                    </div>

                                    <button className="place-trade-button" >
                                        SWAP
                                    </button>
                                </div>
                            }

                            <div className="stats-container-agent">
                                <div className="price">${agent?.stats?.price || 0}</div>
                                <div className="metrics">
                                    <div className="metric">
                                        <span>Market Cap</span>
                                        <span>{getFormattedValue(agent?.stats?.marketCap)}</span>
                                    </div>
                                    <div className="metric">
                                        <span>Liquidity</span>
                                        <span>{getFormattedValue(agent?.stats?.liquidity)}</span>
                                    </div>
                                </div>
                                <div className="metrics">
                                    <div className="metric">
                                        <span>Holders</span>
                                        <span>{agent?.stats ? agent?.stats?.holderCount : 0}</span>
                                    </div>
                                    <div className="metric">
                                        <span>24h Change</span>
                                        <span>{agent?.stats?.priceChange24h ? Number(agent?.stats?.priceChange24h).toFixed(2) : 0}%</span>
                                    </div>
                                </div>
                                <div className="top-10">
                                    <span>Supply</span>
                                    <span>{agent?.stats?.supply ? formatNumberStr(Web3.utils.fromWei(agent?.stats?.supply, "ether")).toLocaleString() : 0}</span>
                                </div>
                                <div className="time-frames">
                                    <div className="time-frame">
                                        <span>1h</span>
                                        <span>{getFormattedValue((volume1Hour))}</span>
                                    </div>
                                    <div className="time-frame">
                                        <span>24h</span>
                                        <span>{getFormattedValue(volume24Hour)}</span>
                                    </div>
                                    <div className="time-frame">
                                        <span>7d</span>
                                        <span>{getFormattedValue(volume7Days)}</span>
                                    </div>
                                </div>
                                {/* <div className="volume">
                                    <span>Volume</span>
                                    <span>${tokenInfoRes?.data?.volume ? (Web3.utils.fromWei(tokenInfoRes?.data?.volume, "ether")).toLocaleString() : 0}</span>
                                </div> */}
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
                                            <span className="wallet-address">{agent?.blockchainData?.creator ? getEllipsisTxt(agent?.blockchainData?.creator, 6) : "Contract Address here"}</span>
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
                                    <p>{agent?.bio}</p>
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
