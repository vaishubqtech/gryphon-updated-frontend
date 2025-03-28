/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
// import { useState } from "react";
import "./modal.css"
import { MdClose } from "react-icons/md";
import { IconContext } from "react-icons";
import { FaCamera } from "react-icons/fa";
import LogoImage from "../../assets/images/logo-white.png"
import ProfileImage from "../../assets/images/Frame 1394.png"
import InfoImage from "../../assets/images/info-vector.png"
import { TiInfoOutline } from "react-icons/ti";
import { Tooltip } from 'antd';


const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [image, setImage] = useState(null);
    const [modalStatus, setModalStatus] = useState(0);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
                        <input type="text" placeholder="Agent Name" />

                        <label>Agent Profile Picture</label>
                        <div className="upload-container">
                            <label className="image-upload">
                                <input type="file" accept="image/png, image/jpeg, image/webp, image/gif" onChange={handleImageChange} className='upload-input' />
                                <div className="image-preview">
                                    {image ? <img src={image} alt="Profile" /> : <FaCamera className="camera-icon" />}
                                </div>
                            </label>
                            <p className="upload-text">JPG, PNG, WEBP, and GIF files supported.<br />Max file size is 5MB</p>
                        </div>

                        <label>Agent Type</label>
                        <select id="agentType">
                            <option>On Chain</option>
                        </select>

                        <label>Pitch your agent</label>
                        <textarea placeholder="Tell everyone what your agent does and how it can help the community" />

                        <label>Goals and purpose of your agent</label>
                        <textarea placeholder="i.e. - Persona, goals, guidelines, thinking style, communication style, etc." />

                        <label>Team bio</label>
                        <textarea placeholder="None" />

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
                                    <div className='acc-red'>Please select a option</div>
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
                                    <div className='buy-desc'>*Purchasing a small amount of your taken is optional but can help protect your coin from snipers.</div>
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
                                <button className="next" >Create Agent</button>
                            </div>
                        </>}</>
                }
            </div>
        </div>
    );
};


export default Modal;