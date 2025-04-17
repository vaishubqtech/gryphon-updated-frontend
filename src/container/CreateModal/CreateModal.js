import React, { useEffect, useState } from 'react'
import "./modal.css"
import { MdClose } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaCamera } from "react-icons/fa";
import LogoImage from "../../assets/images/Frame 1397.png"
import ProfileImage from "../../assets/images/Frame 1394.png"
import InfoImage from "../../assets/images/info-vector.png"
import { Tooltip } from 'antd';
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAgent, getAllAgents } from "../../services/APIManager";
import { amountOutValue, approveFactory, getTokenBalance, LaunchAgent } from "../../services/gryphon-web3";
import { useActiveAccount } from "thirdweb/react";
import Cookies from "js-cookie";
import { useBondingEstimation } from "../../hooks/useBondingEstimation";
import config from '../../config';


const CreateModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const account = useActiveAccount();
    // const walletAddress = account?.address
    const walletAddress = localStorage.getItem("publicAddress")
    const web3 = new Web3(window.ethereum);


    const [name, setName] = useState("");
    const [erc20Address, setErc20Address] = useState(" ");
    const [ticker, setTicker] = useState("");
    const [bio, setBio] = useState("");
    const [agentType, setAgentType] = useState("");
    const [goal, setGoal] = useState("");
    const [personality, setPersonality] = useState("personality");
    const [niche, setNiche] = useState("");
    const [purchaseAmount, setPurchaseAmt] = useState("")
    const [message, setMessage] = useState("");
    const [telegram, setTelegram] = useState("https://t.me/gryphon");
    const [twitter, setTwitter] = useState("https://twitter.com/gryphon");
    const [website, setWebsite] = useState("https://www.gryphon.com");
    const [youtube, setYoutube] = useState("https://www.youtube.com/c/gryphon");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const [modalStatus, setModalStatus] = useState(0);
    const [gryphonMaxBalance, setGryphonMaxBalance] = useState()
    // const[estimatesAmoutOutOnLaunch, setEstimatesAmoutOutOnLaunch] = useState()
    let estimatesAmoutOutOnLaunch = 0;
    const rawAmountInWei = purchaseAmount
    ? web3.utils.toWei(purchaseAmount.toString(), "ether")
    : null;

    const estimate = useBondingEstimation("0x66cdd203413970855a5AEe51a7ADD4519F27aC35", "0xc5fd4915762c796616C684f7D8B7c12365956b71",rawAmountInWei);
    console.log("estimatesAmoutOutOnLaunch" ,estimate )
    estimatesAmoutOutOnLaunch = (estimate?.estimatedOut)


    useEffect(()=>{
        getGryphonBalance()
    },[])

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleUpload = async () => {

        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        console.log("image File ", file)

        try {
            setUploading(true);
            setMessage("");

            const response = await fetch(
                "https://api.gryphon.finance/ai/api/v1/upload/single",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const result = await response.json();
            if (result) {
                console.log("image url", result.data.url)
                return result.data.url;

            } else {
                return false;
            }
        } catch (error) {
            setMessage("Upload failed. Please try again.");
            return false;
        } finally {
            setUploading(false);
        }
    };

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
    const approve_Factory = async () => {
        const toastId = toast.info("Approving your contract...", {
            position: "top-right",
            autoClose: false,
        });
        try {
            if (!purchaseAmount) {
                toast.dismiss(toastId);
                toast.error("Please enter valid GRYPHON amount", {
                    position: "top-right",
                });
                return;
            }

            if(Number(purchaseAmount)> Number(gryphonMaxBalance)){
                toast.dismiss(toastId);
                toast.error("Insufficient Gryphon Balance", {
                    position: "top-right",
                });
                return;
            }
            const adjustedAmount = (parseFloat(purchaseAmount) + 100).toString();
            const approveFactoryRes = await approveFactory(Web3.utils.toWei(adjustedAmount, "ether"), walletAddress);

            console.log("-----approveFactoryRes-------", approveFactoryRes)
            if (approveFactoryRes) {
                toast.dismiss(toastId);
                await create_agent();
            } else {
                toast.dismiss(toastId);
                toast.error("Something went wrong please try again", {
                    position: "top-right",
                });
            }
        } catch (e) {
            console.log("error in approve factory ", e)
            return;
        }
    }

    const create_agent = async () => {
        const loadingToast = toast.loading("Launching agent...");
        try {
            const imageUploadURL = await handleUpload();
            if (!imageUploadURL) {
                toast.update(loadingToast, {
                    render: "Error in uploading image!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
                return;
            }
            const adjustedAmount = (parseFloat(purchaseAmount) + 100).toString();
            const createAgentRes = await LaunchAgent(name, ticker, [0, 1, 2, 3], bio, imageUploadURL ? imageUploadURL : "https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg", twitter, telegram, youtube, website, Web3.utils.toWei(adjustedAmount, "ether"), walletAddress);
            console.log("-----createAgentRes-------", createAgentRes)
            if (createAgentRes?.status) {
                console.log("||||| launched event ||||", createAgentRes?.events?.Launched)
                toast.update(loadingToast, {
                    render: "Agent created successfully! View on New AI Agent ",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                resetForm();
            } else {
                toast.update(loadingToast, {
                    render: "Error in launching agent",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
            setTimeout(() => {
                onClose();
                window.location.reload();
            }, 5000);
        } catch (e) {
            console.log("error in create_agent ", e)
            return;
        }
    }


    const submitWeb3 = async () => {
        await approve_Factory();
    }


    const resetForm = () => {
        setModalStatus(0)
        setName("");
        setFile("");
        setErc20Address("");
        setTicker("");
        setBio("");
        setAgentType("");
        setGoal("");
        setPersonality("");
        setNiche("");
        setPurchaseAmt()
        setImage("")

    };
    function formatNumberStr(numStr) {
        const num = parseFloat(numStr);
        return Number.isInteger(num) ? num : Number(num.toFixed(0));
      }
    const moveModal1 = () => {
        if (name && ticker && bio && agentType && image && niche && goal) {  
            setModalStatus(1)
         } else {
            toast.warning("Please fill the required fields", {
                position: "top-right",
            });
        }
           
     
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal">
                    {modalStatus === 0 ? <>
                        <div className='modal-head'>
                            <div className='modal-heading'>AI Agent Creation</div>
                            <IconContext.Provider value={{ color: "#F2F2F28A", className: "global-class-name" }}>
                                <div style={{ cursor: 'pointer' }} onClick={onClose}>
                                    <MdClose />
                                </div>
                            </IconContext.Provider>
                        </div>
                        <div className='modal-body'>
                            <div className='agent-n-t-flex'>
                                <div className='top-50'>
                                    <label>AI Agent Name*</label>
                                    <input type="text" placeholder="Agent Name" value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='top-50'>
                                    <label>AI Agent Ticker*</label>
                                    <input type="text" placeholder="$" value={ticker}
                                        onChange={(e) => setTicker(e.target.value)} />
                                </div>
                            </div>
                            <label>Agent Profile Picture</label>
                            <div className="upload-container">
                                <label className="image-upload">
                                    <input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} className='upload-input' />
                                    <div className="image-preview">
                                        {image ? <img src={image} alt="Profile" /> : <FaCamera className="camera-icon" />}
                                    </div>
                                </label>
                                <p className="upload-text">JPG, PNG, WEBP, and GIF files supported.<br />Max file size is 5MB</p>
                            </div>

                            <label>Agent Type*</label>
                            <select id="agentType" value={agentType} onChange={(e) => setAgentType(e.target.value)}>
                                <option value="None" >None</option>
                                <option value="on-chain">On-chain</option>
                                <option value="informative">Informative</option>
                                <option value="Productivity">Productivity</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Creative">Creative</option>
                            </select>

                            <label>Pitch your agent*</label>
                            <textarea placeholder="Tell everyone what your agent does and how it can help the community" value={niche} onChange={(e) => setNiche(e.target.value)} />

                            <label>Goals and purpose of your agent*</label>
                            <textarea placeholder="i.e. - Persona, goals, guidelines, thinking style, communication style, etc." value={goal} onChange={(e) => setGoal(e.target.value)} />

                            <label>Team bio*</label>
                            <textarea placeholder="None" value={bio}
                                onChange={(e) => setBio(e.target.value)} />

                            <div className="modal-actions">
                                <button className="cancel" onClick={onClose}>Cancel</button>
                                <button className="next" onClick={moveModal1}>Next</button>
                                {/* <button className="next" onClick={handleUpload}>Next</button> */}
                            </div>
                        </div> </> :
                        <>  {modalStatus === 1 ? <>
                            <div className='modal-head'>
                                <div className='modal-heading'>AI Agent Creation</div>
                                <IconContext.Provider value={{ color: "#F2F2F28A", className: "global-class-name" }}>
                                    <div style={{ cursor: 'pointer' }} onClick={onClose}>
                                        <MdClose />
                                    </div>
                                </IconContext.Provider>
                            </div>
                            <div className='modal-body '>
                                <div className='body-height'>
                                    <div className='modal-heading'>Connecting Socials</div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 25, marginBottom: 15 }}>
                                        <div className='acc-label'>Agent’s X Account</div>
                                        <div className='red-dot' />
                                        <div className='acc-red'>Please connect your X account</div>
                                    </div>
                                    <Tooltip placement="bottom" color='#2e3844' title="Coming soon! Click NEXT to complete your agent creation.">

                                        <div className='x-cta'>Connect X</div>
                                    </Tooltip>
                                    <div className='acc-label' style={{ marginBottom: 10 }}>How would you like to setup the X account</div>
                                    <select id="agentType">
                                        <option>Use Gryphon's AI Stack</option>
                                    </select>

                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: 25, marginBottom: 15 }}>
                                        <div className='acc-label'>How would you like to setup the X account</div>
                                        <div className='red-dot' />
                                        <div className='acc-red'>Please select an option</div>
                                    </div>
                                    <Tooltip placement="bottom" color='#2e3844' title="Coming soon! Click NEXT to complete your agent creation.">
                                        <div className='setup-x'>
                                            <div className='setup-single'>I will manage it myself</div>
                                            <div className='setup-single'>Use Gryphon's AI Stack</div>
                                        </div>
                                    </Tooltip>
                                </div>

                            </div>
                            <div className="modal-actions" style={{ padding: "20px 20px" }}>
                                <button className="cancel" onClick={() => { setModalStatus(0) }}>Cancel</button>
                                <button className="next" onClick={() => setModalStatus(2)}>Next</button>
                            </div>
                        </> :

                            <>

                                <div className='modal-head'>
                                    <div className='modal-heading'>Payment Summary</div>
                                    <IconContext.Provider value={{ color: "#F2F2F28A", className: "global-class-name" }}>
                                        <div style={{ cursor: 'pointer' }} onClick={onClose}>
                                            <MdClose />
                                        </div>
                                    </IconContext.Provider>
                                </div>
                                <div className='modal-body '>
                                    <div className='body-height'>
                                        <div className='modal-heading'>Buy ${ticker}</div>
                                        <div className='buy-desc'>*Purchasing a small amount of your token is optional but can help protect your coin from snipers.</div>
                                        <div className='acc-label' style={{ marginBottom: 10 }}>GRYPHON</div>
                                        <div className='buy-modal-input'>
                                            <input placeholder='200' className='' type='number' onChange={(e) => setPurchaseAmt(e.target.value)} />
                                            <img src={LogoImage} alt="" className='buy-modal-img' />
                                        </div>
                                        <div className='buy-desc' style={{ padding: "5px 0 0" }}>You will receive <span style={{color:'#fff', marginLeft:5}}> {estimatesAmoutOutOnLaunch ? formatNumberStr(Web3.utils.fromWei(estimatesAmoutOutOnLaunch,"ether")) : "0"}</span>   <img src={image ? image : 'https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg'} alt="" className='buy-span-img' /> <span> ${ticker}</span></div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className='buy-desc' style={{ padding: "5px 0 0" }}>Trading Fee</div>
                                            <div style={{ marginLeft: 4, cursor: "pointer", marginBottom: -10 }}>
                                                <Tooltip placement="right" color='#2e3844' title="Trading fees earned will be used to cover inference charges. Once the fees are fully utilized, inferences will fail until more fees are accrued.">
                                                    <img src={InfoImage} alt="" className='vector-info' />
                                                </Tooltip>
                                            </div>

                                        </div>
                                        <div className='border-line-modal' />
                                        <div className='modal-heading' style={{ paddingBottom: 25 }}>Payment Summary</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                            <div className='buy-desc' style={{ padding: 0 }}>Agent Creation Fee</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='buy-desc' style={{ marginRight: 5, padding: 0 }}>100</div>
                                                <img src={LogoImage} alt="" className='buy-modal-img' />
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", marginTop: 10 }}>
                                            <div className='buy-desc' style={{ padding: 0 }}>Your Initial Buy</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div className='buy-desc' style={{ marginRight: 5, padding: 0 }}> {purchaseAmount ? purchaseAmount : "0"}</div>
                                                <img src={image ? image : 'https://t3.ftcdn.net/jpg/06/71/33/46/360_F_671334604_ZBV26w9fERX8FCLUyDrCrLrZG6bq7h0Q.jpg'} alt="" className='buy-modal-img' />

                                            </div>
                                        </div>
                                        <div className='border-line-modal-dash' />
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                            <div>Total</div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {/* <div className='buy-desc' style={{ marginRight: 5, padding: 0 }}>(100 Gryphon + {purchaseAmount ? purchaseAmount : "0"} ${ticker})</div> */}
                                                <div style={{ marginRight: 5 }}>   {100 + (purchaseAmount ? Number(purchaseAmount) : 0)}</div>
                                                <img src={LogoImage} alt="" className='buy-modal-img' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-actions" style={{ padding: "20px 20px" }}>
                                    <button className="cancel" onClick={() => { setModalStatus(1) }}>Cancel</button>
                                    <button className="next" onClick={submitWeb3} >Create Agent</button>
                                </div>
                            </>}</>
                    }
                </div>
            </div >
            <ToastContainer />
        </>
    );
};


export default CreateModal;