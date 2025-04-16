import Web3 from "web3";
import config from "../config";

//pancake ABI

import PancakeFactoryABI from "../abi-v2/pancake/pancakeFactory.json"
import PancakeRouterABI from "../abi-v2/pancake/pancakeRouter.json"



export const getPairPancake = async (tokenA,tokenB) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(PancakeFactoryABI, config.pancake_factory_address);
        let result = await contract.methods.getPair(tokenA,tokenB).call();
        console.log("getPairPancake", result);
        return result;
    } catch (e) {
        console.log("error in getPairPancake", e)
        return;
    }
}

//approve router contract for agentToken 

export const swapExactTokens = async (amountIn, amountOutMin, addressPath, toAddress, deadline,walletAddress) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(PancakeRouterABI, config.pancake_router_address);
        let result = await contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, addressPath, toAddress, deadline).send({from:walletAddress});
        console.log("swapExactTokens", result);
        return result;
    } catch (e) {
        console.log("error in swapExactTokens", e)
        return;
    }
}




// GetAmountsOut(100,[gryphon,agent]) => no fo gryphon you pay
// GetAmountsIn(100,[gryphon,agent]) => how much gryphon it gives


export const amountOutPancake = async (tokenA,tokenB,tradeAmtInwei) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(PancakeRouterABI, config.pancake_router_address);
        let result = await contract.methods.getAmountsOut( tradeAmtInwei, [tokenA,tokenB]).call();
        console.log("amountOutPancake", result);
        return result;
    } catch (e) {
        console.log("error in amountOutPancake", e)
        return;
    }
}
export const amountInPancake = async (tokenA,tokenB,tradeAmtInwei) => {
    try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(PancakeRouterABI, config.pancake_router_address);
        let result = await contract.methods.getAmountsIn( tradeAmtInwei, [tokenA,tokenB]).call();
        console.log("amountInPancake", result);
        return result;
    } catch (e) {
        console.log("error in amountInPancake", e)
        return;
    }
}