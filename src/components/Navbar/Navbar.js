import React, { useEffect, useState } from "react";
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
import Web3 from "web3";
import { getNonce, verifyUser } from "../../services/APIManager";
import Modal from "../../container/Modal/Modal";
var decimalChainId;
var publicAddress;

const Navbar = () => {
    const account = useActiveAccount();

    const navigate = useNavigate();
    const [getNonceData, setGetNonceData] = useState();
    const [verifyUserData, setVerifyUser] = useState();
    const [authToken, setAuthToken] = useState();
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        console.log("wallet address", account?.address);
        if(account?.address){
            getAccount()
        }
      }, [account]);

      async function getAccount() {
        const web3 = new Web3();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
       let  public_address = accounts[0].toLowerCase();
        localStorage.setItem("publicAddress",  web3.utils.toChecksumAddress(public_address));
        let currentChain = await window.ethereum.request({ method: "eth_chainId" });
        let decimal_chainId = parseInt(currentChain, 16);
        localStorage.setItem("chainId", decimal_chainId);
        if(localStorage.getItem("authToken")){
          return;
        }
        await getNonceApi()
      }
      const getNonceApi = async () => {
        try {
          publicAddress = localStorage.getItem("publicAddress")
          decimalChainId = localStorage.getItem("chainId")
          console.log("--getNonce publicAddress--", publicAddress)
          const nonceResult = await getNonce(
            publicAddress,
            decimalChainId
          );
          console.log("nonceResult", nonceResult);
          if (nonceResult.success) {
            setGetNonceData(nonceResult.data);
          }
          await verifyUserApi(nonceResult.data.nonce);
        } catch (err) {
          console.log("error in getNonce API", err);
          return;
        }
      };
    
      const verifyUserApi = async (nonce) => {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const signature = await web3.eth.personal.sign(
            web3.utils.utf8ToHex(`I am signing my one-time nonce: ${nonce}`),
            publicAddress,
            ""
          );
          console.log("signature", signature);
          const verifyUserResult = await verifyUser(
            publicAddress,
            decimalChainId,
            signature
          );
          console.log("verifyUserResult", verifyUserResult?.data);
          if (verifyUserResult?.data) {
            setVerifyUser(verifyUserResult?.data);
            setAuthToken(verifyUserResult?.data?.token);
            localStorage.setItem("authToken", verifyUserResult?.data?.token);
          }
        } catch (err) {
          console.log("error in verifyUserApi API", err);
          return;
        }
      };

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
                    <div className='nav-cta' onClick={() => setModalOpen(true)}>Create Agent</div>
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

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}

export default Navbar


