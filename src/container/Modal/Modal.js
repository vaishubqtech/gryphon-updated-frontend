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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createAgent } from "../../services/APIManager";
import { approveFactory, LaunchAgent } from "../../services/gryphon-web3";


const Modal = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const walletAddress = localStorage.getItem("publicAddress")

    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [erc20Address, setErc20Address] = useState(" ");
    const [ticker, setTicker] = useState("");
    const [bio, setBio] = useState("");
    const [agentType, setAgentType] = useState("");
    const [goal, setGoal] = useState("");
    const [personality, setPersonality] = useState("personality");
    const [niche, setNiche] = useState("");
    const [purchaseAmount, setPurchaseAmt] = useState()
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [telegram, setTelegram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [website, setWebsite] = useState("");
    const [youtube, setYoutube] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const [modalStatus, setModalStatus] = useState(0);
    if (!isOpen) return null;


    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        console.log("image File ", file)
        try {
            setUploading(true);
            setMessage("");

            const response = await fetch(
                "http://api.gryphon.finance/ai/api/v1/upload/single",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (response.ok) {
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


    const approve_Factory = async () => {
        try {

            const approveFactoryRes = await approveFactory(Web3.utils.toWei(purchaseAmount, "ether"), walletAddress);
            console.log("-----approveFactoryRes-------", approveFactoryRes)
            if (approveFactoryRes) {
                await create_agent();
            }
        } catch (e) {
            console.log("error in reqAmountInWei ", e)
            return;
        }
    }

    const create_agent = async () => {
        try {
            const imageUploadURL = await handleUpload();
            if (!imageUploadURL) {
                toast.error("Error in Uplaoading image", {
                    position: "top-right",
                });
                return;
            }
            const createAgentRes = await LaunchAgent(name, ticker, [0, 1, 2, 3], bio, file, twitter, telegram, youtube, website, Web3.utils.toWei(purchaseAmount, "ether"), walletAddress);
            console.log("-----createAgentRes-------", createAgentRes)
            if (createAgentRes?.status) {
                toast.success("Agent created successfully!", {
                    position: "top-right",
                    className: "copy-toast-message",
                });
                resetForm();
            } else {
                toast.error("Error in Launching agent", {
                    position: "top-right",
                });
            }
        } catch (e) {
            console.log("error in create_agent ", e)
            return;
        }
    }


    const submitWeb3 = async () => {
        await approve_Factory();
    }

    const handleSubmit = async () => {
        setLoading(true);

        const token = localStorage.getItem("authToken");
        // await handleUpload();

        const agentData = {
            name,
            profileImage,
            erc20Address,
            ticker,
            bio,
            agentType,
            goal,
            personality,
            niche,
        };
        console.log("---agentData---", agentData)
        try {
            const response = await createAgent(agentData, token);

            if (response.success) {
                toast.success("Agent created successfully!", {
                    position: "top-right",
                    className: "copy-toast-message",
                });
                setMessage("Agent created successfully!");
                navigate("/")
                resetForm();
            } else {
                toast.error("Error Notification !", {
                    position: "top-right",
                });
                setMessage(`Error: ${response.message}`);
            }
        } catch (error) {
            setMessage(`Request failed: ${error.message}`);
            console.error("API error:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName("");
        setFile("");
        setErc20Address("");
        setTicker("");
        setBio("");
        setAgentType("");
        setGoal("");
        setPersonality("");
        setNiche("");
    };

    return (
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
                        <label>AI Agent Name</label>
                        <input type="text" placeholder="Agent Name" value={name}
                            onChange={(e) => setName(e.target.value)} />

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

                        <label>Agent Type</label>
                        <select id="agentType" value={agentType} onChange={(e) => setAgentType(e.target.value)}>
                            <option value="None" >None</option>
                            <option value="on-chain">On-chain</option>
                            <option value="informative">Informative</option>
                            <option value="Productivity">Productivity</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Creative">Creative</option>
                        </select>

                        <label>Pitch your agent</label>
                        <textarea placeholder="Tell everyone what your agent does and how it can help the community" value={niche} onChange={(e) => setNiche(e.target.value)} />

                        <label>Goals and purpose of your agent</label>
                        <textarea placeholder="i.e. - Persona, goals, guidelines, thinking style, communication style, etc." value={goal} onChange={(e) => setGoal(e.target.value)} />

                        <label>Team bio</label>
                        <textarea placeholder="None" value={bio}
                            onChange={(e) => setBio(e.target.value)} />

                        <div className="modal-actions">
                            <button className="cancel" onClick={onClose}>Cancel</button>
                            <button className="next" onClick={() => setModalStatus(1)}>Next</button>
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
                                <div className='x-cta'>Connect X</div>

                                <div className='acc-label' style={{ marginBottom: 10 }}>How would you like to setup the X account</div>
                                <select id="agentType">
                                    <option>Use Gryphon's AI Stack</option>
                                </select>

                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 25, marginBottom: 15 }}>
                                    <div className='acc-label'>How would you like to setup the X account</div>
                                    <div className='red-dot' />
                                    <div className='acc-red'>Please select an option</div>
                                </div>
                                <div className='setup-x'>
                                    <div className='setup-single'>I will manage it myself</div>
                                    <div className='setup-single'>Use Gryphon's AI Stack</div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-actions" style={{ padding: "20px 20px" }}>
                            <button className="cancel" onClick={onClose}>Cancel</button>
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
                                    <div className='modal-heading'>Buy $GRYPHON</div>
                                    <div className='buy-desc'>*Purchasing a small amount of your token is optional but can help protect your coin from snipers.</div>
                                    <div className='acc-label' style={{ marginBottom: 10 }}>GRYPHON</div>
                                    <div className='buy-modal-input'>
                                        <input placeholder='100' className='' />
                                        <img src={LogoImage} alt="" className='buy-modal-img' />
                                    </div>
                                    <div className='buy-desc' style={{ padding: "5px 0 0" }}><span>You will receive 1000</span>   <img src={ProfileImage} alt="" className='buy-span-img' /> <span>(0%)</span></div>
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
                                            <div className='buy-desc' style={{ marginRight: 5, padding: 0 }}>1000</div>
                                            <img src={ProfileImage} alt="" className='buy-modal-img' />

                                        </div>
                                    </div>
                                    <div className='border-line-modal-dash' />
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
                                        <div>Total</div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className='buy-desc' style={{ marginRight: 5, padding: 0 }}>(100 Gryphon + 1000 $AGO)</div>
                                            <div style={{ marginRight: 5 }}>200</div>
                                            <img src={LogoImage} alt="" className='buy-modal-img' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions" style={{ padding: "20px 20px" }}>
                                <button className="cancel" onClick={onClose}>Cancel</button>
                                <button className="next" onClick={submitWeb3} >Create Agent</button>
                            </div>
                        </>}</>
                }
            </div>
        </div>
    );
};


export default Modal;