import Web3 from "web3";
import config from "../config";
import TokenABI from "../contract-abi/gryphon-token.abi.json"
import BondingABI from "../contract-abi/gryphon-bonding.abi.json"
import RouterABI from "../contract-abi/gryphon-router.abi.json"


//version2 ABI

import ERC20ABI from "../abi-v2/fun/FERC20.json";
import BondingV2ABI from "../abi-v2/fun/Bonding.json"
import RouterV2ABI from "../abi-v2/fun/FRouter.json"


export const requiredGryphonAmount = async () => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingABI, config.bonding_contract_address);
        let result = await contract.methods.requiredGryphonAmount().call();
        console.log("requiredGryphonAmount", result);
        return result;
    } catch (e) {
        console.log("error in requiredGryphonAmount", e)
        return;
    }
}

export const approveFactory = async (gryphonAmountInWei, walletAddress) => {
    console.log("---", gryphonAmountInWei, walletAddress)
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, config.gryphon_token_address);
        let result = await contract.methods.approve(config.bonding_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveFactory", e)
        return;
    }
}

export const LaunchAgent = async (name, ticker, cores, desc, img, twitter, telegram, youtube, website, purchaseAmt, walletAddress) => {
    try {
        let urls = [twitter, telegram, youtube, website]
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.launch(name, ticker, cores, desc, img, urls, purchaseAmt).send({ from: walletAddress });
        console.log("createAgent", result);
        return result;
    } catch (e) {
        console.log("error in createAgent", e)
        return;
    }
}

// tw.te.y,w =>SL


export const amountOutValue = async (agentERC20Addr, GryphonAddrOrZerothAddr, tradeAmtInwei, walletAddress) => {
    try {
        console.log("Calling getAmountsOut with:", {
            agentERC20Addr,
            GryphonAddrOrZerothAddr,
            tradeAmtInwei,
        });
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(RouterV2ABI.abi, config.routing_contract_address);
        let result = await contract.methods.getAmountsOut(agentERC20Addr, GryphonAddrOrZerothAddr, tradeAmtInwei).call();
        console.log("amountOutValue", result);
        return result;
    } catch (e) {
        console.log("error in amountOutValue", e)
        return;
    }
}

//approve [bonding,gry cont addr] => foramt of gryp

export const buyApprove = async (gryphonAmountInWei,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, config.gryphon_token_address);
        let result = await contract.methods.approve(config.routing_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveTrade", e)
        return;
    }
}

export const buyTrade = async (buyAmtInwei, agentERC20Addr,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.buy(buyAmtInwei, agentERC20Addr).send({ from: walletAddress });
        console.log("buyTrade", result);
        return result;
    } catch (e) {
        console.log("error in buyTrade", e)
        return;
    }
}

// //approve [bonding,agent token addr] => foramt of gryp

export const sellApprove = async (gryphonAmountInWei,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ERC20ABI.abi, "0xcE47ea4B71BdF82E983995B0696F41Cd6bE076Ce");
        let result = await contract.methods.approve(config.routing_contract_address, gryphonAmountInWei).send({ from: walletAddress });
        console.log("approveFactory", result);
        return result;
    } catch (e) {
        console.log("error in approveFactory", e)
        return;
    }
}
export const sellTrade = async (sellAmtInwei, walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(BondingV2ABI.abi, config.bonding_contract_address);
        let result = await contract.methods.sell(sellAmtInwei,"0xcE47ea4B71BdF82E983995B0696F41Cd6bE076Ce").send({ from: walletAddress });
        console.log("sellTrade", result);
        return result;
    } catch (e) {
        console.log("error in sellTrade", e)
        return;
    }
}
