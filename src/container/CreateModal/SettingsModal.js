import React, { useState } from 'react'
import "./modal.css"
import { IconContext } from "react-icons";
import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ProfileImage from "../../assets/images/Frame 1394.png"
import LogoImage from "../../assets/images/Frame 1397.png"


const SettingsModal = ({ isOpen, onClose }) => {
    const [activeSetting, setActiveSetting] = useState(0)
    const navigate = useNavigate()
    const walletAddress = localStorage.getItem("publicAddress")
    const [name, setName] = useState("Agent Name");
    const [profileImage, setProfileImage] = useState("");
    const [erc20Address, setErc20Address] = useState(" ");
    const [ticker, setTicker] = useState("AG1");
    const [bio, setBio] = useState("Just a chill joker who's been in web3 since the ICO days circa.2017.");
    const [agentType, setAgentType] = useState("informative");
    const [goal, setGoal] = useState("About Goal");
    const [personality, setPersonality] = useState("personality");
    const [niche, setNiche] = useState("Some Niche");
    const [purchaseAmount, setPurchaseAmt] = useState()
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [telegram, setTelegram] = useState("");
    const [twitter, setTwitter] = useState("");
    const [website, setWebsite] = useState("");
    const [youtube, setYoutube] = useState("");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState("https://s3.ap-southeast-1.amazonaws.com/virtualprotocolcdn/name_6f5a14da0e.png");
    const [modalStatus, setModalStatus] = useState(0);
    if (!isOpen) return null;


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className='modal-head'>
                    <div className='modal-heading'>Settings</div>
                    <IconContext.Provider value={{ color: "#F2F2F28A", className: "global-class-name" }}>
                        <div style={{ cursor: 'pointer' }} onClick={onClose}>
                            <MdClose />
                        </div>
                    </IconContext.Provider>
                </div>
                <div className='setting-modal-body'>
                    <div className='setting-modal-flex'>
                        <div className='s-m-left'>
                            <div className={activeSetting === 0 ? 's-m-list-active' : 's-m-list'} onClick={() => setActiveSetting(0)}>
                                Account
                            </div>
                            <div className={activeSetting === 1 ? 's-m-list-active' : 's-m-list'} onClick={() => setActiveSetting(1)}>
                                Socials
                            </div>
                        </div>
                        <div className='s-m-break' />
                        {activeSetting === 0 ?
                            <div className='s-m-right'>
                                <div className='agent-n-t-flex'>
                                    <div className='top-50'>
                                        <label>AI Agent Name</label>
                                        <input type="text" placeholder="Agent Name" value={name}
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className='top-50'>
                                        <label>AI Agent Ticker</label>
                                        <input type="text" placeholder="$" value={ticker}
                                            onChange={(e) => setTicker(e.target.value)} />
                                    </div>
                                </div>
                                {/* <label>Agent Profile Picture</label>
                                <div className="upload-container">
                                    <label className="image-upload">
                                        <div className="image-preview">
                                            <img src={image} alt="Profile" />
                                        </div>

                                    </label>
                                    <input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} className='upload-input' />
                                </div> */}

                                <div className="profile-picture-container">
                                    <label className="profile-label">Agent Profile Picture</label>
                                    <div className="image-wrapper">
                                        <img src={image} alt="Profile" className="profile-image" />
                                        <input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleFileChange} className="hidden-upload" id="file-input" />
                                        <label htmlFor="file-input" className="change-image-btn">Change Image</label>
                                    </div>
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


                            </div> :
                            <>

                                <div className='s-m-right '>
                                    <div className='acc-label'>Agent’s X Account</div>
                                    <div className='twitter-acc-detail'>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src={LogoImage} alt="" className="Profile-setting" />
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5, }}>
                                                    <div className=''>Gryphon</div>
                                                    <div className='green-dot' />
                                                    <div className='acc-green'>Active</div>
                                                </div>
                                                <div className='acc-label'>@GryphonAI</div>
                                            </div>
                                        </div>
                                        <div className='dis-connect-cta'>Disconnect X</div>
                                    </div>
                                    <div className='acc-label' style={{ marginBottom: 4 }}>X Account Setup</div>
                                    <div className='setup-x'>
                                        <div className='setup-single'>Self Management</div>
                                        <div className='setup-single-colored'> Gryphon's AI Stack</div>
                                    </div>


                                </div>

                            </>

                        }
                    </div>
                    <div className="modal-actions">
                        <button className="setting-cancel" onClick={onClose}>Cancel</button>
                        {activeSetting !== 0 && <button className="setting-neutral">Neutral State</button>}
                        <button className="setting-next"    >Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
