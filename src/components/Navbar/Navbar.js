import React from 'react';
import "./navbar.css"
import LogoImage from "../../assets/images/logo-white.png"
import { IconContext } from "react-icons";
import { FiSearch } from "react-icons/fi";
import ProfileImage from "../../assets/images/Frame 1394.png"
import { useNavigate } from 'react-router-dom';
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { useActiveAccount } from "thirdweb/react";

const Navbar = () => {
    const account = useActiveAccount();

    const navigate = useNavigate();

    const client = createThirdwebClient({
        clientId: "bfb4a8901e09d80f302031db896aeec8",
    });
    const wallets = [
        inAppWallet({
            auth: {
                options: ["email"],
            },
        }),
        createWallet("io.metamask"),
        createWallet("com.trustwallet.app"),
        createWallet("com.coinbase.wallet"),
        createWallet("me.rainbow"),
        createWallet("io.rabby"),
        createWallet("io.zerion.wallet"),
    ];


    return (
        <div className='navbar-sec'>
            <div className='nav-cont'>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate("/")}>
                    <img src={LogoImage} alt="logo" className='navbar-logo' />
                    <div className='logo-text'>GRYPHON</div>
                </div>
                <div className='nav-search'>
                    <input className='nav-search-input' placeholder='Find AI Agents...' />
                    <IconContext.Provider value={{ size: "1.2em", color: "#8e9099", className: "global-class-name" }}>
                        <div>
                            <FiSearch />
                        </div>
                    </IconContext.Provider>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='nav-cta'>Create Agent</div>
                    {account?.address ? <img src={ProfileImage} alt="profile" className='nav-profile' /> :
                       
                    <ConnectButton
                        client={client}
                        wallets={wallets}
                        connectModal={{ size: "compact" }}
                        theme={"light"}
                        appMetadata={{
                            name: "Gryphon Protocol",
                            url: "https://example.com",
                        }}
                    /> }
                </div>
            </div>
        </div>
    )
}

export default Navbar


