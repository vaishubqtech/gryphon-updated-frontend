import React from 'react';
import "./navbar.css"
import LogoImage from "../../assets/images/logo-white.png"
import { IconContext } from "react-icons";
import { FiSearch } from "react-icons/fi";
import ProfileImage from "../../assets/images/Frame 1394.png"
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate =useNavigate();
    return (
        <div className='navbar-sec'>
            <div className='nav-cont'>
                <div style={{ display: 'flex', alignItems: 'center',cursor:'pointer' }} onClick={()=>navigate("/")}>
                    <img src={LogoImage} alt="logo" className='navbar-logo' />
                    <div className='logo-text'>GRYPHON</div>
                </div>
                <div className='nav-search'>
                    <input className='nav-search-input' placeholder='Find AI Agents...' />
                    <IconContext.Provider value={{size:"1.2em" ,color: "#8e9099", className: "global-class-name" }}>
                        <div>
                            <FiSearch />
                        </div>
                    </IconContext.Provider>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='nav-cta'>Create Agent</div>
                    <img src={ProfileImage} alt="profile" className='nav-profile' />
                </div>
            </div>
        </div>
    )
}

export default Navbar


